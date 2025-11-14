import { supabase } from '../lib/supabase';
import type { FeedPost, Post } from './types';

export const listFeed = async (limit = 20, cursor?: string): Promise<{ data: FeedPost[]; nextCursor: string | null }> => {
  let query = supabase
    .from('posts')
    .select('*, profiles(*), comments(*), likes(*)')
    .order('created_at', { ascending: false })
    .limit(limit + 1);
  if (cursor) {
    query = query.lt('created_at', cursor);
  }
  const { data, error } = await query;
  if (error) {
    throw new Error(`List feed failed: ${error.message}`);
  }
  const items = (data ?? []) as FeedPost[];
  let nextCursor: string | null = null;
  if (items.length > limit) {
    const next = items.pop();
    nextCursor = next?.created_at ?? null;
  }
  return { data: items, nextCursor };
};

export const createPost = async (input: Partial<Post>): Promise<Post> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Not authenticated');
  }
  const { data, error } = await supabase
    .from('posts')
    .insert({
      author_id: user.id,
      content_md: input.content_md ?? '',
      media_urls: input.media_urls ?? [],
      dojo_id: input.dojo_id ?? null,
    })
    .select('*')
    .single();
  if (error) {
    throw new Error(`Create post failed: ${error.message}`);
  }
  return data as Post;
};

export const deletePost = async (id: string) => {
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) {
    throw new Error(`Delete post failed: ${error.message}`);
  }
};
