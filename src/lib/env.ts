import Constants from 'expo-constants';

type EnvConfig = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  enableOAuth: boolean;
  enablePush: boolean;
};

const raw = Constants.expoConfig?.extra ?? {};

const getPublicEnv = (): EnvConfig => {
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? (raw.supabaseUrl as string);
  const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? (raw.supabaseAnonKey as string);
  const enableOAuth = (process.env.EXPO_PUBLIC_ENABLE_OAUTH ?? 'false').toLowerCase() === 'true';
  const enablePush = (process.env.EXPO_PUBLIC_ENABLE_PUSH ?? 'false').toLowerCase() === 'true';

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase env vars missing. Provide EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.');
  }

  return { supabaseUrl, supabaseAnonKey, enableOAuth, enablePush };
};

export const env = getPublicEnv();
