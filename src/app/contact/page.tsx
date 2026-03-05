import type { Metadata } from "next";

import { SectionHeading } from "@/components/ui/section-heading";
import { ContactForm } from "@/features/contact/contact-form";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description: "お問い合わせページです。",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-8">
      <SectionHeading
        title="Contact"
        description="案件相談、見積もり、制作体制の相談などを受け付けています。"
      />
      <div className="mt-8 grid gap-8 md:grid-cols-[2fr_1fr]">
        <ContactForm />
        <aside className="rounded-2xl border border-stone-200 bg-stone-50 p-6">
          <h2 className="text-lg font-semibold text-stone-900">連絡先</h2>
          <p className="mt-3 text-sm leading-relaxed text-stone-700">
            メールでの直接連絡を希望する場合は、下記のアドレスをご利用ください。
          </p>
          <a
            href={`mailto:${siteConfig.email}`}
            className="mt-4 inline-block text-sm font-semibold text-stone-900 underline"
          >
            {siteConfig.email}
          </a>
        </aside>
      </div>
    </div>
  );
}
