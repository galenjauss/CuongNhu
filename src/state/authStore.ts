import { create } from 'zustand';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { Profile } from '../api/types';
import { getMyProfile } from '../api/profile';

type Status = 'signed_out' | 'loading' | 'ready';

type AuthState = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  status: Status;
  bootstrap: () => Promise<void>;
  signOut: () => Promise<void>;
  setProfile: (profile: Profile | null) => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  profile: null,
  status: 'signed_out',
  setProfile: (profile) => set({ profile }),
  bootstrap: async () => {
    set({ status: 'loading' });
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      set({ session: null, user: null, profile: null, status: 'signed_out' });
      return;
    }
    set({ session, user: session.user });
    try {
      const profile = await getMyProfile();
      set({ profile, status: 'ready' });
    } catch (error) {
      console.warn('Failed to load profile', error);
      set({ profile: null, status: 'ready' });
    }
  },
  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null, profile: null, status: 'signed_out' });
  },
}));

export const useAuthStatus = () => {
  const { session, user, profile, status } = useAuthStore();
  return { session, user, profile, status };
};
