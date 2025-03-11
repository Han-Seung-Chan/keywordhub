import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  onSearch: () => void;
  onClear: () => void;
  isLoading: boolean;
  isDisabled: boolean;
}

export default function ActionButtons({
  onSearch,
  onClear,
  isLoading,
  isDisabled,
}: ActionButtonsProps) {
  return (
    <div className="flex gap-4">
      <Button
        onClick={onSearch}
        disabled={isLoading || isDisabled}
        className="w-32"
      >
        {isLoading ? "처리 중..." : "조회하기"}
      </Button>
      <Button
        variant="outline"
        onClick={onClear}
        disabled={isLoading || isDisabled}
      >
        입력값 지우기
      </Button>
    </div>
  );
}
