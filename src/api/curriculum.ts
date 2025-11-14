import { supabase } from '../lib/supabase';
import type { Curriculum, CurriculumWithLessons, Lesson } from './types';

export const listCurricula = async (): Promise<Curriculum[]> => {
  const { data, error } = await supabase.from('curricula').select('*').order('created_at', { ascending: false });
  if (error) {
    throw new Error(`List curricula failed: ${error.message}`);
  }
  return (data ?? []) as Curriculum[];
};

export const getCurriculum = async (id: string): Promise<CurriculumWithLessons> => {
  const { data, error } = await supabase
    .from('curricula')
    .select('*, lessons(*)')
    .eq('id', id)
    .maybeSingle();
  if (error) {
    throw new Error(`Get curriculum failed: ${error.message}`);
  }
  if (!data) {
    throw new Error('Curriculum not found');
  }
  return { ...(data as Curriculum), lessons: (data.lessons ?? []) as Lesson[] };
};

export const listLessons = async (curriculumId: string): Promise<Lesson[]> => {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('curriculum_id', curriculumId)
    .order('order_index', { ascending: true });
  if (error) {
    throw new Error(`List lessons failed: ${error.message}`);
  }
  return (data ?? []) as Lesson[];
};

export const createCurriculum = async (input: Partial<Curriculum>): Promise<Curriculum> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Not authenticated');
  }
  const { data, error } = await supabase
    .from('curricula')
    .insert({
      title: input.title,
      description: input.description,
      dojo_id: input.dojo_id,
      is_public: input.is_public ?? true,
      created_by: user.id,
    })
    .select('*')
    .single();
  if (error) {
    throw new Error(`Create curriculum failed: ${error.message}`);
  }
  return data as Curriculum;
};

export const upsertLesson = async (input: Partial<Lesson> & { curriculum_id: string }): Promise<Lesson> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Not authenticated');
  }
  const { data, error } = await supabase
    .from('lessons')
    .upsert(
      {
        ...input,
        created_by: user.id,
      },
      { onConflict: 'id' },
    )
    .select('*')
    .single();
  if (error) {
    throw new Error(`Save lesson failed: ${error.message}`);
  }
  return data as Lesson;
};

export const deleteLesson = async (id: string) => {
  const { error } = await supabase.from('lessons').delete().eq('id', id);
  if (error) {
    throw new Error(`Delete lesson failed: ${error.message}`);
  }
};

export const deleteCurriculum = async (id: string) => {
  const { error } = await supabase.from('curricula').delete().eq('id', id);
  if (error) {
    throw new Error(`Delete curriculum failed: ${error.message}`);
  }
};
