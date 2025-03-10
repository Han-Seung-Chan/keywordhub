import { DataLabRequest } from "@/types/data-lab";

export interface KeywordData {
  id: number;
  keyword: string;
  monthlyPcQcCnt: string;
  monthlyAvePcClkCnt: string;
  monthlyAvePcCtr: string;
  monthlyMobileQcCnt: string;
  monthlyAveMobileClkCnt: string;
  monthlyAveMobileCtr: string;
  compIdx: string;
  plAvgDepth: string;
  pcYearData: DataLabRequest;
  mobileYearData: DataLabRequest;
}

// 헤더 정보를 담는 인터페이스
export interface HeaderInfo {
  id: string;
  label: string;
  className?: string;
  dataKey?: string; // 데이터 매핑을 위한 키 추가
}

// 열 구조를 나타내는 인터페이스
export interface ColumnInfo {
  id: string;
  label: string;
  dataKey?: string;
  parentHeaderId?: string;
}
