import { Textarea } from "@/components/ui/textarea";
import { useCallback } from "react";

interface KeywordInputFormProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  keywordCount: number;
  maxKeywords?: number;
}

export default function KeywordInputForm({
  value,
  onChange,
  disabled,
  keywordCount,
  maxKeywords = 100,
}: KeywordInputFormProps) {
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
    <div className="mb-6 rounded-md border border-gray-200 p-4">
      <Textarea
        placeholder={`한 줄에 하나씩 입력해주세요. (최대 ${maxKeywords}개까지)`}
        value={value}
        onChange={handleTextAreaChange}
        className={`mb-4 h-[150px] ${isMaxReached ? "border-red-300 focus-visible:border-red-500" : ""}`}
        disabled={disabled}
      />

      <div className="flex justify-between">
        <div className="text-sm text-gray-500">
          ※ 검색어에 특수문자를 사용할 수 없습니다.
          {isMaxReached && (
            <span className="ml-2 text-red-500">
              최대 키워드 개수에 도달했습니다.
            </span>
          )}
        </div>
        <div
          className={`text-sm ${isMaxReached ? "font-bold text-red-500" : "text-gray-500"}`}
        >
          {keywordCount ? `${keywordCount}/${maxKeywords}` : `0/${maxKeywords}`}
        </div>
      </div>
    </div>
  );
}
