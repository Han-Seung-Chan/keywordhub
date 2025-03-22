import { RefreshCw } from "lucide-react";
import { memo, useMemo } from "react";

import ExcelDownloadButton from "@/components/excel-download";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ExcelColumn } from "@/types/excel";

interface ResultSectionProps {
  result: string;
  addSpaceBetweenKeywords: boolean;
  canCombine: boolean;
  onSpaceChange: (checked: boolean) => void;
  onReset: () => void;
  onGenerate: () => void;
  getExcelData: () => Record<string, unknown>[];
  getExcelColumns: () => ExcelColumn[];
}

export const ResultSection = memo(
  ({
    result,
    addSpaceBetweenKeywords,
    canCombine,
    onSpaceChange,
    onReset,
    onGenerate,
    getExcelData,
    getExcelColumns,
  }: ResultSectionProps) => {
    const hasResults = useMemo(() => result.trim().length > 0, [result]);

    return (
      <div>
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="gap-plus"
                checked={addSpaceBetweenKeywords}
                onCheckedChange={(checked) => onSpaceChange(checked as boolean)}
              />
              <label
                htmlFor="gap-plus"
                className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                키워드 사이 공백추가
              </label>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="text-xs"
            disabled={!hasResults}
          >
            <RefreshCw className="mr-1 h-3 w-3" />
            내역초기화
          </Button>
        </div>

        <div className="result-text mb-4">
          <Textarea
            placeholder="이곳에 조합된 키워드가 표시됩니다."
            value={result}
            readOnly
            className="h-36 resize-none"
          />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={onGenerate}
            className="flex-1"
            disabled={!canCombine}
          >
            조합하기
          </Button>
          <ExcelDownloadButton
            data={getExcelData()}
            columns={getExcelColumns()}
            filename="키워드_조합_결과"
            sheetName="키워드분석"
            disabled={!hasResults}
          />
        </div>
      </div>
    );
  },
);

ResultSection.displayName = "ResultSection";
