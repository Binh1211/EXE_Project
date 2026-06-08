import "dotenv/config";

const isProduction = process.env.NODE_ENV === "production";
const devAccessSecret = "dev-access-secret-change-in-production-32chars";
const devRefreshSecret = "dev-refresh-secret-change-in-production-32chars";
const appPort = readPort();

function required(name: string, fallback?: string): string {
  const value = process.env[name]?.trim();
  if (value) return value;

  if (fallback && !isProduction) {
    return fallback;
  }

  throw new Error(`Missing environment variable: ${name}`);
}

function productionSecret(name: string, fallback: string): string {
  const value = required(name, fallback);
  if (!isProduction) return value;

  const normalized = value.toLowerCase();
  const isPlaceholder =
    value === fallback ||
    normalized.includes("replace") ||
    normalized.includes("change") ||
    normalized.includes("your-");

  if (value.length < 32 || isPlaceholder) {
    throw new Error(
      `${name} must be a real production secret with at least 32 characters`,
    );
  }

  return value;
}

function readPort() {
  const value = Number(process.env.PORT ?? 8080);

  if (!Number.isInteger(value) || value < 1 || value > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535");
  }

  if (isProduction && value !== 8080) {
    throw new Error("PORT must be 8080 in production to match Traefik routing");
  }

  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: appPort,
  mongodbUri: required("MONGODB_URI"),
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:5173",
  jwt: {
    accessSecret: productionSecret("JWT_ACCESS_SECRET", devAccessSecret),
    refreshSecret: productionSecret("JWT_REFRESH_SECRET", devRefreshSecret),
    accessExpires: process.env.JWT_ACCESS_EXPIRES ?? "15m",
    refreshExpires: process.env.JWT_REFRESH_EXPIRES ?? "7d",
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID ?? "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    callbackUrl:
      process.env.GOOGLE_CALLBACK_URL ??
      "http://localhost:8080/api/auth/google/callback",
  },
  smtp: {
    host: process.env.SMTP_HOST ?? "",
    port: Number(process.env.SMTP_PORT ?? 587),
    user: process.env.SMTP_USER ?? "",
    pass: process.env.SMTP_PASS ?? "",
    from: process.env.SMTP_FROM ?? "Vistory <noreply@example.com>",
  },
};

export const isGoogleOAuthEnabled = Boolean(
  env.google.clientId && env.google.clientSecret,
);

export const isSmtpEnabled = Boolean(env.smtp.host && env.smtp.user && env.smtp.pass);
