import React, { useState } from 'react';
import { Alert, Button, FlatList, Text, TextInput, View } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteTrainingLog, listTrainingLogs, summarizeTraining, upsertTrainingLog } from '../../src/api/training';
import { deleteTeachingLog, listTeachingLogs, upsertTeachingLog } from '../../src/api/teaching';
import { Loading } from '../../src/components/Loading';
import { ErrorView } from '../../src/components/ErrorView';

const LogScreen = () => {
  const [mode, setMode] = useState<'training' | 'teaching'>('training');
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState('60');
  const [focus, setFocus] = useState('');
  const queryClient = useQueryClient();

  const trainingQuery = useQuery({ queryKey: ['training_logs'], queryFn: listTrainingLogs });
  const teachingQuery = useQuery({ queryKey: ['teaching_logs'], queryFn: listTeachingLogs });

  const saveTraining = useMutation({
    mutationFn: () =>
      upsertTrainingLog({
        date: date || new Date().toISOString().slice(0, 10),
        duration_min: Number(duration),
        focus,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training_logs'] });
      setFocus('');
    },
    onError: (error) => Alert.alert('Error', error instanceof Error ? error.message : String(error)),
  });

  const saveTeaching = useMutation({
    mutationFn: () =>
      upsertTeachingLog({
        date: date || new Date().toISOString().slice(0, 10),
        duration_min: Number(duration),
        topic: focus,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teaching_logs'] });
      setFocus('');
    },
    onError: (error) => Alert.alert('Error', error instanceof Error ? error.message : String(error)),
  });

  const deleteTraining = useMutation({
    mutationFn: (id: string) => deleteTrainingLog(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['training_logs'] }),
  });

  const deleteTeaching = useMutation({
    mutationFn: (id: string) => deleteTeachingLog(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['teaching_logs'] }),
  });

  if (trainingQuery.isLoading || teachingQuery.isLoading) {
    return <Loading />;
  }
  if (trainingQuery.error || teachingQuery.error) {
    return <ErrorView error={trainingQuery.error ?? teachingQuery.error} />;
  }

  const logs = mode === 'training' ? trainingQuery.data ?? [] : teachingQuery.data ?? [];
  const summary = summarizeTraining(trainingQuery.data ?? []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <View style={{ flexDirection: 'row', marginBottom: 12, gap: 8 }}>
        <Button title="Training" onPress={() => setMode('training')} color={mode === 'training' ? 'blue' : undefined} />
        <Button title="Teaching" onPress={() => setMode('teaching')} color={mode === 'teaching' ? 'blue' : undefined} />
      </View>
      <TextInput placeholder="Date (YYYY-MM-DD)" value={date} onChangeText={setDate} style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 8 }} />
      <TextInput placeholder="Duration in minutes" value={duration} onChangeText={setDuration} keyboardType="numeric" style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 8 }} />
      <TextInput placeholder={mode === 'training' ? 'Focus' : 'Topic'} value={focus} onChangeText={setFocus} style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 8 }} />
      <Button
        title="Save"
        onPress={() => (mode === 'training' ? saveTraining.mutate() : saveTeaching.mutate())}
      />
      <FlatList
        style={{ marginTop: 16 }}
        data={logs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ borderBottomWidth: 1, borderColor: '#eee', paddingVertical: 8 }}>
            <Text>
              {item.date} · {item.duration_min ?? 0} min · {mode === 'training' ? item.focus : item.topic}
            </Text>
            <Button
              title="Delete"
              onPress={() => (mode === 'training' ? deleteTraining.mutate(item.id) : deleteTeaching.mutate(item.id))}
            />
          </View>
        )}
      />
      <View style={{ marginTop: 16 }}>
        <Text style={{ fontWeight: '700' }}>Monthly summary</Text>
        {summary.map((item) => (
          <Text key={item.month}>
            {item.month}: {item.minutes} minutes
          </Text>
        ))}
      </View>
    </View>
  );
};

export default LogScreen;
