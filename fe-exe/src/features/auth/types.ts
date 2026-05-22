export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
};

export type AuthResponse = {
  accessToken: string;
  user: AuthUser;
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

export type GoogleAuthMode = "login" | "register";
