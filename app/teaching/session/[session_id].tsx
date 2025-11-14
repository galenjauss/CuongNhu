import React from 'react';
import { ScrollView, Text } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Stack, useLocalSearchParams } from 'expo-router';
import { listTeachingLogs } from '../../../src/api/teaching';
import { Loading } from '../../../src/components/Loading';
import { ErrorView } from '../../../src/components/ErrorView';
import { useAuthGuard } from '../../../src/hooks/useAuthGuard';

const TeachingSessionScreen = () => {
  useAuthGuard();
  const params = useLocalSearchParams<{ session_id: string }>();
  const { data, isLoading, error } = useQuery({
    queryKey: ['teaching', params.session_id],
    queryFn: async () => {
      const logs = await listTeachingLogs();
      return logs.find((log) => log.id === params.session_id) ?? null;
    },
    enabled: Boolean(params.session_id),
  });

  if (isLoading) {
    return <Loading />;
  }
  if (error || !data) {
    return <ErrorView error={error ?? new Error('Session missing')} />;
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Stack.Screen options={{ title: data.topic ?? 'Teaching Session' }} />
      <Text>Date: {data.date}</Text>
      <Text>Duration: {data.duration_min ?? 0} minutes</Text>
      <Text style={{ marginTop: 12 }}>{data.notes}</Text>
    </ScrollView>
  );
};

export default TeachingSessionScreen;
