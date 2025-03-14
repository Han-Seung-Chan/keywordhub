import { KeywordData } from "@/types/table";

export function calculateSearchVolume(
  percentage: number,
  data: KeywordData,
  type: "pcYearData" | "mobileYearData",
) {
  // 월간 PC 검색량 가져오기
  const cnt: number =
    type === "pcYearData" ? data.monthlyPcQcCnt : data.monthlyMobileQcCnt;
  // 가장 최근 월의 데이터 가져오기
  const yearData = data[type].results[0].data;

  const lastMonthData = yearData[yearData.length - 1];
  const lastMonthPercentage = lastMonthData.ratio;

  // 100%에 해당하는 검색량 계산
  const fullVolumeValue = (cnt / lastMonthPercentage) * 100;

  // 입력받은 백분률에 해당하는 검색량 계산
  const calculatedVolume = fullVolumeValue * (percentage / 100);

  // 결과를 정수로 반올림하여 반환
  return Math.round(calculatedVolume);
}
