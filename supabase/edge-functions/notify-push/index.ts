import { serve } from 'https://deno.land/std@0.181.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

serve(async (req) => {
  const { user_id } = await req.json();
  if (!user_id) {
    return new Response(JSON.stringify({ error: 'user_id required' }), { status: 400 });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const expoToken = Deno.env.get('EXPO_ACCESS_TOKEN');

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('expo_push_token, display_name')
    .eq('user_id', user_id)
    .single();

  if (profileError || !profile?.expo_push_token) {
    return new Response(JSON.stringify({ ok: false, reason: 'no token' }), { status: 200 });
  }

  const { data: notifications, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user_id)
    .eq('is_read', false)
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  const body = notifications
    .map((n) => `${n.type.toUpperCase()}: ${JSON.stringify(n.data)}`)
    .join('\n');

  const message = {
    to: profile.expo_push_token,
    sound: 'default',
    title: `Cuong Nhu Updates for ${profile.display_name}`,
    body: body || 'You have new notifications.',
  };

  if (!expoToken) {
    return new Response(JSON.stringify({ warning: 'EXPO_ACCESS_TOKEN not set', message }), { status: 200 });
  }

  const response = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${expoToken}`,
    },
    body: JSON.stringify(message),
  });

  return new Response(await response.text(), { status: response.status });
});
