-- ====================================================================
-- AI Voice Receptionist SaaS - Complete Multi-Tenant Database Schema
-- Compatible with PostgreSQL 15+ and Supabase
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. USERS & PROFILES (Synced with Supabase Auth or standalone)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    phone VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. BUSINESSES (Tenants)
CREATE TABLE IF NOT EXISTS businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    business_type VARCHAR(100) DEFAULT 'General Services',
    website VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'United States',
    timezone VARCHAR(100) DEFAULT 'America/New_York',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_businesses_slug ON businesses(slug);

-- 3. BUSINESS MEMBERS (Role-Based Access Control)
CREATE TYPE user_role AS ENUM ('OWNER', 'ADMIN', 'STAFF');

CREATE TABLE IF NOT EXISTS business_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'STAFF',
    title VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (business_id, user_id)
);

CREATE INDEX idx_business_members_business_id ON business_members(business_id);
CREATE INDEX idx_business_members_user_id ON business_members(user_id);

-- 4. BUSINESS SETTINGS
CREATE TABLE IF NOT EXISTS business_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID UNIQUE NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    currency VARCHAR(10) DEFAULT 'USD',
    date_format VARCHAR(20) DEFAULT 'YYYY-MM-DD',
    retention_days INT DEFAULT 365,
    allow_call_recording BOOLEAN DEFAULT FALSE,
    record_transcription BOOLEAN DEFAULT TRUE,
    enable_lead_alerts BOOLEAN DEFAULT TRUE,
    enable_appointment_alerts BOOLEAN DEFAULT TRUE,
    notification_email VARCHAR(255),
    notification_phone VARCHAR(50),
    privacy_policy_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. SERVICES (Catalog of Offerings)
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration_minutes INT NOT NULL DEFAULT 60,
    price_cents INT NOT NULL DEFAULT 0,
    is_booking_enabled BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_services_business_id ON services(business_id);

-- 6. BUSINESS HOURS (Operating Schedule)
CREATE TABLE IF NOT EXISTS business_hours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 1=Monday ... 6=Saturday
    is_open BOOLEAN DEFAULT TRUE,
    open_time TIME NOT NULL DEFAULT '09:00:00',
    close_time TIME NOT NULL DEFAULT '17:00:00',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(business_id, day_of_week)
);

CREATE INDEX idx_business_hours_business_id ON business_hours(business_id);

-- 7. FAQS (Frequently Asked Questions)
CREATE TABLE IF NOT EXISTS faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'General',
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_faqs_business_id ON faqs(business_id);

-- 8. KNOWLEDGE DOCUMENTS & CHUNKS (For AI RAG retrieval)
CREATE TABLE IF NOT EXISTS knowledge_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    document_type VARCHAR(50) DEFAULT 'text', -- 'text', 'url', 'pdf', 'policy'
    source_url TEXT,
    content TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS knowledge_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES knowledge_documents(id) ON DELETE CASCADE,
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    chunk_index INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_knowledge_chunks_business ON knowledge_chunks(business_id);

-- 9. CUSTOMERS
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    address TEXT,
    notes TEXT,
    total_calls INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(business_id, phone)
);

CREATE INDEX idx_customers_business_id ON customers(business_id);
CREATE INDEX idx_customers_phone ON customers(phone);

-- 10. LEADS
CREATE TYPE lead_status AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'BOOKED', 'COMPLETED', 'LOST');

CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    service_requested VARCHAR(255),
    source VARCHAR(100) DEFAULT 'AI_VOICE_CALL',
    status lead_status NOT NULL DEFAULT 'NEW',
    estimated_value_cents INT DEFAULT 0,
    notes TEXT,
    assigned_member_id UUID REFERENCES business_members(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_leads_business_id ON leads(business_id);
CREATE INDEX idx_leads_status ON leads(status);

-- 11. LEAD NOTES
CREATE TABLE IF NOT EXISTS lead_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    note TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. APPOINTMENTS
CREATE TYPE appointment_status AS ENUM ('CONFIRMED', 'PENDING', 'CANCELLED', 'RESCHEDULED', 'COMPLETED', 'NO_SHOW');

CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status appointment_status NOT NULL DEFAULT 'CONFIRMED',
    google_event_id VARCHAR(255),
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_email VARCHAR(255),
    notes TEXT,
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_appointments_business_time ON appointments(business_id, start_time, end_time);

-- 13. CALLS
CREATE TYPE call_status AS ENUM ('INITIATED', 'IN_PROGRESS', 'COMPLETED', 'BUSY', 'FAILED', 'NO_ANSWER', 'TRANSFERRED');

CREATE TABLE IF NOT EXISTS calls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    caller_phone VARCHAR(50) NOT NULL,
    business_phone VARCHAR(50) NOT NULL,
    twilio_call_sid VARCHAR(100) UNIQUE,
    start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_time TIMESTAMPTZ,
    duration_seconds INT DEFAULT 0,
    status call_status NOT NULL DEFAULT 'INITIATED',
    summary TEXT,
    outcome VARCHAR(100) DEFAULT 'INQUIRY',
    was_transferred BOOLEAN DEFAULT FALSE,
    transfer_reason TEXT,
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    recording_url TEXT,
    sentiment VARCHAR(50) DEFAULT 'NEUTRAL',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_calls_business_id ON calls(business_id);
CREATE INDEX idx_calls_created_at ON calls(created_at);

-- 14. CALL EVENTS
CREATE TABLE IF NOT EXISTS call_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    call_id UUID NOT NULL REFERENCES calls(id) ON DELETE CASCADE,
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. CONVERSATIONS & MESSAGES
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    call_id UUID UNIQUE REFERENCES calls(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    channel VARCHAR(50) DEFAULT 'VOICE', -- 'VOICE', 'WHATSAPP', 'WEB_CHAT'
    summary TEXT,
    sentiment VARCHAR(50) DEFAULT 'NEUTRAL',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('system', 'assistant', 'user', 'tool', 'human_agent')),
    content TEXT NOT NULL,
    tool_call_id VARCHAR(100),
    tool_name VARCHAR(100),
    tool_args JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at);

-- 16. AI CONFIGURATIONS
CREATE TABLE IF NOT EXISTS ai_configurations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID UNIQUE NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    ai_name VARCHAR(100) DEFAULT 'Sarah',
    greeting_message TEXT DEFAULT 'Thank you for calling. You''re speaking with the AI receptionist for {{business_name}}. How can I help you today?',
    personality VARCHAR(100) DEFAULT 'Friendly and professional',
    voice_provider VARCHAR(50) DEFAULT 'twilio_alice',
    voice_speed NUMERIC(3,2) DEFAULT 1.0,
    language VARCHAR(20) DEFAULT 'en-US',
    business_instructions TEXT DEFAULT 'You are the helpful front-desk receptionist. Provide accurate business info, check real-time availability, schedule service appointments, and collect caller details with care.',
    things_never_to_say TEXT DEFAULT 'Never give legal, medical, or financial advice. Never guess or promise prices not in the service list. Never confirm appointments without checking availability.',
    response_style VARCHAR(50) DEFAULT 'Concise and conversational',
    enable_human_handoff BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 17. AI ACTIONS / FUNCTION EXECUTION LOGS
CREATE TABLE IF NOT EXISTS ai_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    call_id UUID REFERENCES calls(id) ON DELETE CASCADE,
    action_name VARCHAR(100) NOT NULL,
    input_parameters JSONB NOT NULL DEFAULT '{}',
    output_result JSONB NOT NULL DEFAULT '{}',
    success BOOLEAN NOT NULL DEFAULT TRUE,
    error_message TEXT,
    execution_time_ms INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 18. HUMAN HANDOFF RULES
