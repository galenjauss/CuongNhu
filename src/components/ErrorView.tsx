import React from 'react';
import { Text, View } from 'react-native';

export const ErrorView: React.FC<{ error: unknown }> = ({ error }) => {
  const message = error instanceof Error ? error.message : String(error);
  return (
    <View style={{ padding: 24 }}>
      <Text style={{ color: 'red' }}>{message}</Text>
    </View>
  );
};
