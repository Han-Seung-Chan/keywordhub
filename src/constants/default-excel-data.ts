import { ExcelColumn } from "@/types/excel";

export const keywordColumns: ExcelColumn[] = [
  { key: "id", header: "번호", width: 26 },
  { key: "keyword", header: "키워드명", width: 48 },
  { key: "totalCnt", header: "총 검색량", width: 54 },
  {
    key: "monthlyPcQcCnt",
    header: "월간 PC 검색량",
    width: 75,
  },
  {
    key: "monthlyAvePcClkCnt",
    header: "월간 PC 평균 클릭 수",
    width: 102,
  },
  { key: "monthlyAvePcCtr", header: "월간 PC CTR", width: 63 },
  {
    key: "monthlyMobileQcCnt",
    header: "월간 MO 검색량",
    width: 81,
  },
  {
    key: "monthlyAveMobileClkCnt",
    header: "월간 MO 클릭 수",
    width: 84,
  },
  { key: "monthlyAveMobileCtr", header: "월간 MO CTR", width: 69 },
  { key: "compIdx", header: "경쟁 정도", width: 50 },
  { key: "plAvgDepth", header: "월간 광고 노출 수", width: 86 },
];

export const relatedKeywordColumns: ExcelColumn[] = [
  { key: "id", header: "번호", width: 26 },
  { key: "keyword", header: "키워드명", width: 48 },
  { key: "relKeyword", header: "연관키워드", width: 48 },
  { key: "totalCnt", header: "총 검색량", width: 52 },
  {
    key: "monthlyPcQcCnt",
    header: "월간 PC 검색량",
    width: 75,
  },
  ,
  {
    key: "monthlyAvePcClkCnt",
    header: "월간 PC 평균 클릭 수",
    width: 102,
  },
  { key: "monthlyAvePcCtr", header: "월간 PC CTR", width: 63 },
  {
    key: "monthlyMobileQcCnt",
    header: "월간 MO 검색량",
    width: 81,
  },
  {
    key: "monthlyAveMobileClkCnt",
    header: "월간 MO 클릭 수",
    width: 84,
  },
  { key: "monthlyAveMobileCtr", header: "월간 MO CTR", width: 69 },
  { key: "compIdx", header: "경쟁 정도", width: 50 },
  { key: "plAvgDepth", header: "월간 광고 노출 수", width: 86 },
];
