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
 * @param requests 데이터랩 요청 배열 [pcRequest, moRequest]
 * @returns 각 요청에 대한 결과 배열 ([pcResponses[], moResponses[]])
 */
export async function fetchDatalabDataBatch(
  requests: DataLabRequest[],
): Promise<ApiResult<DataLabResponse>[][]> {
  // 결과 배열 준비
  const results: ApiResult<DataLabResponse>[][] = [];

  try {
    // 요청별 처리 (PC와 모바일)
    for (let i = 0; i < requests.length; i++) {
      const request = requests[i];
      const device = request.device || "unknown";

      // 키워드 그룹이 여러 개인 경우, 각각을 개별 요청으로 변환
      const singleKeywordRequests: DataLabRequest[] = [];

      request.keywordGroups.forEach((group) => {
        singleKeywordRequests.push({
          ...request,
          keywordGroups: [
            { groupName: group.groupName, keywords: [group.groupName] },
          ],
        });
      });

      // 배치 API에 모든 단일 키워드 요청 전송
      const batchResponse = await fetch("/api/naver-datalab/batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requests: singleKeywordRequests }),
      });

      if (!batchResponse.ok) {
        throw new Error(`API 요청 실패: ${batchResponse.status}`);
      }

      // 응답 파싱
      const responseMap = await batchResponse.json();

      // 원래 요청의 각 키워드에 대한 결과 수집
      const deviceResults: ApiResult<DataLabResponse>[] = [];

      for (const group of request.keywordGroups) {
        const keyword = group.groupName;
        const requestId = `${keyword}_${device}`;

        if (responseMap[requestId]) {
          deviceResults.push(
            responseMap[requestId] as ApiResult<DataLabResponse>,
          );
        } else {
          // 키워드에 대한 응답이 없는 경우
          deviceResults.push({
            success: false,
            data: null,
            error: `키워드 "${keyword}"에 대한 응답이 없습니다.`,
          });
        }
      }

      results.push(deviceResults);
    }

    return results;
  } catch (error) {
    console.error("데이터랩 배치 요청 처리 중 오류:", error);

    // 오류 발생 시 모든 요청에 대해 오류 결과 생성
    return requests.map((request) =>
      request.keywordGroups.map(() => ({
        success: false,
        data: null,
        error:
          error instanceof Error
            ? error.message
            : "데이터랩 배치 요청이 실패했습니다.",
      })),
    );
  }
}
