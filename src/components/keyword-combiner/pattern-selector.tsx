import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  TWO_KEYWORD_PATTERNS,
  THREE_KEYWORD_PATTERNS,
  FOUR_KEYWORD_PATTERNS,
} from "@/constants/combiner";

interface PatternSelectorProps {
  selectedPatterns: string[];
  onPatternChange: (pattern: string, checked: boolean) => void;
  onSelectAll: () => void;
}

export const PatternSelector: React.FC<PatternSelectorProps> = ({
  selectedPatterns,
  onPatternChange,
  onSelectAll,
}) => {
  return (
    <div className="num_select mb-4">
      <div className="setting_title2 mb-2 flex items-center justify-between">
        <h3 className="font-medium">조합 패턴 선택</h3>
        <div className="text-right">
          <Button
            variant="outline"
            size="sm"
            onClick={onSelectAll}
            className="text-xs"
          >
            {selectedPatterns.length === 0 ? "전체선택" : "전체해제"}
          </Button>
        </div>
      </div>

      {/* 2개 키워드 조합 */}
      <PatternGroup
        title="2개 키워드 조합"
        patterns={TWO_KEYWORD_PATTERNS}
        selectedPatterns={selectedPatterns}
        onPatternChange={onPatternChange}
      />

      {/* 3개 키워드 조합 */}
      <PatternGroup
        title="3개 키워드 조합"
        patterns={THREE_KEYWORD_PATTERNS}
        selectedPatterns={selectedPatterns}
        onPatternChange={onPatternChange}
      />

      {/* 4개 키워드 조합 */}
      <PatternGroup
        title="4개 키워드 조합"
        patterns={FOUR_KEYWORD_PATTERNS}
        selectedPatterns={selectedPatterns}
        onPatternChange={onPatternChange}
      />
    </div>
  );
};

interface PatternGroupProps {
  title: string;
  patterns: string[];
  selectedPatterns: string[];
  onPatternChange: (pattern: string, checked: boolean) => void;
}

const PatternGroup: React.FC<PatternGroupProps> = ({
  title,
  patterns,
  selectedPatterns,
  onPatternChange,
}) => {
  const gridCols = title.includes("2개") ? "md:grid-cols-6" : "md:grid-cols-5";

  return (
    <div className="setting_box mb-4 rounded border border-gray-200 p-3">
      <div className="mb-2 text-sm font-medium">{title}</div>
      <div className={`grid grid-cols-2 gap-1 sm:grid-cols-3 ${gridCols}`}>
        {patterns.map((pattern) => (
          <div key={pattern} className="flex items-center space-x-2">
            <Checkbox
              id={`pattern-${pattern}`}
              checked={selectedPatterns.includes(pattern)}
              onCheckedChange={(checked) =>
                onPatternChange(pattern, checked as boolean)
              }
            />
            <label
              htmlFor={`pattern-${pattern}`}
              className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {pattern}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};
