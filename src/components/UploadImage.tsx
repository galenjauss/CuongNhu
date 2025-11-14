import React, { useEffect, useState } from 'react';
import { Button, Image, View } from 'react-native';
import { pickImage } from '../lib/storage';
import type { ImagePickerAsset } from 'expo-image-picker';

export const UploadImage: React.FC<{ onSelected: (asset: ImagePickerAsset | null) => void; value?: string | null }>
  = ({ onSelected, value }) => {
    const [preview, setPreview] = useState<string | null>(value ?? null);

    useEffect(() => {
      setPreview(value ?? null);
    }, [value]);

    const handlePick = async () => {
      const asset = await pickImage();
      if (asset) {
        setPreview(asset.uri);
        onSelected(asset);
      }
    };

    return (
      <View style={{ marginVertical: 12 }}>
        {preview ? (
          <Image source={{ uri: preview }} style={{ width: 120, height: 120, borderRadius: 8, marginBottom: 8 }} />
        ) : null}
        <Button title="Choose Image" onPress={handlePick} />
      </View>
    );
  };
