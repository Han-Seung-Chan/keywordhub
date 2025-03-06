import ModeToggle from "@/components/mode-toggle";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full border-b border-gray-200">
      <div className="fixed-layout">
        <nav className="flex h-16 items-center justify-between">
          <div className="flex space-x-8">
            <Link href="/" className="text-navy text-lg font-semibold">
              키워드허브
            </Link>
          </div>
          <div className="hidden space-x-6 md:flex">
            <Link
              href="/keyword-search"
              className="hover:text-primary px-3 py-2 text-sm font-medium text-gray-700"
            >
              키워드 조회
            </Link>
            <Link
              href="/keyword-combine"
              className="hover:text-primary px-3 py-2 text-sm font-medium text-gray-700"
            >
              키워드 조합
            </Link>
            <Link
              href="/related-keywords"
              className="hover:text-primary px-3 py-2 text-sm font-medium text-gray-700"
            >
              연관 키워드
            </Link>
            <ModeToggle />
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
