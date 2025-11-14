import { supabase } from '../lib/supabase';
import type { Dojo, DojoMember, MemberRole } from './types';

export const listDojos = async (): Promise<Dojo[]> => {
  const { data, error } = await supabase.from('dojos').select('*').order('name');
  if (error) {
    throw new Error(`List dojos failed: ${error.message}`);
  }
  return (data ?? []) as Dojo[];
};

export const createDojo = async (input: Pick<Dojo, 'name' | 'location' | 'description'>): Promise<Dojo> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Not authenticated');
  }
  const { data, error } = await supabase
    .from('dojos')
    .insert({
      name: input.name,
      location: input.location,
      description: input.description,
      created_by: user.id,
    })
    .select('*')
    .single();
  if (error) {
    throw new Error(`Create dojo failed: ${error.message}`);
  }
  return data as Dojo;
};

export const listMembers = async (dojoId: string): Promise<DojoMember[]> => {
  const { data, error } = await supabase
    .from('dojo_members')
    .select('*, profiles(*)')
    .eq('dojo_id', dojoId)
    .order('joined_at', { ascending: true });
  if (error) {
    throw new Error(`List members failed: ${error.message}`);
  }
  return (data ?? []) as DojoMember[];
};

export const joinDojo = async (dojoId: string): Promise<void> => {
  const {
    data: { user },
    error: sessionError,
  } = await supabase.auth.getUser();
  if (sessionError || !user) {
    throw new Error('Must be authenticated to join dojo');
  }
  const { error } = await supabase.from('dojo_members').upsert({ dojo_id: dojoId, user_id: user.id });
  if (error) {
    throw new Error(`Join dojo failed: ${error.message}`);
  }
};

export const updateMemberRole = async (dojoId: string, userId: string, role: MemberRole) => {
  const { error } = await supabase
    .from('dojo_members')
    .update({ role })
    .eq('dojo_id', dojoId)
    .eq('user_id', userId);
  if (error) {
    throw new Error(`Update member role failed: ${error.message}`);
  }
};
