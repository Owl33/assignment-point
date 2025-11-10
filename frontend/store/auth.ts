import { create } from "zustand";
import { jwtDecode } from "jwt-decode";
import { api, registerTokenManager, type AuthAxiosRequestConfig } from "@/lib/http";
import { clearTokens, loadTokens, saveTokens } from "@/lib/secureStore";

type AuthStatus = "idle" | "authenticating" | "authenticated" | "guest";

interface UserProfile {
  id: number;
  email: string;
  name: string;
}

interface Credentials {
  email: string;
  password: string;
}

interface AuthState {
  status: AuthStatus;
  accessToken: string | null;
  accessTokenExpiresAt: number | null;
  refreshTokenExpiresAt: number | null;
  sessionExpiresAt: number | null;
  user: UserProfile | null;
  login: (credentials: Credentials) => Promise<boolean>;
  restoreSession: () => Promise<boolean>;
  refreshSession: () => Promise<boolean>;
  logout: () => Promise<void>;
  getAccessToken: () => string | null;
}

type AuthResponse = {
  user: UserProfile;
  accessToken: string;
  refreshToken: string;
  sessionExpiresAt: string | null;
};

type JwtPayload = {
  exp?: number;
};

const REFRESH_MARGIN_MS = 5_000;
let accessRefreshTimer: ReturnType<typeof setTimeout> | null = null;
let refreshExpiryTimer: ReturnType<typeof setTimeout> | null = null;
let sessionExpiryTimer: ReturnType<typeof setTimeout> | null = null;

