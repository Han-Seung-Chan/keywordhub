import { Search } from "lucide-react";

export default function EmptyResults() {
  return (
    <div className="flex h-64 w-full flex-col items-center justify-center border-b border-gray-200 p-8 text-gray-500">
      <Search className="mb-4 h-12 w-12 text-gray-300" />
      <p className="mb-2 text-center text-lg font-medium">
        검색 결과가 없습니다
      </p>
      <p className="text-center text-sm">
        키워드를 입력하고 검색하면 결과가 여기에 표시됩니다.
      </p>
      <div className="mt-6 max-w-md text-center text-xs text-gray-400">
        <p>
          입력 방법: 텍스트 영역에 키워드를 한 줄에 하나씩 입력하세요 (최대
          100개)
        </p>
      </div>
    </div>
  );
}
