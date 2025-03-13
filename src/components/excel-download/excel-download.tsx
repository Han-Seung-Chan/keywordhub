"use client";

import { Button } from "@/components/ui/button";
import { KeywordData } from "@/types/table";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import * as XLSX from "xlsx";

const FILE_NAME = "keyword_hub.xlsx";
const SHEET_NAME = "Sheet1";

interface ExcelDownloadButtonProps {
  data: KeywordData[];
}

const ExcelDownloadButton = ({ data }: ExcelDownloadButtonProps) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      if (!data) return false;
      console.log(data);

      const excelData = data.map((item) => {
        // 기본 데이터 객체 생성
        const rowData = {
          번호: item.id,
          키워드명: item.keyword,
          "월간 PC 검색량": item.monthlyPcQcCnt,
          "월간 PC 평균 클릭 수": item.monthlyAvePcClkCnt,
          "월간 PC CTR": item.monthlyAvePcCtr,
          "월간 MO 검색량": item.monthlyMobileQcCnt,
          "월간 MO 클릭 수": item.monthlyAveMobileClkCnt,
          "월간 MO CTR": item.monthlyAveMobileCtr,
          "경쟁 정도": item.compIdx,
          "월간 광고 노출 수": item.plAvgDepth,
        };

        // PC 연간 데이터 추가
        if (item.pcYearData?.results?.[0]?.data) {
          item.pcYearData.results[0].data.forEach((monthData) => {
            const yearMonth = monthData.period.substring(2, 7);
            rowData[`PC_${yearMonth}`] = monthData.ratio;
          });
        }

        // 모바일 연간 데이터 추가
        if (item.mobileYearData?.results?.[0]?.data) {
          item.mobileYearData.results[0].data.forEach((monthData) => {
            const yearMonth = monthData.period.substring(2, 7);
            rowData[`MO_${yearMonth}`] = monthData.ratio;
          });
        }

        return rowData;
      });

      // 워크북 생성
      const workbook = XLSX.utils.book_new();

      // 워크시트 생성
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      // 열 너비 설정
      const worksheetCols = [
        { wpx: 26 }, // 번호 열 - 5자 너비
        { wpx: 48 }, // 키워드명 열 - 20자 너비
        { wpx: 75 }, // 월간 PC 검색량 - 15자 너비
        { wpx: 102 }, // 월간 PC 평균 클릭 수 - 15자 너비
        { wpx: 63 }, // 월간 PC CTR - 10자 너비
        { wpx: 81 }, // 월간 MO 검색량 - 15자 너비
        { wpx: 84 }, // 월간 MO 클릭 수 - 15자 너비
        { wpx: 69 }, // 월간 MO CTR - 10자 너비
        { wpx: 50 }, // 경쟁 정도 - 10자 너비
        { wpx: 86 }, // 월간 광고 노출 수 - 15자 너비
      ];

      // PC와 MO 데이터 열도 너비 설정 (각 월별 데이터에 대해 동일한 너비 적용)
      const pcMoColCount = 24;
      for (let i = 0; i < pcMoColCount; i++) {
        worksheetCols.push({ wpx: 58 });
      }

      // 워크시트에 열 너비 설정 적용
      worksheet["!cols"] = worksheetCols;

      // 워크북에 워크시트 추가
      XLSX.utils.book_append_sheet(workbook, worksheet, SHEET_NAME);

      // 엑셀 파일로 내보내기
      XLSX.writeFile(workbook, FILE_NAME);
    } catch (error) {
      console.error("엑셀 파일 다운로드 중 오류가 발생했습니다:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      size="sm"
      className="flex items-center gap-1"
      onClick={handleDownload}
      disabled={isDownloading}
    >
      {isDownloading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          다운로드 중...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          엑셀 다운로드
        </>
      )}
    </Button>
  );
};

export default ExcelDownloadButton;
