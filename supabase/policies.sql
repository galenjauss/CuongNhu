-- Enable row level security
alter table public.profiles enable row level security;
alter table public.dojos enable row level security;
alter table public.dojo_members enable row level security;
alter table public.curricula enable row level security;
alter table public.lessons enable row level security;
alter table public.training_logs enable row level security;
alter table public.teaching_logs enable row level security;
alter table public.journal_entries enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.likes enable row level security;
alter table public.notifications enable row level security;

-- Profiles policies
create policy "Profiles are viewable by authenticated users" on public.profiles
for select using (auth.role() = 'authenticated');

create policy "Insert own profile" on public.profiles
for insert with check (auth.uid() = user_id);

create policy "Update own profile" on public.profiles
for update using (auth.uid() = user_id);

-- Dojos policies
create policy "Dojos readable" on public.dojos
for select using (true);

create policy "Create dojo authenticated" on public.dojos
for insert with check (auth.role() = 'authenticated');

create policy "Update dojo admins" on public.dojos
for update using (exists (
  select 1 from public.dojo_members dm
  where dm.dojo_id = id and dm.user_id = auth.uid() and dm.role = 'admin'
));

create policy "Delete dojo admins" on public.dojos
for delete using (exists (
  select 1 from public.dojo_members dm
  where dm.dojo_id = id and dm.user_id = auth.uid() and dm.role = 'admin'
));

-- Dojo members policies
create policy "Members readable to same dojo" on public.dojo_members
for select using (exists (
  select 1 from public.dojo_members dm2
  where dm2.dojo_id = dojo_id and dm2.user_id = auth.uid()
));

create policy "Join dojo" on public.dojo_members
for insert with check (auth.uid() = user_id);

create policy "Admins manage member role" on public.dojo_members
for update using (exists (
  select 1 from public.dojo_members dm
  where dm.dojo_id = dojo_id and dm.user_id = auth.uid() and dm.role = 'admin'
));

create policy "Leave dojo" on public.dojo_members
for delete using (auth.uid() = user_id);

-- Curricula
create policy "Curricula view" on public.curricula
for select using (
  is_public
  or exists (
    select 1 from public.dojo_members dm where dm.dojo_id = dojo_id and dm.user_id = auth.uid()
  )
);

create policy "Curricula create" on public.curricula
for insert with check (exists (
  select 1 from public.dojo_members dm
  where dm.dojo_id = dojo_id and dm.user_id = auth.uid() and dm.role in ('instructor', 'admin')
));

create policy "Curricula modify" on public.curricula
for update using (exists (
  select 1 from public.dojo_members dm
  where dm.dojo_id = dojo_id and dm.user_id = auth.uid() and dm.role in ('instructor', 'admin')
));

create policy "Curricula delete" on public.curricula
for delete using (exists (
  select 1 from public.dojo_members dm
  where dm.dojo_id = dojo_id and dm.user_id = auth.uid() and dm.role in ('instructor', 'admin')
));

-- Lessons
create policy "Lessons view" on public.lessons
for select using (
  exists (
    select 1 from public.curricula c
    where c.id = curriculum_id and (c.is_public or exists (
      select 1 from public.dojo_members dm where dm.dojo_id = c.dojo_id and dm.user_id = auth.uid()
    ))
  )
);

create policy "Lessons change" on public.lessons
for all using (exists (
  select 1 from public.curricula c
  join public.dojo_members dm on dm.dojo_id = c.dojo_id
  where c.id = curriculum_id and dm.user_id = auth.uid() and dm.role in ('instructor', 'admin')
));

-- Training logs
create policy "Training read own" on public.training_logs
for select using (auth.uid() = user_id);

create policy "Training modify own" on public.training_logs
for all using (auth.uid() = user_id);

-- Teaching logs
create policy "Teaching read own" on public.teaching_logs
for select using (auth.uid() = user_id);

create policy "Teaching modify own" on public.teaching_logs
for all using (auth.uid() = user_id);

-- Journal entries
create policy "Journal read own" on public.journal_entries
for select using (auth.uid() = user_id);

create policy "Journal modify own" on public.journal_entries
for all using (auth.uid() = user_id);

-- Posts
create policy "Posts readable" on public.posts
for select using (true);

create policy "Posts create" on public.posts
for insert with check (auth.uid() = author_id);

create policy "Posts update" on public.posts
for update using (auth.uid() = author_id);

create policy "Posts delete" on public.posts
for delete using (auth.uid() = author_id);

-- Comments
create policy "Comments readable" on public.comments
for select using (true);

create policy "Comments create" on public.comments
for insert with check (auth.uid() = author_id);

create policy "Comments delete" on public.comments
for delete using (auth.uid() = author_id);

-- Likes
create policy "Likes readable" on public.likes
for select using (true);

create policy "Likes create" on public.likes
for insert with check (auth.uid() = user_id);

create policy "Likes delete" on public.likes
for delete using (auth.uid() = user_id);

-- Notifications
create policy "Notifications read own" on public.notifications
for select using (auth.uid() = user_id);

create policy "Notifications insert system" on public.notifications
for insert with check (true);

create policy "Notifications update own" on public.notifications
for update using (auth.uid() = user_id);
