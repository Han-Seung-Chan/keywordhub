import { KeywordData } from "@/types/table";
import { calculateSearchVolume } from "@/utils/excel-ratio";
import { DataLabResponse } from "@/types/data-lab";
import { keywordColumns } from "@/constants/default-excel-data";
import { ExcelColumn } from "@/types/excel";

/**
 * 연간 데이터를 엑셀 열로 변환하는 함수
 * @param prefix 'pc' 또는 'mo'
 * @param data 연간 데이터 (pcYearData 또는 mobileYearData)
 * @param dataType "pcYearData" 또는 "mobileYearData"
 * @returns 해당 데이터용 ExcelColumn 배열
 */
export function createYearDataColumns(
  prefix: string,
  data: DataLabResponse | undefined,
  dataType: "pcYearData" | "mobileYearData",
): ExcelColumn[] {
  if (!data?.results?.[0]?.data) {
    return [];
  }

  return data.results[0].data.map((monthData) => {
    const yearMonth = monthData.period.substring(2, 7);
    return {
      key: `${prefix}_${yearMonth}`,
      header: `${prefix.toUpperCase()}_${yearMonth}`,
      width: 58,
      formatter: (_: any, rowData: KeywordData) => {
        // 원본 데이터에서 해당 월 데이터 찾기
        const monthDatum = rowData[dataType]?.results?.[0]?.data?.find(
          (d) => d.period.substring(2, 7) === yearMonth,
        );

        if (monthDatum) {
          return calculateSearchVolume(
            monthDatum.ratio,
            rowData,
            dataType,
          ).toLocaleString();
        }
        return "0";
      },
    };
  });
}

/**
 * 모든 키워드 엑셀 열 구성 생성 (기본 + PC/MO 연간 데이터)
 */
export function getKeywordExcelColumns(data: KeywordData[]): ExcelColumn[] {
  if (!data || data.length === 0) {
    return keywordColumns;
  }

  const firstItem = data[0];

  // 기본 컬럼에 연간 데이터 컬럼 추가
  return [
    ...keywordColumns,
    ...createYearDataColumns("pc", firstItem.pcYearData, "pcYearData"),
    ...createYearDataColumns("mo", firstItem.mobileYearData, "mobileYearData"),
  ];
}

import { KeywordResponse } from "@/types/keyword-tool";
import { RelatedKeywordResult } from "@/types/related-keyword";

/**
 * 테이블 표시용 키워드 데이터 형식 변환
 * @param results 검색 결과 배열
 * @param searchKeywords 검색 키워드 배열
 * @returns 테이블 표시용으로 변환된 데이터 배열
 */
export function formatRelatedKeywordTableData(
  results: RelatedKeywordResult[],
  searchKeywords: string[],
): any[] {
  let rows: any[] = [];
  let rowIndex = 1; // 행 번호 초기화

  results.forEach((result, resultIndex) => {
    const searchKw =
      searchKeywords[resultIndex] || result.keywordData.relKeyword || "";

    result.relatedKeywords.forEach((keyword: KeywordResponse) => {
      rows.push({
        id: rowIndex++,
        searchKeyword: searchKw,
        ...keyword,
        // 만약 연관 키워드가 검색 키워드와 동일하면 표시를 다르게 함
        relKeyword:
          keyword.relKeyword === searchKw
            ? `${keyword.relKeyword} (검색 키워드)`
            : keyword.relKeyword,
      });
    });
  });

  return rows;
}

/**
 * 엑셀 다운로드용 키워드 데이터 형식 변환
 * @param results 검색 결과 배열
 * @param searchKeywords 검색 키워드 배열
 * @returns 엑셀 다운로드용으로 변환된 데이터 배열
 */
export function formatRelatedKeywordExcelData(
  results: RelatedKeywordResult[],
  searchKeywords: string[],
): any[] {
  const rows: any[] = [];

  results.forEach((result, resultIndex) => {
    const searchKw = searchKeywords[resultIndex] || "";

    result.relatedKeywords.forEach((keyword: KeywordResponse) => {
      rows.push({
        검색키워드: searchKw,
        연관키워드: keyword.relKeyword === searchKw ? "-" : keyword.relKeyword,
        월간PC검색량: keyword.monthlyPcQcCnt || 0,
        월간PC클릭수: keyword.monthlyAvePcClkCnt || 0,
        월간PCCTR: keyword.monthlyAvePcCtr,
        월간모바일검색량: keyword.monthlyMobileQcCnt || 0,
        월간모바일클릭수: keyword.monthlyAveMobileClkCnt || 0,
        월간모바일CTR: keyword.monthlyAveMobileCtr,
        입찰단가지수: keyword.compIdx || "-",
        월간노출광고수: keyword.plAvgDepth || 0,
      });
    });
  });

  return rows;
}
