import { z } from 'zod';
export declare const LoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const RegisterSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    full_name: z.ZodString;
    business_name: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    full_name: string;
    business_name: string;
    phone?: string | undefined;
}, {
    email: string;
    password: string;
    full_name: string;
    business_name: string;
    phone?: string | undefined;
}>;
export declare const BusinessProfileSchema: z.ZodObject<{
    name: z.ZodString;
    business_type: z.ZodString;
    website: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    phone: z.ZodString;
    email: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    address: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    state: z.ZodOptional<z.ZodString>;
    country: z.ZodDefault<z.ZodString>;
    timezone: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    phone: string;
    name: string;
    business_type: string;
    country: string;
    timezone: string;
    email?: string | undefined;
    website?: string | undefined;
    address?: string | undefined;
    city?: string | undefined;
    state?: string | undefined;
}, {
    phone: string;
    name: string;
    business_type: string;
    email?: string | undefined;
    website?: string | undefined;
    address?: string | undefined;
    city?: string | undefined;
    state?: string | undefined;
    country?: string | undefined;
    timezone?: string | undefined;
}>;
export declare const ServiceSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    duration_minutes: z.ZodDefault<z.ZodNumber>;
    price_cents: z.ZodDefault<z.ZodNumber>;
    is_booking_enabled: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name: string;
    duration_minutes: number;
    price_cents: number;
    is_booking_enabled: boolean;
    description?: string | undefined;
}, {
    name: string;
    description?: string | undefined;
    duration_minutes?: number | undefined;
    price_cents?: number | undefined;
    is_booking_enabled?: boolean | undefined;
}>;
export declare const BusinessHourSchema: z.ZodObject<{
    day_of_week: z.ZodNumber;
    is_open: z.ZodBoolean;
    open_time: z.ZodString;
    close_time: z.ZodString;
}, "strip", z.ZodTypeAny, {
    day_of_week: number;
    is_open: boolean;
    open_time: string;
    close_time: string;
}, {
    day_of_week: number;
    is_open: boolean;
    open_time: string;
    close_time: string;
}>;
export declare const FAQSchema: z.ZodObject<{
    question: z.ZodString;
    answer: z.ZodString;
    category: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    question: string;
    answer: string;
    category: string;
}, {
    question: string;
    answer: string;
    category?: string | undefined;
}>;
export declare const AIConfigSchema: z.ZodObject<{
    ai_name: z.ZodDefault<z.ZodString>;
    greeting_message: z.ZodString;
    personality: z.ZodDefault<z.ZodString>;
    language: z.ZodDefault<z.ZodString>;
    business_instructions: z.ZodString;
    things_never_to_say: z.ZodDefault<z.ZodString>;
    response_style: z.ZodDefault<z.ZodString>;
    enable_human_handoff: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    ai_name: string;
    greeting_message: string;
    personality: string;
    language: string;
    business_instructions: string;
    things_never_to_say: string;
    response_style: string;
    enable_human_handoff: boolean;
}, {
    greeting_message: string;
    business_instructions: string;
    ai_name?: string | undefined;
    personality?: string | undefined;
    language?: string | undefined;
    things_never_to_say?: string | undefined;
    response_style?: string | undefined;
    enable_human_handoff?: boolean | undefined;
}>;
export declare const CreateLeadSchema: z.ZodObject<{
    name: z.ZodString;
    phone: z.ZodString;
    email: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    service_requested: z.ZodOptional<z.ZodString>;
    service_id: z.ZodOptional<z.ZodString>;
    source: z.ZodDefault<z.ZodString>;
    estimated_value_cents: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    phone: string;
    name: string;
    source: string;
    estimated_value_cents: number;
    email?: string | undefined;
    service_requested?: string | undefined;
    service_id?: string | undefined;
    notes?: string | undefined;
}, {
    phone: string;
    name: string;
    email?: string | undefined;
    service_requested?: string | undefined;
    service_id?: string | undefined;
    source?: string | undefined;
    estimated_value_cents?: number | undefined;
    notes?: string | undefined;
}>;
export declare const UpdateLeadStatusSchema: z.ZodObject<{
    status: z.ZodEnum<["NEW", "CONTACTED", "QUALIFIED", "BOOKED", "COMPLETED", "LOST"]>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "NEW" | "CONTACTED" | "QUALIFIED" | "BOOKED" | "COMPLETED" | "LOST";
    notes?: string | undefined;
}, {
    status: "NEW" | "CONTACTED" | "QUALIFIED" | "BOOKED" | "COMPLETED" | "LOST";
    notes?: string | undefined;
}>;
export declare const CheckAvailabilitySchema: z.ZodObject<{
    service_id: z.ZodOptional<z.ZodString>;
    date: z.ZodString;
    timezone: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    date: string;
    timezone?: string | undefined;
    service_id?: string | undefined;
}, {
    date: string;
    timezone?: string | undefined;
    service_id?: string | undefined;
}>;
export declare const CreateAppointmentSchema: z.ZodObject<{
    customer_name: z.ZodString;
    customer_phone: z.ZodString;
    customer_email: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    service_id: z.ZodOptional<z.ZodString>;
    service_name: z.ZodOptional<z.ZodString>;
    start_time: z.ZodString;
    end_time: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
    lead_id: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    customer_name: string;
    customer_phone: string;
    start_time: string;
    service_id?: string | undefined;
    notes?: string | undefined;
    customer_email?: string | undefined;
    service_name?: string | undefined;
    end_time?: string | undefined;
    lead_id?: string | undefined;
}, {
    customer_name: string;
    customer_phone: string;
    start_time: string;
    service_id?: string | undefined;
    notes?: string | undefined;
    customer_email?: string | undefined;
    service_name?: string | undefined;
    end_time?: string | undefined;
    lead_id?: string | undefined;
}>;
export declare const VoiceChatTurnSchema: z.ZodObject<{
    session_id: z.ZodOptional<z.ZodString>;
    caller_phone: z.ZodDefault<z.ZodString>;
    user_speech: z.ZodString;
    conversation_history: z.ZodDefault<z.ZodArray<z.ZodObject<{
        role: z.ZodEnum<["system", "assistant", "user", "tool"]>;
        content: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        role: "system" | "assistant" | "user" | "tool";
        content: string;
    }, {
        role: "system" | "assistant" | "user" | "tool";
        content: string;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    caller_phone: string;
    user_speech: string;
    conversation_history: {
        role: "system" | "assistant" | "user" | "tool";
        content: string;
    }[];
    session_id?: string | undefined;
}, {
    user_speech: string;
    session_id?: string | undefined;
    caller_phone?: string | undefined;
    conversation_history?: {
        role: "system" | "assistant" | "user" | "tool";
        content: string;
    }[] | undefined;
}>;
export declare const ToolCheckAvailabilityArgs: z.ZodObject<{
    date: z.ZodString;
    service_name: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    date: string;
    service_name?: string | undefined;
}, {
    date: string;
    service_name?: string | undefined;
}>;
export declare const ToolCreateAppointmentArgs: z.ZodObject<{
    customer_name: z.ZodString;
    customer_phone: z.ZodString;
    customer_email: z.ZodOptional<z.ZodString>;
    service_name: z.ZodString;
    start_time_iso: z.ZodString;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    customer_name: string;
    customer_phone: string;
    service_name: string;
    start_time_iso: string;
    notes?: string | undefined;
    customer_email?: string | undefined;
}, {
    customer_name: string;
    customer_phone: string;
    service_name: string;
    start_time_iso: string;
    notes?: string | undefined;
    customer_email?: string | undefined;
}>;
export declare const ToolCreateLeadArgs: z.ZodObject<{
    name: z.ZodString;
    phone: z.ZodString;
    email: z.ZodOptional<z.ZodString>;
    service_requested: z.ZodString;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    phone: string;
    name: string;
    service_requested: string;
    email?: string | undefined;
    notes?: string | undefined;
}, {
    phone: string;
    name: string;
    service_requested: string;
    email?: string | undefined;
    notes?: string | undefined;
}>;
export declare const ToolTransferToHumanArgs: z.ZodObject<{
    reason: z.ZodString;
    caller_name: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    reason: string;
    caller_name?: string | undefined;
}, {
    reason: string;
    caller_name?: string | undefined;
}>;
