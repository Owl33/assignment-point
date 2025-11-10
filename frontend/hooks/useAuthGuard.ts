import { useCallback, useEffect } from 'react';
import { useFocusEffect, useRouter, type Href } from 'expo-router';
import { useAuthStore } from '@/store/auth';


export function useAuthGuard() {
  const router = useRouter();
  const status = useAuthStore((state) => state.status);
  const restoreSession = useAuthStore((state) => state.restoreSession);

  useEffect(() => {
    if (status === 'idle') {
      restoreSession();
    }
  }, [restoreSession, status]);

  useEffect(() => {
    if (status === 'guest') {
      router.replace("/(tabs)/(auth)/sign-in");
    }
  }, [router, status]);

  useFocusEffect(
    useCallback(() => {
      if (status === 'guest') {
        router.replace("/(tabs)/(auth)/sign-in");
      }
    }, [router, status]),
  );

  return status;
}
