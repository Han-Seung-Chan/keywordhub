"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function TabNavigation() {
  const pathname = usePathname();

  // 각 탭의 활성 상태 확인
  const isActive = (path: string) => pathname === path;

  return (
    <div className="bg-muted mb-4 grid h-15 w-full grid-cols-3 rounded-lg p-1">
      <Link
        href="/"
        className={`flex h-12 items-center justify-center rounded-md px-3 py-3 text-sm font-medium whitespace-nowrap transition-colors ${isActive("/") ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
      >
        키워드 조회기
      </Link>
      <Link
        href="/keyword-combine"
        className={`flex h-12 items-center justify-center rounded-md px-3 py-3 text-sm font-medium whitespace-nowrap transition-colors ${isActive("/keyword-combine") ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
      >
        키워드 조합기
      </Link>
      <Link
        href="/related-keywords"
        className={`flex h-12 items-center justify-center rounded-md px-3 py-3 text-sm font-medium whitespace-nowrap transition-colors ${isActive("/related-keywords") ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
      >
        연관키워드 (준비중)
      </Link>
    </div>
  );
}
