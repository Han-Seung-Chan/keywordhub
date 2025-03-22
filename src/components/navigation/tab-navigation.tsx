"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TabNavigation() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div
      className="bg-muted mb-4 grid h-15 w-full grid-cols-3 rounded-lg p-1"
      role="tablist"
      aria-label="키워드 도구 탭"
    >
      <Link
        href="/"
        className={`flex h-12 items-center justify-center rounded-md px-3 py-3 text-sm font-medium whitespace-nowrap transition-colors ${isActive("/") ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
        role="tab"
        aria-selected={isActive("/")}
        aria-controls="keyword-search-panel"
      >
        키워드 조회기
      </Link>
      <Link
        href="/keyword-combine"
        className={`flex h-12 items-center justify-center rounded-md px-3 py-3 text-sm font-medium whitespace-nowrap transition-colors ${isActive("/keyword-combine") ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
        role="tab"
        aria-selected={isActive("/keyword-combine")}
        aria-controls="keyword-combine-panel"
      >
        키워드 조합기
      </Link>
      <Link
        href="/related-keywords"
        className={`flex h-12 items-center justify-center rounded-md px-3 py-3 text-sm font-medium whitespace-nowrap transition-colors ${isActive("/related-keywords") ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
        role="tab"
        aria-selected={isActive("/related-keywords")}
        aria-controls="related-keywords-panel"
      >
        연관키워드
      </Link>
    </div>
  );
}
