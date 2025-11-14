import React from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';
import { Link } from 'expo-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { sendMagicLink } from '../../src/api/auth';

const schema = z.object({ email: z.string().email('Valid email required') });

type FormValues = z.infer<typeof schema>;

const MagicLinkScreen = () => {
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { email: '' } });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await sendMagicLink(values.email);
      Alert.alert('Magic link sent', 'Check your email inbox.');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : String(error));
    }
  });

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: '700', marginBottom: 24 }}>Magic Link</Text>
      <Text>Email</Text>
      <TextInput
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 12 }}
        value={form.watch('email')}
        onChangeText={(text) => form.setValue('email', text)}
      />
      {form.formState.errors.email ? <Text style={{ color: 'red' }}>{form.formState.errors.email.message}</Text> : null}
      <Button title="Send Link" onPress={onSubmit} />
      <Link href="/(auth)/sign-in" style={{ marginTop: 12, color: 'blue' }}>
        Back to sign in
      </Link>
    </View>
  );
};

export default MagicLinkScreen;
