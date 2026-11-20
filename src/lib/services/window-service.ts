import { SupabaseClient } from '@supabase/supabase-js';
import { AppWindow, PartnerWindowView, WindowKind, DeviationReason, OpenWindowResult } from '@/types/ritual';

/**
 * Reads current window status for Her from `app_windows` table.
 */
export async function fetchHerWindow(supabase: SupabaseClient): Promise<AppWindow | null> {
  const { data, error } = await supabase
    .from('app_windows')
    .select('id, status, kind, opened_at, expires_at, summary, plausibility, deviation_reason, created_at, updated_at')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching her window:', error);
    return null;
  }
  return data as AppWindow | null;
}

/**
 * Reads current window status for Him exclusively from `partner_window_view`.
 * Note: `app_windows` RLS is blocked for Him. Never query plausibility or deviation_reason.
 */
export async function fetchHimWindow(supabase: SupabaseClient): Promise<PartnerWindowView | null> {
  const { data, error } = await supabase
    .from('partner_window_view')
    .select('id, status, kind, opened_at, expires_at, cycle_day, summary, created_at')
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching partner_window_view for him:', error);
    return null;
  }
  return data as PartnerWindowView | null;
}

/**
 * RPC: Opens a window ('period' | 'support').
 * Returns an object with { id, needs_reason }
 */
export async function openWindowRpc(
  supabase: SupabaseClient,
  kind: WindowKind
): Promise<{ data: OpenWindowResult | null; error: Error | null }> {
  const { data, error } = await supabase.rpc('open_window', { p_kind: kind });

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  // Handle json/record response safely
  let parsed: OpenWindowResult = {};
  if (typeof data === 'object' && data !== null) {
    parsed = data as OpenWindowResult;
  } else if (typeof data === 'string') {
    try {
      parsed = JSON.parse(data);
    } catch {
      parsed = { id: data };
    }
  }

  return { data: parsed, error: null };
}

/**
 * RPC: Records the deviation reason if needs_reason was true.
 */
export async function setDeviationReasonRpc(
  supabase: SupabaseClient,
  windowId: string,
  reason: DeviationReason
): Promise<{ success: boolean; error: Error | null }> {
  const { error } = await supabase.rpc('set_deviation_reason', {
    p_window: windowId,
    p_reason: reason,
  });

  if (error) {
    return { success: false, error: new Error(error.message) };
  }
  return { success: true, error: null };
}

/**
 * RPC: Closes the current active window.
 */
export async function closeWindowRpc(
  supabase: SupabaseClient,
  skipCooldown = false
): Promise<{ success: boolean; error: Error | null }> {
  const { error } = await supabase.rpc('close_window', {
    p_skip_cooldown: skipCooldown,
  });

  if (error) {
    return { success: false, error: new Error(error.message) };
  }
  return { success: true, error: null };
}

/**
 * RPC: Extends support window by 24 hours (only before expires_at).
 */
export async function extendSupportWindowRpc(
  supabase: SupabaseClient
): Promise<{ success: boolean; error: Error | null }> {
  const { error } = await supabase.rpc('extend_support_window');

  if (error) {
    return { success: false, error: new Error(error.message) };
  }
  return { success: true, error: null };
}
