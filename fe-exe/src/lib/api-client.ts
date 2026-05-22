export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type ApiErrorBody = {
  message?: string;
};

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const token = localStorage.getItem("access_token");
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = (await response.json().catch(() => null)) as
    | T
    | ApiErrorBody
    | null;

  if (!response.ok) {
    const message =
      (data as ApiErrorBody | null)?.message ??
      response.statusText ??
      "Đã có lỗi xảy ra.";
    throw new ApiError(response.status, message);
  }

  return data as T;
}
