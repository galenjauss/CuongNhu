-- Seed data for Cuong Nhu app
do $$
declare
  student_id uuid := 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1';
  instructor_id uuid := 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2';
  admin_id uuid := 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3';
  dojo_uci uuid := 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1';
  dojo_dt uuid := 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2';
  curriculum_id uuid := 'cccccccc-cccc-cccc-cccc-ccccccccccc1';
  lesson1 uuid := 'dddddddd-dddd-dddd-dddd-ddddddddddd1';
  lesson2 uuid := 'dddddddd-dddd-dddd-dddd-ddddddddddd2';
  lesson3 uuid := 'dddddddd-dddd-dddd-dddd-ddddddddddd3';
  post1 uuid := 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1';
  post2 uuid := 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee2';
  comment1 uuid := 'ffffffff-ffff-ffff-ffff-fffffffffff1';
  comment2 uuid := 'ffffffff-ffff-ffff-ffff-fffffffffff2';
  like1 uuid := 'ffffffff-ffff-ffff-ffff-fffffffffff3';
  journal1 uuid := '11111111-1111-1111-1111-111111111111';
  journal2 uuid := '22222222-2222-2222-2222-222222222222';
  journal3 uuid := '33333333-3333-3333-3333-333333333333';
  train1 uuid := '44444444-4444-4444-4444-444444444444';
  train2 uuid := '55555555-5555-5555-5555-555555555555';
  teach1 uuid := '66666666-6666-6666-6666-666666666666';
begin
  insert into auth.users (id, email, encrypted_password, email_confirmed_at)
  values
    (student_id, 'student@example.com', crypt('Password1!', gen_salt('bf')), now()),
    (instructor_id, 'instructor@example.com', crypt('Password1!', gen_salt('bf')), now()),
    (admin_id, 'admin@example.com', crypt('Password1!', gen_salt('bf')), now())
  on conflict (id) do nothing;

  insert into public.dojos (id, name, location, description)
  values
    (dojo_uci, 'UCI Cuong Nhu', 'Irvine, CA', 'University club focused on fundamentals.'),
    (dojo_dt, 'Downtown Dojo', 'Portland, OR', 'Community dojo for all ages.')
  on conflict (id) do nothing;

  insert into public.profiles (user_id, display_name, rank, dojo_default, bio)
  values
    (student_id, 'Sam Student', 'Green Belt', dojo_uci, 'Eager to train daily.'),
    (instructor_id, 'Ivy Instructor', 'Brown Belt', dojo_dt, 'Teaching fundamentals.'),
    (admin_id, 'Alex Admin', 'Black Belt', dojo_uci, 'Helps organize events.')
  on conflict (user_id) do update set display_name = excluded.display_name;

  insert into public.dojo_members (dojo_id, user_id, role)
  values
    (dojo_uci, student_id, 'student'),
    (dojo_dt, instructor_id, 'instructor'),
    (dojo_uci, admin_id, 'admin'),
    (dojo_dt, admin_id, 'admin')
  on conflict (dojo_id, user_id) do nothing;

  insert into public.curricula (id, title, description, dojo_id, is_public, created_by)
  values
    (curriculum_id, 'Beginner Essentials', 'Foundational techniques for newcomers.', dojo_uci, true, admin_id)
  on conflict (id) do nothing;

  insert into public.lessons (id, curriculum_id, title, content_md, media_urls, order_index, created_by)
  values
    (lesson1, curriculum_id, 'Stances', '# Horse Stance\nPractice daily.', array['https://example.com/stance.jpg'], 1, admin_id),
    (lesson2, curriculum_id, 'Blocks', '# Rising Block\nProtect the head.', array['https://example.com/block.jpg'], 2, admin_id),
    (lesson3, curriculum_id, 'Strikes', '# Reverse Punch\nSnap back quickly.', array['https://example.com/strike.jpg'], 3, admin_id)
  on conflict (id) do nothing;

  insert into public.posts (id, author_id, dojo_id, content_md, media_urls)
  values
    (post1, admin_id, dojo_uci, 'Great training tonight! **Keep practicing**.', array['https://example.com/photo1.jpg']),
    (post2, instructor_id, dojo_dt, 'Reminder: Seminar this weekend.', array['https://example.com/photo2.jpg'])
  on conflict (id) do nothing;

  insert into public.comments (id, post_id, author_id, content)
  values
    (comment1, post1, student_id, 'Feeling pumped!'),
    (comment2, post1, instructor_id, 'Great energy from everyone!')
  on conflict (id) do nothing;

  insert into public.likes (post_id, user_id)
  values
    (post1, student_id),
    (post1, instructor_id)
  on conflict do nothing;

  insert into public.training_logs (id, user_id, dojo_id, date, duration_min, focus, notes)
  values
    (train1, student_id, dojo_uci, current_date - interval '1 day', 60, 'Kata', 'Worked on forms.'),
    (train2, student_id, dojo_uci, current_date, 45, 'Sparring', 'Light contact with peers.')
  on conflict (id) do nothing;

  insert into public.teaching_logs (id, user_id, dojo_id, date, duration_min, topic, notes)
  values
    (teach1, instructor_id, dojo_dt, current_date, 90, 'Beginner class', 'Introduced new students to basics.')
  on conflict (id) do nothing;

  insert into public.journal_entries (id, user_id, title, content_md, mood)
  values
    (journal1, student_id, 'First Class', 'Felt nervous but excited.', 'motivated'),
    (journal2, instructor_id, 'Teaching Reflections', 'Students progressed well.', 'proud'),
    (journal3, admin_id, 'Planning', 'Working on dojo schedule.', 'focused')
  on conflict (id) do nothing;
end $$;
