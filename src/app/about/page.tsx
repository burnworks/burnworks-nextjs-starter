import type { Metadata } from "next";

import { SectionHeading } from "@/components/ui/section-heading";
import { aboutCopy } from "@/content/site-copy";

export const metadata: Metadata = {
  title: "About",
  description: "このテンプレートの設計方針と想定ユースケース。",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-8">
      <SectionHeading
        as="h1"
        title="About This Starter"
        description="Webサイト制作を素早く開始するための、最小かつ実践的なテンプレートです。"
      />
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {aboutCopy.principles.map((principle) => (
          <article
            key={principle.title}
            className="rounded-2xl border border-stone-200 bg-white/75 p-6"
          >
            <h2 className="text-xl font-semibold text-stone-900">
              {principle.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-stone-700">
              {principle.description}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
