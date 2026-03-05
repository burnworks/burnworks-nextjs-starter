import type { NextConfig } from "next";

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
  // カスタム HTTP レスポンスヘッダーを追加する。
  // セキュリティヘッダー（CSP、X-Frame-Options など）の設定に使う。
  // async headers() {
  //   return [
  //     {
  //       source: "/(.*)",
  //       headers: [
  //         { key: "X-Frame-Options", value: "DENY" },
  //         { key: "X-Content-Type-Options", value: "nosniff" },
  //         { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  //       ],
  //     },
  //   ];
  // },
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
