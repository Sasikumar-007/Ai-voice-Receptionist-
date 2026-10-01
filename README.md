# AI Voice Receptionist SaaS — "AI Receptionist"

A production-ready, multi-tenant enterprise SaaS platform that provides businesses with an AI-powered voice receptionist to answer telephone calls 24/7, conduct human-like conversational voice interactions using **Gemini**, consult business-specific FAQs, hours, and service catalogs, check availability, book real-time appointments synchronized with Google Calendar, capture leads, trigger notifications (Email via Resend & WhatsApp via Meta Cloud API), and seamlessly escalate to a human agent when required.

---

## 1. Project Architecture

Monorepo structure utilizing npm workspaces:

```
/
├── apps/
│   ├── web/                              # React 18 + Vite + Tailwind CSS + Lucide
│   │   ├── src/
│   │   │   ├── components/Layout/        # Sidebar, Navbar, DashboardLayout
│   │   │   ├── context/AuthContext.tsx   # Auth & Tenant context + 1-Click Demo
│   │   │   ├── pages/
│   │   │   │   ├── LandingPage.tsx       # B2B SaaS landing page with live demo trigger
│   │   │   │   ├── LoginPage.tsx         # Sign in + SwiftFix Plumbing demo login
│   │   │   │   ├── RegisterPage.tsx      # Business signup
│   │   │   │   ├── OnboardingPage.tsx    # 8-step setup wizard
│   │   │   │   ├── DashboardOverview.tsx # Metrics KPIs, activity charts, call table
│   │   │   │   ├── LeadsPage.tsx         # Status pipeline & customer journey drawer
│   │   │   │   ├── AppointmentsPage.tsx  # Availability check & cancellation
│   │   │   │   ├── CallsPage.tsx         # Inbound call logs & audio simulation
│   │   │   │   ├── ConversationsPage.tsx # Dual-pane transcript dialog viewer
│   │   │   │   ├── CustomersPage.tsx     # Customer directory & call counts
│   │   │   │   ├── ServicesPage.tsx      # Service & price management
│   │   │   │   ├── KnowledgeBasePage.tsx # FAQs & verified business knowledge
│   │   │   │   ├── VoiceStudioPage.tsx   # Live in-browser speech recognition & synthesis
│   │   │   │   ├── IntegrationsPage.tsx  # Hub for Twilio, Gemini, GCal, Resend, WhatsApp
│   │   │   │   ├── SettingsPage.tsx      # Guardrails, persona prompt, data retention
│   │   │   │   └── UsagePage.tsx         # Consumed voice minutes & AI turns
│   │   │   ├── lib/api.ts                # HTTP client with JWT header injection
│   │   │   └── index.css                 # Custom scrollbars, glassmorphism, animations
│   │   └── package.json
│   │
│   └── api/                              # Fastify REST & WebSocket Backend
│       ├── src/
│       │   ├── middleware/auth.ts        # JWT validation & server-side tenant lookup
│       │   ├── repositories/database.ts  # Multi-tenant data store (Supabase / In-Memory)
│       │   ├── services/
│       │   │   ├── geminiService.ts      # Gemini AI reasoning & tool execution
│       │   │   ├── voiceService.ts       # Twilio TwiML generator & IVoiceProvider abstraction
│       │   │   ├── calendarService.ts    # Google Calendar OAuth 2.0 & event creation
│       │   │   └── notificationService.ts# Resend email & WhatsApp Business Cloud API
│       │   ├── routes/                   # auth, business, services, hours, faqs, leads,
│       │   │                             # appointments, calls, conversations, ai, voice,
│       │   │                             # calendar, notifications, integrations, dashboard
│       │   ├── config.ts                 # Validated environment settings
│       │   └── server.ts                 # Fastify bootstrap & route registration
│       ├── test/api.test.ts              # Vitest test suite (12 passed tests)
│       └── package.json
│
├── packages/
│   └── shared/                           # Shared models, Zod validation, demo constants
│       ├── src/
│       │   ├── types.ts                  # TypeScript interfaces for all DB entities
│       │   ├── schemas.ts                # Zod request & tool argument validation schemas
│       │   ├── constants.ts              # SwiftFix Plumbing seed fixtures & defaults
│       │   └── index.ts                  # Pure ESM module exports
│       └── package.json
│
└── supabase/
    └── migrations/
        └── 20261001000000_init_schema.sql # Complete PostgreSQL DDL with RLS & seed data
```

