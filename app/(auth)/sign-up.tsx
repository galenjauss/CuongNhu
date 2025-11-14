import React from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';
import { Link } from 'expo-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUp } from '../../src/api/auth';
import { useAuthStore } from '../../src/state/authStore';

const schema = z
  .object({
    email: z.string().email('Valid email required'),
    password: z.string().min(6, 'At least 6 characters'),
    display_name: z.string().min(2, 'Display name required'),
    confirm: z.string(),
  })
  .refine((values) => values.password === values.confirm, {
    message: 'Passwords must match',
    path: ['confirm'],
  });

type FormValues = z.infer<typeof schema>;

const SignUpScreen = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '', confirm: '', display_name: '' },
  });
  const bootstrap = useAuthStore((state) => state.bootstrap);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await signUp(values.email, values.password, values.display_name);
      Alert.alert('Check your inbox', 'Confirm your email to continue.');
      await bootstrap();
    } catch (error) {
      Alert.alert('Sign up failed', error instanceof Error ? error.message : String(error));
    }
  });

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: '700', marginBottom: 24 }}>Create account</Text>
      <Text>Display name</Text>
      <TextInput
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 12 }}
        value={form.watch('display_name')}
        onChangeText={(text) => form.setValue('display_name', text)}
      />
      {form.formState.errors.display_name ? (
        <Text style={{ color: 'red' }}>{form.formState.errors.display_name.message}</Text>
      ) : null}
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
      <Text>Confirm password</Text>
      <TextInput
        secureTextEntry
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 12 }}
        value={form.watch('confirm')}
        onChangeText={(text) => form.setValue('confirm', text)}
      />
      {form.formState.errors.confirm ? (
        <Text style={{ color: 'red' }}>{form.formState.errors.confirm.message}</Text>
      ) : null}
      <Button title="Sign Up" onPress={onSubmit} />
      <Link href="/(auth)/sign-in" style={{ marginTop: 12, color: 'blue' }}>
        Already have an account? Sign in
      </Link>
    </View>
  );
};

export default SignUpScreen;
