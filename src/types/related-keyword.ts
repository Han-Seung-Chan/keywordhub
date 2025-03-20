import { KeywordResponse } from "@/types/keyword-tool";

export interface RelatedKeywordResult {
  keywordData: KeywordResponse;
  relatedKeywords: KeywordResponse[];
  isLoading: boolean;
  error: string | null;
}
