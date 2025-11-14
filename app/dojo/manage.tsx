import React from 'react';
import { Alert, Button, FlatList, Text, View } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Stack, useLocalSearchParams } from 'expo-router';
import { listMembers, updateMemberRole } from '../../src/api/dojo';
import type { MemberRole } from '../../src/api/types';
import { Loading } from '../../src/components/Loading';
import { ErrorView } from '../../src/components/ErrorView';
import { useAuthGuard } from '../../src/hooks/useAuthGuard';

const roles: MemberRole[] = ['student', 'instructor', 'admin'];

const ManageDojoScreen = () => {
  useAuthGuard();
  const params = useLocalSearchParams<{ dojo: string }>();
  const dojoId = params.dojo;
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['dojo-members', dojoId],
    queryFn: () => listMembers(dojoId),
    enabled: Boolean(dojoId),
  });

  const mutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: MemberRole }) => updateMemberRole(dojoId, userId, role),
    onSuccess: () => {
      Alert.alert('Updated', 'Member role updated.');
      queryClient.invalidateQueries({ queryKey: ['dojo-members', dojoId] });
    },
    onError: (err) => Alert.alert('Error', err instanceof Error ? err.message : String(err)),
  });

  if (!dojoId) {
    return <ErrorView error={new Error('Dojo ID missing')} />;
  }

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <ErrorView error={error} />;
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Stack.Screen options={{ title: 'Manage Dojo' }} />
      <FlatList
        data={data}
        keyExtractor={(item) => item.user_id}
        renderItem={({ item }) => (
          <View style={{ borderWidth: 1, borderColor: '#eee', padding: 12, marginBottom: 12 }}>
            <Text style={{ fontWeight: '700' }}>{item.profiles?.display_name ?? item.user_id}</Text>
            <Text>Role: {item.role}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {roles.map((role) => (
                <Button key={role} title={role} onPress={() => mutation.mutate({ userId: item.user_id, role })} />
              ))}
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default ManageDojoScreen;
