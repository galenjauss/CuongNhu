import React from 'react';
import { Text, View } from 'react-native';

export const Empty: React.FC<{ message?: string }> = ({ message = 'Nothing here yet.' }) => (
  <View style={{ padding: 24, alignItems: 'center' }}>
    <Text style={{ color: '#666' }}>{message}</Text>
  </View>
);
