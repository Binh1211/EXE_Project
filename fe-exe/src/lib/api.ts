import axios, { AxiosError, type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { getAccessToken, setAccessToken, refreshAccessToken } from './auth';

/**
 * Axios instance that attaches access token and refreshes it on 401.
 * Note: This is FE-only refresh flow (refresh token stored in localStorage).
 */

const api: AxiosInstance = axios.create({ baseURL: '/api' });

api.interceptors.request.use((cfg: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token && cfg && cfg.headers) {
    (cfg.headers as any)['Authorization'] = `Bearer ${token}`;
  }
  return cfg;
});

let isRefreshing = false;
let subscribers: Array<(token: string | null) => void> = [];

function onRefreshed(token: string | null) {
  subscribers.forEach(cb => cb(token));
  subscribers = [];
}

function addSubscriber(cb: (token: string | null) => void) {
  subscribers.push(cb);
}

api.interceptors.response.use(
  (r: AxiosResponse) => r,
  async (error: AxiosError) => {
    const originalRequest = (error.config || {}) as any;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newToken = await refreshAccessToken();
          setAccessToken(newToken);
          isRefreshing = false;
          onRefreshed(newToken);
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch (e) {
          isRefreshing = false;
          onRefreshed(null);
          window.location.href = '/login';
          return Promise.reject(e);
        }
      }

      return new Promise((resolve, reject) => {
        addSubscriber((token) => {
          if (!token) return reject(new Error('No token'));
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          resolve(api(originalRequest));
        });
      });
    }
    return Promise.reject(error);
  }
);

export default api;
