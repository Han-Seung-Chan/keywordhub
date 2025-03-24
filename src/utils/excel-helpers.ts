import { keywordColumns } from "@/constants/default-excel-data";
import { DataLabResponse } from "@/types/data-lab";
import { ExcelColumn, ExcelRow, FormattedKeywordRow } from "@/types/excel";
import { KeywordData } from "@/types/table";
import { calculateSearchVolume } from "@/utils/excel-ratio";

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
      formatter: (_: unknown, rowData: KeywordData) => {
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
): FormattedKeywordRow[] {
  const rows: FormattedKeywordRow[] = [];
  let rowIndex = 1; // 행 번호 초기화

  results.forEach((result, resultIndex) => {
    const searchKw =
      searchKeywords[resultIndex] || result.keywordData.relKeyword || "";

    result.relatedKeywords.forEach((keyword: KeywordResponse) => {
      if (typeof keyword.monthlyPcQcCnt === "string")
        keyword.monthlyPcQcCnt = 0;
      if (typeof keyword.monthlyMobileQcCnt === "string")
        keyword.monthlyMobileQcCnt = 0;

      // 연관 키워드와 검색 키워드 비교 강화
      const isSearchKeyword =
        keyword.relKeyword &&
        searchKw &&
        keyword.relKeyword.trim().toLowerCase() ===
          searchKw.trim().toLowerCase();

      // relKeyword 속성을 분리하여 덮어쓰기 방지
      const { relKeyword: originalRelKeyword, ...keywordWithoutRelKeyword } =
        keyword;

      rows.push({
        id: rowIndex++,
        searchKeyword: searchKw,
        // 만약 연관 키워드가 검색 키워드와 동일하면 표시를 다르게 함
        relKeyword: isSearchKeyword
          ? `${originalRelKeyword} (검색 키워드)`
          : originalRelKeyword,
        totalCnt: keyword.monthlyPcQcCnt + keyword.monthlyMobileQcCnt,
        ...keywordWithoutRelKeyword,
        relevanceScore: keyword.relevanceScore,
      });
    });
  });

  return rows;
}

/**
 * FormattedKeywordRow 배열을 KeywordData 배열로 변환하는 함수
 * @param rows FormattedKeywordRow 배열
 * @returns KeywordData 배열
 */
export function convertToKeywordData(
  rows: FormattedKeywordRow[],
): KeywordData[] {
  return rows.map((row) => {
    const keywordData: KeywordData = {
      id: row.id,
      keyword: row.relKeyword,
      monthlyPcQcCnt: Number(row.monthlyPcQcCnt) || 0,
      monthlyAvePcClkCnt: Number(row.monthlyAvePcClkCnt) || 0,
      monthlyAvePcCtr: Number(row.monthlyAvePcCtr) || 0,
      monthlyMobileQcCnt: Number(row.monthlyMobileQcCnt) || 0,
      monthlyAveMobileClkCnt: Number(row.monthlyAveMobileClkCnt) || 0,
      monthlyAveMobileCtr: Number(row.monthlyAveMobileCtr) || 0,
      compIdx: String(row.compIdx) || "낮음",
      plAvgDepth: Number(row.plAvgDepth) || 0,
      totalCnt: Number(row.totalCnt) || 0,
      pcYearData: null,
      mobileYearData: null,
    };
    return keywordData;
  });
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
): ExcelRow[] {
  const rows: ExcelRow[] = [];

  results.forEach((result, resultIndex) => {
    const searchKw = searchKeywords[resultIndex] || "";

    result.relatedKeywords.forEach((keyword: KeywordResponse, index) => {
      if (typeof keyword.monthlyPcQcCnt === "string")
        keyword.monthlyPcQcCnt = 0;
      if (typeof keyword.monthlyMobileQcCnt === "string")
        keyword.monthlyMobileQcCnt = 0;

      rows.push({
        id: index + 1,
        keyword: searchKw,
        relKeyword: keyword.relKeyword === searchKw ? "-" : keyword.relKeyword,
        totalCnt: keyword.monthlyPcQcCnt + keyword.monthlyMobileQcCnt || 0,
        monthlyPcQcCnt: keyword.monthlyPcQcCnt || 0,
        monthlyAvePcClkCnt: keyword.monthlyAvePcClkCnt || 0,
        monthlyAvePcCtr: keyword.monthlyAvePcCtr,
        monthlyMobileQcCnt: keyword.monthlyMobileQcCnt || 0,
        monthlyAveMobileClkCnt: keyword.monthlyAveMobileClkCnt || 0,
        monthlyAveMobileCtr: keyword.monthlyAveMobileCtr,
        compIdx: keyword.compIdx || "-",
        plAvgDepth: keyword.plAvgDepth || 0,
        relevanceScore: keyword.relevanceScore,
      });
    });
  });

  return rows;
}
