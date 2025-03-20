"use client";

import { memo, useMemo } from "react";
import KeywordTable from "@/components/keyword-table/keyword-table";
import {
  ResultsHeader,
  UsageGuide,
  EmptyResults,
} from "@/components/keyword-results";
import { useKeywordResults } from "@/hooks/useKeywordResults";
import { Card, CardContent } from "@/components/ui/card";
import LoadingProgress from "@/components/loading-progress";

// 결과 컨텐츠 컴포넌트
const ResultsContent = memo(({ searchResults }: { searchResults: any[] }) => {
  return (
    <CardContent className="py-3">
      <KeywordTable keywordData={searchResults} />
    </CardContent>
  );
});

ResultsContent.displayName = "ResultsContent";

// 메인 컴포넌트
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

  // 결과 컨텐츠 메모이제이션
  const content = useMemo(() => {
    if (isLoading) {
      return (
        <LoadingProgress
          loadingProgress={loadingProgress}
          processedCount={processedCount}
          totalKeywords={totalKeywords}
        />
      );
    }

    if (!hasResults) {
      return <EmptyResults />;
    }

    return <ResultsContent searchResults={searchResults} />;
  }, [
    isLoading,
    loadingProgress,
    processedCount,
    totalKeywords,
    hasResults,
    searchResults,
  ]);

  return (
    <Card className="mt-6 w-full gap-0 border border-gray-200 py-3 shadow-sm">
      <ResultsHeader
        onClearResults={handleClearResults}
        data={searchResults}
        resultCount={searchResults.length}
      />

      {content}

      <UsageGuide maxKeywordCnt={100} />
    </Card>
  );
}
