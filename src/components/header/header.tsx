import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="fixed-layout">
        <nav className="flex justify-between items-center h-16">
          <div className="flex space-x-8">
            <Link href="/" className="text-navy font-semibold text-lg">
              키워드허브
            </Link>
          </div>
          <div className="hidden md:flex space-x-6">
            <Link
              href="/keyword-search"
              className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium"
            >
              키워드 조회
            </Link>
            <Link
              href="/keyword-combine"
              className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium"
            >
              키워드 조합
            </Link>
            <Link
              href="/related-keywords"
              className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium"
            >
              연관 키워드
            </Link>
            {/* <Link href="/ad-products" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">
              광고상품
            </Link> */}
            {/* <Link href="/ad-agency" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">
              광고대행사
            </Link> */}
            {/* <Link href="/inquiry" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">
              대행문의
            </Link> */}
          </div>
        </nav>
      </div>
    </header>
  );
}
