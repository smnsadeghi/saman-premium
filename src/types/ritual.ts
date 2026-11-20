export type WindowStatus = 'active' | 'cooldown' | 'dormant' | 'pre';
export type WindowKind = 'period' | 'support';

export type DeviationReason = 'stress' | 'travel' | 'illness' | 'medication' | 'other';

export interface AppWindow {
  id: string;
  status: WindowStatus;
  kind: WindowKind;
  opened_at?: string;
  expires_at?: string | null;
  summary?: string | null;
  plausibility?: string | null;
  deviation_reason?: DeviationReason | null;
  created_at?: string;
  updated_at?: string;
}

export interface PartnerWindowView {
  id: string;
  status: WindowStatus;
  kind: WindowKind;
  opened_at?: string;
  expires_at?: string | null;
  cycle_day?: number | null;
  summary?: string | null;
  created_at?: string;
}

export type CareRequestType =
  | 'warm_drink'
  | 'chocolate'
  | 'call'
  | 'movie'
  | 'sleep_call'
  | 'quiet'
  | 'sos';

export type CareRequestStatus = 'pending' | 'seen' | 'done';

export interface CareRequest {
  id: string;
  type: CareRequestType;
  label?: string | null;
  status: CareRequestStatus;
  created_at: string;
  user_id?: string;
}

export type CapsuleTrigger = 'next_window' | 'date' | 'on_support';

export interface TimeCapsule {
  id: string;
  sender_id?: string;
  title?: string | null;
  content: string;
  deliver_trigger: CapsuleTrigger;
  deliver_date?: string | null;
  opened_at?: string | null;
  created_at: string;
}

export interface CycleRecord {
  id: string;
  start_date: string;
  end_date?: string | null;
  notes?: string | null;
  created_at?: string;
}

export interface OpenWindowResult {
  id?: string;
  needs_reason?: boolean;
  status?: string;
  kind?: string;
  [key: string]: unknown;
}
