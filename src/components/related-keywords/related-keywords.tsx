"use client";

import { useRelatedKeyword } from "@/hooks/useRelatedKeyword";
import { Card, CardContent } from "@/components/ui/card";

import { useMemo } from "react";
import { UsageGuide } from "@/components/keyword-results";
import {
  formatRelatedKeywordExcelData,
  formatRelatedKeywordTableData,
} from "@/utils/excel-helpers";
import { KeywordInputSection } from "@/components/related-keywords/related-keywords-input-section";
import LoadingProgress from "@/components/loading-progress";
import { ResultsSection } from "@/components/related-keywords/related-keywords-result-section";

export default function RelatedKeywords() {
  const {
    searchKeyword,
    setSearchKeyword,
    isSearching,
    progress,
    error,
    keywordCount,
    results,
    allRelatedKeywords,
    processedCount,
    totalKeywords,
    handleSearch,
    handleClear,
    maxKeywords,
    searchKeywords,
  } = useRelatedKeyword();

  const tableData = useMemo(() => {
    return formatRelatedKeywordTableData(results, searchKeywords);
  }, [results, searchKeywords]);

  const excelData = useMemo(() => {
    return formatRelatedKeywordExcelData(results, searchKeywords);
  }, [results, searchKeywords]);

  // 검색 결과가 있는지 확인
  const hasResults = useMemo(() => results.length > 0, [results]);

  return (
    <div className="space-y-6">
      <KeywordInputSection
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
        isSearching={isSearching}
        keywordCount={keywordCount}
        maxKeywords={maxKeywords}
        error={error}
        handleSearch={handleSearch}
        handleClear={handleClear}
      />

      <Card className="w-full border border-gray-200 shadow-sm">
        <CardContent className="p-4">
          {isSearching ? (
            <LoadingProgress
              loadingProgress={progress}
              processedCount={processedCount}
              totalKeywords={totalKeywords}
            />
          ) : hasResults ? (
            <ResultsSection
              tableData={tableData}
              excelData={excelData}
              allRelatedKeywordsLength={allRelatedKeywords.length}
            />
          ) : null}
        </CardContent>
      </Card>

      <UsageGuide maxKeywordCnt={10} />
    </div>
  );
}
