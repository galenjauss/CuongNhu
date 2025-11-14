import { supabase } from '../lib/supabase';

export type SearchResult = {
  type: 'profile' | 'dojo' | 'curriculum' | 'post';
  id: string;
  title: string;
  subtitle?: string;
};

export const globalSearch = async (term: string): Promise<SearchResult[]> => {
  const likeTerm = `%${term}%`;

  const [profiles, dojos, curricula, posts] = await Promise.all([
    supabase.from('profiles').select('user_id, display_name, bio').ilike('display_name', likeTerm),
    supabase.from('dojos').select('id, name, location').ilike('name', likeTerm),
    supabase.from('curricula').select('id, title, description').ilike('title', likeTerm),
    supabase.from('posts').select('id, content_md').ilike('content_md', likeTerm),
  ]);

  const results: SearchResult[] = [];

  if (profiles.error) throw new Error(`Search profiles failed: ${profiles.error.message}`);
  if (profiles.data) {
    results.push(
      ...profiles.data.map((p) => ({
        type: 'profile' as const,
        id: p.user_id,
        title: p.display_name,
        subtitle: p.bio ?? undefined,
      })),
    );
  }

  if (dojos.error) throw new Error(`Search dojos failed: ${dojos.error.message}`);
  if (dojos.data) {
    results.push(
      ...dojos.data.map((d) => ({
        type: 'dojo' as const,
        id: d.id,
        title: d.name,
        subtitle: d.location ?? undefined,
      })),
    );
  }

  if (curricula.error) throw new Error(`Search curricula failed: ${curricula.error.message}`);
  if (curricula.data) {
    results.push(
      ...curricula.data.map((c) => ({
        type: 'curriculum' as const,
        id: c.id,
        title: c.title,
        subtitle: c.description ?? undefined,
      })),
    );
  }

  if (posts.error) throw new Error(`Search posts failed: ${posts.error.message}`);
  if (posts.data) {
    results.push(
      ...posts.data.map((p) => ({
        type: 'post' as const,
        id: p.id,
        title: p.content_md?.slice(0, 50) ?? '',
      })),
    );
  }

  return results;
};
