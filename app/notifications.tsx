import React from 'react';
import { Button, FlatList, Text, View } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { listNotifications, markNotificationRead } from '../src/api/notifications';
import { Loading } from '../src/components/Loading';
import { ErrorView } from '../src/components/ErrorView';
import { useAuthGuard } from '../src/hooks/useAuthGuard';

const NotificationsScreen = () => {
  useAuthGuard();
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: ['notifications'], queryFn: listNotifications });

  const mutation = useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <ErrorView error={error} />;
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Stack.Screen options={{ title: 'Notifications' }} />
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ borderBottomWidth: 1, borderColor: '#eee', paddingVertical: 8 }}>
            <Text style={{ fontWeight: '700' }}>{item.type}</Text>
            <Text>{JSON.stringify(item.data)}</Text>
            <Text>Status: {item.is_read ? 'Read' : 'Unread'}</Text>
            {!item.is_read ? <Button title="Mark read" onPress={() => mutation.mutate(item.id)} /> : null}
          </View>
        )}
      />
    </View>
  );
};

export default NotificationsScreen;
