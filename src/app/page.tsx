import TabNavigation from "@/components/navigation/tab-navigation";
import KeywordSearch from "@/components/keyword-search";
import KeywordResults from "@/components/keyword-results";

export default function MainPage() {
  return (
    <main className="min-h-screen">
      <div className="mt-6 flex flex-col gap-4">
        <div className="w-full">
          {/* 페이지 제목 영역 */}
          <div className="mb-6">
            <h1 className="text-navy mb-2 text-2xl font-bold">
              키워드 검색량 조회기
            </h1>
            <p className="text-gray-600">
              키워드의 조회수를 확인할 수 있는 키워드 검색량 조회기입니다.
              <br />한 번에 최대 100개의 키워드를 검색할 수 있습니다.
            </p>
          </div>

          {/* 탭 네비게이션 */}
          <TabNavigation />

          {/* 키워드 검색 영역 */}
          <div className="mt-6">
            <KeywordSearch />
          </div>

          {/* 키워드 결과 영역 */}
          <KeywordResults />
        </div>
      </div>
    </main>
  );
}
