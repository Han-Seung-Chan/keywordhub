import { DataLabRequest, DataLabResponse } from "@/types/data-lab";
import { NextRequest, NextResponse } from "next/server";
import { validateEnvVariables, handleApiError } from "@/utils/naver-api";

/**
 * 환경 변수에서 API 설정을 가져옵니다
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
 * Naver Datalab API를 호출하여 키워드 트렌드 데이터를 가져옵니다.
 * @route POST /api/naver-datalab
 */
export async function POST(request: NextRequest) {
  try {
    // 요청 본문 파싱
    const requestData: DataLabRequest = await request.json();

    try {
      // API 설정 가져오기
      const config = getDataLabConfig();

      // API 요청 헤더 및 본문 설정
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
        const errorText = await response.text();
        console.error("Naver API 응답 에러:", response.status, errorText);
        return NextResponse.json(
          { error: "네이버 API 호출 중 오류가 발생했습니다." },
          { status: response.status },
        );
      }

      // 응답 데이터 파싱
      const data: DataLabResponse = await response.json();

      return NextResponse.json(data);
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
      "네이버 데이터랩 API 처리 중 오류가 발생했습니다",
    );
  }
}
