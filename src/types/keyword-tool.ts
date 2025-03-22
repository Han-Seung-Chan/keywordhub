/**
 * 네이버 검색 광고 API 타입 정의
 */

export interface ApiKeywordToolConfig {
  baseUrl: string;
  apiKey: string;
  secretKey: string;
  customerId: string;
}

/**
 * API 오류 응답 타입
 */
export interface ApiServerErrorResponse {
  status: number;
  title: string;
}

/**
 * 키워드 API 응답 인터페이스
 */
export interface KeywordServerResponse {
  keywordList: KeywordResponse[];
}

/**
 * 키워드 항목 인터페이스
 * API 응답으로 반환되는 각 키워드 정보를 나타냅니다
 */
export interface KeywordResponse {
  relKeyword: string; // 연관 키워드
  monthlyPcQcCnt: number; // 월간 PC 검색량
  monthlyMobileQcCnt: number; // 월간 모바일 검색량
  monthlyAvePcClkCnt?: number; // 월간 평균 PC 클릭수
  monthlyAveMobileClkCnt?: number; // 월간 평균 모바일 클릭수
  monthlyAvePcCtr?: number; // 월간 평균 PC CTR
  monthlyAveMobileCtr?: number; // 월간 평균 모바일 CTR
  compIdx?: string; // 경쟁 정도
  plAvgDepth?: number; // 평균 노출 순위
  relKeywordCnt?: number; // 연관 키워드 수
  relevanceScore?: number; // 연관도 점수
}
