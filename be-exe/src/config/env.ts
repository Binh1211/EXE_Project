import "dotenv/config";

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 8080),
  mongodbUri: required("MONGODB_URI"),
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:5173",
  jwt: {
    accessSecret: required(
      "JWT_ACCESS_SECRET",
      "dev-access-secret-change-in-production-32chars",
    ),
    refreshSecret: required(
      "JWT_REFRESH_SECRET",
      "dev-refresh-secret-change-in-production-32chars",
    ),
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
