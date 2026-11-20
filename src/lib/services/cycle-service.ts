import { SupabaseClient } from '@supabase/supabase-js';
import { CycleRecord } from '@/types/ritual';

/**
 * Fetches recent menstrual cycle records.
 */
export async function fetchCycles(
  supabase: SupabaseClient,
  limit = 10
): Promise<CycleRecord[]> {
  const { data, error } = await supabase
    .from('cycles')
    .select('id, start_date, end_date, notes, created_at')
    .order('start_date', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching cycles:', error);
    return [];
  }
  return (data || []) as CycleRecord[];
}

/**
 * Inserts or logs a cycle date entry.
 */
export async function recordCycle(
  supabase: SupabaseClient,
  params: {
    start_date: string;
    end_date?: string | null;
    notes?: string | null;
  }
): Promise<{ data: CycleRecord | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('cycles')
    .insert([
      {
        start_date: params.start_date,
        end_date: params.end_date || null,
        notes: params.notes?.trim() || null,
      },
    ])
    .select()
    .single();

  if (error) {
    return { data: null, error: new Error(error.message) };
  }
  return { data: data as CycleRecord, error: null };
}
