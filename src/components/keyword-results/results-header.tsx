import ExcelDownloadButton from "@/components/excel-download";
import { Button } from "@/components/ui/button";
import { KeywordData } from "@/types/table";
import { Trash2 } from "lucide-react";

interface ResultsHeaderProps {
  onClearResults: () => void;
  data: KeywordData[];
  resultCount?: number;
}

export default function ResultsHeader({
  onClearResults,
  data,
  resultCount = 0,
}: ResultsHeaderProps) {
  const hasResults = data.length > 0;

  return (
    <div className="border-b border-gray-200 p-2">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">
          키워드 조회 결과
          {resultCount > 0 && (
            <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-sm text-blue-700">
              {resultCount}개
            </span>
          )}
        </h2>
        <div className="flex gap-2">
          <ExcelDownloadButton data={data} />
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-1 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={onClearResults}
            disabled={!hasResults}
          >
            <Trash2 className="h-4 w-4" />
            검색결과 초기화
          </Button>
        </div>
      </div>
    </div>
  );
}
