# Cuong Nhu Mobile App

A functional Expo + TypeScript application for the Cuong Nhu martial arts community using Supabase for data, authentication, storage, and edge functions.

## Features
- Email/password and magic link authentication with Supabase Auth.
- Profiles with avatar upload, ranks, dojo membership, and push token capture.
- Dojo directory with role-based member management.
- Curriculum browser with lessons and media support.
- Training, teaching, and journal logs with summaries.
- Social feed with posts, comments, likes, and offline-friendly caching.
- Global search across members, dojos, curricula, and posts.
- Notifications list with mark-as-read handling and Expo push trigger edge function.
- Settings panel exposing feature flags.

## Prerequisites
- Node.js 18+
- Expo CLI (`npm install -g expo-cli` recommended)
- Supabase project

## Setup
1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Environment variables**
   Copy `.env.example` to `.env` (or configure your preferred env loader) and populate:
   ```
   EXPO_PUBLIC_SUPABASE_URL=<your-project-url>
   EXPO_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
   EXPO_PUBLIC_ENABLE_OAUTH=false
   EXPO_PUBLIC_ENABLE_PUSH=false
   ```
3. **Supabase database**
   - In the Supabase dashboard SQL editor, run the files in `supabase/` in order:
     1. `schema.sql`
     2. `policies.sql`
     3. `seeds.sql`
   - Confirm storage buckets `avatars` and `curriculum` exist (the schema script creates them if missing).
4. **Edge functions**
   Deploy the provided functions using the Supabase CLI:
   ```bash
   supabase functions deploy on-new-like
   supabase functions deploy notify-push
   ```
   `notify-push` expects the environment variable `EXPO_ACCESS_TOKEN` (optional; without it the function logs a warning).

## Running the app
```bash
npx expo start
```
Choose your preferred platform (iOS simulator, Android emulator, or web). Use the seeded credentials (`student@example.com` / `Password1!` etc.) or create new accounts.

## Tests
```bash
npm test
```

## Typical workflow
1. Sign up or sign in.
2. Edit your profile and join a dojo.
3. Browse curriculum and lessons.
4. Log training/teaching sessions and journal entries.
5. Post to the feed, comment, and like to generate notifications.
6. Review notifications and mark them as read.

## Edge Function examples
```bash
curl -X POST \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"user_id":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1"}' \
  https://<project>.functions.supabase.co/notify-push
```

## Notes
- Role-based access control enforced with Supabase RLS policies. Admins can manage dojo memberships, instructors can edit curricula.
- React Query caches data with offline persistence using AsyncStorage.
- Error states surface via alerts or inline messages; loading spinners cover async flows.
