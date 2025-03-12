import { useEffect, useCallback } from "react";
import { KeywordData } from "@/types/table";
import { useSharedKeywordState } from "@/store/useSharedKeywordState";

export function useKeywordResults() {
  // 공유 상태에서 값 가져오기
  const {
    isSearching,
    progress,
    keywordResults,
    processedCount,
    totalCount,
    tableData,
    setTableData,
    resetAll,
    clearSearchKeyword,
  } = useSharedKeywordState();

  // 결과 초기화 핸들러
  const handleClearResults = useCallback(() => {
    resetAll();
    clearSearchKeyword();
  }, [resetAll, clearSearchKeyword]);

  // 키워드 결과 데이터 처리 및 테이블 데이터 변환
  useEffect(() => {
    if (keywordResults && keywordResults.length > 0) {
      // 처리된 결과를 KeywordData 형태로 변환하여 테이블에 표시
      const newResults: KeywordData[] = keywordResults
        .filter(
          (result) => result.keywordData?.success && result.keywordData?.data,
        )
        .map((result, index) => {
          const { keyword, keywordData, pcData, mobileData } = result;

          // API 응답에서 필요한 데이터 추출
          const data = keywordData?.data;

          if (!data) {
            console.warn(
              `키워드 "${keyword}"에 대한 유효한 데이터가 없습니다.`,
            );
            return null;
          }

          return {
            id: index + 1,
            keyword: keyword,
            monthlyPcQcCnt: data.monthlyPcQcCnt || 0,
            monthlyAvePcClkCnt: data.monthlyAvePcClkCnt || 0,
            monthlyAvePcCtr: data.monthlyAvePcCtr || 0,
            monthlyMobileQcCnt: data.monthlyMobileQcCnt || 0,
            monthlyAveMobileClkCnt: data.monthlyAveMobileClkCnt || 0,
            monthlyAveMobileCtr: data.monthlyAveMobileCtr || 0,
            compIdx: data.compIdx || "낮음",
            plAvgDepth: data.plAvgDepth || 0,
            pcYearData: pcData,
            mobileYearData: mobileData,
          };
        })
        .filter(Boolean) as KeywordData[]; // null 값 제거

      setTableData(newResults);
    }
  }, [keywordResults, setTableData]);

  return {
    searchResults: tableData,
    isLoading: isSearching,
    loadingProgress: progress,
    processedCount,
    totalKeywords: totalCount,
    handleClearResults,
    hasResults: tableData.length > 0,
  };
}
