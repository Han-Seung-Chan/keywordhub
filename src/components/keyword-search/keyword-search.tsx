"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { DataLabRequest, DataLabResponse } from "@/types/data-lab";
import { KeywordResponse } from "@/types/keyword-tool";
import { useKeywordMutation } from "@/query/useKeywordMutation";
import { useDataLabMutation } from "@/query/useDataLabMutation";

const defaultRequest: DataLabRequest = {
  startDate: "2024-01-01",
  endDate: "2024-12-01",
  timeUnit: "month",
  keywordGroups: [{ groupName: "apple", keywords: ["apple"] }],
  device: "mo",
  gender: "",
  ages: [],
};

export default function KeywordSearch() {
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [formData, setFormData] = useState<DataLabRequest>(defaultRequest);

  const [keywordResults, setKeywordResults] = useState<KeywordResponse[]>([]);
  const [dataLabResult, setDataLabResult] = useState<DataLabResponse | null>(
    null,
  );

  const [activeTab, setActiveTab] = useState<string>("keyword-search");

  const [error, setError] = useState<string | null>(null);

  // React Query mutations 사용
  const keywordMutation = useKeywordMutation();
  const dataLabMutation = useDataLabMutation();

  // 로딩 상태 통합
  const isLoading = keywordMutation.isPending || dataLabMutation.isPending;

  // 검색 핸들러
  const handleSearch = async () => {
    // 입력값 유효성 검사
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

    try {
      // 키워드 데이터 가져오기
      const keywordResult = await keywordMutation.mutateAsync(searchKeyword);

      if (keywordResult.success) {
        if (keywordResult.data.length === 0) {
          setError("검색 결과가 없습니다. 다른 키워드로 시도해 보세요.");
        }
        console.log(keywordResult.data);
        setKeywordResults(keywordResult.data);
      } else {
        console.error("키워드 분석 중 오류 발생:", keywordResult.error);
        setError(
          keywordResult.error ||
            "키워드 데이터를 가져오는 중 오류가 발생했습니다.",
        );
      }

      // DataLab 데이터 가져오기
      const dataLabResult = await dataLabMutation.mutateAsync(formData);
      if (dataLabResult.success) {
        console.log(dataLabResult.data);
        setDataLabResult(dataLabResult.data);
      } else {
        setError(dataLabResult.error || "데이터를 가져오는 데 실패했습니다.");
        console.error("API 오류:", dataLabResult.error);
      }
    } catch (err) {
      console.error("검색 처리 중 예외 발생:", err);
      setError("검색 처리 중 오류가 발생했습니다.");
    }
  };

  const handleClear = useCallback(() => {
    setSearchKeyword("");
    setKeywordResults([]);
    setDataLabResult(null);
    setError(null);
  }, []);

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
  }, []);

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
