import ExcelDownloadButton from "@/components/excel-download";
import { Button } from "@/components/ui/button";
import { KeywordData } from "@/types/table";

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
  return (
    <div className="border-b border-gray-200 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">
          키워드 조회 결과
          {resultCount > 0 && <span className="ml-2">({resultCount}개)</span>}
        </h2>
        <div className="flex gap-2">
          <ExcelDownloadButton data={data} />
          <Button
            size="sm"
            onClick={onClearResults}
            disabled={data.length === 0}
          >
            검색값초기화
          </Button>
        </div>
      </div>

      <div className="mb-2 text-sm text-gray-500">
        {data.length > 0 ? (
          <>
            ※키워드를 선택하신 후 다운로드가 가능합니다.
            <br />
            ※키워드 클릭시 상세정보 제공
          </>
        ) : (
          "키워드를 검색하면 결과가 여기에 표시됩니다."
        )}
      </div>
    </div>
  );
}
