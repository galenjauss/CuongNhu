import React, { useState } from 'react';
import { Alert, Button, ScrollView, Text, TextInput, View } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { getMyProfile, upsertMyProfile } from '../../src/api/profile';
import { ranks } from '../../src/api/rank';
import { UploadImage } from '../../src/components/UploadImage';
import { Loading } from '../../src/components/Loading';
import { ErrorView } from '../../src/components/ErrorView';
import { useAuthStore } from '../../src/state/authStore';
import { useAuthGuard } from '../../src/hooks/useAuthGuard';

const EditProfileScreen = () => {
  useAuthGuard();
  const queryClient = useQueryClient();
  const setProfile = useAuthStore((state) => state.setProfile);
  const { data, isLoading, error } = useQuery({ queryKey: ['profile'], queryFn: getMyProfile });
  const [selectedRank, setSelectedRank] = useState<string>('');
  const [dojo, setDojo] = useState<string>('');
  const [bio, setBio] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [avatar, setAvatar] = useState<any>(null);

  React.useEffect(() => {
    if (data) {
      setSelectedRank(data.rank ?? '');
      setDojo(data.dojo_default ?? '');
      setBio(data.bio ?? '');
      setDisplayName(data.display_name);
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: () =>
      upsertMyProfile({
        display_name: displayName,
        rank: selectedRank,
        bio,
        dojo_default: dojo || null,
        avatar,
      }),
    onSuccess: (profile) => {
      setProfile(profile);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      Alert.alert('Saved', 'Profile updated');
    },
    onError: (err) => Alert.alert('Error', err instanceof Error ? err.message : String(err)),
  });

  if (isLoading) {
    return <Loading />;
  }
  if (error || !data) {
    return <ErrorView error={error ?? new Error('Profile not found')} />;
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Stack.Screen options={{ title: 'Edit Profile' }} />
      <UploadImage onSelected={setAvatar} value={data.photo_url ?? undefined} />
      <Text style={{ fontWeight: '700' }}>Display name</Text>
      <TextInput value={displayName} onChangeText={setDisplayName} style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 12 }} />
      <Text style={{ fontWeight: '700' }}>Rank</Text>
      <View style={{ borderWidth: 1, borderColor: '#ccc', marginBottom: 12 }}>
        {ranks.map((rank) => (
          <Button key={rank} title={rank} onPress={() => setSelectedRank(rank)} color={selectedRank === rank ? 'blue' : undefined} />
        ))}
      </View>
      <Text style={{ fontWeight: '700' }}>Default dojo ID</Text>
      <TextInput value={dojo} onChangeText={setDojo} placeholder="Enter dojo UUID" style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 12 }} />
      <Text style={{ fontWeight: '700' }}>Bio</Text>
      <TextInput value={bio} onChangeText={setBio} multiline style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, height: 120, marginBottom: 12 }} />
      <Button title="Save" onPress={() => mutation.mutate()} />
    </ScrollView>
  );
};

export default EditProfileScreen;
