"use client";
import { Loader2 } from "lucide-react";
import { memo, useMemo } from "react";

import { Loading } from "@/components/common";

const LoadingProgress = memo(
  ({
    loadingProgress,
    processedCount,
    totalKeywords,
  }: {
    loadingProgress: number;
    processedCount: number;
    totalKeywords: number;
  }) => {
    // 로딩 상태 메시지 생성
    const loadingMessage = useMemo(() => {
      if (totalKeywords > 0) {
        return `키워드 처리 중... (${processedCount}/${totalKeywords})`;
      }
      return "데이터 로딩 중...";
    }, [processedCount, totalKeywords]);

    return (
      <div className="p-8">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="text-primary mb-4 h-8 w-8 animate-spin" />
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            {loadingMessage}
          </h3>
          <p className="text-sm text-gray-500">
            다량의 키워드는 처리 시간이 더 소요될 수 있습니다.
          </p>
          <div className="mt-6 w-full max-w-md">
            <Loading
              isLoading={true}
              progress={loadingProgress}
              message={loadingMessage}
            />
          </div>
        </div>
      </div>
    );
  },
);

export default LoadingProgress;
LoadingProgress.displayName = "LoadingProgress";
