"use client";

import { useRelatedKeyword } from "@/hooks/useRelatedKeyword";
import { KeywordInputForm, ErrorMessage } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import LoadingProgress from "@/components/loading-progress";
import { Loader2, X, Search, StopCircle } from "lucide-react";
import { useCallback, useMemo } from "react";
import ExcelDownloadButton from "@/components/excel-download";
import RelatedKeywordsTable from "@/components/related-keywords/RelatedKeywordsTable";

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
    handleStop,
    maxKeywords,
  } = useRelatedKeyword();

  // 키워드 입력 처리 함수
  const handleKeywordChange = useCallback(
    (value: string) => {
      const lines = value.split("\n");

      // 최대 키워드 개수를 초과하는 경우 입력 제한
      if (lines.length > maxKeywords) {
        // 최대 개수까지만 유지
        const limitedValue = lines.slice(0, maxKeywords).join("\n");
        setSearchKeyword(limitedValue);
      } else {
        setSearchKeyword(value);
      }
    },
    [setSearchKeyword, maxKeywords],
  );

  // 검색 결과가 있는지 확인
  const hasResults = useMemo(() => results.length > 0, [results]);

  // 검색키워드 목록 생성
  const searchKeywords = useMemo(() => {
    return searchKeyword
      .split("\n")
      .map((kw) => kw.trim())
      .filter((kw) => kw !== "");
  }, [searchKeyword]);

  // 엑셀 다운로드를 위한 데이터 형식 변환
  const excelData = useMemo(() => {
    const rows: any[] = [];

    results.forEach((result, resultIndex) => {
      const searchKw = searchKeywords[resultIndex] || "";

      result.relatedKeywords.forEach((keyword) => {
        rows.push({
          검색키워드: searchKw,
          연관키워드:
            keyword.relKeyword === searchKw ? "-" : keyword.relKeyword,
          월간PC검색량: keyword.monthlyPcQcCnt || 0,
          월간PC클릭수: keyword.monthlyAvePcClkCnt || 0,
          월간PCCTR: keyword.monthlyAvePcCtr
            ? `${keyword.monthlyAvePcCtr.toFixed(2)}%`
            : "0.00%",
          월간모바일검색량: keyword.monthlyMobileQcCnt || 0,
          월간모바일클릭수: keyword.monthlyAveMobileClkCnt || 0,
          월간모바일CTR: keyword.monthlyAveMobileCtr
            ? `${keyword.monthlyAveMobileCtr.toFixed(2)}%`
            : "0.00%",
          입찰단가지수: keyword.compIdx || "-",
          월간노출광고수: keyword.plAvgDepth || 0,
        });
      });
    });

    return rows;
  }, [results, searchKeywords]);

  // 엑셀 컬럼 정의
  const excelColumns = [
    { key: "검색키워드", header: "검색키워드", width: 58 },
    { key: "연관키워드", header: "연관키워드", width: 58 },
    { key: "월간PC검색량", header: "월간PC검색량", width: 58 },
    { key: "월간PC클릭수", header: "월간PC클릭수", width: 58 },
    { key: "월간PCCTR", header: "월간PCCTR", width: 58 },
    { key: "월간모바일검색량", header: "월간모바일검색량", width: 58 },
    { key: "월간모바일클릭수", header: "월간모바일클릭수", width: 58 },
    { key: "월간모바일CTR", header: "월간모바일CTR", width: 58 },
    { key: "입찰단가지수", header: "입찰단가지수", width: 58 },
    { key: "월간노출광고수", header: "월간노출광고수", width: 58 },
  ];

  // 로딩 상태 표시
  const LoadingState = () => (
    <div className="p-8">
      <div className="flex flex-col items-center justify-center">
        <Loader2 className="text-primary mb-4 h-8 w-8 animate-spin" />
        <h3 className="mb-2 text-lg font-medium text-gray-900">
          연관 키워드 검색 중... ({processedCount}/{totalKeywords})
        </h3>
        <p className="text-sm text-gray-500">
          다량의 키워드는 처리 시간이 더 소요될 수 있습니다.
        </p>
        <div className="mt-6 w-full max-w-md">
          <LoadingProgress
            isLoading={true}
            progress={progress}
            message={`키워드 처리 중... (${processedCount}/${totalKeywords})`}
          />
        </div>
        <Button
          onClick={handleStop}
          variant="outline"
          className="mt-4 flex items-center gap-2"
        >
          <StopCircle className="h-4 w-4" />
          검색 중단하기
        </Button>
      </div>
    </div>
  );

  // 결과 헤더 영역
  const ResultsHeader = () => {
    if (!hasResults) return null;

    return (
      <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-medium">
            연관 키워드 결과
            <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-sm text-blue-700">
              총 {allRelatedKeywords.length}개
            </span>
          </h3>
        </div>
        <div className="flex gap-2">
          <ExcelDownloadButton
            data={excelData}
            columns={excelColumns}
            disabled={false}
            filename="연관키워드_결과"
            sheetName="연관키워드"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <KeywordInputForm
          value={searchKeyword}
          onChange={handleKeywordChange}
          disabled={isSearching}
          keywordCount={keywordCount}
          maxKeywords={maxKeywords}
          title="연관 키워드를 찾을 키워드 입력"
        />

        <ErrorMessage message={error} />

        <div className="flex gap-4">
          <Button
            onClick={handleSearch}
            disabled={isSearching || !searchKeyword.trim()}
            className="flex w-32 items-center gap-2"
          >
            {isSearching ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                처리 중...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                조회하기
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleClear}
            disabled={isSearching}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            입력값 지우기
          </Button>
        </div>
      </div>

      <Card className="w-full border border-gray-200 shadow-sm">
        <CardContent className="p-4">
          {isSearching ? (
            <LoadingState />
          ) : hasResults ? (
            <>
              <ResultsHeader />
              <RelatedKeywordsTable
                data={results}
                searchKeywords={searchKeywords}
              />
            </>
          ) : null}
        </CardContent>
      </Card>

      {/* 도움말 */}
      {!isSearching && !hasResults && (
        <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-700">
          <h3 className="mb-2 font-medium">사용 방법</h3>
          <ul className="list-inside list-disc space-y-1">
            <li>검색하려는 키워드를 한 줄에 하나씩 입력하세요 (최대 100개)</li>
            <li>연관 키워드 조회는 네이버 검색 API 기반으로 작동합니다</li>
            <li>각 키워드에 대한 결과는 개별적으로 표시됩니다</li>
            <li>모든 연관 키워드는 중복 없이 한 번에 표시됩니다</li>
            <li>테이블 뷰에서는 상세 데이터를 확인할 수 있습니다</li>
          </ul>
        </div>
      )}
    </div>
  );
}
