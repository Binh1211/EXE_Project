import type { IUser } from "../models/User.js";

/** Map DB user → format FE đang dùng */
export function toAuthUser(user: IUser) {
  return {
    id: user._id.toString(),
    email: user.email,
    fullName: user.displayName,
    avatarUrl: user.avatarUrl ?? undefined,
    role: user.role,
    level: user.level,
  };
}
