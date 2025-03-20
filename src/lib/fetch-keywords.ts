import { ApiResult } from "@/types/api";
import { KeywordResponse } from "@/types/keyword-tool";

/**
 * 단일 키워드 데이터를 가져오는 함수
 * @param keyword 검색할 키워드
 * @returns API 결과 객체
 */
export async function fetchKeywordData(
  keyword: string,
): Promise<ApiResult<KeywordResponse[]>> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10초 타임아웃

    const response = await fetch("/api/keywords", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        keywords: [keyword],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // 응답 데이터 파싱
    const responseData = await response.json();

    // 응답 상태 확인
    if (!response.ok) {
      return {
        success: false,
        data: null,
        error: {
          status: response.status,
          error: responseData.error || "키워드 분석 실패",
          message: responseData.message,
          ...responseData,
        },
      };
    }

    // 응답 구조 검증
    if (!responseData.keywordList || !Array.isArray(responseData.keywordList)) {
      return {
        success: false,
        data: null,
        error: "응답 데이터 형식이 예상과 다릅니다.",
      };
    }

    // 결과 없음 검사
    if (responseData.keywordList.length === 0) {
      return {
        success: true,
        data: null,
        error: null,
      };
    }

    return {
      success: true,
      data: responseData.keywordList,
      error: null,
    };
  } catch (error) {
    // 타임아웃 확인
    if (error instanceof DOMException && error.name === "AbortError") {
      return {
        success: false,
        data: null,
        error: "요청 시간이 초과되었습니다.",
      };
    }

    // 네트워크 오류 등의 예외 처리
    return {
      success: false,
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "키워드 데이터를 가져오는 중 오류가 발생했습니다.",
    };
  }
}

/**
 * 여러 키워드 데이터를 한 번에 가져오는 함수
 * @param keywords 검색할 키워드 배열
 * @returns 키워드별 API 결과 객체 맵
 */
export async function fetchBatchKeywordData(
  keywords: string[],
): Promise<Map<string, ApiResult<KeywordResponse>>> {
  try {
    const requestBody = { keywords };
    const response = await fetch("/api/keywords/batch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status}`);
    }

    const data = await response.json();
    const resultMap = new Map<string, ApiResult<KeywordResponse>>();

    // 응답 데이터를 키워드별로 매핑
    for (const [keyword, result] of Object.entries(data)) {
      resultMap.set(keyword, result as ApiResult<KeywordResponse>);
    }

    return resultMap;
  } catch (error) {
    console.error("배치 키워드 데이터 요청 실패:", error);
    throw error;
  }
}
