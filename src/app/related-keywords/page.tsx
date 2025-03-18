import { Metadata } from "next";
import TabNavigation from "@/components/navigation/tab-navigation";
import { Card, CardContent } from "@/components/ui/card";

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
          <div className="w-full overflow-hidden">
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

            <Card className="mt-6 w-full border border-gray-200 shadow-sm">
              <CardContent className="flex flex-col items-center justify-center p-12">
                <div className="mb-6 rounded-full bg-purple-50 p-4">
                  <div className="text-4xl" aria-hidden="true">
                    🔍
                  </div>
                </div>
                <h2 className="mb-2 text-2xl font-bold text-gray-800">
                  준비 중입니다
                </h2>
                <p className="mb-6 text-center text-gray-600">
                  연관 키워드 찾기 기능은 현재 개발 중이며 곧 서비스될
                  예정입니다.
                  <br />더 나은 서비스로 찾아뵙겠습니다!
                </p>
                <div className="text-sm text-gray-500">
                  예상 오픈일: 2025년 5월
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
