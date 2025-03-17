import React, { useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";

interface KeywordInputFormProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  keywordCount: number;
  maxKeywords?: number;
  title: string;
}

export const KeywordInputForm: React.FC<KeywordInputFormProps> = ({
  value,
  onChange,
  disabled,
  keywordCount,
  maxKeywords = 100,
  title,
}) => {
  // 키워드 입력 처리 - 라인 수 제한
  const handleTextAreaChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      const lines = newValue.split("\n");

      // 최대 키워드 개수에 도달한 상태에서 추가 줄바꿈 시도 차단
      if (lines.length > maxKeywords && newValue.length > value.length) {
        // 입력 차단 - 이전 값 유지
        return;
      }

      onChange(newValue);
    },
    [onChange, maxKeywords, value],
  );

  // 키워드 개수가 최대에 도달했는지 확인
  const isMaxReached = keywordCount > maxKeywords;

  return (
    <div className="keyword-input">
      <h3 className="mb-2 font-medium">{title}</h3>
      <div className="rounded-md border border-gray-200 p-3">
        <Textarea
          placeholder={`한 줄에 하나씩 입력해주세요. (최대 ${maxKeywords}개까지)`}
          value={value}
          onChange={handleTextAreaChange}
          className={`mb-3 h-[150px] resize-none ${isMaxReached ? "border-red-300 focus-visible:border-red-500" : ""}`}
          disabled={disabled}
        />

        <div className="flex justify-between">
          <div className="text-xs text-gray-500">
            {isMaxReached && (
              <span className="text-red-500">
                최대 키워드 개수에 도달했습니다.
              </span>
            )}
          </div>
          <div
            className={`text-xs ${isMaxReached ? "font-bold text-red-500" : "text-gray-500"}`}
          >
            {keywordCount
              ? `${keywordCount}/${maxKeywords}`
              : `0/${maxKeywords}`}
          </div>
        </div>
      </div>
    </div>
  );
};
