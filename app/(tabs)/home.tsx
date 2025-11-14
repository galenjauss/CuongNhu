import React, { useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getMyProfile } from '../../src/api/profile';
import { listTrainingLogs } from '../../src/api/training';
import { listCurricula } from '../../src/api/curriculum';
import { listFeed } from '../../src/api/posts';
import { globalSearch } from '../../src/api/search';
import { Empty } from '../../src/components/Empty';
import { ErrorView } from '../../src/components/ErrorView';
import { Loading } from '../../src/components/Loading';

const HomeScreen = () => {
  const [search, setSearch] = useState('');
  const profileQuery = useQuery({ queryKey: ['profile'], queryFn: getMyProfile });
  const logsQuery = useQuery({ queryKey: ['training_logs'], queryFn: listTrainingLogs });
  const curriculaQuery = useQuery({ queryKey: ['curricula'], queryFn: listCurricula });
  const feedQuery = useQuery({ queryKey: ['feed', { limit: 5 }], queryFn: () => listFeed(5) });
  const searchQuery = useQuery({
    queryKey: ['search', search],
    queryFn: () => globalSearch(search),
    enabled: search.length > 2,
  });

  if (profileQuery.isLoading || logsQuery.isLoading || curriculaQuery.isLoading || feedQuery.isLoading) {
    return <Loading />;
  }

  if (profileQuery.error || logsQuery.error || curriculaQuery.error || feedQuery.error) {
    return <ErrorView error={profileQuery.error ?? logsQuery.error ?? curriculaQuery.error ?? feedQuery.error} />;
  }

  const latestLog = logsQuery.data?.[0];
  const latestCurriculum = curriculaQuery.data?.[0];
  const latestFeed = feedQuery.data?.data[0];

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 12 }}>
        Welcome back, {profileQuery.data?.display_name}
      </Text>
      <TextInput
        placeholder="Search members, dojos, curriculum, posts"
        value={search}
        onChangeText={setSearch}
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 12 }}
      />
      {search.length > 2 ? (
        searchQuery.isLoading ? (
          <Loading />
        ) : searchQuery.error ? (
          <ErrorView error={searchQuery.error} />
        ) : (
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontWeight: '700' }}>Search results</Text>
            {searchQuery.data?.map((result) => (
              <Text key={`${result.type}-${result.id}`}>
                [{result.type}] {result.title}
              </Text>
            ))}
            {!searchQuery.data?.length ? <Empty message="No matches" /> : null}
          </View>
        )
      ) : null}
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontWeight: '700' }}>Today&apos;s focus</Text>
        {latestLog ? (
          <Text>
            {latestLog.date}: {latestLog.focus ?? 'Training'} for {latestLog.duration_min ?? 0} minutes
          </Text>
        ) : (
          <Empty message="No training log yet." />
        )}
      </View>
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontWeight: '700' }}>Curriculum highlight</Text>
        {latestCurriculum ? (
          <Text>{latestCurriculum.title}</Text>
        ) : (
          <Empty message="No curriculum available." />
        )}
      </View>
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontWeight: '700' }}>Community update</Text>
        {latestFeed ? (
          <Text>{latestFeed.content_md}</Text>
        ) : (
          <Empty message="No posts yet." />
        )}
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
