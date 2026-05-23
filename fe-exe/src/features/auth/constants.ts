export const AUTH_STORAGE_KEYS = {
  accessToken: "access_token",
  user: "auth_user",
} as const;

export const AUTH_ROUTES = {
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  resetPassword: "/forgot-password/reset",
  profile: "/profile",
  changePassword: "/profile/change-password",
  googleCallback: "/auth/google/callback",
} as const;

export const authFieldClass = "flex flex-col gap-1";
export const authLabelClass = "text-xs leading-none text-gray-500";
export const authInputClass =
  "w-full rounded-xl border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-[#5f3713] focus:bg-white disabled:opacity-60";
export const authPrimaryBtnClass =
  "w-full rounded-xl bg-[#5f3713] py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#4d2c0f] disabled:opacity-70";
export const authSecondaryBtnClass =
  "w-full rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-70";
