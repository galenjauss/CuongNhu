import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient } from '@tanstack/react-query';
import { createAsyncStoragePersistor } from '@tanstack/query-async-storage-persister';
import { persistQueryClient } from '@tanstack/react-query-persist-client';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60,
    },
    mutations: {
      retry: 0,
    },
  },
});

const persistor = createAsyncStoragePersistor({
  storage: AsyncStorage,
  key: 'cuong-nhu-react-query',
});

persistQueryClient({
  queryClient,
  persistor,
  maxAge: 1000 * 60 * 60 * 24,
});
