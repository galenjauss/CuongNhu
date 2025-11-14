import { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export const handleError = (error: PostgrestError | null, context: string) => {
  if (error) {
    const err = new Error(`${context}: ${error.message}`);
    (err as any).cause = error;
    throw err;
  }
};

export const fromSupabase = () => supabase;
