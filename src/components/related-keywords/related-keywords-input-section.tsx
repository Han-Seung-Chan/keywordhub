"use client";

import { KeywordInputForm, ErrorMessage } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Loader2, X, Search } from "lucide-react";
import { useCallback } from "react";

interface KeywordInputSectionProps {
  searchKeyword: string;
  setSearchKeyword: (value: string) => void;
  isSearching: boolean;
  keywordCount: number;
  maxKeywords: number;
  error: string | null;
  handleSearch: () => void;
  handleClear: () => void;
}

export function KeywordInputSection({
  searchKeyword,
  setSearchKeyword,
  isSearching,
  keywordCount,
  maxKeywords,
  error,
  handleSearch,
  handleClear,
}: KeywordInputSectionProps) {
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

  return (
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
  );
}
