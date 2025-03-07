"use client";

import ExcelDownloadButton from "@/components/excel-download";
import KeywordTable from "@/components/keyword-results/keyword-table";
import { Button } from "@/components/ui/button";

interface KeywordResultsProps {
  keywords?: string[];
}

interface KeywordData {
  id: number;
  keyword: string;
  pcSearchCount: number;
  mobileSearchCount: number;
  totalSearchCount: number;
  pcBlogCount: number;
  mobileBlogCount: number;
  pcClickCount: number;
  mobileClickCount: number;
  pcClickRate: number;
  mobileClickRate: number;
  competition: string;
}

export default function KeywordResults({ keywords }: KeywordResultsProps) {
  // 예시 데이터 생성
  const generateMockData = (keyword: string, index: number): KeywordData => {
    const baseCount = Math.floor(Math.random() * 10000) + 1000;
    const pcSearchCount = baseCount;
    const mobileSearchCount = Math.floor(baseCount * 1.5);

    return {
      id: index + 1,
      keyword,
      pcSearchCount,
      mobileSearchCount,
      totalSearchCount: pcSearchCount + mobileSearchCount,
      pcBlogCount: Math.floor(pcSearchCount * 0.3),
      mobileBlogCount: Math.floor(mobileSearchCount * 0.2),
      pcClickCount: Math.floor(pcSearchCount * 0.4),
      mobileClickCount: Math.floor(mobileSearchCount * 0.3),
      pcClickRate: Math.random() * 5 + 1,
      mobileClickRate: Math.random() * 4 + 0.5,
      competition: ["낮음", "보통", "높음"][Math.floor(Math.random() * 3)],
    };
  };

  const keywordData = !keywords ? [] : keywords.map(generateMockData);

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

      <KeywordTable keywordData={[]} />

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
