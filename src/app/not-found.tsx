import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 ページが見つかりません",
  robots: {
    index: false,
  },
};

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-6xl flex-col items-start justify-center px-6 py-16 lg:px-8">
      <p className="text-xs font-semibold tracking-[0.12em] text-stone-600 uppercase">
        404
      </p>
      <h1 className="mt-3 text-4xl font-bold text-stone-900">
        ページが見つかりません
      </h1>
      <p className="mt-4 max-w-xl text-sm text-stone-700 md:text-base">
        URL
        が変更されたか、ページが削除された可能性があります。トップページから目的の情報を探してください。
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-stone-50 transition hover:bg-stone-700"
      >
        トップへ戻る
      </Link>
    </div>
  );
}
