import { supabase } from '../lib/supabase';
import type { Comment } from './types';

export const listCommentsByPost = async (postId: string): Promise<Comment[]> => {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });
  if (error) {
    throw new Error(`List comments failed: ${error.message}`);
  }
  return (data ?? []) as Comment[];
};

export const addComment = async (input: Pick<Comment, 'post_id' | 'content'>): Promise<Comment> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Not authenticated');
  }
  const { data, error } = await supabase
    .from('comments')
    .insert({ ...input, author_id: user.id })
    .select('*')
    .single();
  if (error) {
    throw new Error(`Add comment failed: ${error.message}`);
  }
  return data as Comment;
};

export const deleteComment = async (id: string) => {
  const { error } = await supabase.from('comments').delete().eq('id', id);
  if (error) {
    throw new Error(`Delete comment failed: ${error.message}`);
  }
};
