import { ApiResult } from "@/types/api";
import { DataLabResponse } from "@/types/data-lab";
import { KeywordResponse } from "@/types/keyword-tool";

// 키워드 검색 결과 타입 (API 응답 결과 저장용)
export interface KeywordSearchResult {
  keyword: string;
  keywordData: ApiResult<KeywordResponse> | null;
  pcData: DataLabResponse | null;
  mobileData: DataLabResponse | null;
}
