import React, { memo, useRef, useCallback, useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";

interface KeywordInputFormProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  keywordCount: number;
  maxKeywords?: number;
  title: string;
}

export const KeywordInputForm = memo(
  ({
    value,
    onChange,
    disabled,
    keywordCount,
    maxKeywords = 100,
    title,
  }: KeywordInputFormProps) => {
    // 로컬 상태 추가 (제어 컴포넌트 유지하면서 불필요한 리렌더링 방지)
    const [localValue, setLocalValue] = useState(value);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    // 부모로부터 전달받은 value가 변경될 때만 로컬 상태 업데이트
    useEffect(() => {
      setLocalValue(value);
    }, [value]);

    // 키워드 입력 처리 - 디바운스 적용
    const handleTextAreaChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        const lines = newValue.split("\n");

        // 최대 키워드 개수에 도달한 상태에서 추가 줄바꿈 시도 차단
        if (lines.length > maxKeywords && newValue.length > localValue.length) {
          return;
        }

        // 로컬 상태는 즉시 업데이트
        setLocalValue(newValue);

        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }

        // 디바운스 적용하여 부모 컴포넌트에 변경 알림
        debounceTimerRef.current = setTimeout(() => {
          onChange(newValue);
        }, 300);
      },
      [onChange, maxKeywords, localValue],
    );

    // 키워드 개수가 최대에 도달했는지 확인
    const isMaxReached = keywordCount > maxKeywords;

    return (
      <div className="keyword-input">
        <h3 className="mb-2 font-medium">{title}</h3>
        <div className="rounded-md border border-gray-200 p-3">
          <Textarea
            placeholder={`한 줄에 하나씩 입력해주세요. (최대 ${maxKeywords}개까지)`}
            value={localValue}
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
  },
);

KeywordInputForm.displayName = "KeywordInputForm";
