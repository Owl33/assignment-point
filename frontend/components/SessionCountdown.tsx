import { useAuthStore } from "@/store/auth";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
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
  const [remaining, setRemaining] = useState<Remaining>({
    access: null,
    refresh: null,
    session: null,
  });

  useEffect(() => {
    if (status !== "authenticated") {
      setRemaining({ access: null, refresh: null, session: null });
      return;
    }

    const tick = () => {
      setRemaining({
        access: calcRemaining(accessExpiresAt),
        refresh: calcRemaining(refreshExpiresAt),
        session: calcRemaining(sessionExpiresAt),
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [accessExpiresAt, refreshExpiresAt, sessionExpiresAt, status]);

  if (status !== "authenticated") {
    return null;
  }


  return (
    <Box className="flex-row gap-4">
      <Text>액세스 {remaining.access}초</Text>
      <Text>리프레쉬 {remaining.refresh}초</Text>
      <Text>세션 {remaining.session}초</Text>
    </Box>
  );
}

function calcRemaining(expiresAt: number | null) {
  if (!expiresAt) {
    return null;
  }
  return Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
}
