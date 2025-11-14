import { act, render } from '@testing-library/react-native';
import React from 'react';
import { z } from 'zod';
import { PostCard } from '../components/PostCard';
import { useUIStore } from '../state/uiStore';
import { toggleLike } from '../api/likes';
import { useAuthGuard } from '../hooks/useAuthGuard';
import { useAuthStore } from '../state/authStore';

const getUserMock = jest.fn().mockResolvedValue({ data: { user: null } });
const chain = () => ({
  select: jest.fn(() => chain()),
  eq: jest.fn(() => chain()),
  maybeSingle: jest.fn(() => Promise.resolve({ data: null, error: null })),
  delete: jest.fn(() => Promise.resolve({ error: null })),
  insert: jest.fn(() => Promise.resolve({ error: null })),
  order: jest.fn(() => chain()),
  limit: jest.fn(() => chain()),
  lt: jest.fn(() => chain()),
});

jest.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: () => getUserMock(),
    },
    from: () => chain(),
  },
}));

const replaceMock = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: replaceMock }),
  useSegments: () => ['(tabs)'],
}));

beforeEach(() => {
  replaceMock.mockReset();
});

describe('uiStore', () => {
  it('toggles theme', () => {
    const { theme, toggleTheme } = useUIStore.getState();
    expect(theme).toBe('light');
    act(() => toggleTheme());
    expect(useUIStore.getState().theme).toBe('dark');
  });
});

describe('form validation', () => {
  it('requires email', () => {
    const schema = z.object({ email: z.string().email() });
    expect(() => schema.parse({ email: 'bad' })).toThrow();
  });
});

describe('PostCard component', () => {
  it('renders counts', () => {
    const { getByText } = render(
      <PostCard
        post={{
          id: '1',
          author_id: 'a',
          content_md: 'Hello',
          media_urls: [],
          created_at: '',
          likes: [],
          comments: [],
          profiles: {
            display_name: 'Tester',
            user_id: '1',
            photo_url: null,
            rank: null,
            dojo_default: null,
            bio: null,
            expo_push_token: null,
            created_at: '',
            updated_at: '',
          },
        }}
      />,
    );
    expect(getByText('Tester')).toBeTruthy();
    expect(getByText('0 likes · 0 comments')).toBeTruthy();
  });
});

describe('toggleLike', () => {
  it('throws when unauthenticated', async () => {
    await expect(toggleLike('post1')).rejects.toThrow('Not authenticated');
  });
});

describe('useAuthGuard', () => {
  it('redirects when signed out', () => {
    useAuthStore.setState({ session: null, status: 'ready', user: null, profile: null } as any);
    const TestComponent = () => {
      useAuthGuard();
      return null;
    };
    render(<TestComponent />);
    expect(replaceMock).toHaveBeenCalledWith('/(auth)/sign-in');
  });
});
