import ExcelDownloadButton from "@/components/excel-download";
import KeywordTable from "@/components/keyword-table/keyword-table";
import { relatedKeywordColumns } from "@/constants/default-excel-data";
import { relatedKeywordsHeader } from "@/constants/default-header";
import { KeywordData } from "@/types/table"; // KeywordData 타입 추가

interface ResultsSectionProps {
  tableData: KeywordData[];
  excelData: Record<string, unknown>[];
  allRelatedKeywordsLength: number;
}

export function ResultsSection({
  tableData,
  excelData,
  allRelatedKeywordsLength,
}: ResultsSectionProps) {
  return (
    <>
      <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-medium">
            연관 키워드 결과
            <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-sm text-blue-700">
              총 {allRelatedKeywordsLength}개
            </span>
          </h3>
        </div>
        <div className="flex gap-2">
          <ExcelDownloadButton
            data={excelData}
            columns={relatedKeywordColumns}
            disabled={false}
            filename="연관키워드_결과"
            sheetName="연관키워드"
          />
        </div>
      </div>
      <KeywordTable
        keywordData={tableData}
        headers={relatedKeywordsHeader}
        emptyMessage="연관 키워드를 찾지 못했습니다."
      />
    </>
  );
}
