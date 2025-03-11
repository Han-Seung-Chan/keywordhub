import ExcelDownloadButton from "@/components/excel-download";
import { Button } from "@/components/ui/button";

interface ResultsHeaderProps {
  onClearResults: () => void;
  data: any[];
}

export default function ResultsHeader({
  onClearResults,
  data,
}: ResultsHeaderProps) {
  return (
    <div className="border-b border-gray-200 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-navy text-xl font-bold">키워드 조회 결과</h2>
        <div className="flex gap-2">
          <ExcelDownloadButton data={data} />
          <Button size="sm" onClick={onClearResults}>
            검색값초기화
          </Button>
        </div>
      </div>

      <div className="mb-2 text-sm text-gray-500">
        ※키워드를 선택하신 후 다운로드가 가능합니다.
        <br />
        ※키워드 클릭시 상세정보 제공
      </div>
    </div>
  );
}