function getExpiration(token: string | null | undefined) {
  if (!token) {
    return null;
  }
  try {
    const payload = jwtDecode<JwtPayload>(token);
    return payload.exp ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

function deriveTokenMeta(
  accessToken: string | null,
  refreshToken: string | null,
  sessionExpiresAt?: string | null
) {
  return {
    accessTokenExpiresAt: getExpiration(accessToken),
    refreshTokenExpiresAt: getExpiration(refreshToken),
    sessionExpiresAt: getTimestamp(sessionExpiresAt),
  };
}

function getTimestamp(value: string | null | undefined) {
  if (!value) {
    return null;
  }
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function clearSessionTimers() {
  if (accessRefreshTimer) {
    clearTimeout(accessRefreshTimer);
    accessRefreshTimer = null;
  }
  if (refreshExpiryTimer) {
    clearTimeout(refreshExpiryTimer);
    refreshExpiryTimer = null;
  }
  if (sessionExpiryTimer) {
    clearTimeout(sessionExpiryTimer);
    sessionExpiryTimer = null;
  }
}

function scheduleSessionTimers(get: () => AuthState) {
  clearSessionTimers();
  const { status, accessTokenExpiresAt, refreshTokenExpiresAt, sessionExpiresAt } = get();
  if (status !== "authenticated") {
    return;
  }

  if (accessTokenExpiresAt) {
    const delay = Math.max(0, accessTokenExpiresAt - Date.now() - REFRESH_MARGIN_MS);
    accessRefreshTimer = setTimeout(() => {
      const state = get();
      if (state.status === "authenticated") {
        state.refreshSession();
      }
    }, delay);
  }

  if (refreshTokenExpiresAt) {
    const delay = Math.max(0, refreshTokenExpiresAt - Date.now());
    refreshExpiryTimer = setTimeout(() => {
      get().logout();
    }, delay);
  }

  if (sessionExpiresAt) {
    const delay = Math.max(0, sessionExpiresAt - Date.now());
    sessionExpiryTimer = setTimeout(() => {
      get().logout();
    }, delay);
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  status: "idle",
  accessToken: null,
  accessTokenExpiresAt: null,
  refreshTokenExpiresAt: null,
  sessionExpiresAt: null,
  user: null,

  async login(credentials) {
    set({ status: "authenticating" });
    try {
      const loginConfig: AuthAxiosRequestConfig = { skipAutoRefresh: true };
      const { data } = await api.post<AuthResponse>("/auth/login", credentials, loginConfig);
      await saveTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        sessionExpiresAt: data.sessionExpiresAt,
      });
      const meta = deriveTokenMeta(data.accessToken, data.refreshToken, data.sessionExpiresAt);
      set({
        accessToken: data.accessToken,
        user: data.user,
        status: "authenticated",
        ...meta,
      });
      scheduleSessionTimers(get);
      return true;
    } catch (error) {
      set({
        status: "guest",
        accessToken: null,
        user: null,
        accessTokenExpiresAt: null,
        refreshTokenExpiresAt: null,
        sessionExpiresAt: null,
      });
      clearSessionTimers();
      throw error;
    }
  },

  async restoreSession() {
    const tokens = await loadTokens();
    if (!tokens?.refreshToken) {
      set({
        status: "guest",
        accessToken: null,
        user: null,
        accessTokenExpiresAt: null,
        refreshTokenExpiresAt: null,
        sessionExpiresAt: null,
      });
      clearSessionTimers();
      return false;
    }

    if (tokens.accessToken) {
      const meta = deriveTokenMeta(
        tokens.accessToken,
        tokens.refreshToken ?? null,
        tokens.sessionExpiresAt ?? null
      );
      set({
        accessToken: tokens.accessToken,
        status: "authenticating",
        ...meta,
      });
    } else {
      const meta = deriveTokenMeta(
        null,
        tokens.refreshToken ?? null,
        tokens.sessionExpiresAt ?? null
      );
      set({
        accessToken: null,
        status: "authenticating",
        ...meta,
      });
    }

    const refreshed = await get().refreshSession();
    if (!refreshed) {
      set({
        status: "guest",
        accessToken: null,
        user: null,
        accessTokenExpiresAt: null,
        refreshTokenExpiresAt: null,
        sessionExpiresAt: null,
      });
      clearSessionTimers();
    }
    return refreshed;
  },

  async refreshSession() {
    const tokens = await loadTokens();
    if (!tokens?.refreshToken) {
      return false;
    }

    try {
      const refreshConfig: AuthAxiosRequestConfig = { skipAutoRefresh: true };
      const { data } = await api.post<AuthResponse>(
        "/auth/refresh",
        { refreshToken: tokens.refreshToken },
        refreshConfig
      );
      await saveTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        sessionExpiresAt: data.sessionExpiresAt,
      });
      const meta = deriveTokenMeta(data.accessToken, data.refreshToken, data.sessionExpiresAt);
      set({
        accessToken: data.accessToken,
        user: data.user,
        status: "authenticated",
        ...meta,
      });
      scheduleSessionTimers(get);
      return true;
    } catch (error) {
      await clearTokens();
      set({
        accessToken: null,
        user: null,
        status: "guest",
        accessTokenExpiresAt: null,
        refreshTokenExpiresAt: null,
        sessionExpiresAt: null,
      });
      clearSessionTimers();
      return false;
    }
  },

  async logout() {
    const tokens = await loadTokens();
    if (tokens?.refreshToken) {
      try {
        const logoutConfig: AuthAxiosRequestConfig = { skipAutoRefresh: true };
        await api.post("/auth/logout", { refreshToken: tokens.refreshToken }, logoutConfig);
      } catch {
        // 서버 응답 실패 시에도 로컬 세션만 지우면 된다.
      }
    }

    await clearTokens();
    set({
      accessToken: null,
      user: null,
      status: "guest",
      accessTokenExpiresAt: null,
      refreshTokenExpiresAt: null,
      sessionExpiresAt: null,
    });
    clearSessionTimers();
  },

  getAccessToken() {
    return get().accessToken;
  },
}));

registerTokenManager({
  getAccessToken: () => useAuthStore.getState().getAccessToken(),
  refreshSession: () => useAuthStore.getState().refreshSession(),
  logout: () => useAuthStore.getState().logout(),
});
