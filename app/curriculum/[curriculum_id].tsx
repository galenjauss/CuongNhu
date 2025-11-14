import React from 'react';
import { Button, ScrollView, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { getCurriculum } from '../../src/api/curriculum';
import { Loading } from '../../src/components/Loading';
import { ErrorView } from '../../src/components/ErrorView';
import { useAuthGuard } from '../../src/hooks/useAuthGuard';

const CurriculumDetailScreen = () => {
  useAuthGuard();
  const params = useLocalSearchParams<{ curriculum_id: string }>();
  const router = useRouter();
  const { data, isLoading, error } = useQuery({
    queryKey: ['curriculum', params.curriculum_id],
    queryFn: () => getCurriculum(params.curriculum_id),
    enabled: Boolean(params.curriculum_id),
  });

  if (isLoading) {
    return <Loading />;
  }
  if (error || !data) {
    return <ErrorView error={error ?? new Error('Curriculum missing')} />;
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Stack.Screen options={{ title: data.title }} />
      <Text style={{ marginBottom: 16 }}>{data.description}</Text>
      {data.lessons.map((lesson) => (
        <View key={lesson.id} style={{ borderWidth: 1, borderColor: '#eee', padding: 12, marginBottom: 12 }}>
          <Text style={{ fontWeight: '700' }}>{lesson.title}</Text>
          <Button
            title="Open"
            onPress={() =>
              router.push({
                pathname: `/curriculum/lesson/${lesson.id}`,
                params: { curriculum: data.id },
              })
            }
          />
        </View>
      ))}
    </ScrollView>
  );
};

export default CurriculumDetailScreen;
