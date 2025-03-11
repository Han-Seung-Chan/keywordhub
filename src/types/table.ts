import { DataLabResponse } from "@/types/data-lab";

export interface KeywordData {
  id: number;
  keyword: string;
  monthlyPcQcCnt: number;
  monthlyAvePcClkCnt: number;
  monthlyAvePcCtr: number;
  monthlyMobileQcCnt: number;
  monthlyAveMobileClkCnt: number;
  monthlyAveMobileCtr: number;
  compIdx: string;
  plAvgDepth: number;
  pcYearData: DataLabResponse;
  mobileYearData: DataLabResponse;
}

// 헤더 정보를 담는 인터페이스
export interface HeaderInfo {
  id: string;
  label: string;
  dataKey: string;
}

// 열 구조를 나타내는 인터페이스
export interface ColumnInfo extends HeaderInfo {}
