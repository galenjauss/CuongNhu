import { supabase } from '../lib/supabase';
import type { TrainingLog, TrainingSummary } from './types';

export const listTrainingLogs = async (): Promise<TrainingLog[]> => {
  const { data, error } = await supabase
    .from('training_logs')
    .select('*')
    .order('date', { ascending: false });
  if (error) {
    throw new Error(`List training logs failed: ${error.message}`);
  }
  return (data ?? []) as TrainingLog[];
};

export const upsertTrainingLog = async (input: Partial<TrainingLog>): Promise<TrainingLog> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Not authenticated');
  }
  const { data, error } = await supabase
    .from('training_logs')
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
    throw new Error(`Save training log failed: ${error.message}`);
  }
  return data as TrainingLog;
};

export const deleteTrainingLog = async (id: string) => {
  const { error } = await supabase.from('training_logs').delete().eq('id', id);
  if (error) {
    throw new Error(`Delete training log failed: ${error.message}`);
  }
};

export const summarizeTraining = (logs: TrainingLog[]): TrainingSummary[] => {
  const map = new Map<string, number>();
  logs.forEach((log) => {
    const month = log.date.slice(0, 7);
    const prev = map.get(month) ?? 0;
    map.set(month, prev + (log.duration_min ?? 0));
  });
  return Array.from(map.entries())
    .map(([month, minutes]) => ({ month, minutes }))
    .sort((a, b) => a.month.localeCompare(b.month));
};
