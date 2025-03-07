"use client";

import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import * as XLSX from "xlsx";

const ExcelDownloadButton = ({
  data,
  fileName = "download.xlsx",
  sheetName = "Sheet1",
}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      // 데이터가 없는 경우 샘플 데이터 생성
      const excelData = [
        { id: 1, name: "홍길동", age: 30, email: "hong@example.com" },
        { id: 2, name: "김철수", age: 25, email: "kim@example.com" },
        { id: 3, name: "이영희", age: 28, email: "lee@example.com" },
      ];

      // 워크북 생성
      const workbook = XLSX.utils.book_new();

      // 워크시트 생성
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // 워크북에 워크시트 추가
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

      // 엑셀 파일로 내보내기
      XLSX.writeFile(workbook, fileName);
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
