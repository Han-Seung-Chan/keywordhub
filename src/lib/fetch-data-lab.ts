import { ApiResult } from "@/types/api";
import { DataLabRequest, DataLabResponse } from "@/types/data-lab";

/**
 * 네이버 데이터랩 API 요청 함수
 * @param requestData 데이터랩 요청 데이터
 * @returns API 결과 객체
 */
export async function fetchDatalabData(
  requestData: DataLabRequest,
): Promise<ApiResult<DataLabResponse>> {
  try {
    const response = await fetch("/api/naver-datalab", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    // 응답 상태 확인
    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      let errorMessage = `API 요청 실패: ${response.status}`;

      try {
        // JSON 형식의 오류 응답이 있는지 확인
        const errorData = errorBody ? JSON.parse(errorBody) : {};
        errorMessage = errorData.error || errorData.message || errorMessage;

        return {
          success: false,
          data: null,
          error: {
            status: response.status,
            error: errorMessage,
            ...errorData,
          },
        };
      } catch {
        // JSON 파싱 실패 시 기본 오류 메시지 사용
        return {
          success: false,
          data: null,
          error: errorMessage,
        };
      }
    }

    // 응답 데이터 파싱
    const responseData = await response.json();

    // 응답 구조 검증
    if (!responseData || !responseData.results) {
      return {
        success: false,
        data: null,
        error: "응답 데이터 형식이 예상과 다릅니다.",
      };
    }

    return {
      success: true,
      data: responseData as DataLabResponse,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "데이터를 가져오는 중 오류가 발생했습니다.",
    };
  }
}
