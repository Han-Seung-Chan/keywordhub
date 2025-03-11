import { Textarea } from "@/components/ui/textarea";

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
  return (
    <div className="mb-6 rounded-md border border-gray-200 p-4">
      <Textarea
        placeholder={`한 줄에 하나씩 입력해세요. (최대${maxKeywords}개까지)`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mb-4 h-[150px]"
        disabled={disabled}
      />

      <div className="flex justify-between">
        <div className="text-sm text-gray-500">
          ※ 검색어에 특수문자를 사용할 수 없습니다.
        </div>
        <div className="text-sm text-gray-500">
          {keywordCount ? `${keywordCount}/${maxKeywords}` : `0/${maxKeywords}`}
        </div>
      </div>
    </div>
  );
}
