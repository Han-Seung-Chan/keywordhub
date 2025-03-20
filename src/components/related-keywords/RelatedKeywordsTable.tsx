"use client";

import { memo, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { KeywordResponse } from "@/types/keyword-tool";

interface RelatedKeywordsTableProps {
  data: Array<{
    keywordData: KeywordResponse;
    relatedKeywords: KeywordResponse[];
  }>;
  searchKeywords: string[];
}

// 테이블 헤더 정의
const tableHeaders = [
  { id: "no", label: "NO" },
  { id: "searchKeyword", label: "검색 키워드" },
  { id: "relKeyword", label: "연관 키워드" },
  { id: "monthlyPcQcCnt", label: "월간 PC 검색량" },
  { id: "monthlyAvePcClkCnt", label: "월간 PC 클릭 수" },
  { id: "monthlyAvePcCtr", label: "월간 PC CTR(%)" },
  { id: "monthlyMobileQcCnt", label: "월간 MO 검색량" },
  { id: "monthlyAveMobileClkCnt", label: "월간 MO 클릭 수" },
  { id: "monthlyAveMobileCtr", label: "월간 MO CTR(%)" },
  { id: "compIdx", label: "입찰 단가 지수" },
  { id: "plAvgDepth", label: "월간 노출 광고 수" },
];

// 테이블 셀 렌더링 함수
const renderCellValue = (
  item: KeywordResponse,
  key: string,
  searchKeyword: string,
): React.ReactNode => {
  if (key === "relKeyword") {
    // 연관 키워드가 검색 키워드와 같을 경우 '-' 표시
    return item.relKeyword === searchKeyword ? "-" : item.relKeyword;
  }

  // 숫자 형식은 천 단위 콤마 추가
  if (typeof item[key as keyof KeywordResponse] === "number") {
    const value = item[key as keyof KeywordResponse] as number;

    // CTR 값은 소수점 둘째 자리까지 표시
    if (key.includes("Ctr")) {
      return value ? value.toFixed(2) : "0.00";
    }

    // 그 외 숫자 값은 천 단위 콤마 추가
    return value ? value.toLocaleString() : "0";
  }

  return item[key as keyof KeywordResponse] || "-";
};

const RelatedKeywordsTable = memo(
  ({ data, searchKeywords }: RelatedKeywordsTableProps) => {
    // 테이블 데이터 변환
    const tableData = useMemo(() => {
      let rowIndex = 1; // 행 번호 초기화
      const rows: Array<{
        id: number;
        searchKeyword: string;
        rowData: KeywordResponse;
      }> = [];

      // 결과 데이터 순회하며 행 데이터 생성
      data.forEach((result, resultIndex) => {
        const searchKeyword =
          searchKeywords[resultIndex] || result.keywordData.relKeyword;

        // 각 결과의 연관 키워드 데이터를 행으로 변환
        result.relatedKeywords.forEach((keyword) => {
          rows.push({
            id: rowIndex++,
            searchKeyword,
            rowData: keyword,
          });
        });
      });

      return rows;
    }, [data, searchKeywords]);

    if (tableData.length === 0) {
      return null;
    }

    return (
      <Card className="mt-6 w-full border border-gray-200 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-auto">
            <Table className="border-collapse">
              <TableHeader className="sticky top-0 z-10">
                <TableRow className="bg-muted/50">
                  {tableHeaders.map((header) => (
                    <TableHead
                      key={header.id}
                      className="border border-gray-200 p-2 text-center whitespace-nowrap"
                    >
                      {header.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="border border-gray-200 p-2 text-center">
                      {row.id}
                    </TableCell>
                    <TableCell className="border border-gray-200 p-2 text-center">
                      {row.searchKeyword}
                    </TableCell>
                    {tableHeaders.slice(2).map((header) => (
                      <TableCell
                        key={`${row.id}-${header.id}`}
                        className="border border-gray-200 p-2 text-center"
                      >
                        {renderCellValue(
                          row.rowData,
                          header.id,
                          row.searchKeyword,
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  },
);

RelatedKeywordsTable.displayName = "RelatedKeywordsTable";

export default RelatedKeywordsTable;
