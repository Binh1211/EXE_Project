export const API_BASE_URL =
  // In production serve API from the same origin (Vercel serverless proxy). In dev, default to localhost backend.
  (import.meta.env.PROD ? '' : (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'));

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NetworkError";
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

  // Don't set Content-Type for FormData, let the browser handle it
  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  const token = localStorage.getItem("access_token");
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
      credentials: (options as any).credentials ?? "include",
    });
  } catch {
    throw new NetworkError(
      `Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng của bạn và thử lại.`,);
  }

  const text = await response.text();
  let data: T | ApiErrorBody | null = null;
  if (text) {
    try {
      data = JSON.parse(text) as T | ApiErrorBody;
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    // Try refresh once on 401
    if (response.status === 401) {
      try {
        const refreshRes = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });
        if (refreshRes.ok) {
          const body = await refreshRes.json().catch(() => null) as any;
          if (body?.accessToken) {
            localStorage.setItem("access_token", body.accessToken);
            // retry original request with new token
            const retryHeaders = new Headers(options.headers);
            if (
              options.body &&
              !(options.body instanceof FormData) &&
              !retryHeaders.has("Content-Type")
            ) {
              retryHeaders.set("Content-Type", "application/json");
            }
            retryHeaders.set("Authorization", `Bearer ${body.accessToken}`);
            const retryResp = await fetch(`${API_BASE_URL}${path}`, {
              ...options,
              headers: retryHeaders,
              credentials: (options as any).credentials ?? "include",
            });
            const retryText = await retryResp.text();
            let retryData: T | ApiErrorBody | null = null;
            if (retryText) {
              try {
                retryData = JSON.parse(retryText) as T | ApiErrorBody;
              } catch {
                retryData = null;
              }
            }
            if (!retryResp.ok) {
              const message = (retryData as ApiErrorBody | null)?.message ?? retryResp.statusText ?? "Đã có lỗi xảy ra.";
              throw new ApiError(retryResp.status, message);
            }
            return (retryResp.status === 204 || retryData === null) ? (undefined as unknown as T) : (retryData as T);
          }
        }
      } catch (e) {
        // ignore and fallthrough to original error
      }
    }

    const message =
      (data as ApiErrorBody | null)?.message ??
      response.statusText ??
      "Đã có lỗi xảy ra.";
    throw new ApiError(response.status, message);
  }

  if (response.status === 204 || data === null) {
    return undefined as T;
  }

  return data as T;
}

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof NetworkError || error instanceof ApiError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Đã có lỗi xảy ra. Vui lòng thử lại.";
}
