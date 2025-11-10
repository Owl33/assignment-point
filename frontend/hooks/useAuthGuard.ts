import { useCallback, useEffect } from 'react';
import { useFocusEffect, useRouter, type Href } from 'expo-router';
import { useAuthStore } from '@/store/auth';

const SIGN_IN_ROUTE: Href = '/(tabs)/(auth)/sign-in';

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
      router.navigate(SIGN_IN_ROUTE);
    }
  }, [router, status]);

  useFocusEffect(
    useCallback(() => {
      if (status === 'guest') {
        router.navigate(SIGN_IN_ROUTE);
      }
    }, [router, status]),
  );

  return status;
}
