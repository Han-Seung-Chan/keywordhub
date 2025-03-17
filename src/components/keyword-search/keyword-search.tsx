"use client";

import { useCallback } from "react";
import { useKeywordSearch } from "@/hooks/useKeywordSearch";
import ActionButtons from "@/components/keyword-search/action-buttons";
import { ErrorMessage } from "@/components/common";
import { KeywordInputForm } from "@/components/common/keyword-input-form";

export default function KeywordSearch() {
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
    <div className="space-y-4">
      <KeywordInputForm
        value={searchKeyword}
        onChange={handleKeywordChange}
        disabled={isLoading}
        keywordCount={keywordCount}
        maxKeywords={maxKeywords}
        title=""
      />

      <ErrorMessage message={error} />

      <ActionButtons
        onSearch={handleSearch}
        onClear={handleClear}
        isLoading={isLoading}
        isDisabled={!searchKeyword.trim()}
      />
    </div>
  );
}
