import { z } from 'zod';
// Authentication Schemas
export const LoginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters')
});
export const RegisterSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    full_name: z.string().min(2, 'Name must be at least 2 characters'),
    business_name: z.string().min(2, 'Business name must be at least 2 characters'),
    phone: z.string().optional()
});
// Business Onboarding & Profile Schemas
export const BusinessProfileSchema = z.object({
    name: z.string().min(2, 'Business name is required'),
    business_type: z.string().min(2, 'Business type is required'),
    website: z.string().url().optional().or(z.literal('')),
    phone: z.string().min(5, 'Valid business phone is required'),
    email: z.string().email().optional().or(z.literal('')),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().default('United States'),
    timezone: z.string().default('America/New_York')
});
// Services Schema
export const ServiceSchema = z.object({
    name: z.string().min(2, 'Service name is required'),
    description: z.string().optional(),
    duration_minutes: z.coerce.number().min(15).max(480).default(60),
    price_cents: z.coerce.number().min(0).default(0),
    is_booking_enabled: z.boolean().default(true)
});
// Business Hours Schema
export const BusinessHourSchema = z.object({
    day_of_week: z.number().min(0).max(6),
    is_open: z.boolean(),
    open_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, 'Format HH:MM'),
    close_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, 'Format HH:MM')
});
// FAQ Schema
export const FAQSchema = z.object({
    question: z.string().min(3, 'Question is required'),
    answer: z.string().min(3, 'Answer is required'),
    category: z.string().default('General')
});
// AI Configuration Schema
export const AIConfigSchema = z.object({
    ai_name: z.string().min(1, 'AI Name is required').default('Sarah'),
    greeting_message: z.string().min(5, 'Greeting message is required'),
    personality: z.string().default('Friendly and professional'),
    language: z.string().default('en-US'),
    business_instructions: z.string().min(10, 'Business instructions are required'),
    things_never_to_say: z.string().default(''),
    response_style: z.string().default('Concise and conversational'),
    enable_human_handoff: z.boolean().default(true)
});
// Lead Schemas
export const CreateLeadSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    phone: z.string().min(5, 'Phone number is required'),
    email: z.string().email().optional().or(z.literal('')),
    service_requested: z.string().optional(),
    service_id: z.string().uuid().optional(),
    source: z.string().default('AI_VOICE_CALL'),
    estimated_value_cents: z.number().optional().default(0),
    notes: z.string().optional()
});
export const UpdateLeadStatusSchema = z.object({
    status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'BOOKED', 'COMPLETED', 'LOST']),
    notes: z.string().optional()
});
// Appointment Schemas
export const CheckAvailabilitySchema = z.object({
    service_id: z.string().uuid().optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
    timezone: z.string().optional()
});
export const CreateAppointmentSchema = z.object({
    customer_name: z.string().min(2, 'Customer name is required'),
    customer_phone: z.string().min(5, 'Customer phone is required'),
    customer_email: z.string().email().optional().or(z.literal('')),
    service_id: z.string().uuid().optional(),
    service_name: z.string().optional(),
    start_time: z.string().datetime(),
    end_time: z.string().datetime().optional(),
    notes: z.string().optional(),
    lead_id: z.string().uuid().optional()
});
// AI Voice / Chat Turn Schema
export const VoiceChatTurnSchema = z.object({
    session_id: z.string().optional(),
    caller_phone: z.string().default('+1 (555) 000-0000'),
    user_speech: z.string().min(1, 'Caller speech cannot be empty'),
    conversation_history: z.array(z.object({
        role: z.enum(['system', 'assistant', 'user', 'tool']),
        content: z.string()
    })).default([])
});
// AI Function Calling Tool Schemas
export const ToolCheckAvailabilityArgs = z.object({
    date: z.string().describe('The date to check availability for in YYYY-MM-DD format (e.g. 2026-10-02)'),
    service_name: z.string().optional().describe('The name or type of service requested')
});
export const ToolCreateAppointmentArgs = z.object({
    customer_name: z.string().describe('Full name of the customer booking the appointment'),
    customer_phone: z.string().describe('Phone number of the customer'),
    customer_email: z.string().optional().describe('Email address of the customer if provided'),
    service_name: z.string().describe('The name of the service to be booked'),
    start_time_iso: z.string().describe('The confirmed appointment start time in ISO 8601 format'),
    notes: z.string().optional().describe('Any specific customer notes, issue description, or address details')
});
export const ToolCreateLeadArgs = z.object({
    name: z.string().describe('Name of the caller or prospective client'),
    phone: z.string().describe('Phone number to reach the lead'),
    email: z.string().optional().describe('Email address if provided'),
    service_requested: z.string().describe('What service or inquiry they called about'),
    notes: z.string().optional().describe('Key details gathered during the conversation')
});
export const ToolTransferToHumanArgs = z.object({
    reason: z.string().describe('The reason the call needs to be transferred to a human agent'),
    caller_name: z.string().optional().describe('The caller name if collected')
});
