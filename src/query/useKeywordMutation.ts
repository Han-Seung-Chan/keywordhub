import { fetchKeywordData } from "@/lib/fetch-keywords";
import { ApiResult } from "@/types/api";
import { KeywordResponse } from "@/types/keyword-tool";
import { useMutation } from "@tanstack/react-query";

// 키워드 검색 mutation
export const useKeywordMutation = () => {
  return useMutation({
    mutationFn: async (
      keyword: string,
    ): Promise<ApiResult<KeywordResponse[]>> => {
      return fetchKeywordData(keyword);
    },
  });
};
