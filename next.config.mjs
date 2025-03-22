/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // 모든 https 호스트 허용
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "**", // 모든 http 호스트 허용
        port: "",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  webpack: (config) => {
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg"),
    );

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
        use: ["@svgr/webpack"],
      },
    );

    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ["@google/generative-ai"],
  },
  api: {
    bodyParser: {
      sizeLimit: "10mb", // 이미지 요청을 위한 제한 크기 증가
    },
  },
};

export default nextConfig;
