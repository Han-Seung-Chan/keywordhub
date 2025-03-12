import { NextRequest, NextResponse } from "next/server";
import { DataLabRequest } from "@/types/data-lab";
import { validateEnvVariables, handleApiError } from "@/utils/naver-api";

/**
 * 환경 변수에서 네이버 오픈 API 설정을 가져옵니다
 */
const getDataLabConfig = () => {
  try {
    validateEnvVariables([
      "NEVER_OPENAPI_BASE_URL",
      "NAVER_OPENAPI_CLIENT_ID",
      "NAVER_OPENAPI_CLIENT_SECRET",
    ]);

    return {
      baseUrl: process.env.NEVER_OPENAPI_BASE_URL!,
      clientId: process.env.NAVER_OPENAPI_CLIENT_ID!,
      clientSecret: process.env.NAVER_OPENAPI_CLIENT_SECRET!,
    };
  } catch (error) {
    throw new Error("네이버 Datalab API 인증 정보가 설정되지 않았습니다");
  }
};

/**
 * 단일 데이터랩 요청 처리
 */
const fetchDataLabSingle = async (
  requestData: DataLabRequest,
  config: { baseUrl: string; clientId: string; clientSecret: string },
  requestId: string,
) => {
  try {
    const response = await fetch(config.baseUrl, {
      method: "POST",
      headers: {
        "X-Naver-Client-Id": config.clientId,
        "X-Naver-Client-Secret": config.clientSecret,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      console.error(`데이터랩 요청 실패 (${requestId}): ${response.status}`);
      return {
        success: false,
        data: null,
        error: `API 응답 오류 (${response.status})`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      data,
      error: null,
    };
  } catch (error: any) {
    console.error(`데이터랩 요청 처리 중 오류 (${requestId}):`, error);
    return {
      success: false,
      data: null,
      error: error.message || "데이터랩 요청 처리 중 오류가 발생했습니다",
    };
  }
};

/**
 * Naver Datalab API를 호출하여 키워드 트렌드 데이터를 배치로 가져옵니다.
 * @route POST /api/naver-datalab/batch
 */
export async function POST(request: NextRequest) {
  try {
    // 요청 본문 파싱
    const requestBody = await request.json();
    const { requests } = requestBody;

    // 입력 검증
    if (!Array.isArray(requests) || requests.length === 0) {
      return NextResponse.json(
        { error: "유효한 요청 배열이 필요합니다." },
        { status: 400 },
      );
    }

    try {
      // API 설정 가져오기
      const config = getDataLabConfig();

      // 모든 요청을 병렬로 처리
      const requestPromises = requests.map(async (requestData, index) => {
        const keyword =
          requestData.keywordGroups?.[0]?.groupName || `unknown_${index}`;
        const device = requestData.device || "unknown";
        const requestId = `${keyword}_${device}`;

        const result = await fetchDataLabSingle(requestData, config, requestId);
        return {
          requestId,
          result,
        };
      });

      const results = await Promise.all(requestPromises);

      // 결과를 요청 ID로 매핑하여 반환
      const responseMap = results.reduce(
        (acc, { requestId, result }) => {
          acc[requestId] = result;
          return acc;
        },
        {} as Record<string, any>,
      );

      return NextResponse.json(responseMap);
    } catch (error: any) {
      if (error.message.includes("인증 정보")) {
        return NextResponse.json(
          { error: "API 인증 정보가 설정되지 않았습니다." },
          { status: 500 },
        );
      }
      throw error;
    }
  } catch (error) {
    return handleApiError(
      error,
      "네이버 데이터랩 API 배치 처리 중 오류가 발생했습니다",
    );
  }
}
