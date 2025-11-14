import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../src/lib/queryClient';
import { useAuthStore } from '../src/state/authStore';
import { Loading } from '../src/components/Loading';

const RootLayout = () => {
  const bootstrap = useAuthStore((state) => state.bootstrap);
  const status = useAuthStore((state) => state.status);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  if (status === 'loading') {
    return <Loading />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }} />
    </QueryClientProvider>
  );
};

export default RootLayout;
