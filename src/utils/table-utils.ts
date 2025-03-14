import { KeywordData } from "@/types/table";

// 값 포맷팅
export const formatValue = (value: any, dataKey?: string) => {
  if (typeof value === "number") {
    return value.toLocaleString();
  }
  return value;
};

// 셀 값 렌더링
export const renderCellValue = (item: KeywordData, dataKey?: string) => {
  // 데이터 키가 있고 아이템에 값이 있는 경우
  if (dataKey && item[dataKey] !== undefined) {
    return formatValue(item[dataKey], dataKey);
  }

  return "-";
};
