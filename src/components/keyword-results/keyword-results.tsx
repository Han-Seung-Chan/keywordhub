"use client";

import { memo, useMemo } from "react";
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

// 로딩 상태 컴포넌트 분리
const LoadingState = memo(
  ({
    loadingProgress,
    processedCount,
    totalKeywords,
  }: {
    loadingProgress: number;
    processedCount: number;
    totalKeywords: number;
  }) => {
    // 로딩 상태 메시지 생성
    const loadingMessage = useMemo(() => {
      if (totalKeywords > 0) {
        return `키워드 처리 중... (${processedCount}/${totalKeywords})`;
      }
      return "데이터 로딩 중...";
    }, [processedCount, totalKeywords]);

    return (
      <div className="p-8">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="text-primary mb-4 h-8 w-8 animate-spin" />
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            {loadingMessage}
          </h3>
          <p className="text-sm text-gray-500">
            다량의 키워드는 처리 시간이 더 소요될 수 있습니다.
          </p>
          <div className="mt-6 w-full max-w-md">
            <LoadingProgress
              isLoading={true}
              progress={loadingProgress}
              message={loadingMessage}
            />
          </div>
        </div>
      </div>
    );
  },
);

LoadingState.displayName = "LoadingState";

// 결과 컨텐츠 컴포넌트
const ResultsContent = memo(({ searchResults }: { searchResults: any[] }) => {
  return (
    <CardContent className="p-6">
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
        <LoadingState
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
    <Card className="mt-6 w-full gap-0 border border-gray-200 shadow-sm">
      <ResultsHeader
        onClearResults={handleClearResults}
        data={searchResults}
        resultCount={searchResults.length}
      />

      {content}

      <UsageGuide />
    </Card>
  );
}
