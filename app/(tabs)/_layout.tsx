import React from 'react';
import { Tabs } from 'expo-router';
import { useAuthGuard } from '../../src/hooks/useAuthGuard';

const TabsLayout = () => {
  useAuthGuard();
  return (
    <Tabs>
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="feed" options={{ title: 'Feed' }} />
      <Tabs.Screen name="curriculum" options={{ title: 'Curriculum' }} />
      <Tabs.Screen name="log" options={{ title: 'Logs' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
};

export default TabsLayout;
