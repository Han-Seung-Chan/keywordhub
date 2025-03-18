// src/components/structured-data.tsx
import Script from "next/script";

export function WebsiteStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "키워드 허브",
    url: "https://www.keywordhub.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.keywordhub.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
    description: "키워드의 검색량을 조회하고 키워드를 조합할 수 있는 서비스",
    keywords: "키워드 조회, 검색량, 키워드 조합, 네이버 키워드",
  };

  return (
    <Script
      id="website-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function SoftwareApplicationStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "키워드 허브",
    applicationCategory: "WebApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "KRW",
    },
    operatingSystem: "Any",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1024",
    },
  };

  return (
    <Script
      id="software-application-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
