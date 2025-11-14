import React, { useState } from 'react';
import { Alert, Button, FlatList, Text, TextInput, View } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Stack, useRouter } from 'expo-router';
import { deleteJournalEntry, listJournalEntries, upsertJournalEntry } from '../../src/api/journal';
import { Loading } from '../../src/components/Loading';
import { ErrorView } from '../../src/components/ErrorView';
import { useAuthGuard } from '../../src/hooks/useAuthGuard';

const JournalScreen = () => {
  useAuthGuard();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { data, isLoading, error } = useQuery({ queryKey: ['journal'], queryFn: listJournalEntries });

  const saveMutation = useMutation({
    mutationFn: () => upsertJournalEntry({ title, content_md: content }),
    onSuccess: () => {
      setTitle('');
      setContent('');
      queryClient.invalidateQueries({ queryKey: ['journal'] });
    },
    onError: (err) => Alert.alert('Error', err instanceof Error ? err.message : String(err)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteJournalEntry(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['journal'] }),
  });

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <ErrorView error={error} />;
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Stack.Screen options={{ title: 'Journal' }} />
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 8 }} />
      <TextInput placeholder="Content" value={content} onChangeText={setContent} multiline style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, height: 120, marginBottom: 8 }} />
      <Button title="Save" onPress={() => saveMutation.mutate()} />
      <FlatList
        style={{ marginTop: 16 }}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ borderBottomWidth: 1, borderColor: '#eee', paddingVertical: 8 }}>
            <Text style={{ fontWeight: '700' }}>{item.title}</Text>
            <Button title="Open" onPress={() => router.push(`/journal/entry/${item.id}`)} />
            <Button title="Delete" onPress={() => deleteMutation.mutate(item.id)} />
          </View>
        )}
      />
    </View>
  );
};

export default JournalScreen;
