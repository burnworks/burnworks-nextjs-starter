import Link from "next/link";

import { siteConfig } from "@/lib/site-config";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-stone-300/60 bg-stone-300/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
        <Link
          href="/"
          className="text-base font-bold tracking-wide text-stone-900 md:text-lg"
        >
          {siteConfig.shortName}
        </Link>
        <nav aria-label="Main Navigation">
          <ul className="flex items-center gap-5 text-sm font-medium text-stone-700">
            {siteConfig.navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="transition hover:text-stone-950"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
