"use client";

import Link from "next/link";
import { useState } from "react";
import FeatureAlert from "@/components/common/alert-message";

export default function Header() {
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleFeatureClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAlertOpen(true);
  };

  return (
    <>
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
                href="/"
                className="hover:text-primary px-3 py-2 text-sm font-medium text-gray-700"
              >
                키워드 조회
              </Link>
              <Link
                href="#"
                className="hover:text-primary px-3 py-2 text-sm font-medium text-gray-700"
                onClick={handleFeatureClick}
              >
                키워드 조합
              </Link>
              <Link
                href="#"
                className="hover:text-primary px-3 py-2 text-sm font-medium text-gray-700"
                onClick={handleFeatureClick}
              >
                연관 키워드
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* 알림 모달 */}
      <FeatureAlert
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
      />
    </>
  );
}
