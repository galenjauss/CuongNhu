import React from 'react';
import { ScrollView, Text } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Stack, useLocalSearchParams } from 'expo-router';
import { getJournalEntry } from '../../../src/api/journal';
import { Loading } from '../../../src/components/Loading';
import { ErrorView } from '../../../src/components/ErrorView';
import { useAuthGuard } from '../../../src/hooks/useAuthGuard';

const JournalEntryScreen = () => {
  useAuthGuard();
  const params = useLocalSearchParams<{ entry_id: string }>();
  const { data, isLoading, error } = useQuery({
    queryKey: ['journal', params.entry_id],
    queryFn: () => getJournalEntry(params.entry_id),
    enabled: Boolean(params.entry_id),
  });

  if (isLoading) {
    return <Loading />;
  }
  if (error || !data) {
    return <ErrorView error={error ?? new Error('Entry missing')} />;
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Stack.Screen options={{ title: data.title ?? 'Entry' }} />
      <Text style={{ marginBottom: 8 }}>Mood: {data.mood ?? 'Unknown'}</Text>
      <Text>{data.content_md}</Text>
    </ScrollView>
  );
};

export default JournalEntryScreen;
