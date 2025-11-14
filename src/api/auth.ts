import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { Profile } from './types';

export const signUp = async (email: string, password: string, displayName: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) {
    throw new Error(`Sign up failed: ${error.message}`);
  }
  if (data.user) {
    await supabase.from('profiles').upsert({
      user_id: data.user.id,
      display_name: displayName,
    });
  }
  return data;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    throw new Error(`Sign in failed: ${error.message}`);
  }
  return data;
};

export const sendMagicLink = async (email: string) => {
  const { error } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
  if (error) {
    throw new Error(`Magic link failed: ${error.message}`);
  }
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(`Sign out failed: ${error.message}`);
  }
};

export const getSession = async (): Promise<Session | null> => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    throw new Error(`Get session failed: ${error.message}`);
  }
  return data.session;
};

export const onAuthStateChange = (
  callback: (event: AuthChangeEvent, session: Session | null) => void,
) => supabase.auth.onAuthStateChange(callback);

export const ensureProfile = async (): Promise<Profile> => {
  const session = await getSession();
  if (!session?.user) {
    throw new Error('No session');
  }
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', session.user.id)
    .maybeSingle();
  if (error) {
    throw new Error(`Fetch profile failed: ${error.message}`);
  }
  if (data) {
    return data as Profile;
  }
  const { data: inserted, error: insertError } = await supabase
    .from('profiles')
    .insert({ user_id: session.user.id, display_name: session.user.email ?? 'New Student' })
    .select('*')
    .single();
  if (insertError) {
    throw new Error(`Create profile failed: ${insertError.message}`);
  }
  return inserted as Profile;
};
