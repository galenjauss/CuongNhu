import * as ImagePicker from 'expo-image-picker';
import { supabase } from './supabase';

const bucketMap: Record<'avatar' | 'curriculum', string> = {
  avatar: 'avatars',
  curriculum: 'curriculum',
};

export type UploadKind = keyof typeof bucketMap;

export const pickImage = async (): Promise<ImagePicker.ImagePickerAsset | null> => {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    throw new Error('Permission denied for media library.');
  }
  const result = await ImagePicker.launchImageLibraryAsync({
    allowsMultipleSelection: false,
    quality: 0.7,
    base64: false,
  });
  if (result.canceled) {
    return null;
  }
  return result.assets[0] ?? null;
};

export const uploadImage = async (kind: UploadKind, file: ImagePicker.ImagePickerAsset, userId: string) => {
  const path = `${userId}/${Date.now()}-${file.fileName ?? 'image.jpg'}`;
  const { error } = await supabase.storage.from(bucketMap[kind]).upload(path, {
    uri: file.uri,
    type: file.mimeType ?? 'image/jpeg',
    name: file.fileName ?? 'upload.jpg',
  } as any);
  if (error) {
    throw error;
  }
  const { data } = supabase.storage.from(bucketMap[kind]).getPublicUrl(path);
  return data.publicUrl;
};
