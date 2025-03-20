import { Metadata } from "next";
import TabNavigation from "@/components/navigation/tab-navigation";
import { Card, CardContent } from "@/components/ui/card";
import RelatedKeywords from "@/components/related-keywords/related-keywords";

// 페이지별 메타데이터 추가
export const metadata: Metadata = {
  title: "연관 키워드 찾기",
  description:
    "입력한 키워드와 관련된 연관 키워드를 찾아주는 도구입니다. 곧 서비스될 예정입니다.",
  keywords: [
    "연관 키워드",
    "관련 키워드",
    "키워드 발굴",
    "SEO 키워드",
    "키워드 확장",
  ],
};

export default function RelatedKeywordsPage() {
  return (
    <section className="min-h-screen">
      <div className="mt-6 flex flex-col gap-4">
        <div className="w-full">
          <header className="mb-6">
            <h1 className="text-navy mb-2 text-2xl font-bold">
              연관 키워드 찾기
            </h1>
            <p className="text-gray-600">
              입력한 키워드와 관련된 연관 키워드를 찾아주는 도구입니다.
            </p>
          </header>

          {/* 탭 네비게이션 컴포넌트 */}
          <nav aria-label="키워드 도구 내비게이션">
            <TabNavigation />
          </nav>

          {/* <section className="mt-6" aria-labelledby="search-section">
            <h2 id="search-section" className="sr-only">
              키워드 검색
            </h2>
            <KeywordSearch />
          </section>

          <section aria-labelledby="results-section">
            <h2 id="results-section" className="sr-only">
              키워드 검색 결과
            </h2>
            <KeywordResults />
          </section> */}

          <Card className="mt-6 w-full border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <RelatedKeywords />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
