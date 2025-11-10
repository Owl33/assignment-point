import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

export type StoredUser = {
  id: number;
  email: string;
  password: string;
  name: string;
  refreshTokenHash?: string | null;
  sessionStartedAt?: string | null;
};

export type BalanceEntry = {
  userId: number;
  amount: number;
};

export type HistoryEntry = {
  userId: number;
  type: 'earn';
  amount: number;
  description: string;
  createdAt: string;
};

export type DataStoreShape = {
  users: StoredUser[];
  balances: BalanceEntry[];
  history: HistoryEntry[];
};

const dataPath = path.resolve(process.cwd(), 'data/points.json');
let cache: DataStoreShape | null = null;

function ensureCache() {
  if (!cache) {
    const file = readFileSync(dataPath, 'utf8');
    cache = JSON.parse(file) as DataStoreShape;
  }
  return cache;
}

export function getStore() {
  return ensureCache();
}

export function saveStore() {
  if (!cache) {
    return;
  }
  writeFileSync(dataPath, JSON.stringify(cache, null, 2), 'utf8');
}

export function reloadStore() {
  cache = null;
  return ensureCache();
}
