/**
 * 트렌드 조회를 위한 날짜 범위를 계산하는 함수
 * startDate: 현재 월에서 1년 1개월 전의 1일
 * endDate: 현재 월의 이전 달 마지막 날
 * @returns {Object} { startDate: string, endDate: string } 형식의 'YYYY-MM-DD' 문자열
 */
export function getDataLabDateRange(): { startDate: string; endDate: string } {
  const today = new Date();

  // startDate: 현재 월에서 1년 1개월 전의 1일
  const startDate = new Date(today);
  startDate.setMonth(today.getMonth() - 12); // 1년전
  startDate.setDate(1); // 월의 첫 날

  // endDate: 현재 월의 이전 달 마지막 날
  const endDate = new Date(today);
  endDate.setDate(0); // 이번 달의 0일 = 이전 달의 마지막 날

  // 'YYYY-MM-DD' 형식으로 포맷팅
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  };
}
