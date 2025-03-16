"use client";

import { useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useKeywordSearch } from "@/hooks/useKeywordSearch";
import KeywordInputForm from "@/components/keyword-search/keyword-input-form";
import ActionButtons from "@/components/keyword-search/action-buttons";
import { ErrorMessage } from "@/components/common";

export default function KeywordSearch() {
  const [activeTab, setActiveTab] = useState<string>("keyword-search");

  const {
    searchKeyword,
    setSearchKeyword,
    isLoading,
    error,
    keywordCount,
    handleSearch,
    handleClear,
    maxKeywords,
  } = useKeywordSearch();

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
  }, []);

  // 키워드 입력 처리 함수 - 최대 라인 수 제한 적용
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

  return (
    <div className="w-full overflow-hidden">
      <h1 className="text-navy mb-2 text-2xl font-bold">
        키워드 검색량 조회기
      </h1>
      <p className="mb-6 text-gray-600">
        키워드의 조회수를 확인할 수 있는 키워드 검색량 조회기입니다.
        <br />한 번에 최대 {maxKeywords}개의 키워드를 검색할 수 있습니다.
      </p>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="mb-4 grid h-15 w-full grid-cols-3">
          <TabsTrigger value="keyword-search" className="h-12 py-3">
            키워드 조회기
          </TabsTrigger>
          <TabsTrigger value="keyword-combine" className="h-12 py-3" disabled>
            키워드 조합기 (준비중)
          </TabsTrigger>
          <TabsTrigger value="related-keywords" className="h-12 py-3" disabled>
            연관키워드 (준비중)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="keyword-search" className="space-y-4">
          <KeywordInputForm
            value={searchKeyword}
            onChange={handleKeywordChange}
            disabled={isLoading}
            keywordCount={keywordCount}
            maxKeywords={maxKeywords}
          />

          <ErrorMessage message={error} />

          <ActionButtons
            onSearch={handleSearch}
            onClear={handleClear}
            isLoading={isLoading}
            isDisabled={!searchKeyword.trim()}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
