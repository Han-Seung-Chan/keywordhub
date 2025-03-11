import { Progress } from "@/components/ui/progress";

interface LoadingProgressProps {
  isLoading: boolean;
  progress: number;
  message?: string;
}

export default function LoadingProgress({
  isLoading,
  progress,
  message = "로딩 중...",
}: LoadingProgressProps) {
  if (!isLoading) return null;

  return (
    <div className="mb-4">
      <div className="mb-1 flex justify-between text-xs text-gray-500">
        <span>{message}</span>
        <span>{progress}%</span>
      </div>
      <Progress value={progress} className="h-1" />
    </div>
  );
}
