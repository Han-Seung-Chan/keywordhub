"use client";

import KeywordTable from "@/components/keyword-table/keyword-table";
import {
  ResultsHeader,
  UsageGuide,
  EmptyResults,
} from "@/components/keyword-results";
import { useKeywordResults } from "@/hooks/useKeywordResults";
import LoadingProgress from "@/components/loading-progress";

export default function KeywordResults() {
  const {
    searchResults,
    isLoading,
    loadingProgress,
    processedCount,
    totalKeywords,
    handleClearResults,
    hasResults,
  } = useKeywordResults();

  // 로딩 상태 메시지 생성
  const getLoadingMessage = () => {
    if (totalKeywords > 0) {
      return `키워드 처리 중... (${processedCount}/${totalKeywords})`;
    }
    return "데이터 로딩 중...";
  };

  return (
    <div className="mt-6 w-full rounded-md border border-gray-200">
      <ResultsHeader
        onClearResults={handleClearResults}
        data={searchResults}
        resultCount={searchResults.length}
      />

      {isLoading && (
        <div className="p-4">
          <LoadingProgress
            isLoading={isLoading}
            progress={loadingProgress}
            message={getLoadingMessage()}
          />
        </div>
      )}

      {!isLoading && !hasResults ? (
        <EmptyResults />
      ) : (
        <KeywordTable keywordData={searchResults} />
      )}

      <UsageGuide />
    </div>
  );
}
