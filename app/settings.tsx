import React from 'react';
import { Switch, Text, View } from 'react-native';
import { Stack } from 'expo-router';
import { featureFlags } from '../src/config/featureFlags';
import { useAuthGuard } from '../src/hooks/useAuthGuard';

const SettingsScreen = () => {
  useAuthGuard();
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Stack.Screen options={{ title: 'Settings' }} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
        <Text>Enable OAuth</Text>
        <Switch value={featureFlags.enableOAuth} disabled />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
        <Text>Push Notifications</Text>
        <Switch value={featureFlags.enablePush} disabled />
      </View>
      <Text style={{ marginTop: 24 }}>Legal: By using this app you agree to community guidelines.</Text>
    </View>
  );
};

export default SettingsScreen;
