"use client";

import ExcelDownloadButton from "@/components/excel-download";
import KeywordTable from "@/components/keyword-results/keyword-table/keyword-table";
import { Button } from "@/components/ui/button";
import { defaultDataLab } from "@/constants/default-data-lab";
import { useDataLabQueries } from "@/query/useDataLabQueries";
import { useKeywordQuery } from "@/query/useKeywordQuery";
import { useKeywordStore } from "@/store/useKeywordStore";
import { useEffect, useState } from "react";

export default function KeywordResults() {
  const { searchKeyword } = useKeywordStore();
  const [searchResult, setSearchResult] = useState([]);

  const { data: keywordData, isLoading: isKeywordLoading } =
    useKeywordQuery(searchKeyword);
  const dataLab = useDataLabQueries(defaultDataLab, searchKeyword);

  useEffect(() => {
    if (!keywordData || !dataLab.pc.data || !dataLab.mobile.data) return;

    console.log(keywordData);
    console.log(dataLab.pc.data);
    console.log(dataLab.mobile.data);

    setSearchResult((prev) => [
      ...prev,
      {
        id: searchResult.length + 1,
        keyword: searchKeyword,
        monthlyPcQcCnt: keywordData.data.monthlyPcQcCnt,
        monthlyAvePcClkCnt: keywordData.data.monthlyAvePcClkCnt,
        monthlyAvePcCtr: keywordData.data.monthlyAvePcCtr,
        monthlyMobileQcCnt: keywordData.data.monthlyMobileQcCnt,
        monthlyAveMobileClkCnt: keywordData.data.monthlyAveMobileClkCnt,
        monthlyAveMobileCtr: keywordData.data.monthlyAveMobileCtr,
        compIdx: keywordData.data.compIdx,
        plAvgDepth: keywordData.data.plAvgDepth,
        pcYearData: dataLab.pc.data,
        mobileYearData: dataLab.mobile.data,
      },
    ]);
  }, [keywordData, dataLab.pc.data, dataLab.mobile.data]);

  return (
    <div className="mt-6 w-full rounded-md border border-gray-200">
      <div className="border-b border-gray-200 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-navy text-xl font-bold">키워드 조회 결과</h2>
          <div className="flex gap-2">
            <ExcelDownloadButton data={[]} />
            <Button size="sm" onClick={() => {}}>
              검색값초기화
            </Button>
          </div>
        </div>

        <div className="mb-2 text-sm text-gray-500">
          ※키워드를 선택하신 후 다운로드가 가능합니다.
          <br />
          ※키워드 클릭시 상세정보 제공
        </div>
      </div>

      <KeywordTable keywordData={searchResult} />

      <div className="border-t border-gray-200 p-6">
        <h3 className="mb-4 text-lg font-bold">이용안내</h3>
        <ol className="list-decimal space-y-2 pl-5">
          <li>원하는 키워드를 넣어주세요</li>
          <li>[입력값 지우기]클릭시 입력한 모든 키워드가 삭제됩니다.</li>
          <li>
            [다운로드]를 누르시면 조회 결과를 엑셀파일로 내려받을 수
            있습니다.(*CSV파일로 제공됩니다.)
          </li>
        </ol>

        <div className="mt-4 text-sm text-gray-600">
          <p>-원하는 키워드만 선택하여 다운로드도 가능</p>
          <p>-키워드 및 조회수에 따라 오름/내림차순으로 정렬가능</p>
        </div>
      </div>
    </div>
  );
}