CREATE TABLE IF NOT EXISTS human_handoff_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    rule_name VARCHAR(255) NOT NULL,
    condition_type VARCHAR(100) NOT NULL, -- 'KEYWORD', 'LOW_CONFIDENCE', 'SENTIMENT_NEGATIVE', 'EMERGENCY'
    condition_value TEXT NOT NULL,
    target_phone VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 19. INTEGRATIONS (Calendar, Voice, WhatsApp)
CREATE TABLE IF NOT EXISTS calendar_integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID UNIQUE NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    provider VARCHAR(50) DEFAULT 'google_calendar',
    calendar_id VARCHAR(255) DEFAULT 'primary',
    access_token TEXT,
    refresh_token TEXT,
    token_expiry TIMESTAMPTZ,
    is_connected BOOLEAN DEFAULT FALSE,
    last_synced_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS voice_integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID UNIQUE NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    provider VARCHAR(50) DEFAULT 'twilio',
    phone_number VARCHAR(50) NOT NULL,
    twiml_app_sid VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_voice_integrations_phone ON voice_integrations(phone_number);

CREATE TABLE IF NOT EXISTS whatsapp_integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID UNIQUE NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    provider VARCHAR(50) DEFAULT 'meta_cloud_api',
    phone_number_id VARCHAR(100),
    business_account_id VARCHAR(100),
    access_token TEXT,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 20. NOTIFICATION TEMPLATES & NOTIFICATIONS LOG
CREATE TABLE IF NOT EXISTS notification_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    template_type VARCHAR(100) NOT NULL, -- 'NEW_LEAD', 'APPOINTMENT_CONFIRMATION', 'APPOINTMENT_CANCELLED', 'HUMAN_HANDOFF'
    channel VARCHAR(50) NOT NULL DEFAULT 'EMAIL', -- 'EMAIL', 'WHATSAPP', 'SMS'
    subject VARCHAR(255),
    content_template TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    channel VARCHAR(50) NOT NULL, -- 'EMAIL', 'WHATSAPP', 'SMS'
    recipient VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    body TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- 'SENT', 'FAILED', 'PENDING'
    error_message TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 21. USAGE RECORDS & SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID UNIQUE NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    plan_tier VARCHAR(50) NOT NULL DEFAULT 'STARTER', -- 'STARTER', 'PROFESSIONAL', 'BUSINESS'
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    billing_period VARCHAR(20) DEFAULT 'MONTHLY',
    call_minutes_limit INT DEFAULT 200,
    ai_requests_limit INT DEFAULT 1000,
    current_period_start TIMESTAMPTZ DEFAULT NOW(),
    current_period_end TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS usage_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    metric_type VARCHAR(100) NOT NULL, -- 'VOICE_SECONDS', 'AI_REQUEST', 'EMAIL_SENT', 'WHATSAPP_SENT', 'APPOINTMENT_BOOKED'
    quantity INT NOT NULL DEFAULT 1,
    call_id UUID REFERENCES calls(id) ON DELETE SET NULL,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_usage_records_business ON usage_records(business_id, recorded_at);

-- 22. AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    actor_email VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(100),
    details JSONB DEFAULT '{}',
    ip_address VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_records ENABLE ROW LEVEL SECURITY;

