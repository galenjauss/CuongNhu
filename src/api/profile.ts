import { supabase } from '../lib/supabase';
import type { Profile } from './types';
import { uploadImage } from '../lib/storage';
import type { ImagePickerAsset } from 'expo-image-picker';

export const getMyProfile = async (): Promise<Profile> => {
  const {
    data: { user },
    error: sessionError,
  } = await supabase.auth.getUser();
  if (sessionError) {
    throw new Error(`Session error: ${sessionError.message}`);
  }
  if (!user) {
    throw new Error('Not authenticated');
  }
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();
  if (error) {
    throw new Error(`Load profile failed: ${error.message}`);
  }
  return data as Profile;
};

export const getProfileById = async (userId: string): Promise<Profile> => {
  const { data, error } = await supabase.from('profiles').select('*').eq('user_id', userId).single();
  if (error) {
    throw new Error(`Load profile failed: ${error.message}`);
  }
  return data as Profile;
};

export type UpsertProfileInput = {
  display_name: string;
  bio?: string;
  rank?: string;
  dojo_default?: string | null;
  avatar?: ImagePickerAsset | null;
};

export const upsertMyProfile = async (input: UpsertProfileInput): Promise<Profile> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Not authenticated');
  }
  let photo_url: string | undefined;
  if (input.avatar) {
    photo_url = await uploadImage('avatar', input.avatar, user.id);
  }
  const { data, error } = await supabase
    .from('profiles')
    .upsert(
      {
        user_id: user.id,
        display_name: input.display_name,
        bio: input.bio ?? null,
        rank: input.rank ?? null,
        dojo_default: input.dojo_default ?? null,
        ...(photo_url ? { photo_url } : {}),
      },
      { onConflict: 'user_id' },
    )
    .select('*')
    .single();
  if (error) {
    throw new Error(`Update profile failed: ${error.message}`);
  }
  return data as Profile;
};
