import { ApiResult } from "@/types/api";
import { KeywordResponse } from "@/types/keyword-tool";

/**
 * 키워드 데이터를 가져오는 함수
 * @param keyword 검색할 키워드
 * @param showDetail 상세 정보 포함 여부
 * @returns API 결과 객체
 */
export async function fetchKeywordData(
  keyword: string,
  showDetail: boolean = true,
): Promise<ApiResult<KeywordResponse[]>> {
  try {
    const response = await fetch("/api/keywords", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        keywords: [keyword],
        showDetail,
      }),
    });

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
        data: [],
        error: null,
      };
    }

    return {
      success: true,
      data: responseData.keywordList,
      error: null,
    };
  } catch (error) {
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
 * 여러 키워드 데이터를 가져오는 함수
 * @param keywords 검색할 키워드 배열
 * @param showDetail 상세 정보 포함 여부
 * @returns API 결과 객체
 */
export async function fetchMultipleKeywords(
  keywords: string[],
  showDetail: boolean = true,
): Promise<ApiResult<KeywordResponse[]>> {
  try {
    const response = await fetch("/api/keywords", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        keywords,
        showDetail,
      }),
    });

    const responseData = await response.json();

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

    if (!responseData.keywordList || !Array.isArray(responseData.keywordList)) {
      return {
        success: false,
        data: null,
        error: "응답 데이터 형식이 예상과 다릅니다.",
      };
    }

    return {
      success: true,
      data: responseData.keywordList,
      error: null,
    };
  } catch (error) {
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
