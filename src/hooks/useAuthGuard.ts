import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '../state/authStore';

export const useAuthGuard = () => {
  const router = useRouter();
  const segments = useSegments();
  const { session, status } = useAuthStore();

  useEffect(() => {
    if (status === 'loading') return;
    const inAuthGroup = segments[0] === '(auth)';
    if (!session && !inAuthGroup) {
      router.replace('/(auth)/sign-in');
    }
    if (session && inAuthGroup) {
      router.replace('/(tabs)/home');
    }
  }, [session, segments, router, status]);
};
