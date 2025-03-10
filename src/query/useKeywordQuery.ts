import { useQuery } from "@tanstack/react-query";
import { fetchKeywordData } from "@/lib/fetch-keywords";
import { QUERY_KEYS } from "@/constants/query-keys";
import { KeywordResponse } from "@/types/keyword-tool";
import { ApiResult } from "@/types/api";

export const useKeywordQuery = (keyword: string, enabled = false) => {
  return useQuery({
    queryKey: [QUERY_KEYS.KEYWORD_DATA, keyword],
    queryFn: async (): Promise<ApiResult<KeywordResponse>> => {
      return fetchKeywordData(keyword);
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5분 동안 데이터 캐시
  });
};
