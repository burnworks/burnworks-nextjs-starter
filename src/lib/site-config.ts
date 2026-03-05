type NavItem = {
  href: string;
  label: string;
};

const fallbackUrl = "http://localhost:3000";
const envUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const siteUrl = envUrl && URL.canParse(envUrl) ? envUrl : fallbackUrl;

const envSiteName = process.env.NEXT_PUBLIC_SITE_NAME;
const envSiteShortName = process.env.NEXT_PUBLIC_SITE_SHORT_NAME;
const envSiteDescription = process.env.NEXT_PUBLIC_SITE_DESCRIPTION;
const envContactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
const envXHandle = process.env.NEXT_PUBLIC_X_HANDLE;
const envLastModified = process.env.NEXT_PUBLIC_SITE_LAST_MODIFIED;

export const siteConfig = {
  name: envSiteName || "Burnworks Next.js Starter",
  shortName: envSiteShortName || "Burnworks Starter",
  description:
    envSiteDescription ||
    "認証なしの Web サイト案件に最適化した Next.js テンプレート。",
  url: siteUrl,
  email: envContactEmail || "hello@example.com",
  lastModified: envLastModified
    ? new Date(envLastModified)
    : new Date("2025-01-01"),
  navItems: [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ] satisfies NavItem[],
  social: {
    xHandle: envXHandle || "@burnworks_jp",
  },
};

export type { NavItem };
