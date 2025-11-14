import { env } from '../lib/env';

export const featureFlags = {
  enableOAuth: env.enableOAuth,
  enablePush: env.enablePush,
};
