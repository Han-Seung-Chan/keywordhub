import { Metadata } from "next";
import TabNavigation from "@/components/navigation/tab-navigation";
import KeywordSearch from "@/components/keyword-search";
import KeywordResults from "@/components/keyword-results";

// 페이지별 메타데이터 추가
export const metadata: Metadata = {
  title: "키워드 검색량 조회기",
  description:
    "키워드의 PC 및 모바일 검색량, 클릭률을 한 번에 분석하세요. 한 번에 최대 100개의 키워드를 빠르게 검색할 수 있습니다.",
  keywords: [
    "키워드 검색량",
    "네이버 검색량",
    "키워드 분석",
    "PC 검색량",
    "모바일 검색량",
  ],
};

export default function MainPage() {
  return (
    <section className="min-h-screen">
      <div className="mt-6 flex flex-col gap-4">
        <div className="w-full">
          {/* 페이지 제목 영역 - 시맨틱 태그 적용 */}
          <header className="mb-6">
            <h1 className="text-navy mb-2 text-2xl font-bold">
              키워드 검색량 조회기
            </h1>
            <p className="text-gray-600">
              키워드의 조회수를 확인할 수 있는 키워드 검색량 조회기입니다.
              <br />한 번에 최대 100개의 키워드를 검색할 수 있습니다.
            </p>
          </header>

          {/* 탭 네비게이션 */}
          <nav aria-label="키워드 도구 내비게이션">
            <TabNavigation />
          </nav>

          {/* 키워드 검색 영역 */}
          <section className="mt-6" aria-labelledby="search-section">
            <h2 id="search-section" className="sr-only">
              키워드 검색
            </h2>
            <KeywordSearch />
          </section>

          {/* 키워드 결과 영역 */}
          <section aria-labelledby="results-section">
            <h2 id="results-section" className="sr-only">
              키워드 검색 결과
            </h2>
            <KeywordResults />
          </section>
        </div>
      </div>
    </section>
  );
}
