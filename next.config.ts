import type { NextConfig } from "next";

import { validateBuildEnvironment } from "./src/lib/env-validation";

validateBuildEnvironment();

const nextConfig: NextConfig = {
  // React の strict mode を明示的に有効化する。
  // 開発時に潜在的な問題を検出するためのダブルレンダリングなどが有効になる。
  // reactStrictMode: true,
  // next/image で外部ドメインの画像を使う場合に許可するホストを列挙する。
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: "https",
  //       hostname: "example.com",
  //       // port: "",
  //       // pathname: "/images/**",
  //     },
  //   ],
  // },
  // CSP と HSTS は案件ごとの外部サービス・HTTPS 構成に合わせて追加する。
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  // URL リダイレクトを定義する。旧 URL から新 URL への恒久転送などに使う。
  // async redirects() {
  //   return [
  //     {
  //       source: "/old-path",
  //       destination: "/new-path",
  //       permanent: true, // true = 308, false = 307
  //     },
  //   ];
  // },
};

export default nextConfig;
