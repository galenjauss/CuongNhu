import { supabase } from '../lib/supabase';
import type { JournalEntry } from './types';

export const listJournalEntries = async (): Promise<JournalEntry[]> => {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    throw new Error(`List journal entries failed: ${error.message}`);
  }
  return (data ?? []) as JournalEntry[];
};

export const getJournalEntry = async (id: string): Promise<JournalEntry> => {
  const { data, error } = await supabase.from('journal_entries').select('*').eq('id', id).single();
  if (error) {
    throw new Error(`Get journal entry failed: ${error.message}`);
  }
  return data as JournalEntry;
};

export const upsertJournalEntry = async (input: Partial<JournalEntry>): Promise<JournalEntry> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Not authenticated');
  }
  const { data, error } = await supabase
    .from('journal_entries')
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
    throw new Error(`Save journal entry failed: ${error.message}`);
  }
  return data as JournalEntry;
};

export const deleteJournalEntry = async (id: string) => {
  const { error } = await supabase.from('journal_entries').delete().eq('id', id);
  if (error) {
    throw new Error(`Delete journal entry failed: ${error.message}`);
  }
};
