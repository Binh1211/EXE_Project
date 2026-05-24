import mongoose from "mongoose";
import {
  PasswordResetToken,
  RefreshToken,
  User,
  type IUser,
} from "../models/index.js";
import { env } from "../config/env.js";
import {
  comparePassword,
  generateSecureToken,
  hashPassword,
  hashToken,
} from "../utils/hash.js";
import { signAccessToken, signRefreshToken } from "../utils/jwt.js";
import { toAuthUser } from "../utils/user-mapper.js";
import { sendPasswordResetEmail } from "./email.service.js";
import { saveBase64Avatar, deleteOldAvatar } from "../utils/avatar.js";

export class AuthError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function buildAuthResponse(user: IUser, accessToken: string) {
  return {
    accessToken,
    user: toAuthUser(user),
  };
}

async function storeRefreshToken(userId: string, rawToken: string, deviceInfo?: string) {
  const decoded = await import("jsonwebtoken").then((jwt) =>
    jwt.default.decode(rawToken),
  ) as { exp?: number } | null;

  const expiresAt = decoded?.exp
    ? new Date(decoded.exp * 1000)
    : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await RefreshToken.create({
    userId,
    tokenHash: hashToken(rawToken),
    deviceInfo,
    expiresAt,
  });
}

export async function registerUser(input: {
  fullName: string;
  email: string;
  password: string;
}) {
  const email = input.email.toLowerCase().trim();
  const exists = await User.findOne({ email });
  if (exists) {
    throw new AuthError(409, "Email đã được sử dụng.");
  }

  const user = await User.create({
    email,
    passwordHash: await hashPassword(input.password),
    displayName: input.fullName.trim(),
    role: "user",
    level: 1,
    subscription: { status: "free" },
  });

  const accessToken = signAccessToken({
    sub: user._id.toString(),
    email: user.email,
    role: user.role,
  });
  const refreshToken = signRefreshToken(user._id.toString());
  await storeRefreshToken(user._id.toString(), refreshToken);

  user.lastLoginAt = new Date();
  await user.save();

  return buildAuthResponse(user, accessToken);
}

export async function loginUser(email: string, password: string) {
  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user || !user.passwordHash) {
    throw new AuthError(401, "Email hoặc mật khẩu không đúng.");
  }
  if (!user.isActive) {
    throw new AuthError(403, "Tài khoản đã bị khóa.");
  }

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) {
    throw new AuthError(401, "Email hoặc mật khẩu không đúng.");
  }

  const accessToken = signAccessToken({
    sub: user._id.toString(),
    email: user.email,
    role: user.role,
  });
  const refreshToken = signRefreshToken(user._id.toString());
  await storeRefreshToken(user._id.toString(), refreshToken);

  user.lastLoginAt = new Date();
  await user.save();

  return buildAuthResponse(user, accessToken);
}

export async function forgotPassword(email: string) {
  const user = await User.findOne({ email: email.toLowerCase().trim() });
  const genericMessage =
    "Nếu email tồn tại trong hệ thống, chúng tôi đã gửi link đặt lại mật khẩu. Vui lòng kiểm tra hộp thư.";

  if (!user) {
    return { message: genericMessage };
  }

  const rawToken = generateSecureToken();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  await PasswordResetToken.deleteMany({ userId: user._id });
  await PasswordResetToken.create({
    userId: user._id,
    tokenHash: hashToken(rawToken),
    expiresAt,
  });

  const resetUrl = `${env.clientUrl}/forgot-password/reset?token=${rawToken}`;
  
  try {
    await sendPasswordResetEmail(user.email, resetUrl);
  } catch (error) {
    // Log lỗi nhưng vẫn trả về thông báo generic (không tiết lộ thông tin)
    console.error("[AUTH] Lỗi gửi email reset password cho:", user.email, error);
  }

  return { message: genericMessage };
}

export async function resetPassword(token: string, password: string) {
  const tokenHash = hashToken(token);
  const record = await PasswordResetToken.findOne({
    tokenHash,
    expiresAt: { $gt: new Date() },
  });

  if (!record) {
    throw new AuthError(400, "Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.");
  }

  const user = await User.findById(record.userId);
  if (!user) {
    throw new AuthError(404, "Không tìm thấy người dùng.");
  }

  user.passwordHash = await hashPassword(password);
  await user.save();
  await PasswordResetToken.deleteMany({ userId: user._id });
  await RefreshToken.deleteMany({ userId: user._id });

  return { message: "Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại." };
}

export async function getUserById(userId: string) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new AuthError(400, "ID người dùng không hợp lệ.");
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new AuthError(404, "Không tìm thấy người dùng.");
  }
  return toAuthUser(user);
}

export async function updateProfile(userId: string, fullName: string) {
  const user = await User.findById(userId);
  if (!user) {
    throw new AuthError(404, "Không tìm thấy người dùng.");
  }
  user.displayName = fullName.trim();
  await user.save();
  return toAuthUser(user);
}

export async function uploadAvatar(userId: string, avatarUrl: string) {
  const user = await User.findById(userId);
  if (!user) {
    throw new AuthError(404, "Không tìm thấy người dùng.");
  }

  user.avatarUrl = avatarUrl;
  await user.save();

  return toAuthUser(user);
}

export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
) {
  const user = await User.findById(userId);
  if (!user || !user.passwordHash) {
    throw new AuthError(400, "Tài khoản đăng nhập bằng Google không thể đổi mật khẩu tại đây.");
  }

  const valid = await comparePassword(currentPassword, user.passwordHash);
  if (!valid) {
    throw new AuthError(401, "Mật khẩu hiện tại không đúng.");
  }

  user.passwordHash = await hashPassword(newPassword);
  await user.save();
  await RefreshToken.deleteMany({ userId: user._id });

  return { message: "Đổi mật khẩu thành công." };
}

export async function logoutUser(userId: string) {
  await RefreshToken.deleteMany({ userId });
  return { message: "Đăng xuất thành công." };
}

export async function findOrCreateGoogleUser(profile: {
  googleId: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
}) {
  const email = profile.email.toLowerCase();

  let user = await User.findOne({
    $or: [
      { email },
      { oauthProviders: { $elemMatch: { provider: "google", uid: profile.googleId } } },
    ],
  });

  if (user) {
    const hasGoogle = user.oauthProviders?.some(
      (p) => p.provider === "google" && p.uid === profile.googleId,
    );
    if (!hasGoogle) {
      await User.updateOne(
        { _id: user._id },
        {
          $push: {
            oauthProviders: { provider: "google", uid: profile.googleId },
          },
        },
      );
    }
    if (profile.avatarUrl && !user.avatarUrl) {
      user.avatarUrl = profile.avatarUrl;
    }
    user.lastLoginAt = new Date();
    await user.save();
    user = await User.findById(user._id);
    if (!user) throw new AuthError(500, "Lỗi tải lại người dùng.");
  } else {
    user = await User.create({
      email,
      displayName: profile.displayName,
      avatarUrl: profile.avatarUrl,
      role: "user",
      level: 1,
      subscription: { status: "free" },
      oauthProviders: [{ provider: "google", uid: profile.googleId }],
    });
  }

  const accessToken = signAccessToken({
    sub: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  return { accessToken, user: toAuthUser(user) };
}
