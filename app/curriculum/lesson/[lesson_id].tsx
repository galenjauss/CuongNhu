import React from 'react';
import { Image, ScrollView, Text } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Stack, useLocalSearchParams } from 'expo-router';
import { listLessons } from '../../../src/api/curriculum';
import { Loading } from '../../../src/components/Loading';
import { ErrorView } from '../../../src/components/ErrorView';
import { useAuthGuard } from '../../../src/hooks/useAuthGuard';

const LessonScreen = () => {
  useAuthGuard();
  const params = useLocalSearchParams<{ lesson_id: string; curriculum: string }>();
  const lessonId = params.lesson_id;
  const curriculumId = params.curriculum;
  const { data, isLoading, error } = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: async () => {
      const lessons = await listLessons(curriculumId);
      return lessons.find((l) => l.id === lessonId) ?? null;
    },
    enabled: Boolean(lessonId && curriculumId),
  });

  if (isLoading) {
    return <Loading />;
  }
  if (error || !data) {
    return <ErrorView error={error ?? new Error('Lesson missing')} />;
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Stack.Screen options={{ title: data.title }} />
      <Text style={{ marginBottom: 16 }}>{data.content_md}</Text>
      {data.media_urls?.map((url) => (
        <Image key={url} source={{ uri: url }} style={{ width: '100%', height: 200, marginBottom: 12 }} />
      ))}
    </ScrollView>
  );
};

export default LessonScreen;
