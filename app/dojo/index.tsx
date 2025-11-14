import React from 'react';
import { Alert, Button, FlatList, Text, View } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Stack, useRouter } from 'expo-router';
import { joinDojo, listDojos, listMembers } from '../../src/api/dojo';
import { useAuthStore } from '../../src/state/authStore';
import { Loading } from '../../src/components/Loading';
import { ErrorView } from '../../src/components/ErrorView';
import { useAuthGuard } from '../../src/hooks/useAuthGuard';

const DojoScreen = () => {
  useAuthGuard();
  const queryClient = useQueryClient();
  const router = useRouter();
  const profile = useAuthStore((state) => state.profile);
  const { data, isLoading, error } = useQuery({ queryKey: ['dojos'], queryFn: listDojos });
  const membersQuery = useQuery({ queryKey: ['members', profile?.dojo_default], queryFn: () => (profile?.dojo_default ? listMembers(profile.dojo_default) : []) });

  const joinMutation = useMutation({
    mutationFn: (dojoId: string) => joinDojo(dojoId),
    onSuccess: () => {
      Alert.alert('Joined', 'Welcome to the dojo!');
      queryClient.invalidateQueries({ queryKey: ['dojos'] });
      useAuthStore.getState().bootstrap();
    },
  });

  if (isLoading || membersQuery.isLoading) {
    return <Loading />;
  }
  if (error || membersQuery.error) {
    return <ErrorView error={error ?? membersQuery.error} />;
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Stack.Screen options={{ title: 'Dojos' }} />
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ borderWidth: 1, borderColor: '#eee', padding: 12, borderRadius: 8, marginBottom: 12 }}>
            <Text style={{ fontWeight: '700' }}>{item.name}</Text>
            <Text>{item.location}</Text>
            <Text>{item.description}</Text>
            <Button title="Join" onPress={() => joinMutation.mutate(item.id)} />
            <Button title="Manage" onPress={() => router.push(`/dojo/manage?dojo=${item.id}`)} />
          </View>
        )}
      />
      <View style={{ marginTop: 16 }}>
        <Text style={{ fontWeight: '700' }}>Members of default dojo</Text>
        {membersQuery.data?.map((member) => (
          <Text key={member.user_id}>
            {member.profiles?.display_name ?? member.user_id} - {member.role}
          </Text>
        ))}
      </View>
    </View>
  );
};

export default DojoScreen;
