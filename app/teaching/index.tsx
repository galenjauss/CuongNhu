import React, { useState } from 'react';
import { Alert, Button, FlatList, Text, TextInput, View } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Stack, useRouter } from 'expo-router';
import { deleteTeachingLog, listTeachingLogs, upsertTeachingLog } from '../../src/api/teaching';
import { Loading } from '../../src/components/Loading';
import { ErrorView } from '../../src/components/ErrorView';
import { useAuthGuard } from '../../src/hooks/useAuthGuard';

const TeachingScreen = () => {
  useAuthGuard();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [topic, setTopic] = useState('');
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState('60');
  const { data, isLoading, error } = useQuery({ queryKey: ['teaching_logs'], queryFn: listTeachingLogs });

  const saveMutation = useMutation({
    mutationFn: () =>
      upsertTeachingLog({
        topic,
        date: date || new Date().toISOString().slice(0, 10),
        duration_min: Number(duration),
      }),
    onSuccess: () => {
      setTopic('');
      queryClient.invalidateQueries({ queryKey: ['teaching_logs'] });
    },
    onError: (err) => Alert.alert('Error', err instanceof Error ? err.message : String(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTeachingLog(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['teaching_logs'] }),
  });

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <ErrorView error={error} />;
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Stack.Screen options={{ title: 'Teaching Logs' }} />
      <TextInput placeholder="Topic" value={topic} onChangeText={setTopic} style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 8 }} />
      <TextInput placeholder="Date (YYYY-MM-DD)" value={date} onChangeText={setDate} style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 8 }} />
      <TextInput placeholder="Duration" value={duration} onChangeText={setDuration} keyboardType="numeric" style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 8 }} />
      <Button title="Save" onPress={() => saveMutation.mutate()} />
      <FlatList
        style={{ marginTop: 16 }}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ borderBottomWidth: 1, borderColor: '#eee', paddingVertical: 8 }}>
            <Text>
              {item.date} · {item.duration_min ?? 0} min · {item.topic}
            </Text>
            <Button title="Open" onPress={() => router.push(`/teaching/session/${item.id}`)} />
            <Button title="Delete" onPress={() => deleteMutation.mutate(item.id)} />
          </View>
        )}
      />
    </View>
  );
};

export default TeachingScreen;
