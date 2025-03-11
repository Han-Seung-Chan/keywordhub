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
  const { searchResults, isLoading, handleClearResults, hasResults } =
    useKeywordResults();

  return (
    <div className="mt-6 w-full rounded-md border border-gray-200">
      <ResultsHeader onClearResults={handleClearResults} data={searchResults} />

      {isLoading && (
        <div className="p-4">
          <LoadingProgress
            isLoading={isLoading}
            progress={90}
            message="결과 데이터 로딩 중..."
          />
        </div>
      )}

      {!hasResults && !isLoading ? (
        <EmptyResults />
      ) : (
        <KeywordTable keywordData={searchResults} />
      )}

      <UsageGuide />
    </div>
  );
}
