const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const getOptionalValue = (value: string | undefined) => {
  const normalized = value?.trim();
  return normalized || undefined;
};

const parseHttpUrl = (
  name: string,
  value: string | undefined,
  options: { required?: boolean; siteUrl?: boolean } = {},
) => {
  const normalized = getOptionalValue(value);
  if (!normalized) {
    if (options.required) {
      throw new Error(`${name} is required for production builds.`);
    }

    return undefined;
  }

  let url: URL;
  try {
    url = new URL(normalized);
  } catch {
    throw new Error(`${name} must be a valid absolute URL.`);
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(`${name} must use the http or https protocol.`);
  }

  if (
    options.siteUrl &&
    (url.username || url.password || url.search || url.hash)
  ) {
    throw new Error(
      `${name} must not contain credentials, a query, or a hash.`,
    );
  }

  return url.toString().replace(/\/$/, "");
};

const parseEmail = (name: string, value: string | undefined) => {
  const normalized = getOptionalValue(value);
  if (!normalized) return undefined;

  if (!EMAIL_PATTERN.test(normalized)) {
    throw new Error(`${name} must be a valid email address.`);
  }

  return normalized;
};

const parseDate = (name: string, value: string | undefined) => {
  const normalized = getOptionalValue(value);
  if (!normalized) return undefined;

  if (!DATE_PATTERN.test(normalized)) {
    throw new Error(`${name} must use the YYYY-MM-DD format.`);
  }

  const date = new Date(`${normalized}T00:00:00.000Z`);
  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== normalized
  ) {
    throw new Error(`${name} must be a valid calendar date.`);
  }

  return date;
};

export const getPublicEnvironment = (
  environment: NodeJS.ProcessEnv = process.env,
) => ({
  siteUrl:
    parseHttpUrl("NEXT_PUBLIC_SITE_URL", environment.NEXT_PUBLIC_SITE_URL, {
      required: environment.NODE_ENV === "production",
      siteUrl: true,
    }) ?? "http://localhost:3000",
  contactEmail:
    parseEmail(
      "NEXT_PUBLIC_CONTACT_EMAIL",
      environment.NEXT_PUBLIC_CONTACT_EMAIL,
    ) ?? "hello@example.com",
  lastModified:
    parseDate(
      "NEXT_PUBLIC_SITE_LAST_MODIFIED",
      environment.NEXT_PUBLIC_SITE_LAST_MODIFIED,
    ) ?? new Date("2025-01-01T00:00:00.000Z"),
});

export const validateBuildEnvironment = (
  environment: NodeJS.ProcessEnv = process.env,
) => {
  getPublicEnvironment(environment);
  parseHttpUrl("CONTACT_WEBHOOK_URL", environment.CONTACT_WEBHOOK_URL);
};
