import { KeywordData } from "@/types/table";

// 값 포맷팅
export const formatValue = (value: any, dataKey?: string) => {
  if (typeof value === "number") {
    // 퍼센트 값인 경우
    if (dataKey?.includes("Rate")) {
      return `${value.toFixed(2)}%`;
    }
    // 일반 숫자인 경우
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
