import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";

export type AccessTokenPayload = {
  sub: string;
  email: string;
  role: string;
};

const accessOptions: SignOptions = {
  expiresIn: env.jwt.accessExpires as SignOptions["expiresIn"],
};

const refreshOptions: SignOptions = {
  expiresIn: env.jwt.refreshExpires as SignOptions["expiresIn"],
};

export function signAccessToken(payload: AccessTokenPayload) {
  return jwt.sign(payload, env.jwt.accessSecret, accessOptions);
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.jwt.accessSecret) as AccessTokenPayload;
}

export function signRefreshToken(userId: string) {
  return jwt.sign({ sub: userId }, env.jwt.refreshSecret, refreshOptions);
}