---

## 2. Multi-Tenant Isolation Strategy

- Every tenant table contains `business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE`.
- PostgreSQL Row-Level Security (RLS) is enabled across all tenant tables.
- **Server-Side Identity**: The active business ID is derived strictly from the authenticated JWT session claim and server database query (`db.getBusinessMember(userId)`). Client-supplied `business_id` query strings or body parameters are NEVER trusted for authorization.
- For inbound telephone calls, the dialed phone number (`To`) is looked up in the `voice_integrations` table to resolve the tenant context.

---

## 3. Demo Credentials & Quick Test

- **Demo Business**: SwiftFix Plumbing
- **Owner Email**: `owner@swiftfixplumbing.com`
- **Password**: `password123`
- **1-Click Access**: On the Login page (`/login`), click **"1-Click SwiftFix Demo Login"** to enter the dashboard immediately without typing credentials.

---

## 4. Local Setup Instructions

### Prerequisites
- Node.js v18+ (tested on Node v24)
- npm v9+

### Install Dependencies
```bash
npm install
```

### Run Automated Tests
```bash
npm run test --workspace=@ai-receptionist/api
```

### Typecheck All Workspaces
```bash
npm run typecheck
```

### Build Production Bundles
```bash
npm run build
```

### Start Development Servers
In separate terminals or concurrently:
```bash
# Terminal 1: Backend Fastify API (Runs on http://localhost:4000)
npm run dev:api

# Terminal 2: Frontend Web App (Runs on http://localhost:3000)
npm run dev:web
```

Open `http://localhost:3000` in your web browser.

---

## 5. Environment Variables (.env)

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Key environment configurations:
- `PORT=4000`: Backend port.
- `JWT_SECRET`: Signing secret for JWT session tokens.
- `SUPABASE_URL` & `SUPABASE_SERVICE_ROLE_KEY`: Supabase PostgreSQL URL and service role key. (When omitted or set to mock, the system operates seamlessly in memory).
- `GEMINI_API_KEY`: Google Gemini AI API key for natural language reasoning and tool execution.
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`: Twilio credentials for PSTN inbound routing.
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`: Google Calendar OAuth credentials.
- `RESEND_API_KEY` & `NOTIFICATION_FROM_EMAIL`: Resend email API key.
- `WHATSAPP_ACCESS_TOKEN` & `WHATSAPP_PHONE_NUMBER_ID`: Meta WhatsApp Cloud API credentials.
- `ENABLE_MOCK_FALLBACK=true`: Enables offline testing mode without live carrier charges.

---

## 6. Supabase Setup Instructions
1. Create a project in [Supabase](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Paste and run the entire contents of [`supabase/migrations/20261001000000_init_schema.sql`](supabase/migrations/20261001000000_init_schema.sql).
4. Copy your `Project URL` and `service_role` key from **Project Settings > API** into `.env`.

---

## 7. Twilio Voice Setup Instructions
1. Create a [Twilio](https://twilio.com) account and purchase a phone number with Voice capabilities.
2. In the Twilio Console, navigate to **Phone Numbers > Manage > Active Numbers**.
3. Under **Voice & Fax**, set **A CALL COMES IN** to:
   - **Webhook**: `https://<YOUR_DEPLOYED_API_DOMAIN>/api/voice/incoming`
   - **HTTP Method**: `POST`
4. Copy `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_PHONE_NUMBER` into `.env`.

---

## 8. Google Calendar Setup Instructions
1. Open [Google Cloud Console](https://console.cloud.google.com).
2. Enable the **Google Calendar API**.
3. Create an **OAuth 2.0 Client ID** (Web application).
4. Add Authorized redirect URI: `https://<YOUR_DEPLOYED_API_DOMAIN>/api/calendar/callback`.
5. Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to `.env`.

---

## 9. Interactive Voice Studio (Testing in Browser)
For instant evaluation without needing a live telephone number:
1. Log in to the dashboard at `http://localhost:3000`.
2. Click **"Test AI Voice"** in the top navbar or navigate to **Voice Studio** in the sidebar.
3. Click **"Simulate Inbound Call"**.
4. Speak via microphone or click the **"Master Prompt Scenario"** button (*"My kitchen sink is leaking and I need someone tomorrow."*).
5. Listen to Sarah synthesize her voice response in real time, watch the availability check execute, pick 2:00 PM, and observe the appointment and lead created in the dashboard!
