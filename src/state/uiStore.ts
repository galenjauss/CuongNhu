import { create } from 'zustand';

type UIState = {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  lastError: string | null;
  setError: (error: string | null) => void;
};

export const useUIStore = create<UIState>((set) => ({
  theme: 'light',
  lastError: null,
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === 'light' ? 'dark' : 'light',
    })),
  setError: (error) => set({ lastError: error }),
}));
