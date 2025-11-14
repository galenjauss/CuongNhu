-- Supabase schema for Cuong Nhu app
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

create type public.member_role as enum ('student', 'instructor', 'admin');
create type public.notification_type as enum ('like', 'comment', 'new_post', 'system');

create table if not exists public.dojos (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  location text,
  description text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  photo_url text,
  rank text,
  dojo_default uuid references public.dojos(id),
  bio text,
  expo_push_token text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.dojo_members (
  dojo_id uuid references public.dojos(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role public.member_role not null default 'student',
  joined_at timestamptz not null default now(),
  primary key (dojo_id, user_id)
);

create table if not exists public.curricula (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  dojo_id uuid references public.dojos(id) on delete cascade,
  is_public boolean not null default true,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  curriculum_id uuid references public.curricula(id) on delete cascade,
  title text not null,
  content_md text,
  media_urls text[] default '{}',
  order_index int not null default 0,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.training_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  dojo_id uuid references public.dojos(id),
  date date not null,
  duration_min int check (duration_min >= 0),
  focus text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.teaching_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  dojo_id uuid references public.dojos(id),
  date date not null,
  duration_min int check (duration_min >= 0),
  topic text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text,
  content_md text,
  mood text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references auth.users(id) on delete cascade,
  dojo_id uuid references public.dojos(id),
  content_md text,
  media_urls text[] default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.posts(id) on delete cascade,
  author_id uuid references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.likes (
  post_id uuid references public.posts(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  type public.notification_type not null,
  data jsonb not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_u before update on public.profiles for each row execute function public.set_updated_at();
create trigger trg_dojos_u before update on public.dojos for each row execute function public.set_updated_at();
create trigger trg_curricula_u before update on public.curricula for each row execute function public.set_updated_at();
create trigger trg_lessons_u before update on public.lessons for each row execute function public.set_updated_at();
create trigger trg_training_logs_u before update on public.training_logs for each row execute function public.set_updated_at();
create trigger trg_teaching_logs_u before update on public.teaching_logs for each row execute function public.set_updated_at();
create trigger trg_journal_entries_u before update on public.journal_entries for each row execute function public.set_updated_at();

select storage.create_bucket('avatars', true, 'public');
select storage.create_bucket('curriculum', true, 'public');
