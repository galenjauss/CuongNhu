import { supabase } from '../lib/supabase';
import type { Like } from './types';

export const toggleLike = async (postId: string): Promise<{ liked: boolean }> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Not authenticated');
  }
  const { data: existing, error: selectError } = await supabase
    .from('likes')
    .select('*')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .maybeSingle();
  if (selectError) {
    throw new Error(`Check like failed: ${selectError.message}`);
  }
  if (existing) {
    const { error } = await supabase.from('likes').delete().eq('post_id', postId).eq('user_id', user.id);
    if (error) {
      throw new Error(`Unlike failed: ${error.message}`);
    }
    return { liked: false };
  }
  const { error } = await supabase.from('likes').insert({ post_id: postId, user_id: user.id });
  if (error) {
    throw new Error(`Like failed: ${error.message}`);
  }
  return { liked: true };
};

export const listLikers = async (postId: string): Promise<Like[]> => {
  const { data, error } = await supabase
    .from('likes')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: false });
  if (error) {
    throw new Error(`List likers failed: ${error.message}`);
  }
  return (data ?? []) as Like[];
};
