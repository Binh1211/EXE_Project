export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role?: "admin" | "user";
  level?: 1 | 2 | 3;
};

export type AuthResponse = {
  accessToken: string;
  user: AuthUser;
};

export type MessageResponse = {
  message: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  fullName: string;
  email: string;
  password: string;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ResetPasswordRequest = {
  token: string;
  password: string;
};

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};

export type UpdateProfileRequest = {
  fullName?: string;
  avatarUrl?: string;
};

export type GoogleAuthMode = "login" | "register";
