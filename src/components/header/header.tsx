import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full border-b border-gray-200" role="banner">
      <div className="fixed-layout">
        <nav
          className="flex h-16 items-center justify-between"
          aria-label="메인 내비게이션"
        >
          <div className="flex space-x-8">
            <Link
              href="/"
              className="text-navy text-2xl font-bold"
              aria-label="키워드허브 홈"
            >
              <h1>키워드허브</h1>
            </Link>
          </div>
          <div className="hidden space-x-6 md:flex">
            <Link
              href="/"
              className="hover:text-primary px-3 py-2 text-sm font-medium text-gray-700"
              aria-current={
                typeof window !== "undefined" &&
                window.location.pathname === "/"
                  ? "page"
                  : undefined
              }
            >
              키워드 조회
            </Link>
            <Link
              href="/keyword-combine"
              className="hover:text-primary px-3 py-2 text-sm font-medium text-gray-700"
              aria-current={
                typeof window !== "undefined" &&
                window.location.pathname === "/keyword-combine"
                  ? "page"
                  : undefined
              }
            >
              키워드 조합
            </Link>
            <Link
              href="/related-keywords"
              className="hover:text-primary px-3 py-2 text-sm font-medium text-gray-700"
              aria-current={
                typeof window !== "undefined" &&
                window.location.pathname === "/related-keywords"
                  ? "page"
                  : undefined
              }
            >
              연관 키워드
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
