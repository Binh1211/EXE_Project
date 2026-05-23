import { env, isGoogleOAuthEnabled } from "../config/env.js";
import { AuthError } from "./auth.service.js";

type GoogleState = {
  mode: "login" | "register";
  redirectUri: string;
};

export function encodeGoogleState(state: GoogleState) {
  return Buffer.from(JSON.stringify(state)).toString("base64url");
}

export function decodeGoogleState(encoded: string): GoogleState {
  try {
    return JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8"),
    ) as GoogleState;
  } catch {
    throw new AuthError(400, "State OAuth không hợp lệ.");
  }
}

export function getGoogleAuthorizationUrl(state: GoogleState) {
  if (!isGoogleOAuthEnabled) {
    throw new AuthError(503, "Google OAuth chưa được cấu hình trên server.");
  }

  const params = new URLSearchParams({
    client_id: env.google.clientId,
    redirect_uri: env.google.callbackUrl,
    response_type: "code",
    scope: "openid email profile",
    access_type: "online",
    prompt: "select_account",
    state: encodeGoogleState(state),
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

async function exchangeCode(code: string) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: env.google.clientId,
      client_secret: env.google.clientSecret,
      redirect_uri: env.google.callbackUrl,
      grant_type: "authorization_code",
    }),
  });

  const data = (await response.json()) as {
    access_token?: string;
    error?: string;
  };

  if (!response.ok || !data.access_token) {
    throw new AuthError(401, "Không thể xác thực với Google.");
  }

  return data.access_token;
}

async function fetchGoogleProfile(accessToken: string) {
  const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const profile = (await response.json()) as {
    id?: string;
    email?: string;
    name?: string;
    picture?: string;
  };

  if (!profile.id || !profile.email) {
    throw new AuthError(401, "Google không trả về đủ thông tin tài khoản.");
  }

  return {
    googleId: profile.id,
    email: profile.email,
    displayName: profile.name ?? profile.email.split("@")[0],
    avatarUrl: profile.picture,
  };
}

export async function handleGoogleCallback(code: string) {
  const accessToken = await exchangeCode(code);
  return fetchGoogleProfile(accessToken);
}
