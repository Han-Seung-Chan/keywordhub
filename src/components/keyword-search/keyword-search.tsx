"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { DataLabRequest, DataLabResponse } from "@/types/data-lab";
import { fetchKeywordData } from "@/lib/fetch-keywords";
import { fetchDatalabData } from "@/lib/fetch-data-lab";
import { KeywordResponse } from "@/types/keyword-tool";

const defaultRequest: DataLabRequest = {
  startDate: "2024-01-01",
  endDate: "2024-12-01",
  timeUnit: "month",
  keywordGroups: [
    { groupName: "1", keywords: ["apple"] },
    // { groupName: "2", keywords: ["2"] },
  ],
  device: "mo",
  ages: [],
};

export default function KeywordSearch() {
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [formData, setFormData] = useState<DataLabRequest>(defaultRequest);

  const [keywordResults, setKeywordResults] = useState<KeywordResponse[]>([]);
  const [dataLabResult, setDataLabResult] = useState<DataLabResponse>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 검색 핸들러
  const handleSearch = async () => {
    // 입력값 유효성 검사
    if (!searchKeyword.trim()) return setError("검색할 키워드를 입력해주세요.");

    // 줄바꿈 처리
    console.log(searchKeyword.replace(/ /g, "").split("\n"));

    setIsLoading(true);
    setError(null);

    const keywordResult = await fetchKeywordData(searchKeyword);

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

    const dataLabResult = await fetchDatalabData(formData);
    if (dataLabResult.success) {
      console.log(dataLabResult.data);
      setDataLabResult(dataLabResult.data);
    } else {
      setError(dataLabResult.error || "데이터를 가져오는 데 실패했습니다.");
      console.error("API 오류:", dataLabResult.error);
    }

    setIsLoading(false);
  };

  const handleClear = () => {
    setSearchKeyword("");
  };

  return (
    <div className="w-full overflow-hidden rounded-md border border-gray-200 bg-white">
      <div className="p-6">
        <h1 className="text-navy mb-2 text-2xl font-bold">
          키워드허브 - 키워드 검색량 조회기
        </h1>
        <p className="mb-6 text-gray-600">
          키워드의 조회수를 확인할 수 있는 키워드 검색량 조회기입니다.
          <br />
          마피아넷 회원이라면 누구나 무료로 사용 하실 수 있습니다.
        </p>

        <Tabs defaultValue="keyword-search" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-3">
            <TabsTrigger
              value="keyword-search"
              className="data-[state=active]:bg-gray-100"
            >
              키워드 조회기
            </TabsTrigger>
            <TabsTrigger
              value="keyword-combine"
              className="data-[state=active]:bg-gray-100"
            >
              키워드 조합기
            </TabsTrigger>
            <TabsTrigger
              value="related-keywords"
              className="data-[state=active]:bg-gray-100"
            >
              연관키워드
            </TabsTrigger>
          </TabsList>

          <TabsContent value="keyword-search" className="space-y-4">
            <div className="mb-6 rounded-md border border-gray-200 p-4">
              <Textarea
                placeholder="한 줄에 하나씩 입력해세요. (최대100개까지)"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="mb-4 min-h-[120px]"
              />

              <div className="flex justify-between">
                <div className="text-sm text-gray-500">
                  ※ 검색어에 특수문자를 사용할 수 없습니다.
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={handleSearch}>
                조회하기
              </Button>
              <Button variant="outline" onClick={handleClear}>
                입력값지우기
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
