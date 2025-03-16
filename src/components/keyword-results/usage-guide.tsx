import { Info, Download, SortDesc } from "lucide-react";

export default function UsageGuide() {
  return (
    <div className="border-t border-gray-200 bg-gray-50 p-6">
      <div className="flex items-center">
        <Info className="mr-2 h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-bold text-gray-800">이용안내</h3>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center text-indigo-600">
            <Search className="mr-2 h-5 w-5" />
            <h4 className="font-semibold">키워드 검색</h4>
          </div>
          <ul className="ml-7 list-disc space-y-1 text-sm text-gray-600">
            <li>키워드를 한 줄에 하나씩 입력</li>
            <li>최대 100개까지 한 번에 검색 가능</li>
            <li>특수문자는 사용할 수 없음</li>
            <li>유효하지 않은 키워드는 결과에서 제외</li>
          </ul>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center text-green-600">
            <Download className="mr-2 h-5 w-5" />
            <h4 className="font-semibold">데이터 활용</h4>
          </div>
          <ul className="ml-7 list-disc space-y-1 text-sm text-gray-600">
            <li>조회 결과는 엑셀 파일로 다운로드 가능</li>
            <li>원하는 키워드만 선택하여 다운로드 가능</li>
            <li>PC/모바일 검색량 및 클릭률 확인 가능</li>
            <li>최근 12개월 검색 추이 데이터 제공</li>
          </ul>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center text-amber-600">
            <SortDesc className="mr-2 h-5 w-5" />
            <h4 className="font-semibold">테이블 기능</h4>
          </div>
          <ul className="ml-7 list-disc space-y-1 text-sm text-gray-600">
            <li>키워드 및 조회수에 따라 정렬 가능</li>
            <li>열 제목을 드래그하여 순서 변경 가능</li>
            <li>키워드 클릭시 상세 정보 확인 가능</li>
            <li>초기화 버튼으로 기본 설정 복원</li>
          </ul>
        </div>
      </div>

      <div className="mt-6 rounded bg-blue-50 p-3 text-sm text-blue-700">
        <p className="font-medium">참고:</p>
        <p>
          데이터 제공 기준일은 전월 말일이며, 검색량은 네이버 검색광고 API를
          통해 제공되는 참고용 데이터입니다.
        </p>
      </div>
    </div>
  );
}

// Lucide 아이콘 타입 정의
function Search(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
