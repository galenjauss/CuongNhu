import React from 'react';
import { ActivityIndicator, View } from 'react-native';

export const Loading: React.FC = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
    <ActivityIndicator />
  </View>
);
