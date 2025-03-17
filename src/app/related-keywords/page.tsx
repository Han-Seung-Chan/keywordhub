import TabNavigation from "@/components/navigation/tab-navigation";
import { Card, CardContent } from "@/components/ui/card";

export default function RelatedKeywordsPage() {
  return (
    <main className="min-h-screen">
      <div className="mt-6 flex flex-col gap-4">
        <div className="w-full">
          <div className="w-full overflow-hidden">
            <h1 className="text-navy mb-2 text-2xl font-bold">
              연관 키워드 찾기
            </h1>
            <p className="mb-6 text-gray-600">
              입력한 키워드와 관련된 연관 키워드를 찾아주는 도구입니다.
            </p>

            {/* 탭 네비게이션 컴포넌트 */}
            <TabNavigation />

            {/* 준비 중 메시지 */}
            <Card className="mt-6 w-full border border-gray-200 shadow-sm">
              <CardContent className="flex flex-col items-center justify-center p-12">
                <div className="mb-6 rounded-full bg-purple-50 p-4">
                  <div className="text-4xl">🔍</div>
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
    </main>
  );
}
