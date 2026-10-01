export type UserRole = 'OWNER' | 'ADMIN' | 'STAFF';

export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'BOOKED' | 'COMPLETED' | 'LOST';

export type AppointmentStatus = 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'RESCHEDULED' | 'COMPLETED' | 'NO_SHOW';

export type CallStatus = 'INITIATED' | 'IN_PROGRESS' | 'COMPLETED' | 'BUSY' | 'FAILED' | 'NO_ANSWER' | 'TRANSFERRED';

export type Sentiment = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';

export type NotificationChannel = 'EMAIL' | 'WHATSAPP' | 'SMS';

export type NotificationType = 'NEW_LEAD' | 'APPOINTMENT_CONFIRMATION' | 'APPOINTMENT_CANCELLED' | 'HUMAN_HANDOFF';

export type PlanTier = 'STARTER' | 'PROFESSIONAL' | 'BUSINESS';

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Business {
  id: string;
  name: string;
  slug: string;
  business_type: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  country: string;
  timezone: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BusinessMember {
  id: string;
  business_id: string;
  user_id: string;
  role: UserRole;
  title?: string;
  is_active: boolean;
  user?: User;
  created_at: string;
}

export interface BusinessSettings {
  id: string;
  business_id: string;
  currency: string;
  date_format: string;
  retention_days: number;
  allow_call_recording: boolean;
  record_transcription: boolean;
  enable_lead_alerts: boolean;
  enable_appointment_alerts: boolean;
  notification_email?: string;
  notification_phone?: string;
  privacy_policy_url?: string;
}

export interface Service {
  id: string;
  business_id: string;
  name: string;
  description?: string;
  duration_minutes: number;
  price_cents: number;
  is_booking_enabled: boolean;
  is_active: boolean;
}

export interface BusinessHour {
  id: string;
  business_id: string;
  day_of_week: number; // 0=Sunday ... 6=Saturday
  is_open: boolean;
  open_time: string; // "09:00:00"
  close_time: string; // "17:00:00"
}

export interface FAQ {
  id: string;
  business_id: string;
  question: string;
  answer: string;
  category: string;
  is_active: boolean;
  display_order: number;
}

export interface Customer {
  id: string;
  business_id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
  total_calls: number;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  business_id: string;
  customer_id?: string;
  name: string;
  phone: string;
  email?: string;
  service_id?: string;
  service_requested?: string;
  source: string;
  status: LeadStatus;
  estimated_value_cents: number;
  notes?: string;
  assigned_member_id?: string;
  customer?: Customer;
  service?: Service;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  business_id: string;
  customer_id?: string;
  lead_id?: string;
  service_id?: string;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
  google_event_id?: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  notes?: string;
  cancellation_reason?: string;
  service?: Service;
  created_at: string;
  updated_at: string;
}

export interface Call {
  id: string;
  business_id: string;
  customer_id?: string;
  caller_phone: string;
  business_phone: string;
  twilio_call_sid?: string;
  start_time: string;
  end_time?: string;
  duration_seconds: number;
  status: CallStatus;
  summary?: string;
  outcome?: string;
  was_transferred: boolean;
  transfer_reason?: string;
  lead_id?: string;
  appointment_id?: string;
  recording_url?: string;
  sentiment: Sentiment;
  created_at: string;
}

export interface Conversation {
  id: string;
  business_id: string;
  call_id?: string;
  customer_id?: string;
  channel: string;
  summary?: string;
  sentiment: Sentiment;
  messages?: Message[];
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  business_id: string;
  role: 'system' | 'assistant' | 'user' | 'tool' | 'human_agent';
  content: string;
  tool_call_id?: string;
  tool_name?: string;
  tool_args?: Record<string, unknown>;
  created_at: string;
}

export interface AIConfiguration {
  id: string;
  business_id: string;
  ai_name: string;
  greeting_message: string;
  personality: string;
  voice_provider: string;
  voice_speed: number;
  language: string;
  business_instructions: string;
  things_never_to_say: string;
  response_style: string;
  enable_human_handoff: boolean;
}

export interface CalendarIntegration {
  id: string;
  business_id: string;
  provider: string;
  calendar_id: string;
  is_connected: boolean;
  last_synced_at?: string;
}

export interface VoiceIntegration {
  id: string;
  business_id: string;
  provider: string;
  phone_number: string;
  is_active: boolean;
}

export interface WhatsAppIntegration {
  id: string;
  business_id: string;
  provider: string;
  phone_number_id?: string;
  is_active: boolean;
}

export interface Subscription {
  id: string;
  business_id: string;
  plan_tier: PlanTier;
  status: string;
  call_minutes_limit: number;
  ai_requests_limit: number;
  current_period_start: string;
  current_period_end: string;
}

export interface DashboardMetrics {
  total_calls: number;
  today_calls: number;
  new_leads: number;
  appointments_count: number;
  conversion_rate: number;
  ai_resolution_rate: number;
  human_transfers: number;
  estimated_revenue_cents: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}
