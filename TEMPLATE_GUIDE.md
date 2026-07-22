# TEMPLATE GUIDE

## 1. 最初に変更する項目

1. `src/lib/site-config.ts` のサイト名、説明文、ナビゲーション、メールアドレス
2. `.env.local` の下記値を案件ごとに設定
   - `NEXT_PUBLIC_SITE_URL` — **本番 URL を必ず設定**（未変更だと canonical・sitemap が localhost のまま）
   - `NEXT_PUBLIC_SITE_NAME`
   - `NEXT_PUBLIC_SITE_SHORT_NAME`
   - `NEXT_PUBLIC_SITE_DESCRIPTION`
   - `NEXT_PUBLIC_CONTACT_EMAIL`
   - `NEXT_PUBLIC_X_HANDLE`
   - `NEXT_PUBLIC_SITE_LAST_MODIFIED` — サイト公開日またはコンテンツ更新日（`YYYY-MM-DD` 形式）
   - `CONTACT_WEBHOOK_URL`
3. `src/content/site-copy.ts` の文言（Hero、特徴、説明）
4. `src/content/site-copy.ts` の `aboutCopy.principles`（About ページのカード内容）

## 2. ページ追加の基本

1. `src/app/<slug>/page.tsx` を追加
2. `metadata` をページごとに定義し、`alternates.canonical` を忘れずに設定する

   ```tsx
   export const metadata: Metadata = {
     title: "ページタイトル",
     description: "ページの説明文",
     alternates: {
       canonical: "/<slug>",
     },
   };
   ```

3. ナビゲーションに必要なら `src/lib/site-config.ts` の `navItems` を更新
4. `src/app/sitemap.ts` の `routes` 配列にパスを追加

   ```ts
   const routes = ["", "/about", "/contact", "/<slug>"];
   ```

## 3. フォントの変更

### デフォルト: `@fontsource` を使う方法（現在の構成）

`src/app/globals.css` の `@theme inline` 内の `--font-body` を変更します。
`@fontsource-variable/noto-sans-jp` を使わない場合は `package.json` から依存も削除してください。

```css
@theme inline {
  --font-body: "変更後フォント名", sans-serif;
}
```

### オプション: `next/font` を使う方法

`next/font` を使うと、フォントのフォールバック寸法（`size-adjust` / `ascent-override` 等）が自動計算され、フォント読み込み前後のレイアウトずれ（CLS）を最小化できます。Web Vitals を重視する案件ではこちらが有利です。

**切り替え手順**

1. `package.json` から `@fontsource-variable/noto-sans-jp` を削除し、`npm install` を実行
2. `src/app/layout.tsx` にフォントの設定を追加し、CSS 変数として `body` に適用する

   ```tsx
   import { Noto_Sans_JP } from "next/font/google";
   import "./globals.css";

   const notoSansJP = Noto_Sans_JP({
     subsets: ["latin"],
     display: "swap",
     variable: "--font-body",
   });

   export default function RootLayout({ children }: ...) {
     return (
       <html lang="ja">
         <body className={notoSansJP.variable}>
           ...
         </body>
       </html>
     );
   }
   ```

3. `src/app/layout.tsx` の `import "@fontsource-variable/noto-sans-jp";` を削除する（`next/font` の import に置き換わるため不要）

> `variable: "--font-body"` の名前を変えないことで、`globals.css` の `@theme inline` や `font-body` クラスとの連携がそのまま維持されます。

## 4. 問い合わせ連携

- `CONTACT_WEBHOOK_URL` 未設定時: API は `503 Service Unavailable` を返す
- `CONTACT_WEBHOOK_URL` 設定時: `/api/contact` から外部 Webhook へ POST
- API のリクエストボディ上限は 16 KiB、Webhook のタイムアウトは 10 秒
- 送信される JSON の構造や接続先の詳細は `README.md` の「Contact Webhook」セクションを参照

## 5. デプロイ前チェック

1. `npm run format:check`
2. `npm run lint`
3. `npm run build`
4. `NEXT_PUBLIC_SITE_URL` が本番 URL になっているか確認
5. `NEXT_PUBLIC_SITE_LAST_MODIFIED` をコンテンツの最終更新日に合わせて更新
