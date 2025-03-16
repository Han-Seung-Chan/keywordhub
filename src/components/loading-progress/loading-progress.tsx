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

  // 진행 상태에 따른 색상 변경
  let progressColor = "bg-blue-400";
  if (progress >= 75) {
    progressColor = "bg-green-500";
  } else if (progress >= 50) {
    progressColor = "bg-blue-500";
  } else if (progress >= 25) {
    progressColor = "bg-blue-400";
  }

  return (
    <div className="mb-4 w-full">
      <div className="mb-1 flex justify-between text-sm text-gray-600">
        <span>{message}</span>
        <span className="font-medium">{progress}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className={`h-full transition-all duration-500 ${progressColor}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
