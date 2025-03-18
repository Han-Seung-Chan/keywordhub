import { Metadata } from "next";
import TabNavigation from "@/components/navigation/tab-navigation";
import { Card, CardContent } from "@/components/ui/card";
import KeywordCombiner from "@/components/keyword-combiner";

// 페이지별 메타데이터 추가
export const metadata: Metadata = {
  title: "키워드 조합기",
  description:
    "다양한 키워드를 패턴별로 조합하여 새로운 키워드를 생성할 수 있는 도구입니다. 여러 키워드 세트를 입력하고 원하는 조합 패턴을 선택하세요.",
  keywords: [
    "키워드 조합",
    "키워드 생성",
    "조합 패턴",
    "키워드 툴",
    "마케팅 키워드",
  ],
};

export default function KeywordCombinePage() {
  return (
    <section className="min-h-screen">
      <div className="mt-6 flex flex-col gap-4">
        <div className="w-full">
          <div className="w-full overflow-hidden">
            <header className="mb-6">
              <h1 className="text-navy mb-2 text-2xl font-bold">
                키워드 조합기
              </h1>
              <p className="text-gray-600">
                여러 키워드를 조합하여 새로운 키워드를 생성할 수 있는
                도구입니다.
              </p>
            </header>

            {/* 탭 네비게이션 컴포넌트 */}
            <nav aria-label="키워드 도구 내비게이션">
              <TabNavigation />
            </nav>

            {/* 키워드 조합기 UI */}
            <Card className="mt-6 w-full border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <KeywordCombiner />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
