import type { Metadata } from "next";
import Link from "next/link";

import { SectionHeading } from "@/components/ui/section-heading";
import { homeCopy } from "@/content/site-copy";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <div className="pb-20">
      <section className="mx-auto w-full max-w-6xl px-6 pt-18 pb-16 lg:px-8">
        <p className="inline-flex rounded-full border border-white/80 bg-white/60 px-3 py-1 text-xs tracking-[0.12em] text-stone-600 uppercase backdrop-blur">
          Website-first Next.js Template
        </p>
        <h1 className="mt-6 max-w-3xl text-4xl leading-tight font-bold text-stone-900 md:text-6xl">
          {homeCopy.hero.title}
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-stone-700 md:text-lg">
          {homeCopy.hero.description}
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/contact"
            className="rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-stone-50 transition hover:bg-stone-700"
          >
            相談を始める
          </Link>
          <Link
            href="/about"
            className="rounded-full border border-stone-900 px-6 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-100"
          >
            テンプレート思想を見る
          </Link>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-6 px-6 py-10 md:grid-cols-3 lg:px-8">
        {homeCopy.pillars.map((pillar) => (
          <article
            key={pillar.title}
            className="rounded-2xl border border-stone-200/80 bg-white/80 p-6 shadow-sm shadow-stone-200/40 backdrop-blur"
          >
            <h2 className="text-xl font-bold text-stone-900">{pillar.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-stone-700">
              {pillar.description}
            </p>
          </article>
        ))}
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 py-10 lg:px-8">
        <SectionHeading
          title="標準搭載の機能"
          description="初期段階で必要な構成をまとめ、不要な認証機能は含めない方針です。"
        />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {homeCopy.featureList.map((feature) => (
            <article
              key={feature.title}
              className="rounded-xl border border-stone-200 bg-stone-50/70 p-5"
            >
              <h3 className="text-lg font-semibold text-stone-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-700">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
