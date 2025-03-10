"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useKeywordQuery } from "@/query/useKeywordQuery";
import { defaultDataLab } from "@/constants/default-data-lab";
import { useKeywordStore } from "@/store/useKeywordStore";
import { useDataLabQueries } from "@/query/useDataLabQueries";

export default function KeywordSearch() {
  const { searchKeyword, setSearchKeyword, clearSearchKeyword } =
    useKeywordStore();
  const [activeTab, setActiveTab] = useState<string>("keyword-search");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 쿼리 실행 여부를 제어하는 상태
  const [shouldFetchKeyword, setShouldFetchKeyword] = useState(false);
  const [shouldFetchDataLab, setShouldFetchDataLab] = useState(false);

  const keywordQuery = useKeywordQuery(searchKeyword, shouldFetchKeyword);
  const dataLab = useDataLabQueries(
    defaultDataLab,
    searchKeyword,
    shouldFetchDataLab,
  );

  // 검색 핸들러
  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      setError("검색할 키워드를 입력해주세요.");
      return;
    }

    if (/[^a-zA-Z0-9가-힣\s]/.test(searchKeyword)) {
      setError("검색어에 특수문자를 사용할 수 없습니다.");
      return;
    }

    // 줄바꿈 처리
    console.log(searchKeyword.replace(/ /g, "").split("\n"));

    setError(null);
    setIsLoading(true);
    setShouldFetchKeyword(true);
    setShouldFetchDataLab(true);
  };

  const handleClear = useCallback(() => {
    clearSearchKeyword();
    setShouldFetchKeyword(false);
    setShouldFetchDataLab(false);
    setError(null);
  }, []);

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
  }, []);

  useEffect(() => {
    // API 오류 처리
    const keywordError = keywordQuery.error;
    const dataLabErrors = dataLab.isError;

    if ((keywordError || dataLabErrors) && !error) {
      setError("데이터를 가져오는 중 오류가 발생했습니다.");
      return;
    }

    setIsLoading(false);
  }, [
    keywordQuery.error,
    dataLab.isError,
    shouldFetchKeyword,
    shouldFetchDataLab,
    error,
  ]);

  return (
    <div className="w-full overflow-hidden">
      <div className="p-6">
        <h1 className="text-navy mb-2 text-2xl font-bold">
          키워드허브 - 키워드 검색량 조회기
        </h1>
        <p className="mb-6 text-gray-600">
          키워드의 조회수를 확인할 수 있는 키워드 검색량 조회기입니다.
          <br />
          누구나 무료로 사용 하실 수 있습니다.
        </p>

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="mb-6 grid w-full grid-cols-3">
            <TabsTrigger value="keyword-search">키워드 조회기</TabsTrigger>
            <TabsTrigger value="keyword-combine">키워드 조합기</TabsTrigger>
            <TabsTrigger value="related-keywords">연관키워드</TabsTrigger>
          </TabsList>

          <TabsContent value="keyword-search" className="space-y-4">
            <div className="mb-6 rounded-md border border-gray-200 p-4">
              <Textarea
                placeholder="한 줄에 하나씩 입력해세요. (최대100개까지)"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="mb-4 h-[150px]"
                disabled={isLoading}
              />

              <div className="flex justify-between">
                <div className="text-sm text-gray-500">
                  ※ 검색어에 특수문자를 사용할 수 없습니다.
                </div>
                <div className="text-sm text-gray-500">
                  {searchKeyword
                    ? `${searchKeyword.split("\n").filter(Boolean).length}/100`
                    : "0/100"}
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-4 rounded-md bg-red-50 p-4 text-red-600">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <Button
                onClick={handleSearch}
                disabled={isLoading || !searchKeyword.trim()}
                className="w-32"
              >
                {isLoading ? "처리 중..." : "조회하기"}
              </Button>
              <Button
                variant="outline"
                onClick={handleClear}
                disabled={isLoading || !searchKeyword.trim()}
              >
                입력값 지우기
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="keyword-combine">
            <div className="flex h-40 items-center justify-center text-gray-500">
              키워드 조합 기능은 이 데모에서 구현되지 않았습니다.
            </div>
          </TabsContent>

          <TabsContent value="related-keywords">
            <div className="flex h-40 items-center justify-center text-gray-500">
              연관 키워드 기능은 이 데모에서 구현되지 않았습니다.
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
