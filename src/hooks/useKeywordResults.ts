import { useCallback, useEffect, useMemo } from "react";

import { useSharedKeywordState } from "@/store/useSharedKeywordState";
import { KeywordData } from "@/types/table";

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

  // 결과 존재 여부 계산을 메모이제이션
  const hasResults = useMemo(() => tableData.length > 0, [tableData.length]);

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

          if (typeof data.monthlyPcQcCnt === "string") data.monthlyPcQcCnt = 0;
          if (typeof data.monthlyMobileQcCnt === "string")
            data.monthlyMobileQcCnt = 0;

          return {
            id: index + 1,
            keyword: keyword,
            totalCnt: data.monthlyPcQcCnt + data.monthlyMobileQcCnt || 0,
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

      // 메모이제이션을 위한 비교 로직 추가 - 기존 데이터와 실제로 다를 때만 업데이트
      if (JSON.stringify(newResults) !== JSON.stringify(tableData)) {
        setTableData(newResults);
      }
    }
  }, [keywordResults, setTableData, tableData]);

  return {
    searchResults: tableData,
    isLoading: isSearching,
    loadingProgress: progress,
    processedCount,
    totalKeywords: totalCount,
    handleClearResults,
    hasResults,
  };
}
