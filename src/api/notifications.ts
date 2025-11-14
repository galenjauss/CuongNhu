import { supabase } from '../lib/supabase';
import type { Notification } from './types';

export const listNotifications = async (): Promise<Notification[]> => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    throw new Error(`List notifications failed: ${error.message}`);
  }
  return (data ?? []) as Notification[];
};

export const markNotificationRead = async (id: string) => {
  const { error } = await supabase.from('notifications').update({ is_read: true }).eq('id', id);
  if (error) {
    throw new Error(`Mark notification read failed: ${error.message}`);
  }
};
