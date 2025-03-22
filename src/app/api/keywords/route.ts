import { NextRequest, NextResponse } from "next/server";

import {
  ApiKeywordToolConfig,
  KeywordServerResponse,
} from "@/types/keyword-tool";
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
 */
const fetchKeywordData = async (
  keywords: string[],
  config: ApiKeywordToolConfig,
): Promise<KeywordServerResponse> => {
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

  // API 요청
  const response = await fetch(url, {
    method,
    headers,
  });

  const { data, error } = await parseApiResponse(response);

  if (error) {
    throw new Error(error.message);
  }

  return data || { keywordList: [] };
};

/**
 * 키워드 도구 API 핸들러
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

      // 키워드 데이터 요청
      const keywordData = await fetchKeywordData(keywords, apiConfig);

      return NextResponse.json(keywordData);
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
        : new Error("키워드 API 처리 중 오류가 발생했습니다"),
    );
  }
}
