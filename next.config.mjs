/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: "standalone",

  serverExternalPackages: ["@google/generative-ai"],

  experimental: {
    largePageDataBytes: 10 * 1024 * 1024, // 10MB로 설정 (bodyParser.sizeLimit과 유사한 역할)
  },

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
};

export default nextConfig;
