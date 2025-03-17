import { memo, useMemo } from "react";
import ExcelDownloadButton from "@/components/excel-download";
import { Button } from "@/components/ui/button";
import { KeywordData } from "@/types/table";
import { Trash2 } from "lucide-react";

interface ResultsHeaderProps {
  onClearResults: () => void;
  data: KeywordData[];
  resultCount?: number;
}

const ResultsHeader = memo(
  ({ onClearResults, data, resultCount = 0 }: ResultsHeaderProps) => {
    // 결과 유무 계산 최적화
    const hasResults = useMemo(() => data.length > 0, [data.length]);

    // 결과 카운트 배지 컴포넌트 최적화
    const ResultCountBadge = useMemo(() => {
      if (resultCount <= 0) return null;

      return (
        <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-sm text-blue-700">
          {resultCount}개
        </span>
      );
    }, [resultCount]);

    return (
      <div className="border-b border-gray-200 p-2">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            키워드 조회 결과
            {ResultCountBadge}
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
  },
);

ResultsHeader.displayName = "ResultsHeader";

export default ResultsHeader;
