import { supabase } from '../lib/supabase';
import type { TeachingLog } from './types';

export const listTeachingLogs = async (): Promise<TeachingLog[]> => {
  const { data, error } = await supabase
    .from('teaching_logs')
    .select('*')
    .order('date', { ascending: false });
  if (error) {
    throw new Error(`List teaching logs failed: ${error.message}`);
  }
  return (data ?? []) as TeachingLog[];
};

export const upsertTeachingLog = async (input: Partial<TeachingLog>): Promise<TeachingLog> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Not authenticated');
  }
  const { data, error } = await supabase
    .from('teaching_logs')
    .upsert(
      {
        ...input,
        user_id: user.id,
      },
      { onConflict: 'id' },
    )
    .select('*')
    .single();
  if (error) {
    throw new Error(`Save teaching log failed: ${error.message}`);
  }
  return data as TeachingLog;
};

export const deleteTeachingLog = async (id: string) => {
  const { error } = await supabase.from('teaching_logs').delete().eq('id', id);
  if (error) {
    throw new Error(`Delete teaching log failed: ${error.message}`);
  }
};
