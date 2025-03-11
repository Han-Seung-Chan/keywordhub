import { useState, useEffect, useCallback } from "react";
import { useKeywordStore } from "@/store/useKeywordStore";
import { useKeywordQuery } from "@/query/useKeywordQuery";
import { useDataLabQueries } from "@/query/useDataLabQueries";
import { defaultDataLab } from "@/constants/default-data-lab";
import { KeywordData } from "@/types/table";

export function useKeywordResults() {
  const { searchKeyword, clearSearchKeyword } = useKeywordStore();
  const [searchResults, setSearchResults] = useState<KeywordData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 키워드 쿼리
  const { data: keywordData, isLoading: isKeywordLoading } =
    useKeywordQuery(searchKeyword);

  // 데이터랩 쿼리
  const dataLab = useDataLabQueries(defaultDataLab, searchKeyword);

  // 결과 초기화 핸들러
  const handleClearResults = useCallback(() => {
    setSearchResults([]);
    clearSearchKeyword();
  }, [clearSearchKeyword]);

  // 엑셀 다운로드 핸들러
  const handleExcelDownload = useCallback(() => {
    // 엑셀 다운로드 로직 (실제 구현은 ExcelDownloadButton 컴포넌트에서 처리)
    console.log("엑셀 다운로드 요청");
  }, []);

  // 데이터 처리 상태
  useEffect(() => {
    setIsLoading(isKeywordLoading || dataLab.isLoading);
  }, [isKeywordLoading, dataLab.isLoading]);

  // 키워드 및 데이터랩 결과가 모두 로드되면 결과 추가
  useEffect(() => {
    if (
      !keywordData ||
      !dataLab.pc.data ||
      !dataLab.mobile.data ||
      !searchKeyword
    )
      return;

    if (keywordData.success && keywordData.data) {
      const newResult: KeywordData = {
        id: searchResults.length + 1,
        keyword: searchKeyword,
        monthlyPcQcCnt: keywordData.data.monthlyPcQcCnt,
        monthlyAvePcClkCnt: keywordData.data.monthlyAvePcClkCnt || 0,
        monthlyAvePcCtr: keywordData.data.monthlyAvePcCtr || 0,
        monthlyMobileQcCnt: keywordData.data.monthlyMobileQcCnt,
        monthlyAveMobileClkCnt: keywordData.data.monthlyAveMobileClkCnt || 0,
        monthlyAveMobileCtr: keywordData.data.monthlyAveMobileCtr || 0,
        compIdx: keywordData.data.compIdx || "낮음",
        plAvgDepth: keywordData.data.plAvgDepth || 0,
        pcYearData: dataLab.pc.data,
        mobileYearData: dataLab.mobile.data,
      };

      // 중복 결과 방지 (같은 키워드 재검색 시)
      const exists = searchResults.some(
        (result) => result.keyword === searchKeyword,
      );
      if (!exists) {
        setSearchResults((prev) => [...prev, newResult]);
      }
    }
  }, [
    keywordData,
    dataLab.pc.data,
    dataLab.mobile.data,
    searchKeyword,
    searchResults,
  ]);

  return {
    searchResults,
    isLoading,
    handleClearResults,
    handleExcelDownload,
    hasResults: searchResults.length > 0,
  };
}
