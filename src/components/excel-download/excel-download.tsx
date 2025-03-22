"use client";

import { memo, useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Loader2 } from "lucide-react";
import * as XLSX from "xlsx";
import { ExcelColumn } from "@/types/excel";

// 기본 열 너비 설정
const DEFAULT_COL_WIDTH = 58;

export interface ExcelDownloadProps {
  data: Record<string, unknown>[];
  columns: ExcelColumn[];
  disabled: boolean;
  filename?: string; // 파일 이름
  sheetName?: string; // 시트 이름
}

const ExcelDownloadButton = memo(
  ({
    data,
    columns,
    disabled,
    filename = "download",
    sheetName = "Sheet1",
  }: ExcelDownloadProps) => {
    const [isDownloading, setIsDownloading] = useState(false);

    // 데이터 유효성 확인 (memo로 최적화)
    const isDataValid = useMemo(
      () => data && data.length > 0 && columns && columns.length > 0,
      [data, columns],
    );

    const handleDownload = useCallback(async () => {
      if (!isDataValid) return;

      try {
        setIsDownloading(true);

        // 데이터 변환 - 각 항목을 열 설정에 따라 변환
        const excelData = data.map((item) => {
          const rowData: Record<string, unknown> = {};

          // 각 열 설정에 따라 데이터 매핑
          columns.forEach((column) => {
            const value = item[column.key];

            // 값이 존재하고 포맷터가 있으면 포맷팅 적용
            if (column.formatter) {
              rowData[column.header] = column.formatter(value, item);
            } else {
              rowData[column.header] = value;
            }
          });

          return rowData;
        });

        // 비동기 처리를 위한 지연
        await new Promise((resolve) => setTimeout(resolve, 0));

        // 워크북 생성
        const workbook = XLSX.utils.book_new();

        // 워크시트 생성
        const worksheet = XLSX.utils.json_to_sheet(excelData);

        // 열 너비 설정
        const worksheetCols = columns.map((column) => ({
          wpx: column.width || DEFAULT_COL_WIDTH,
        }));

        // 워크시트에 열 너비 설정 적용
        worksheet["!cols"] = worksheetCols;

        // 워크북에 워크시트 추가
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

        // 엑셀 파일로 내보내기
        XLSX.writeFile(workbook, `${filename}.xlsx`);
      } catch (error) {
        console.error("엑셀 파일 다운로드 중 오류가 발생했습니다:", error);
      } finally {
        setIsDownloading(false);
      }
    }, [data, columns, isDataValid, filename, sheetName]);

    return (
      <Button
        variant="outline"
        className="flex items-center gap-1 text-green-700 hover:bg-green-50 hover:text-green-700"
        disabled={isDownloading || !isDataValid || disabled}
        onClick={handleDownload}
      >
        {isDownloading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            다운로드 중...
          </>
        ) : (
          <>
            <FileSpreadsheet className="h-4 w-4" />
            엑셀 다운로드
          </>
        )}
      </Button>
    );
  },
);

ExcelDownloadButton.displayName = "ExcelDownloadButton";

export default ExcelDownloadButton;
