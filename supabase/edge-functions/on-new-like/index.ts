import { serve } from 'https://deno.land/std@0.181.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

type LikePayload = {
  record: {
    post_id: string;
    user_id: string;
  };
};

serve(async (req) => {
  const payload = (await req.json()) as LikePayload;
  const { post_id, user_id } = payload.record;

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });

  const { data: post, error: postError } = await supabase
    .from('posts')
    .select('author_id, content_md')
    .eq('id', post_id)
    .single();

  if (postError || !post) {
    return new Response(JSON.stringify({ error: postError?.message ?? 'Post missing' }), { status: 400 });
  }

  if (post.author_id === user_id) {
    return new Response(JSON.stringify({ ok: true, reason: 'self like ignored' }), { status: 200 });
  }

  const { data: likerProfile } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('user_id', user_id)
    .single();

  await supabase.from('notifications').insert({
    user_id: post.author_id,
    type: 'like',
    data: {
      post_id,
      liker_id: user_id,
      liker_name: likerProfile?.display_name ?? 'Someone',
    },
  });

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
});
