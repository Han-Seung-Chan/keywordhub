import { NextRequest, NextResponse } from "next/server";

import { ApiResult } from "@/types/api";
import { ApiKeywordToolConfig, KeywordResponse } from "@/types/keyword-tool";
import {
  generateSignature,
  getTimestamp,
  handleApiError,
  parseApiResponse,
  validateEnvVariables,
} from "@/utils/naver-api";

/**
 * 환경 변수에서 API 설정을 가져옵니다
 */
const getApiConfig = (): ApiKeywordToolConfig => {
  try {
    validateEnvVariables([
      "NAVER_SEARCH_AD_API_BASE_URL",
      "NAVER_SEARCH_AD_API_KEY",
      "NAVER_SEARCH_AD_SECRET_KEY",
      "NAVER_SEARCH_AD_CUSTOMER_ID",
    ]);

    return {
      baseUrl: process.env.NAVER_SEARCH_AD_API_BASE_URL!,
      apiKey: process.env.NAVER_SEARCH_AD_API_KEY!,
      secretKey: process.env.NAVER_SEARCH_AD_SECRET_KEY!,
      customerId: process.env.NAVER_SEARCH_AD_CUSTOMER_ID!,
    };
  } catch {
    throw new Error("네이버 SearchAD API 인증 정보가 설정되지 않았습니다");
  }
};

/**
 * 네이버 검색 광고 API에 요청을 보냅니다
 * 배치로 여러 키워드를 한 번에 처리합니다
 * 대소문자 구분 없이 매칭하도록 수정
 */
const fetchKeywordDataBatch = async (
  keywords: string[],
  config: ApiKeywordToolConfig,
): Promise<Record<string, ApiResult<KeywordResponse>>> => {
  if (keywords.length === 0) {
    return {};
  }

  const uri = "/keywordstool";
  const method = "GET";
  const timestamp = getTimestamp();
  const signature = generateSignature(timestamp, method, uri, config.secretKey);

  // 쿼리 파라미터 설정
  const params = new URLSearchParams();
  params.append("hintKeywords", keywords.join(","));
  params.append("showDetail", "1");

  // URL 및 헤더 구성
  const url = `${config.baseUrl}${uri}?${params.toString()}`;
  const headers = {
    "Content-Type": "application/json; charset=UTF-8",
    "X-Timestamp": timestamp,
    "X-API-KEY": config.apiKey,
    "X-Customer": config.customerId,
    "X-Signature": signature,
  };

  try {
    // API 요청
    const response = await fetch(url, {
      method,
      headers,
    });

    const { data, error } = await parseApiResponse(response);

    if (error) {
      throw new Error(error.message);
    }

    // 결과를 키워드별로 매핑
    const results: Record<string, ApiResult<KeywordResponse>> = {};
    if (data && data.keywordList) {
      // 대소문자 구분 없이 매칭하기 위한 맵 생성
      const keywordMap = new Map<string, string>();
      keywords.forEach((keyword) => {
        keywordMap.set(keyword.toLowerCase(), keyword);
      });

      // 네이버 API 응답에서 relKeyword가 키워드 이름임
      data.keywordList.forEach((item: KeywordResponse) => {
        const apiKeyword = item.relKeyword;
        // 원래 입력한 키워드 대소문자 형태 찾기
        const originalKeyword =
          keywordMap.get(apiKeyword.toLowerCase()) || apiKeyword;

        results[originalKeyword] = {
          success: true,
          data: item,
          error: null,
        };

        // 대소문자가 다른 형태로도 결과 복제하여 두 가지 형태 모두 결과에 포함
        if (
          originalKeyword !== apiKeyword &&
          keywordMap.has(apiKeyword.toLowerCase())
        ) {
          results[apiKeyword] = {
            success: true,
            data: item,
            error: null,
          };
        }
      });

      // 요청한 키워드 중 응답에 포함되지 않은 키워드에 대해 빈 결과 추가
      keywords.forEach((keyword) => {
        if (!results[keyword]) {
          // 대소문자 변형으로도 결과가 있는지 확인
          const lowerKeyword = keyword.toLowerCase();
          let found = false;

          for (const [resultKey, resultValue] of Object.entries(results)) {
            if (resultKey.toLowerCase() === lowerKeyword) {
              results[keyword] = resultValue;
              found = true;
              break;
            }
          }

          if (!found) {
            results[keyword] = {
              success: false,
              data: null,
              error: "데이터를 찾을 수 없습니다.",
            };
          }
        }
      });
    }

    return results;
  } catch (error: unknown) {
    // 오류 발생 시 모든 키워드에 동일한 오류 반환
    const errorResults: Record<string, ApiResult<KeywordResponse>> = {};
    keywords.forEach((keyword) => {
      errorResults[keyword] = {
        success: false,
        data: null,
        error:
          error instanceof Error
            ? error.message
            : "키워드 데이터 요청 중 오류가 발생했습니다.",
      };
    });
    return errorResults;
  }
};

/**
 * 키워드 도구 API 핸들러 - 배치 처리 버전
 */
export async function POST(request: NextRequest) {
  try {
    // 요청 데이터 파싱
    const data = await request.json();
    const { keywords } = data;

    // 입력 검증
    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return NextResponse.json(
        { error: "유효한 키워드 배열이 필요합니다." },
        { status: 400 },
      );
    }

    try {
      // API 설정 가져오기
      const apiConfig = getApiConfig();

      const CHUNK_SIZE = 5;
      const chunks = [];

      for (let i = 0; i < keywords.length; i += CHUNK_SIZE) {
        chunks.push(keywords.slice(i, i + CHUNK_SIZE));
      }

      // 각 청크에 대해 병렬로 API 요청
      const chunkResults = await Promise.all(
        chunks.map((chunk) => fetchKeywordDataBatch(chunk, apiConfig)),
      );

      // 모든 결과 병합
      const mergedResults = chunkResults.reduce((acc, result) => {
        return { ...acc, ...result };
      }, {});

      return NextResponse.json(mergedResults);
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes("인증 정보")) {
        return NextResponse.json(
          { error: "API 인증 정보가 설정되지 않았습니다." },
          { status: 500 },
        );
      }

      throw error;
    }
  } catch (error: unknown) {
    return handleApiError(
      error instanceof Error
        ? error
        : new Error("키워드 API 배치 처리 중 오류가 발생했습니다"),
    );
  }
}
