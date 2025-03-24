export type ExcelCellValue =
  | string
  | number
  | boolean
  | Date
  | null
  | undefined;

export interface ExcelColumn {
  key: string; // 데이터의 키 값
  header: string; // 엑셀에 표시될 열 이름
  width?: number; // 열 너비
  formatter?: (value: unknown, rowData?: unknown) => ExcelCellValue; // 값 포맷팅 함수
}

export interface FormattedKeywordRow {
  id: number;
  searchKeyword: string;
  relKeyword: string;
  totalCnt: number;
  relevanceScore?: number;
  [key: string]: unknown;
}

export interface ExcelRow {
  id: number;
  keyword: string;
  relKeyword: string;
  totalCnt: number;
  monthlyPcQcCnt: number;
  monthlyAvePcClkCnt: number;
  monthlyAvePcCtr: number | null;
  monthlyMobileQcCnt: number;
  monthlyAveMobileClkCnt: number;
  monthlyAveMobileCtr: number | null;
  compIdx: string;
  plAvgDepth: number;
  [key: string]: unknown; // 추가 필드를 위한 인덱스 시그니처
}
