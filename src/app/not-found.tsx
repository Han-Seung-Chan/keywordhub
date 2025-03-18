// src/app/not-found.tsx
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없음 - 키워드 허브",
  description:
    "요청하신 페이지를 찾을 수 없습니다. 키워드 허브 홈페이지로 이동하여 키워드 검색 서비스를 이용해보세요.",
};

export default function NotFound() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <h1 className="mb-4 text-6xl font-bold">404</h1>
      <h2 className="mb-6 text-2xl font-semibold">페이지를 찾을 수 없습니다</h2>
      <p className="mb-8 max-w-md text-gray-600">
        요청하신 페이지가 존재하지 않거나, 이동되었거나, 일시적으로 사용할 수
        없습니다.
      </p>
      <Link
        href="/"
        className="rounded-md bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
      >
        홈으로 돌아가기
      </Link>

      <div className="mt-12">
        <h3 className="mb-4 text-lg font-medium">이런 페이지는 어떠세요?</h3>
        <div className="flex flex-col justify-center gap-4 md:flex-row">
          <Link
            href="/"
            className="rounded-md border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50"
          >
            키워드 검색량 조회
          </Link>
          <Link
            href="/keyword-combine"
            className="rounded-md border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50"
          >
            키워드 조합기
          </Link>
        </div>
      </div>
    </section>
  );
}
