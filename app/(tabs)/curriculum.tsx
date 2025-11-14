import React from 'react';
import { Button, FlatList, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { listCurricula } from '../../src/api/curriculum';
import { Loading } from '../../src/components/Loading';
import { ErrorView } from '../../src/components/ErrorView';
import { Empty } from '../../src/components/Empty';

const CurriculumScreen = () => {
  const router = useRouter();
  const { data, isLoading, error } = useQuery({ queryKey: ['curricula'], queryFn: listCurricula });

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <ErrorView error={error} />;
  }

  const curricula = data ?? [];

  if (!curricula.length) {
    return <Empty message="No curriculum yet." />;
  }

  return (
    <FlatList
      contentContainerStyle={{ padding: 16 }}
      data={curricula}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={{ borderWidth: 1, borderColor: '#eee', padding: 12, borderRadius: 8, marginBottom: 12 }}>
          <Text style={{ fontWeight: '700', fontSize: 16 }}>{item.title}</Text>
          <Text style={{ marginVertical: 8 }}>{item.description}</Text>
          <Button title="View lessons" onPress={() => router.push(`/curriculum/${item.id}`)} />
        </View>
      )}
    />
  );
};

export default CurriculumScreen;
