import { SupabaseClient } from '@supabase/supabase-js';
import { CareRequest, CareRequestType, CareRequestStatus } from '@/types/ritual';

export interface SendCareRequestResult {
  data: CareRequest | null;
  error: Error | null;
  isWindowLocked: boolean;
}

/**
 * Sends a care request from Her to Him.
 * Gracefully detects `window_locked` exception.
 */
export async function sendCareRequest(
  supabase: SupabaseClient,
  type: CareRequestType,
  label?: string
): Promise<SendCareRequestResult> {
  const { data, error } = await supabase
    .from('care_requests')
    .insert([
      {
        type,
        label: label?.trim() || null,
        status: 'pending',
      },
    ])
    .select()
    .single();

  if (error) {
    const errorMsg = (error.message || '').toLowerCase();
    const isWindowLocked =
      errorMsg.includes('window_locked') ||
      errorMsg.includes('locked') ||
      error.code === 'P0001';

    return {
      data: null,
      error: new Error(error.message),
      isWindowLocked,
    };
  }

  return {
    data: data as CareRequest,
    error: null,
    isWindowLocked: false,
  };
}

/**
 * Fetches care requests list.
 */
export async function fetchCareRequests(
  supabase: SupabaseClient,
  limit = 20
): Promise<CareRequest[]> {
  const { data, error } = await supabase
    .from('care_requests')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching care requests:', error);
    return [];
  }
  return (data || []) as CareRequest[];
}

/**
 * Updates a care request status to 'seen' or 'done' (Him action).
 */
export async function updateCareRequestStatus(
  supabase: SupabaseClient,
  requestId: string,
  status: CareRequestStatus
): Promise<{ success: boolean; error: Error | null; isWindowLocked: boolean }> {
  const { error } = await supabase
    .from('care_requests')
    .update({ status })
    .eq('id', requestId);

  if (error) {
    const errorMsg = (error.message || '').toLowerCase();
    const isWindowLocked =
      errorMsg.includes('window_locked') ||
      errorMsg.includes('locked') ||
      error.code === 'P0001';

    return {
      success: false,
      error: new Error(error.message),
      isWindowLocked,
    };
  }

  return { success: true, error: null, isWindowLocked: false };
}
