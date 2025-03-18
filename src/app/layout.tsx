import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { AppProviders } from "@/provider";
import {
  WebsiteStructuredData,
  SoftwareApplicationStructuredData,
} from "@/components/structured-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 기본 메타데이터 향상
export const metadata: Metadata = {
  title: {
    template: "%s | 키워드 허브",
    default: "키워드 허브 - 키워드 검색량 조회기",
  },
  description:
    "키워드의 조회수를 확인할 수 있는 키워드 검색량 조회기입니다. PC 및 모바일 검색량, 클릭률 데이터를 제공합니다.",
  keywords: [
    "키워드 조회",
    "키워드 조합",
    "검색량",
    "네이버 키워드",
    "클릭률",
    "검색어 분석",
    "SEO 최적화",
  ],
  authors: [{ name: "키워드 허브" }],
  creator: "키워드 허브",
  publisher: "키워드 허브",
  // Open Graph 메타 태그 추가
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://www.keywordhub.com",
    title: "키워드 허브 - 키워드 검색량 조회기",
    description:
      "키워드의 조회수를 확인할 수 있는 키워드 검색량 조회기입니다. PC 및 모바일 검색량, 클릭률 데이터를 제공합니다.",
    siteName: "키워드 허브",
  },
};

// 뷰포트 설정 추가
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <WebsiteStructuredData />
        <SoftwareApplicationStructuredData />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppProviders>
          <Header />
          <main className="fixed-layout">{children}</main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
