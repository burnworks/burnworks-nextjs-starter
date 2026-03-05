# DECISIONS

## Scope

- 認証つき Web アプリではなく、サイト案件向けに最適化する
- 高頻度で使わない機能は初期テンプレートから除外する

## Architecture

- Next.js App Router を採用
- `components / content / features / lib` の分割を採用
- ルーティングは分かりやすさを優先し、過度な抽象化を避ける

## Quality

- TypeScript strict + ESLint を必須
- フォーマットは Prettier で統一
- pre-commit で最低限の整形と lint を実行
- CI で `lint` と `build` を検証

## SEO

- `metadata` / `sitemap` / `robots` / `opengraph-image` を初期搭載し、ゼロから設定する手間を省く
- canonical URL は各ページの `metadata` で個別に設定する（ルートレイアウトで一括設定しない）
- OG 画像は `opengraph-image.tsx` で動的生成し、サイト設定と連動させる

## Fonts

- フォント設定は `src/app/globals.css` の `@theme inline` に集約する
- デフォルトは `@fontsource` パッケージでローカル配信する（設定が CSS に集約でき、シンプル）
- `next/font` はフォールバック寸法の自動最適化により CLS 改善が見込めるため、Web Vitals を重視する案件では切り替えを検討する（`TEMPLATE_GUIDE.md` 参照）

## Configuration

- サイト名・URL・メール等のサイト設定は `NEXT_PUBLIC_*` 環境変数で上書き可能にする
- コードを変更せずに案件ごとの設定を切り替えられることを優先する
- 環境変数が未設定の場合はフォールバック値を使い、クローン直後でも動作する状態を保つ

## Contact Form

- デフォルトはシンプルなフォームと API route
- 必要時のみ Webhook で外部連携する
- スパム対策として honeypot フィールドを実装する
