"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

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
            <Button size="sm" className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              다운로드
            </Button>
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

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="p-3 text-center">
                <input type="checkbox" />
              </th>
              <th className="p-3 text-center">NO</th>
              <th className="p-3 text-left">키워드</th>
              <th colSpan={2} className="p-3 text-center">
                월간검색수
              </th>
              <th className="p-3 text-center">검색수합계</th>
              <th colSpan={2} className="p-3 text-center">
                월간 블로그 발행
              </th>
              <th className="p-3 text-center">네이버쇼핑 카테고리</th>
              <th colSpan={2} className="p-3 text-center">
                월평균클릭수
              </th>
              <th colSpan={2} className="p-3 text-center">
                월평균클릭율
              </th>
              <th className="p-3 text-center">경쟁정도</th>
              <th className="p-3 text-center">월평균노출평균순위</th>
            </tr>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="p-2"></th>
              <th className="p-2"></th>
              <th className="p-2"></th>
              <th className="p-2 text-center">PC</th>
              <th className="p-2 text-center">Mobile</th>
              <th className="p-2 text-center">검색수합계</th>
              <th className="p-2 text-center">수량</th>
              <th className="p-2 text-center">포화도</th>
              <th className="p-2 text-center"></th>
              <th className="p-2 text-center">PC</th>
              <th className="p-2 text-center">Mobile</th>
              <th className="p-2 text-center">PC</th>
              <th className="p-2 text-center">Mobile</th>
              <th className="p-2 text-center"></th>
              <th className="p-2 text-center"></th>
            </tr>
          </thead>
          <tbody>
            {keywordData.length > 0 ? (
              keywordData.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="p-3 text-center">
                    <input type="checkbox" />
                  </td>
                  <td className="p-3 text-center">{item.id}</td>
                  <td className="p-3 text-left font-medium">{item.keyword}</td>
                  <td className="p-3 text-center">
                    {item.pcSearchCount.toLocaleString()}
                  </td>
                  <td className="p-3 text-center">
                    {item.mobileSearchCount.toLocaleString()}
                  </td>
                  <td className="p-3 text-center">
                    {item.totalSearchCount.toLocaleString()}
                  </td>
                  <td className="p-3 text-center">
                    {item.pcBlogCount.toLocaleString()}
                  </td>
                  <td className="p-3 text-center">
                    {item.mobileBlogCount.toLocaleString()}
                  </td>
                  <td className="p-3 text-center">-</td>
                  <td className="p-3 text-center">
                    {item.pcClickCount.toLocaleString()}
                  </td>
                  <td className="p-3 text-center">
                    {item.mobileClickCount.toLocaleString()}
                  </td>
                  <td className="p-3 text-center">
                    {item.pcClickRate.toFixed(2)}%
                  </td>
                  <td className="p-3 text-center">
                    {item.mobileClickRate.toFixed(2)}%
                  </td>
                  <td className="p-3 text-center">{item.competition}</td>
                  <td className="p-3 text-center">-</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={15} className="p-6 text-center text-gray-500">
                  키워드를 조회하세요.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
