import Link from "next/link";

import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-stone-300/70 bg-stone-300">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-stone-600 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <p>
          © {year} {siteConfig.name}
        </p>
        <div className="flex items-center gap-4">
          <Link href="/about" className="transition hover:text-stone-900">
            About
          </Link>
          <Link href="/contact" className="transition hover:text-stone-900">
            Contact
          </Link>
          <a
            href={`mailto:${siteConfig.email}`}
            className="transition hover:text-stone-900"
          >
            {siteConfig.email}
          </a>
        </div>
      </div>
    </footer>
  );
}
