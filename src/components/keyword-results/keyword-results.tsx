"use client";

import KeywordTable from "@/components/keyword-table/keyword-table";
import {
  ResultsHeader,
  UsageGuide,
  EmptyResults,
} from "@/components/keyword-results";
import { useKeywordResults } from "@/hooks/useKeywordResults";
import LoadingProgress from "@/components/loading-progress";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

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
    <Card className="mt-6 w-full gap-0 border border-gray-200 shadow-sm">
      <ResultsHeader
        onClearResults={handleClearResults}
        data={searchResults}
        resultCount={searchResults.length}
      />

      {isLoading && (
        <div className="p-8">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="text-primary mb-4 h-8 w-8 animate-spin" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              {getLoadingMessage()}
            </h3>
            <p className="text-sm text-gray-500">
              다량의 키워드는 처리 시간이 더 소요될 수 있습니다.
            </p>
            <div className="mt-6 w-full max-w-md">
              <LoadingProgress
                isLoading={isLoading}
                progress={loadingProgress}
                message={getLoadingMessage()}
              />
            </div>
          </div>
        </div>
      )}

      {!isLoading && !hasResults ? (
        <EmptyResults />
      ) : (
        <CardContent className="p-6">
          <KeywordTable keywordData={searchResults} />
        </CardContent>
      )}

      <UsageGuide />
    </Card>
  );
}
