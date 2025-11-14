import { useState } from 'react';
import type { ImagePickerAsset } from 'expo-image-picker';
import { pickImage } from '../lib/storage';

export const useImagePicker = () => {
  const [asset, setAsset] = useState<ImagePickerAsset | null>(null);

  const chooseImage = async () => {
    const result = await pickImage();
    if (result) {
      setAsset(result);
    }
    return result;
  };

  return { asset, chooseImage, setAsset };
};
