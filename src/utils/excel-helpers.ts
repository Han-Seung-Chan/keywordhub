// src/utils/excel-helpers.ts
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
