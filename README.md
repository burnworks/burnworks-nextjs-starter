# Burnworks Next.js Starter

認証機能を前提としない Web サイト案件向けの Next.js テンプレートです。  
ランディングページ、コーポレートサイト、サービス紹介サイトを短時間で立ち上げる用途を想定しています。

## Included

- App Router + TypeScript strict
- Home / About / Contact / 404 のページ雛形
- `metadata`, `sitemap`, `robots`, `opengraph-image` による SEO 基盤
- `/api/contact` + クライアントフォーム（Webhook 連携可能）
- ESLint + Prettier + Husky + lint-staged
- GitHub Actions CI（lint + build）

## Prerequisites

- Node.js `v24.14.0` LTS（開発環境の前提バージョン）

## Getting Started

テンプレートから新規プロジェクトを作る場合:

```bash
npx create-next-app@latest my-project --example "https://github.com/burnworks/burnworks-nextjs-starter"
```

このリポジトリを直接使う場合:

```bash
npm install
cp .env.example .env.local
npm run dev
```

`http://localhost:3000` を開いて確認できます。

## Environment Variables

| 変数名                           | 説明                                                                                                         | 例                            |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------ | ----------------------------- |
| `NEXT_PUBLIC_SITE_URL`           | 公開サイト URL。canonical URL・sitemap・robots に使用される。**本番デプロイ前に必ず本番 URL へ変更すること** | `https://example.com`         |
| `NEXT_PUBLIC_SITE_NAME`          | サイト正式名。`<title>` タグや OG タグに使用                                                                 | `My Company`                  |
| `NEXT_PUBLIC_SITE_SHORT_NAME`    | ヘッダーロゴ表示用の短縮名                                                                                   | `MyBiz`                       |
| `NEXT_PUBLIC_SITE_DESCRIPTION`   | 共通メタディスクリプション                                                                                   | `サービス紹介サイト`          |
| `NEXT_PUBLIC_CONTACT_EMAIL`      | フッターおよび Contact ページに表示するメールアドレス                                                        | `hello@example.com`           |
| `NEXT_PUBLIC_X_HANDLE`           | X (Twitter) のアカウントハンドル。Twitter Card の `creator` に使用                                           | `@example`                    |
| `NEXT_PUBLIC_SITE_LAST_MODIFIED` | sitemap の `lastModified` に使用する日付。コンテンツ更新時に変更する                                         | `2025-06-01`                  |
| `CONTACT_WEBHOOK_URL`            | 問い合わせ内容の転送先 Webhook URL。未設定時は受理メッセージのみ返す（後述）                                 | `https://hooks.slack.com/...` |

## Scripts

- `npm run dev`: 開発サーバー起動
- `npm run build`: 本番ビルド
- `npm run lint`: ESLint 実行
- `npm run format`: Prettier で整形（ファイルを上書き）
- `npm run format:check`: Prettier でフォーマットチェックのみ（CI 等で使用）

## Project Structure

```text
src/
  app/            # ルーティング、layout、SEO、API routes
  components/     # 再利用 UI とレイアウト
  content/        # テキストや静的コンテンツ
  features/       # 機能単位（例: contact）
  lib/            # 設定や共通ロジック
```

## Contact Webhook

`CONTACT_WEBHOOK_URL` に Webhook の受信エンドポイントを設定すると、フォーム送信時に以下の JSON を POST します。
Slack の Incoming Webhook、Discord の Webhook、Make（旧 Integromat）、Zapier の Webhook などが接続先として利用できます。

```json
{
  "type": "contact",
  "source": "burnworks-nextjs-starter",
  "submittedAt": "2025-06-01T12:00:00.000Z",
  "data": {
    "name": "送信者名",
    "email": "sender@example.com",
    "message": "お問い合わせ本文"
  }
}
```

> **Slack への接続例**: Slack アプリの Incoming Webhook URL（`https://hooks.slack.com/services/...`）をそのまま設定しても、Slack が期待するペイロード形式と異なるためメッセージは届きません。Make や Zapier 等を中継して変換するか、独自のエンドポイントを用意してください。

## Deployment

Vercel へのデプロイを推奨します。

1. リポジトリを Vercel に接続してプロジェクトを作成
2. Vercel ダッシュボードの **Settings > Environment Variables** で本番用の環境変数を設定
3. **`NEXT_PUBLIC_SITE_URL` を必ず本番 URL に変更する**（未変更のままだと canonical・sitemap・robots が `http://localhost:3000` のまま出力される）

その他のホスティング（AWS、Cloudflare Pages 等）でも動作しますが、`/api/contact` などの API routes を使用するため、静的エクスポート（`output: "export"`）には対応していません。

## Out of Scope

このテンプレートが**対象外**としている機能です。これらが必要な場合は別途実装するか、別のスターターを検討してください。

- **認証・ログイン機能**（NextAuth.js、Clerk 等）
- **データベース連携**（Prisma、Drizzle 等）
- **ヘッドレス CMS 連携**（Contentful、microCMS、Sanity 等）
- **i18n / 多言語対応**（next-intl 等）
- **EC・決済機能**（Stripe 等）

## Template Docs

- `TEMPLATE_GUIDE.md`: 新規案件で最初に変更すべきポイント
- `DECISIONS.md`: このテンプレートで採用している設計判断

## Packages

### Runtime Dependencies

- `next`: React ベースのフルスタックフレームワーク本体（App Router を含む）。
- `react`: UI コンポーネント構築のためのライブラリ本体。
- `react-dom`: React コンポーネントをブラウザへ描画するための実行基盤。
- `@fontsource-variable/noto-sans-jp`: Noto Sans JP Variable フォントをローカル配信するためのパッケージ。

### Development Dependencies

- `typescript`: 型安全な開発を行うための TypeScript コンパイラ。
- `@types/node`: Node.js v24 系に合わせた Node.js API の型定義。
- `@types/react`: React の型定義。
- `@types/react-dom`: React DOM の型定義。
- `eslint`: 静的解析ツール本体。
- `eslint-config-next`: Next.js 推奨ルールをまとめた ESLint 設定。
- `prettier`: コード整形ツール本体。
- `prettier-plugin-tailwindcss`: Tailwind クラスの並び順を整える Prettier プラグイン。
- `husky`: Git フックを管理するツール。
- `lint-staged`: コミット対象ファイルだけに lint/format を適用するツール。
- `tailwindcss`: ユーティリティファーストな CSS フレームワーク本体。
- `@tailwindcss/postcss`: Tailwind v4 を PostCSS 経由で使うための統合パッケージ。
- `@tailwindcss/typography`: `prose` など記事向けタイポグラフィスタイルを提供する公式プラグイン。
