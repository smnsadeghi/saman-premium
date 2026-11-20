import { SupabaseClient } from '@supabase/supabase-js';
import { TimeCapsule, CapsuleTrigger } from '@/types/ritual';

/**
 * Creates a time capsule message for the partner.
 */
export async function createTimeCapsule(
  supabase: SupabaseClient,
  params: {
    content: string;
    title?: string;
    deliver_trigger: CapsuleTrigger;
    deliver_date?: string;
  }
): Promise<{ data: TimeCapsule | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('time_capsules')
    .insert([
      {
        content: params.content.trim(),
        title: params.title?.trim() || null,
        deliver_trigger: params.deliver_trigger,
        deliver_date: params.deliver_trigger === 'date' ? params.deliver_date : null,
      },
    ])
    .select()
    .single();

  if (error) {
    return { data: null, error: new Error(error.message) };
  }
  return { data: data as TimeCapsule, error: null };
}

/**
 * Fetches time capsules addressed to or available to read.
 */
export async function fetchTimeCapsules(
  supabase: SupabaseClient,
  limit = 20
): Promise<TimeCapsule[]> {
  const { data, error } = await supabase
    .from('time_capsules')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching time capsules:', error);
    return [];
  }
  return (data || []) as TimeCapsule[];
}

/**
 * Marks a time capsule as opened / read.
 */
export async function markCapsuleOpened(
  supabase: SupabaseClient,
  capsuleId: string
): Promise<boolean> {
  const { error } = await supabase
    .from('time_capsules')
    .update({ opened_at: new Date().toISOString() })
    .eq('id', capsuleId);

  if (error) {
    console.error('Error marking capsule opened:', error);
    return false;
  }
  return true;
}
