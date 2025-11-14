import React from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';
import { Link } from 'expo-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from '../../src/api/auth';
import { useAuthStore } from '../../src/state/authStore';

const schema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Password is required'),
});

type FormValues = z.infer<typeof schema>;

const SignInScreen = () => {
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { email: '', password: '' } });
  const setStatus = useAuthStore((state) => state.bootstrap);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await signIn(values.email, values.password);
      await setStatus();
    } catch (error) {
      Alert.alert('Sign in failed', error instanceof Error ? error.message : String(error));
    }
  });

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: '700', marginBottom: 24 }}>Sign In</Text>
      <Text>Email</Text>
      <TextInput
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 12 }}
        value={form.watch('email')}
        onChangeText={(text) => form.setValue('email', text)}
      />
      {form.formState.errors.email ? <Text style={{ color: 'red' }}>{form.formState.errors.email.message}</Text> : null}
      <Text>Password</Text>
      <TextInput
        secureTextEntry
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 12 }}
        value={form.watch('password')}
        onChangeText={(text) => form.setValue('password', text)}
      />
      {form.formState.errors.password ? (
        <Text style={{ color: 'red' }}>{form.formState.errors.password.message}</Text>
      ) : null}
      <Button title="Sign In" onPress={onSubmit} />
      <Link href="/(auth)/magic-link" style={{ marginTop: 12, color: 'blue' }}>
        Send magic link
      </Link>
      <Link href="/(auth)/sign-up" style={{ marginTop: 12, color: 'blue' }}>
        Need an account? Sign up
      </Link>
    </View>
  );
};

export default SignInScreen;
