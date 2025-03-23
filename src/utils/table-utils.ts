import { KeywordData } from "@/types/table";

// 셀 값 렌더링
export const renderCellValue = (item: KeywordData, dataKey?: string) => {
  // 데이터 키가 있고 아이템에 값이 있는 경우
  if (dataKey && item[dataKey as keyof KeywordData] !== undefined) {
    // 숫자 포맷팅
    if (typeof item[dataKey as keyof KeywordData] === "number") {
      return (item[dataKey as keyof KeywordData] as number).toLocaleString();
    }
    return String(item[dataKey as keyof KeywordData]);
  }

  // 관계형 데이터 처리 (예: 중첩된 객체)
  if (dataKey && dataKey.includes(".")) {
    const parts = dataKey.split(".");
    let value: unknown = item;
    for (const part of parts) {
      if (value === undefined || value === null) return "-";
      value = (value as Record<string, unknown>)[part];
    }

    if (typeof value === "number") {
      return value.toLocaleString();
    }

    return value !== undefined && value !== null ? String(value) : "-";
  }

  return "-";
};
