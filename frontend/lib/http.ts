import axios, { AxiosError, AxiosRequestConfig, type AxiosRequestHeaders } from 'axios';

const baseURL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080';

export const api = axios.create({
  baseURL,
  timeout: 10000,
});

export type AuthAxiosRequestConfig<D = unknown> = AxiosRequestConfig<D> & {
  skipAutoRefresh?: boolean;
};

type TokenManager = {
  getAccessToken: () => string | null;
  refreshSession: () => Promise<boolean>;
  logout: () => Promise<void>;
};

interface RetriableConfig extends AuthAxiosRequestConfig {
  _didRetry?: boolean;
}

let tokenManager: TokenManager | null = null;

export function registerTokenManager(manager: TokenManager) {
  tokenManager = manager;
}

api.interceptors.request.use((config) => {
  if (tokenManager) {
    const token = tokenManager.getAccessToken();
    if (token) {
      const headers: AxiosRequestHeaders = (config.headers ?? {}) as AxiosRequestHeaders;
      headers.Authorization = `Bearer ${token}`;
      config.headers = headers;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const originalRequest = error.config as RetriableConfig | undefined;

    if (
      status === 401 &&
      tokenManager &&
      originalRequest &&
      !originalRequest._didRetry &&
      !originalRequest.skipAutoRefresh
    ) {
      originalRequest._didRetry = true;
      const refreshed = await tokenManager.refreshSession();
      if (refreshed) {
        return api(originalRequest);
      }
      await tokenManager.logout();
    }

    return Promise.reject(error);
  },
);
