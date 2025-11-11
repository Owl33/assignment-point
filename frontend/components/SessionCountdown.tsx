import { useAuthStore } from "@/store/auth";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { Text } from "react-native";
import { Box } from "./ui/box";

type Remaining = {
  access: number | null;
  refresh: number | null;
  session: number | null;
};

export function SessionCountdown() {
  const status = useAuthStore((state) => state.status);
  const accessExpiresAt = useAuthStore((state) => state.accessTokenExpiresAt);
  const refreshExpiresAt = useAuthStore((state) => state.refreshTokenExpiresAt);
  const sessionExpiresAt = useAuthStore((state) => state.sessionExpiresAt);
  const now = useSharedNowTicker(status === "authenticated");

  if (status !== "authenticated") {
    return null;
  }

  const remaining: Remaining = {
    access: calcRemaining(accessExpiresAt, now),
    refresh: calcRemaining(refreshExpiresAt, now),
    session: calcRemaining(sessionExpiresAt, now),
  };

  return (
    <Box className="flex-row gap-4">
      <Text>액세스 {remaining.access}초</Text>
      <Text>리프레쉬 {remaining.refresh}초</Text>
      <Text>세션 {remaining.session}초</Text>
    </Box>
  );
}

function calcRemaining(expiresAt: number | null, now: number) {
  if (!expiresAt) {
    return null;
  }
  return Math.max(0, Math.floor((expiresAt - now) / 1000));
}

type NowListener = Dispatch<SetStateAction<number>>;
const nowListeners = new Set<NowListener>();
let nowInterval: ReturnType<typeof setInterval> | null = null;

function subscribeNow(listener: NowListener) {
  nowListeners.add(listener);
  if (!nowInterval) {
    nowInterval = setInterval(() => {
      const current = Date.now();
      nowListeners.forEach((notify) => notify(current));
    }, 1000);
  }
  return () => {
    nowListeners.delete(listener);
    if (nowListeners.size === 0 && nowInterval) {
      clearInterval(nowInterval);
      nowInterval = null;
    }
  };
}

function useSharedNowTicker(active: boolean) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!active) {
      return;
    }

    setNow(Date.now());
    return subscribeNow(setNow);
  }, [active]);

  return now;
}
