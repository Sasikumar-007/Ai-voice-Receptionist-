import { Business, Service, BusinessHour, FAQ, AIConfiguration, Subscription } from './types.js';

export const DEMO_BUSINESS_ID = '22222222-2222-2222-2222-222222222222';
export const DEMO_USER_ID = '11111111-1111-1111-1111-111111111111';

export const DEMO_BUSINESS: Business = {
  id: DEMO_BUSINESS_ID,
  name: 'SwiftFix Plumbing',
  slug: 'swiftfix-plumbing',
  business_type: 'Plumbing & HVAC',
  website: 'https://swiftfixplumbing.demo',
  phone: '+1 (555) 019-2831',
  email: 'contact@swiftfixplumbing.com',
  address: '742 Evergreen Terrace',
  city: 'Springfield',
  state: 'OR',
  country: 'United States',
  timezone: 'America/Los_Angeles',
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export const DEMO_SERVICES: Service[] = [
  {
    id: '33333333-3333-3333-3333-333333333301',
    business_id: DEMO_BUSINESS_ID,
    name: 'Emergency Plumbing',
    description: 'Rapid 24/7 emergency response for burst pipes, heavy leaks, or flooding.',
    duration_minutes: 60,
    price_cents: 18900,
    is_booking_enabled: true,
    is_active: true
  },
  {
    id: '33333333-3333-3333-3333-333333333302',
    business_id: DEMO_BUSINESS_ID,
    name: 'Pipe Repair & Leak Detection',
    description: 'Comprehensive inspection and repair of cracked, leaking, or damaged pipes.',
    duration_minutes: 90,
    price_cents: 14900,
    is_booking_enabled: true,
    is_active: true
  },
  {
    id: '33333333-3333-3333-3333-333333333303',
    business_id: DEMO_BUSINESS_ID,
    name: 'Drain Cleaning & Hydro-jetting',
    description: 'Clearing severe blockages in sinks, toilets, and main sewer lines.',
    duration_minutes: 60,
    price_cents: 11900,
    is_booking_enabled: true,
    is_active: true
  },
  {
    id: '33333333-3333-3333-3333-333333333304',
    business_id: DEMO_BUSINESS_ID,
    name: 'Water Heater Repair & Install',
    description: 'Diagnostic, repair, and full replacement of tank and tankless water heaters.',
    duration_minutes: 120,
    price_cents: 24900,
    is_booking_enabled: true,
    is_active: true
  }
];

export const DEMO_HOURS: BusinessHour[] = [
  { id: 'h1', business_id: DEMO_BUSINESS_ID, day_of_week: 1, is_open: true, open_time: '08:00:00', close_time: '18:00:00' },
  { id: 'h2', business_id: DEMO_BUSINESS_ID, day_of_week: 2, is_open: true, open_time: '08:00:00', close_time: '18:00:00' },
  { id: 'h3', business_id: DEMO_BUSINESS_ID, day_of_week: 3, is_open: true, open_time: '08:00:00', close_time: '18:00:00' },
  { id: 'h4', business_id: DEMO_BUSINESS_ID, day_of_week: 4, is_open: true, open_time: '08:00:00', close_time: '18:00:00' },
  { id: 'h5', business_id: DEMO_BUSINESS_ID, day_of_week: 5, is_open: true, open_time: '08:00:00', close_time: '18:00:00' },
  { id: 'h6', business_id: DEMO_BUSINESS_ID, day_of_week: 6, is_open: true, open_time: '09:00:00', close_time: '14:00:00' },
  { id: 'h0', business_id: DEMO_BUSINESS_ID, day_of_week: 0, is_open: false, open_time: '09:00:00', close_time: '17:00:00' }
];

export const DEMO_FAQS: FAQ[] = [
  {
    id: 'f1',
    business_id: DEMO_BUSINESS_ID,
    question: 'What is your service call diagnostic fee?',
    answer: 'Our standard diagnostic dispatch fee is $49, which is completely waived if you proceed with the recommended repair.',
    category: 'Pricing',
    is_active: true,
    display_order: 1
  },
  {
    id: 'f2',
    business_id: DEMO_BUSINESS_ID,
    question: 'Do you offer emergency 24/7 service?',
    answer: 'Yes, SwiftFix Plumbing has on-call technicians available 24 hours a day, 7 days a week for urgent leaks and burst pipes.',
    category: 'Services',
    is_active: true,
    display_order: 2
  },
  {
    id: 'f3',
    business_id: DEMO_BUSINESS_ID,
    question: 'Are your plumbers licensed and insured?',
    answer: 'All SwiftFix technicians are fully licensed journeyman or master plumbers, background-checked, and bonded for up to $2,000,000.',
    category: 'General',
    is_active: true,
    display_order: 3
  }
];

export const DEMO_AI_CONFIG: AIConfiguration = {
  id: 'aiconfig-demo',
  business_id: DEMO_BUSINESS_ID,
  ai_name: 'Sarah',
  greeting_message: "Thank you for calling SwiftFix Plumbing! My name is Sarah, your AI receptionist. How can I help you today?",
  personality: 'Friendly and professional',
  voice_provider: 'twilio_alice',
  voice_speed: 1.0,
  language: 'en-US',
  business_instructions: `You are Sarah, the welcoming AI receptionist for SwiftFix Plumbing. We provide top-rated residential and commercial plumbing services across Springfield.
Help callers schedule appointments, answer common pricing and service questions using our business knowledge, collect lead details (caller name, phone, address, and issue description), and transfer to emergency dispatch when the caller asks for a human. Never invent availability or pricing not in our list.`,
  things_never_to_say: 'Never guarantee exact repair costs without a technician on-site inspection. Never offer electrical or structural construction advice. Never confirm appointments without checking availability.',
  response_style: 'Concise and conversational',
  enable_human_handoff: true
};

export const DEMO_SUBSCRIPTION: Subscription = {
  id: 'sub-demo',
  business_id: DEMO_BUSINESS_ID,
  plan_tier: 'PROFESSIONAL',
  status: 'ACTIVE',
  call_minutes_limit: 1000,
  ai_requests_limit: 5000,
  current_period_start: new Date().toISOString(),
  current_period_end: new Date(Date.now() + 30 * 86400000).toISOString()
};
