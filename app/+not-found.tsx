import { Link, Stack } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

const NotFoundScreen = () => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Stack.Screen options={{ title: 'Not Found' }} />
    <Text>Oops! This screen does not exist.</Text>
    <Link href="/(tabs)/home" style={{ marginTop: 12, color: 'blue' }}>
      Go Home
    </Link>
  </View>
);

export default NotFoundScreen;
