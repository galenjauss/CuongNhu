import React from 'react';
import { Button, ScrollView, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { getMyProfile } from '../../src/api/profile';
import { Avatar } from '../../src/components/Avatar';
import { Loading } from '../../src/components/Loading';
import { ErrorView } from '../../src/components/ErrorView';
import { useAuthStore } from '../../src/state/authStore';

const ProfileScreen = () => {
  const router = useRouter();
  const signOut = useAuthStore((state) => state.signOut);
  const { data, isLoading, error } = useQuery({ queryKey: ['profile'], queryFn: getMyProfile });

  if (isLoading) {
    return <Loading />;
  }
  if (error || !data) {
    return <ErrorView error={error ?? new Error('Profile missing')} />;
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <View style={{ alignItems: 'center', marginBottom: 16 }}>
        <Avatar uri={data.photo_url ?? undefined} name={data.display_name} size={96} />
        <Text style={{ fontSize: 20, fontWeight: '700', marginTop: 12 }}>{data.display_name}</Text>
        <Text>Rank: {data.rank ?? 'Unranked'}</Text>
        <Text>Default Dojo: {data.dojo_default ?? 'None'}</Text>
        <Text style={{ marginTop: 12 }}>{data.bio}</Text>
      </View>
      <Button title="Edit Profile" onPress={() => router.push('/profile/edit')} />
      <View style={{ marginTop: 16 }}>
        <Button title="View Dojos" onPress={() => router.push('/dojo')} />
      </View>
      <View style={{ marginTop: 16 }}>
        <Button title="Journal" onPress={() => router.push('/journal')} />
      </View>
      <View style={{ marginTop: 16 }}>
        <Button title="Teaching" onPress={() => router.push('/teaching')} />
      </View>
      <View style={{ marginTop: 16 }}>
        <Button title="Notifications" onPress={() => router.push('/notifications')} />
      </View>
      <View style={{ marginTop: 16 }}>
        <Button title="Settings" onPress={() => router.push('/settings')} />
      </View>
      <View style={{ marginTop: 24 }}>
        <Button title="Sign Out" color="red" onPress={() => signOut()} />
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
