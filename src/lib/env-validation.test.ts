import { describe, expect, it } from "vitest";

import {
  getPublicEnvironment,
  validateBuildEnvironment,
} from "./env-validation";

describe("getPublicEnvironment", () => {
  it("uses development fallbacks when optional values are missing", () => {
    const environment = getPublicEnvironment({ NODE_ENV: "development" });

    expect(environment.siteUrl).toBe("http://localhost:3000");
    expect(environment.contactEmail).toBe("hello@example.com");
    expect(environment.lastModified.toISOString()).toBe(
      "2025-01-01T00:00:00.000Z",
    );
  });

  it("requires the site URL for production builds", () => {
    expect(() => getPublicEnvironment({ NODE_ENV: "production" })).toThrow(
      /NEXT_PUBLIC_SITE_URL is required/,
    );
  });

  it("normalizes a trailing slash in the site URL", () => {
    const environment = getPublicEnvironment({
      NODE_ENV: "production",
      NEXT_PUBLIC_SITE_URL: "https://example.com/base/",
    });

    expect(environment.siteUrl).toBe("https://example.com/base");
  });

  it.each([
    ["relative URL", { NEXT_PUBLIC_SITE_URL: "/relative" }, /absolute URL/],
    [
      "unsupported protocol",
      { NEXT_PUBLIC_SITE_URL: "ftp://example.com" },
      /http or https/,
    ],
    [
      "query in site URL",
      { NEXT_PUBLIC_SITE_URL: "https://example.com?preview=1" },
      /query/,
    ],
    [
      "invalid email",
      { NEXT_PUBLIC_CONTACT_EMAIL: "invalid" },
      /email address/,
    ],
    [
      "invalid date format",
      { NEXT_PUBLIC_SITE_LAST_MODIFIED: "2026/07/22" },
      /YYYY-MM-DD/,
    ],
    [
      "nonexistent date",
      { NEXT_PUBLIC_SITE_LAST_MODIFIED: "2026-02-30" },
      /calendar date/,
    ],
  ])("rejects %s", (_label, values, expectedError) => {
    expect(() =>
      getPublicEnvironment({ NODE_ENV: "development", ...values }),
    ).toThrow(expectedError);
  });
});

describe("validateBuildEnvironment", () => {
  it("accepts an omitted webhook URL", () => {
    expect(() =>
      validateBuildEnvironment({
        NODE_ENV: "production",
        NEXT_PUBLIC_SITE_URL: "https://example.com",
      }),
    ).not.toThrow();
  });

  it("rejects an invalid webhook URL", () => {
    expect(() =>
      validateBuildEnvironment({
        NODE_ENV: "production",
        NEXT_PUBLIC_SITE_URL: "https://example.com",
        CONTACT_WEBHOOK_URL: "not-a-url",
      }),
    ).toThrow(/CONTACT_WEBHOOK_URL must be a valid absolute URL/);
  });
});
