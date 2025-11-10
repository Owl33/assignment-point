import * as SecureStore from 'expo-secure-store';

type TokenBundle = {
  accessToken: string;
  refreshToken: string;
  sessionExpiresAt?: string | null;
};

const ACCESS_TOKEN_KEY = 'assignment-point/access';
const REFRESH_TOKEN_KEY = 'assignment-point/refresh';
const SESSION_EXPIRES_KEY = 'assignment-point/session-expires';
const memoryStore: Record<string, string | null> = {};

async function isSecureStoreAvailable() {
  try {
    return await SecureStore.isAvailableAsync();
  } catch {
    return false;
  }
}

async function setItem(key: string, value: string | null) {
  if (value == null) {
    return removeItem(key);
  }

  if (await isSecureStoreAvailable()) {
    await SecureStore.setItemAsync(key, value);
  } else if (typeof window !== 'undefined') {
    window.localStorage.setItem(key, value);
  } else {
    memoryStore[key] = value;
  }
}

async function getItem(key: string) {
  if (await isSecureStoreAvailable()) {
    return SecureStore.getItemAsync(key);
  }
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem(key);
  }
  return memoryStore[key] ?? null;
}

async function removeItem(key: string) {
  if (await isSecureStoreAvailable()) {
    await SecureStore.deleteItemAsync(key);
  } else if (typeof window !== 'undefined') {
    window.localStorage.removeItem(key);
  }
  memoryStore[key] = null;
}

export async function saveTokens(tokens: TokenBundle) {
  await Promise.all([
    setItem(ACCESS_TOKEN_KEY, tokens.accessToken),
    setItem(REFRESH_TOKEN_KEY, tokens.refreshToken),
    setItem(SESSION_EXPIRES_KEY, tokens.sessionExpiresAt ?? null),
  ]);
}

export async function loadTokens() {
  const [accessToken, refreshToken, sessionExpiresAt] = await Promise.all([
    getItem(ACCESS_TOKEN_KEY),
    getItem(REFRESH_TOKEN_KEY),
    getItem(SESSION_EXPIRES_KEY),
  ]);

  if (!accessToken && !refreshToken) {
    return null;
  }

  return { accessToken, refreshToken, sessionExpiresAt };
}

export async function clearTokens() {
  await Promise.all([
    removeItem(ACCESS_TOKEN_KEY),
    removeItem(REFRESH_TOKEN_KEY),
    removeItem(SESSION_EXPIRES_KEY),
  ]);
}