-- Helper function to check if authenticated user belongs to business
CREATE OR REPLACE FUNCTION auth_is_business_member(b_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM business_members
        WHERE business_id = b_id
          AND user_id = auth.uid()
          AND is_active = TRUE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Standard tenant isolation policy template
CREATE POLICY tenant_isolation_services ON services
    FOR ALL USING (auth_is_business_member(business_id));

CREATE POLICY tenant_isolation_leads ON leads
    FOR ALL USING (auth_is_business_member(business_id));

CREATE POLICY tenant_isolation_appointments ON appointments
    FOR ALL USING (auth_is_business_member(business_id));

CREATE POLICY tenant_isolation_calls ON calls
    FOR ALL USING (auth_is_business_member(business_id));

CREATE POLICY tenant_isolation_conversations ON conversations
    FOR ALL USING (auth_is_business_member(business_id));

-- ====================================================================
-- DEMO SEED DATA: "SwiftFix Plumbing"
-- ====================================================================

DO $$
DECLARE
    demo_user_id UUID := '11111111-1111-1111-1111-111111111111';
    demo_biz_id  UUID := '22222222-2222-2222-2222-222222222222';
    srv_emergency UUID := '33333333-3333-3333-3333-333333333301';
    srv_pipe      UUID := '33333333-3333-3333-3333-333333333302';
    srv_drain     UUID := '33333333-3333-3333-3333-333333333303';
    srv_heater    UUID := '33333333-3333-3333-3333-333333333304';
    cust_john     UUID := '44444444-4444-4444-4444-444444444401';
    cust_sarah    UUID := '44444444-4444-4444-4444-444444444402';
    lead_john     UUID := '55555555-5555-5555-5555-555555555501';
    appt_john     UUID := '66666666-6666-6666-6666-666666666601';
    call_john     UUID := '77777777-7777-7777-7777-777777777701';
    conv_john     UUID := '88888888-8888-8888-8888-888888888801';
BEGIN
    -- Insert Demo User
    INSERT INTO users (id, email, full_name, phone)
    VALUES (demo_user_id, 'owner@swiftfixplumbing.com', 'David Miller', '+1 (555) 234-5678')
    ON CONFLICT (id) DO NOTHING;

    -- Insert Demo Business
    INSERT INTO businesses (id, name, slug, business_type, website, phone, email, address, city, state, country, timezone)
    VALUES (demo_biz_id, 'SwiftFix Plumbing', 'swiftfix-plumbing', 'Plumbing & HVAC', 'https://swiftfixplumbing.demo', '+1 (555) 019-2831', 'contact@swiftfixplumbing.com', '742 Evergreen Terrace', 'Springfield', 'OR', 'United States', 'America/Los_Angeles')
    ON CONFLICT (id) DO NOTHING;

    -- Membership
    INSERT INTO business_members (business_id, user_id, role, title)
    VALUES (demo_biz_id, demo_user_id, 'OWNER', 'Owner & Master Plumber')
    ON CONFLICT (business_id, user_id) DO NOTHING;

    -- Settings
    INSERT INTO business_settings (business_id, currency, allow_call_recording, record_transcription, enable_lead_alerts, notification_email, notification_phone)
    VALUES (demo_biz_id, 'USD', TRUE, TRUE, TRUE, 'owner@swiftfixplumbing.com', '+1 (555) 234-5678')
    ON CONFLICT (business_id) DO NOTHING;

    -- Services
    INSERT INTO services (id, business_id, name, description, duration_minutes, price_cents, is_booking_enabled)
    VALUES 
    (srv_emergency, demo_biz_id, 'Emergency Plumbing', 'Rapid 24/7 emergency response for burst pipes, heavy leaks, or flooding.', 60, 18900, TRUE),
    (srv_pipe, demo_biz_id, 'Pipe Repair & Leak Detection', 'Comprehensive inspection and repair of cracked, leaking, or damaged pipes.', 90, 14900, TRUE),
    (srv_drain, demo_biz_id, 'Drain Cleaning & Hydro-jetting', 'Clearing severe blockages in sinks, toilets, and main sewer lines.', 60, 11900, TRUE),
    (srv_heater, demo_biz_id, 'Water Heater Repair & Install', 'Diagnostic, repair, and full replacement of tank and tankless water heaters.', 120, 24900, TRUE)
    ON CONFLICT (id) DO NOTHING;

    -- Business Hours (Mon-Fri 8am-6pm, Sat 9am-2pm, Sun Closed)
    INSERT INTO business_hours (business_id, day_of_week, is_open, open_time, close_time) VALUES
    (demo_biz_id, 1, TRUE, '08:00:00', '18:00:00'),
    (demo_biz_id, 2, TRUE, '08:00:00', '18:00:00'),
    (demo_biz_id, 3, TRUE, '08:00:00', '18:00:00'),
    (demo_biz_id, 4, TRUE, '08:00:00', '18:00:00'),
    (demo_biz_id, 5, TRUE, '08:00:00', '18:00:00'),
    (demo_biz_id, 6, TRUE, '09:00:00', '14:00:00'),
    (demo_biz_id, 0, FALSE, '09:00:00', '17:00:00')
    ON CONFLICT (business_id, day_of_week) DO NOTHING;

    -- FAQs
    INSERT INTO faqs (business_id, question, answer, category, display_order) VALUES
    (demo_biz_id, 'What is your service call diagnostic fee?', 'Our standard diagnostic dispatch fee is $49, which is completely waived if you proceed with the recommended repair.', 'Pricing', 1),
    (demo_biz_id, 'Do you offer emergency 24/7 service?', 'Yes, SwiftFix Plumbing has on-call technicians available 24 hours a day, 7 days a week for urgent leaks and burst pipes.', 'Services', 2),
    (demo_biz_id, 'Are your plumbers licensed and insured?', 'All SwiftFix technicians are fully licensed journeyman or master plumbers, background-checked, and bonded for up to $2,000,000.', 'General', 3),
    (demo_biz_id, 'What warranty do you provide on repairs?', 'We provide a 1-year parts and labor warranty on all repairs, and a 10-year warranty on newly installed water heaters and piping.', 'Warranty', 4)
    ON CONFLICT DO NOTHING;

    -- AI Configuration
    INSERT INTO ai_configurations (
        business_id, ai_name, greeting_message, personality, language,
        business_instructions, things_never_to_say, response_style, enable_human_handoff
    ) VALUES (
        demo_biz_id,
        'Sarah',
        'Thank you for calling SwiftFix Plumbing! My name is Sarah, your AI assistant. How can I help you today?',
        'Friendly, professional, and efficient',
        'en-US',
        'You are Sarah, the welcoming receptionist for SwiftFix Plumbing. We provide residential and commercial plumbing across Springfield. Answer questions accurately from our services list and FAQs. Collect the customer''s issue, name, phone, and address, then offer to book an appointment with our master plumbers.',
        'Never guarantee exact repair costs without a technician''s on-site inspection. Never give electrical or structural advice. Never make promises about arrival times under 15 minutes unless authorized.',
        'Concise and conversational',
        TRUE
    ) ON CONFLICT (business_id) DO NOTHING;

    -- Voice Integration
    INSERT INTO voice_integrations (business_id, provider, phone_number, is_active)
    VALUES (demo_biz_id, 'twilio', '+15550192831', TRUE)
    ON CONFLICT (business_id) DO NOTHING;

    -- Customers
    INSERT INTO customers (id, business_id, name, phone, email, address, notes, total_calls)
    VALUES 
    (cust_john, demo_biz_id, 'John Smith', '+1 (555) 432-8765', 'john.smith@example.com', '124 Elm Street, Springfield', 'Kitchen sink pipe leaking under countertop.', 2),
    (cust_sarah, demo_biz_id, 'Elena Rostova', '+1 (555) 789-0123', 'elena.rostova@example.com', '458 Oak Avenue, Springfield', 'Annual water heater maintenance inquiry.', 1)
    ON CONFLICT (id) DO NOTHING;

    -- Lead
    INSERT INTO leads (id, business_id, customer_id, name, phone, email, service_id, service_requested, status, estimated_value_cents, notes)
    VALUES (
        lead_john,
        demo_biz_id,
        cust_john,
        'John Smith',
        '+1 (555) 432-8765',
        'john.smith@example.com',
        srv_pipe,
        'Pipe Repair & Leak Detection',
        'BOOKED',
        14900,
        'Kitchen sink pipe leaking heavily. Scheduled 2:00 PM tomorrow.'
    ) ON CONFLICT (id) DO NOTHING;

    -- Appointment
    INSERT INTO appointments (id, business_id, customer_id, lead_id, service_id, start_time, end_time, status, customer_name, customer_phone, customer_email, notes)
    VALUES (
        appt_john,
        demo_biz_id,
        cust_john,
        lead_john,
        srv_pipe,
        NOW() + INTERVAL '1 day' + INTERVAL '4 hours',
        NOW() + INTERVAL '1 day' + INTERVAL '5 hours 30 minutes',
        'CONFIRMED',
        'John Smith',
        '+1 (555) 432-8765',
        'john.smith@example.com',
        'Emergency kitchen sink leak repair. Gate code: #4512.'
    ) ON CONFLICT (id) DO NOTHING;

    -- Call
    INSERT INTO calls (id, business_id, customer_id, caller_phone, business_phone, twilio_call_sid, start_time, end_time, duration_seconds, status, summary, outcome, lead_id, appointment_id, sentiment)
    VALUES (
        call_john,
        demo_biz_id,
        cust_john,
        '+1 (555) 432-8765',
        '+1 (555) 019-2831',
        'CA_demo_twilio_sid_001',
        NOW() - INTERVAL '3 hours',
        NOW() - INTERVAL '3 hours' + INTERVAL '192 seconds',
        192,
        'COMPLETED',
        'Caller John Smith reported a leaking kitchen sink. Sarah verified pipe repair service and scheduled an on-site technician for tomorrow at 2:00 PM. Lead created and calendar invitation dispatched.',
        'APPOINTMENT_BOOKED',
        lead_john,
        appt_john,
        'POSITIVE'
    ) ON CONFLICT (id) DO NOTHING;

    -- Conversation & Messages
    INSERT INTO conversations (id, business_id, call_id, customer_id, channel, summary, sentiment)
    VALUES (conv_john, demo_biz_id, call_john, cust_john, 'VOICE', 'Appointment booking for leaking kitchen sink', 'POSITIVE')
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO messages (conversation_id, business_id, role, content) VALUES
    (conv_john, demo_biz_id, 'assistant', 'Thank you for calling SwiftFix Plumbing! My name is Sarah, your AI assistant. How can I help you today?'),
    (conv_john, demo_biz_id, 'user', 'Hi, my kitchen sink is leaking badly under the cupboard and I need someone tomorrow.'),
    (conv_john, demo_biz_id, 'assistant', 'I can certainly help you with that! We offer pipe repair and leak detection services. Let me check our availability for tomorrow.'),
    (conv_john, demo_biz_id, 'assistant', 'I have openings at 10:00 AM and 2:00 PM tomorrow. Which of those works better for you?'),
    (conv_john, demo_biz_id, 'user', '2:00 PM works great.'),
    (conv_john, demo_biz_id, 'assistant', 'Wonderful. May I please have your full name and phone number for the booking?'),
    (conv_john, demo_biz_id, 'user', 'My name is John Smith and my number is 555-432-8765.'),
    (conv_john, demo_biz_id, 'assistant', 'Thank you, John! What is your address in Springfield?'),
    (conv_john, demo_biz_id, 'user', '124 Elm Street.'),
    (conv_john, demo_biz_id, 'assistant', 'All set, John! I have confirmed your appointment for pipe repair tomorrow at 2:00 PM at 124 Elm Street. We''ve sent a confirmation to your phone. Is there anything else I can assist with?'),
    (conv_john, demo_biz_id, 'user', 'No, that''s all. Thank you!'),
    (conv_john, demo_biz_id, 'assistant', 'Thank you for choosing SwiftFix Plumbing. Have a great day!');

    -- Subscriptions
    INSERT INTO subscriptions (business_id, plan_tier, status, call_minutes_limit, ai_requests_limit)
    VALUES (demo_biz_id, 'PROFESSIONAL', 'ACTIVE', 1000, 5000)
    ON CONFLICT (business_id) DO NOTHING;

END $$;
