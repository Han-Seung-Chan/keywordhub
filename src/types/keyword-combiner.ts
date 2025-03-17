export interface KeywordState {
  keyword1: string;
  keyword2: string;
  keyword3: string;
  keyword4: string;
}

// 키워드 배열 타입
export interface KeywordArrays {
  [key: string]: string[];
}

// 키워드 카운트 타입
export interface KeywordCounts {
  [key: string]: number;
}

// 패턴 그룹 타입
export interface PatternGroups {
  twoKeywordPatterns: string[];
  threeKeywordPatterns: string[];
  fourKeywordPatterns: string[];
}
