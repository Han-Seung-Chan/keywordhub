import { ApiResult } from "@/types/api";
import { DataLabRequest, DataLabResponse } from "@/types/data-lab";

/**
 * 네이버 데이터랩 API 요청 함수 - 성능 최적화 버전
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
    // AbortError 처리 (타임아웃)
    if (error instanceof DOMException && error.name === "AbortError") {
      return {
        success: false,
        data: null,
        error: "요청 시간이 초과되었습니다.",
      };
    }

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

/**
 * 여러 데이터랩 요청을 병렬로 처리하는 함수
 * @param requests 데이터랩 요청 배열
 * @returns 각 요청에 대한 결과 배열
 */
export async function fetchDatalabDataBatch(
  requests: DataLabRequest[],
): Promise<ApiResult<DataLabResponse>[]> {
  // 모든 요청을 병렬로 처리
  const results = await Promise.allSettled(
    requests.map((request) => fetchDatalabData(request)),
  );

  // 결과 매핑
  return results.map((result) => {
    if (result.status === "fulfilled") {
      return result.value;
    } else {
      // 실패한 요청에 대한 오류 생성
      return {
        success: false,
        data: null,
        error: result.reason?.message || "데이터랩 요청이 실패했습니다.",
      };
    }
  });
}
