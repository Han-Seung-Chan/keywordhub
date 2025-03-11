import { HeaderInfo } from "@/types/table";

export const defaultHeader: HeaderInfo[] = [
  {
    id: "no",
    label: "NO",
    dataKey: "id",
  },
  {
    id: "keyword",
    label: "키워드",
    dataKey: "keyword",
  },
  {
    id: "yearPcGraph",
    label: "PC 1년 검색량",
    dataKey: "yearPcGraph",
  },
  {
    id: "monthlyPcQcCnt",
    label: "월간 PC 검색량",
    dataKey: "monthlyPcQcCnt",
  },
  {
    id: "monthlyAvePcClkCnt",
    label: "월간 PC 클릭 수",
    dataKey: "monthlyAvePcClkCnt",
  },
  {
    id: "monthlyAvePcCtr",
    label: "월간 PC CTR",
    dataKey: "monthlyAvePcCtr",
  },
  {
    id: "yearMoGraph",
    label: "MO 1년 검색량",
    dataKey: "yearMoGraph",
  },
  {
    id: "monthlyMobileQcCnt",
    label: "월간 MO 검색량",
    dataKey: "monthlyMobileQcCnt",
  },
  {
    id: "monthlyAveMobileClkCnt",
    label: "월간 MO 클릭 수",
    dataKey: "monthlyAveMobileClkCnt",
  },
  {
    id: "monthlyAveMobileCtr",
    label: "월간 MO CTR",
    dataKey: "monthlyAveMobileCtr",
  },
  {
    id: "compIdx",
    label: "경쟁 정도",
    dataKey: "compIdx",
  },
  {
    id: "plAvgDepth",
    label: "월간 광고 노출 수",
    dataKey: "plAvgDepth",
  },
];
