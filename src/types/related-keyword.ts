import { KeywordResponse } from "@/types/keyword-tool";

export interface RelatedKeywordResult {
  keywordData: KeywordResponse;
  relatedKeywords: (KeywordResponse & { relevanceScore?: number })[];
  isLoading: boolean;
  error: string | null;
}
