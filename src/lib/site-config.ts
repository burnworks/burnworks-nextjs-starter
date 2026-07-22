import { getPublicEnvironment } from "@/lib/env-validation";

type NavItem = {
  href: string;
  label: string;
};

const publicEnvironment = getPublicEnvironment();

export const siteUrl = publicEnvironment.siteUrl;

const envSiteName = process.env.NEXT_PUBLIC_SITE_NAME;
const envSiteShortName = process.env.NEXT_PUBLIC_SITE_SHORT_NAME;
const envSiteDescription = process.env.NEXT_PUBLIC_SITE_DESCRIPTION;
const envXHandle = process.env.NEXT_PUBLIC_X_HANDLE;

export const siteConfig = {
  name: envSiteName || "Burnworks Next.js Starter",
  shortName: envSiteShortName || "Burnworks Starter",
  description:
    envSiteDescription ||
    "認証なしの Web サイト案件に最適化した Next.js テンプレート。",
  url: siteUrl,
  email: publicEnvironment.contactEmail,
  lastModified: publicEnvironment.lastModified,
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
