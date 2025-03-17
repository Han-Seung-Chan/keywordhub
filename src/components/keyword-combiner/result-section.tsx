import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { FileSpreadsheet, RefreshCw } from "lucide-react";

interface ResultSectionProps {
  result: string;
  addSpaceBetweenKeywords: boolean;
  canCombine: boolean;
  onSpaceChange: (checked: boolean) => void;
  onReset: () => void;
  onGenerate: () => void;
  onDownload: () => void;
}

export const ResultSection: React.FC<ResultSectionProps> = ({
  result,
  addSpaceBetweenKeywords,
  canCombine,
  onSpaceChange,
  onReset,
  onGenerate,
  onDownload,
}) => {
  return (
    <div className="result-box">
      <div className="result-top mb-2 flex items-center justify-between">
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
          disabled={!result}
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
        <Button onClick={onGenerate} className="flex-1" disabled={!canCombine}>
          조합하기
        </Button>
        <Button
          onClick={onDownload}
          disabled={!result}
          variant="outline"
          className="flex items-center"
        >
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          다운받기
        </Button>
      </div>
    </div>
  );
};
