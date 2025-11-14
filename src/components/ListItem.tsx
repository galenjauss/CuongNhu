import React from 'react';
import { Pressable, Text, View } from 'react-native';

export const ListItem: React.FC<{
  title: string;
  subtitle?: string | null;
  onPress?: () => void;
  actions?: React.ReactNode;
}> = ({ title, subtitle, onPress, actions }) => (
  <Pressable onPress={onPress} style={{ padding: 12, borderBottomWidth: 1, borderColor: '#eee' }}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 16, fontWeight: '600' }}>{title}</Text>
        {subtitle ? <Text style={{ color: '#666', marginTop: 4 }}>{subtitle}</Text> : null}
      </View>
      {actions ? <View>{actions}</View> : null}
    </View>
  </Pressable>
);
