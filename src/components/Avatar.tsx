import React from 'react';
import { Image, Text, View } from 'react-native';

export const Avatar: React.FC<{ uri?: string | null; name: string; size?: number }> = ({ uri, name, size = 64 }) => {
  if (uri) {
    return <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} />;
  }
  const initials = name
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ fontWeight: '700', fontSize: size / 2 }}>{initials || '?'}</Text>
    </View>
  );
};
