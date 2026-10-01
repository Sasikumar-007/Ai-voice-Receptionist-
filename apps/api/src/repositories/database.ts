import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  User, Business, BusinessMember, BusinessSettings, Service, BusinessHour, FAQ,
  Customer, Lead, Appointment, Call, Conversation, Message, AIConfiguration,
  Subscription, DashboardMetrics, UserRole, LeadStatus, AppointmentStatus, CallStatus, Sentiment,
  DEMO_BUSINESS_ID, DEMO_USER_ID, DEMO_BUSINESS, DEMO_SERVICES, DEMO_HOURS, DEMO_FAQS, DEMO_AI_CONFIG, DEMO_SUBSCRIPTION
} from '@ai-receptionist/shared';
import { config } from '../config.js';

class DatabaseService {
  private supabase: SupabaseClient | null = null;
  public isMock: boolean;

  // In-memory data store for standalone/dev/offline mode
  private users: Map<string, User> = new Map();
  private userPasswords: Map<string, string> = new Map(); // email -> password hash
  private businesses: Map<string, Business> = new Map();
  private members: Map<string, BusinessMember> = new Map();
  private settings: Map<string, BusinessSettings> = new Map();
  private services: Map<string, Service> = new Map();
  private hours: Map<string, BusinessHour> = new Map();
  private faqs: Map<string, FAQ> = new Map();
  private customers: Map<string, Customer> = new Map();
  private leads: Map<string, Lead> = new Map();
  private appointments: Map<string, Appointment> = new Map();
  private calls: Map<string, Call> = new Map();
  private conversations: Map<string, Conversation> = new Map();
  private messages: Map<string, Message> = new Map();
  private aiConfigs: Map<string, AIConfiguration> = new Map();
  private subscriptions: Map<string, Subscription> = new Map();
  private calendarIntegrations: Map<string, any> = new Map();
  private voiceIntegrations: Map<string, any> = new Map();

  constructor() {
    this.isMock = config.enableMockFallback;

    if (!this.isMock && config.supabaseUrl && config.supabaseServiceKey) {
      try {
        this.supabase = createClient(config.supabaseUrl, config.supabaseServiceKey);
        console.log('[Database] Connected to remote Supabase database.');
      } catch (err) {
        console.warn('[Database] Failed connecting to Supabase, falling back to in-memory store:', err);
        this.isMock = true;
      }
    } else {
      console.log('[Database] Initializing in-memory multi-tenant store with demo seed data.');
      this.initSeedData();
    }
  }

  private initSeedData() {
    // 1. Demo User
    const demoUser: User = {
      id: DEMO_USER_ID,
      email: 'owner@swiftfixplumbing.com',
      full_name: 'David Miller',
      phone: '+1 (555) 234-5678',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.users.set(demoUser.id, demoUser);
    // password for demo user is "password123"
    this.userPasswords.set(demoUser.email, 'password123');

    // 2. Demo Business
    this.businesses.set(DEMO_BUSINESS.id, { ...DEMO_BUSINESS });

    // 3. Demo Member
    const member: BusinessMember = {
      id: 'member-demo',
      business_id: DEMO_BUSINESS.id,
      user_id: demoUser.id,
      role: 'OWNER',
      title: 'Owner & Master Plumber',
      is_active: true,
      created_at: new Date().toISOString()
    };
    this.members.set(member.id, member);

    // 4. Settings
    this.settings.set(DEMO_BUSINESS.id, {
      id: 'settings-demo',
      business_id: DEMO_BUSINESS.id,
      currency: 'USD',
      date_format: 'YYYY-MM-DD',
      retention_days: 365,
      allow_call_recording: true,
      record_transcription: true,
      enable_lead_alerts: true,
      enable_appointment_alerts: true,
      notification_email: 'owner@swiftfixplumbing.com',
      notification_phone: '+1 (555) 234-5678'
    });

    // 5. Services
    DEMO_SERVICES.forEach(s => this.services.set(s.id, { ...s }));

    // 6. Business Hours
    DEMO_HOURS.forEach(h => this.hours.set(`${h.business_id}_${h.day_of_week}`, { ...h }));

    // 7. FAQs
    DEMO_FAQS.forEach(f => this.faqs.set(f.id, { ...f }));

    // 8. AI Config
    this.aiConfigs.set(DEMO_BUSINESS.id, { ...DEMO_AI_CONFIG });

    // 9. Subscriptions
    this.subscriptions.set(DEMO_BUSINESS.id, { ...DEMO_SUBSCRIPTION });

    // 10. Voice Integration
    this.voiceIntegrations.set(DEMO_BUSINESS.id, {
      id: 'voice-demo',
      business_id: DEMO_BUSINESS.id,
      provider: 'twilio',
      phone_number: '+15550192831',
      is_active: true
    });

    // 11. Sample Customers
    const cust1: Customer = {
      id: '44444444-4444-4444-4444-444444444401',
      business_id: DEMO_BUSINESS.id,
      name: 'John Smith',
      phone: '+1 (555) 432-8765',
      email: 'john.smith@example.com',
      address: '124 Elm Street, Springfield',
      notes: 'Kitchen sink pipe leaking under countertop.',
      total_calls: 2,
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date().toISOString()
    };
    const cust2: Customer = {
      id: '44444444-4444-4444-4444-444444444402',
      business_id: DEMO_BUSINESS.id,
      name: 'Elena Rostova',
      phone: '+1 (555) 789-0123',
      email: 'elena.rostova@example.com',
      address: '458 Oak Avenue, Springfield',
      notes: 'Water heater maintenance inquiry.',
      total_calls: 1,
      created_at: new Date(Date.now() - 172800000).toISOString(),
      updated_at: new Date().toISOString()
    };
    this.customers.set(cust1.id, cust1);
    this.customers.set(cust2.id, cust2);

    // 12. Sample Lead
    const lead1: Lead = {
      id: '55555555-5555-5555-5555-555555555501',
      business_id: DEMO_BUSINESS.id,
      customer_id: cust1.id,
      name: cust1.name,
      phone: cust1.phone,
      email: cust1.email,
      service_id: DEMO_SERVICES[1].id,
      service_requested: 'Pipe Repair & Leak Detection',
      source: 'AI_VOICE_CALL',
      status: 'BOOKED',
      estimated_value_cents: 14900,
      notes: 'Kitchen sink pipe leaking heavily. Scheduled 2:00 PM tomorrow.',
      created_at: new Date(Date.now() - 10800000).toISOString(),
      updated_at: new Date().toISOString()
    };
    this.leads.set(lead1.id, lead1);

    // 13. Sample Appointment
    const appt1: Appointment = {
      id: '66666666-6666-6666-6666-666666666601',
      business_id: DEMO_BUSINESS.id,
      customer_id: cust1.id,
      lead_id: lead1.id,
      service_id: DEMO_SERVICES[1].id,
      start_time: new Date(Date.now() + 86400000 + 14400000).toISOString(),
      end_time: new Date(Date.now() + 86400000 + 19800000).toISOString(),
      status: 'CONFIRMED',
      customer_name: cust1.name,
      customer_phone: cust1.phone,
      customer_email: cust1.email,
      notes: 'Emergency kitchen sink leak repair. Gate code: #4512.',
      service: DEMO_SERVICES[1],
      created_at: new Date(Date.now() - 10800000).toISOString(),
      updated_at: new Date().toISOString()
    };
    this.appointments.set(appt1.id, appt1);

    // 14. Sample Call
    const call1: Call = {
      id: '77777777-7777-7777-7777-777777777701',
      business_id: DEMO_BUSINESS.id,
      customer_id: cust1.id,
      caller_phone: cust1.phone,
      business_phone: '+1 (555) 019-2831',
      twilio_call_sid: 'CA_demo_twilio_sid_001',
      start_time: new Date(Date.now() - 10800000).toISOString(),
      end_time: new Date(Date.now() - 10608000).toISOString(),
      duration_seconds: 192,
      status: 'COMPLETED',
      summary: 'Caller John Smith reported a leaking kitchen sink. Sarah verified pipe repair service and scheduled an on-site technician for tomorrow at 2:00 PM. Lead created and calendar invitation dispatched.',
      outcome: 'APPOINTMENT_BOOKED',
      was_transferred: false,
      lead_id: lead1.id,
      appointment_id: appt1.id,
      sentiment: 'POSITIVE',
      created_at: new Date(Date.now() - 10800000).toISOString()
    };
    this.calls.set(call1.id, call1);

    // 15. Sample Conversation & Messages
    const conv1: Conversation = {
      id: '88888888-8888-8888-8888-888888888801',
      business_id: DEMO_BUSINESS.id,
      call_id: call1.id,
      customer_id: cust1.id,
      channel: 'VOICE',
      summary: 'Appointment booking for leaking kitchen sink',
      sentiment: 'POSITIVE',
      created_at: new Date(Date.now() - 10800000).toISOString()
    };
    this.conversations.set(conv1.id, conv1);

    const dialog = [
      { role: 'assistant' as const, content: "Thank you for calling SwiftFix Plumbing! My name is Sarah, your AI assistant. How can I help you today?" },
      { role: 'user' as const, content: "Hi, my kitchen sink is leaking badly under the cupboard and I need someone tomorrow." },
      { role: 'assistant' as const, content: "I can certainly help you with that! We offer pipe repair and leak detection services. Let me check our availability for tomorrow." },
      { role: 'assistant' as const, content: "I have openings at 10:00 AM and 2:00 PM tomorrow. Which of those works better for you?" },
      { role: 'user' as const, content: "2:00 PM works great." },
      { role: 'assistant' as const, content: "Wonderful. May I please have your full name and phone number for the booking?" },
      { role: 'user' as const, content: "My name is John Smith and my number is 555-432-8765." },
      { role: 'assistant' as const, content: "Thank you, John! What is your address in Springfield?" },
      { role: 'user' as const, content: "124 Elm Street." },
      { role: 'assistant' as const, content: "All set, John! I have confirmed your appointment for pipe repair tomorrow at 2:00 PM at 124 Elm Street. We have dispatched a confirmation to your phone. Is there anything else I can assist with?" },
      { role: 'user' as const, content: "No, that's all. Thank you!" },
      { role: 'assistant' as const, content: "Thank you for choosing SwiftFix Plumbing. Have a great day!" }
    ];

    dialog.forEach((d, idx) => {
      const msg: Message = {
        id: `msg-${idx + 1}`,
        conversation_id: conv1.id,
        business_id: DEMO_BUSINESS.id,
        role: d.role,
        content: d.content,
        created_at: new Date(Date.now() - 10800000 + idx * 15000).toISOString()
      };
      this.messages.set(msg.id, msg);
    });
  }

  // --- Auth & User Queries ---
  async getUserByEmail(email: string): Promise<User | null> {
    for (const u of this.users.values()) {
      if (u.email.toLowerCase() === email.toLowerCase()) return u;
    }
    return null;
  }

  async getUserById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async verifyPassword(email: string, pass: string): Promise<boolean> {
    const stored = this.userPasswords.get(email.toLowerCase());
    return stored === pass;
  }

  async createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>, pass: string): Promise<User> {
    const newUser: User = {
      id: crypto.randomUUID(),
      ...user,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.users.set(newUser.id, newUser);
    this.userPasswords.set(user.email.toLowerCase(), pass);
    return newUser;
  }

  async getBusinessMember(userId: string): Promise<{ member: BusinessMember; business: Business } | null> {
    for (const m of this.members.values()) {
      if (m.user_id === userId && m.is_active) {
        const b = this.businesses.get(m.business_id);
        if (b) return { member: m, business: b };
      }
    }
    return null;
  }

  async createBusinessWithMembership(
    userId: string,
    businessData: Partial<Business>
  ): Promise<{ business: Business; member: BusinessMember }> {
    const bizId = crypto.randomUUID();
    const slug = (businessData.name || 'business')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const business: Business = {
      id: bizId,
      name: businessData.name || 'New Business',
      slug: `${slug}-${Math.floor(Math.random() * 1000)}`,
      business_type: businessData.business_type || 'General Services',
      website: businessData.website,
      phone: businessData.phone || '+1 (555) 000-0000',
      email: businessData.email,
      address: businessData.address,
      city: businessData.city,
      state: businessData.state,
      country: businessData.country || 'United States',
      timezone: businessData.timezone || 'America/New_York',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const member: BusinessMember = {
      id: crypto.randomUUID(),
      business_id: bizId,
      user_id: userId,
      role: 'OWNER',
      title: 'Business Owner',
      is_active: true,
      created_at: new Date().toISOString()
    };

    this.businesses.set(business.id, business);
    this.members.set(member.id, member);

    // Default settings
    this.settings.set(bizId, {
      id: crypto.randomUUID(),
      business_id: bizId,
      currency: 'USD',
      date_format: 'YYYY-MM-DD',
      retention_days: 365,
      allow_call_recording: false,
      record_transcription: true,
      enable_lead_alerts: true,
      enable_appointment_alerts: true
    });

    // Default AI config
    this.aiConfigs.set(bizId, {
      id: crypto.randomUUID(),
      business_id: bizId,
      ai_name: 'Sarah',
      greeting_message: `Thank you for calling ${business.name}! How may I help you today?`,
      personality: 'Friendly and professional',
      voice_provider: 'twilio_alice',
      voice_speed: 1.0,
      language: 'en-US',
      business_instructions: `You are the front desk receptionist for ${business.name}. Answer inquiries accurately and schedule service appointments.`,
      things_never_to_say: 'Never invent prices or confirm appointments without checking availability.',
      response_style: 'Concise and conversational',
      enable_human_handoff: true
    });

    return { business, member };
  }

  // --- Tenant Scoped Entity Queries ---

  async getBusiness(businessId: string): Promise<Business | null> {
    return this.businesses.get(businessId) || null;
  }

  async updateBusiness(businessId: string, updates: Partial<Business>): Promise<Business | null> {
    const b = this.businesses.get(businessId);
    if (!b) return null;
    const updated = { ...b, ...updates, updated_at: new Date().toISOString() };
    this.businesses.set(businessId, updated);
    return updated;
  }

  async getSettings(businessId: string): Promise<BusinessSettings | null> {
    return this.settings.get(businessId) || null;
  }

  async updateSettings(businessId: string, updates: Partial<BusinessSettings>): Promise<BusinessSettings> {
    const s = this.settings.get(businessId) || {
      id: crypto.randomUUID(),
      business_id: businessId,
      currency: 'USD',
      date_format: 'YYYY-MM-DD',
      retention_days: 365,
      allow_call_recording: false,
      record_transcription: true,
      enable_lead_alerts: true,
      enable_appointment_alerts: true
    };
    const updated = { ...s, ...updates };
    this.settings.set(businessId, updated);
    return updated;
  }

  // --- Services ---
  async getServices(businessId: string): Promise<Service[]> {
    return Array.from(this.services.values()).filter(s => s.business_id === businessId && s.is_active);
  }

  async createService(businessId: string, data: Omit<Service, 'id' | 'business_id' | 'is_active'>): Promise<Service> {
    const service: Service = {
      id: crypto.randomUUID(),
      business_id: businessId,
      is_active: true,
      ...data
    };
    this.services.set(service.id, service);
    return service;
  }

  async updateService(businessId: string, serviceId: string, updates: Partial<Service>): Promise<Service | null> {
    const s = this.services.get(serviceId);
    if (!s || s.business_id !== businessId) return null;
    const updated = { ...s, ...updates };
    this.services.set(serviceId, updated);
    return updated;
  }

  async deleteService(businessId: string, serviceId: string): Promise<boolean> {
    const s = this.services.get(serviceId);
    if (!s || s.business_id !== businessId) return false;
    s.is_active = false;
    this.services.set(serviceId, s);
    return true;
  }

  // --- Business Hours ---
  async getBusinessHours(businessId: string): Promise<BusinessHour[]> {
    return Array.from(this.hours.values())
      .filter(h => h.business_id === businessId)
      .sort((a, b) => a.day_of_week - b.day_of_week);
  }

  async updateBusinessHours(businessId: string, hoursList: BusinessHour[]): Promise<BusinessHour[]> {
    hoursList.forEach(h => {
      const key = `${businessId}_${h.day_of_week}`;
      this.hours.set(key, { ...h, business_id: businessId });
    });
    return this.getBusinessHours(businessId);
  }

  // --- FAQs ---
  async getFAQs(businessId: string): Promise<FAQ[]> {
    return Array.from(this.faqs.values()).filter(f => f.business_id === businessId && f.is_active);
  }

  async createFAQ(businessId: string, data: Omit<FAQ, 'id' | 'business_id' | 'is_active' | 'display_order'>): Promise<FAQ> {
    const faq: FAQ = {
      id: crypto.randomUUID(),
      business_id: businessId,
      is_active: true,
      display_order: this.faqs.size + 1,
      ...data
    };
    this.faqs.set(faq.id, faq);
    return faq;
  }

  async deleteFAQ(businessId: string, faqId: string): Promise<boolean> {
    const f = this.faqs.get(faqId);
    if (!f || f.business_id !== businessId) return false;
    f.is_active = false;
    this.faqs.set(faqId, f);
    return true;
  }

  // --- AI Configuration ---
  async getAIConfig(businessId: string): Promise<AIConfiguration | null> {
    return this.aiConfigs.get(businessId) || null;
  }

  async updateAIConfig(businessId: string, updates: Partial<AIConfiguration>): Promise<AIConfiguration> {
    const existing = this.aiConfigs.get(businessId) || {
      id: crypto.randomUUID(),
      business_id: businessId,
      ai_name: 'Sarah',
      greeting_message: 'Thank you for calling! How can I help you today?',
      personality: 'Friendly and professional',
      voice_provider: 'twilio_alice',
      voice_speed: 1.0,
      language: 'en-US',
      business_instructions: 'Handle customer calls professionally and book appointments.',
      things_never_to_say: 'Never invent prices or confirm appointments without checking availability.',
      response_style: 'Concise and conversational',
      enable_human_handoff: true
    };
    const updated = { ...existing, ...updates };
    this.aiConfigs.set(businessId, updated);
    return updated;
  }

  // --- Customers ---
  async getCustomers(businessId: string): Promise<Customer[]> {
    return Array.from(this.customers.values()).filter(c => c.business_id === businessId);
  }

  async findOrCreateCustomer(businessId: string, data: { name: string; phone: string; email?: string; address?: string }): Promise<Customer> {
    for (const c of this.customers.values()) {
      if (c.business_id === businessId && c.phone === data.phone) {
        c.total_calls += 1;
        if (data.email) c.email = data.email;
        if (data.address) c.address = data.address;
        c.updated_at = new Date().toISOString();
        return c;
      }
    }
    const customer: Customer = {
      id: crypto.randomUUID(),
      business_id: businessId,
      name: data.name,
      phone: data.phone,
      email: data.email,
      address: data.address,
      total_calls: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.customers.set(customer.id, customer);
    return customer;
  }

  // --- Leads ---
  async getLeads(businessId: string): Promise<Lead[]> {
    return Array.from(this.leads.values())
      .filter(l => l.business_id === businessId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  async getLeadById(businessId: string, leadId: string): Promise<Lead | null> {
    const l = this.leads.get(leadId);
    if (!l || l.business_id !== businessId) return null;
    return l;
  }

  async createLead(businessId: string, data: Omit<Lead, 'id' | 'business_id' | 'created_at' | 'updated_at'>): Promise<Lead> {
    const lead: Lead = {
      id: crypto.randomUUID(),
      business_id: businessId,
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.leads.set(lead.id, lead);
    return lead;
  }

  async updateLeadStatus(businessId: string, leadId: string, status: LeadStatus, notes?: string): Promise<Lead | null> {
    const l = this.leads.get(leadId);
    if (!l || l.business_id !== businessId) return null;
    l.status = status;
    if (notes) l.notes = l.notes ? `${l.notes}\n[Update]: ${notes}` : notes;
    l.updated_at = new Date().toISOString();
    this.leads.set(leadId, l);
    return l;
  }

  // --- Appointments & Real-Time Availability ---
  async getAppointments(businessId: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values())
      .filter(a => a.business_id === businessId)
      .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());
  }

  async checkAvailability(businessId: string, targetDateStr: string): Promise<string[]> {
    // Parse target date
    const targetDate = new Date(targetDateStr);
    const dayOfWeek = targetDate.getDay();

    // Check operating hours
    const hour = this.hours.get(`${businessId}_${dayOfWeek}`);
    if (!hour || !hour.is_open) {
      return []; // Closed on this day
    }

    const [openHour] = hour.open_time.split(':').map(Number);
    const [closeHour] = hour.close_time.split(':').map(Number);

    // Potential slot times: hourly between open and close - 1hr
    const potentialSlots: string[] = [];
    for (let h = openHour; h < closeHour; h++) {
      const slotTime = `${targetDateStr}T${String(h).padStart(2, '0')}:00:00.000Z`;
      potentialSlots.push(slotTime);
    }

    // Filter out conflicts with existing appointments
    const existing = Array.from(this.appointments.values()).filter(a =>
      a.business_id === businessId &&
      a.status !== 'CANCELLED' &&
      a.start_time.startsWith(targetDateStr)
    );

    const availableSlots = potentialSlots.filter(slot => {
      const slotTimeMs = new Date(slot).getTime();
      return !existing.some(a => {
        const apptTimeMs = new Date(a.start_time).getTime();
        return Math.abs(slotTimeMs - apptTimeMs) < 60 * 60 * 1000; // within 1 hour
      });
    });

    return availableSlots;
  }

  async createAppointment(businessId: string, data: Omit<Appointment, 'id' | 'business_id' | 'status' | 'created_at' | 'updated_at' | 'end_time'> & { end_time?: string }): Promise<Appointment> {
    const end = data.end_time || new Date(new Date(data.start_time).getTime() + 60 * 60 * 1000).toISOString();
    const appt: Appointment = {
      id: crypto.randomUUID(),
      business_id: businessId,
      status: 'CONFIRMED',
      ...data,
      end_time: end,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.appointments.set(appt.id, appt);

    // If customer doesn't exist, create customer
    const cust = await this.findOrCreateCustomer(businessId, {
      name: data.customer_name,
      phone: data.customer_phone,
      email: data.customer_email
    });
    appt.customer_id = cust.id;

    return appt;
  }

  async updateAppointmentStatus(businessId: string, appointmentId: string, status: AppointmentStatus, reason?: string): Promise<Appointment | null> {
    const a = this.appointments.get(appointmentId);
    if (!a || a.business_id !== businessId) return null;
    a.status = status;
    if (reason) a.cancellation_reason = reason;
    a.updated_at = new Date().toISOString();
    this.appointments.set(appointmentId, a);
    return a;
  }

  // --- Calls & Conversations ---
  async getCalls(businessId: string): Promise<Call[]> {
    return Array.from(this.calls.values())
      .filter(c => c.business_id === businessId)
      .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());
  }

  async createCall(businessId: string, data: Omit<Call, 'id' | 'business_id' | 'created_at'>): Promise<Call> {
    const call: Call = {
      id: crypto.randomUUID(),
      business_id: businessId,
      ...data,
      created_at: new Date().toISOString()
    };
    this.calls.set(call.id, call);
    return call;
  }

  async updateCall(callId: string, updates: Partial<Call>): Promise<Call | null> {
    const c = this.calls.get(callId);
    if (!c) return null;
    const updated = { ...c, ...updates };
    this.calls.set(callId, updated);
    return updated;
  }

  async getConversations(businessId: string): Promise<Conversation[]> {
    return Array.from(this.conversations.values())
      .filter(c => c.business_id === businessId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  async getConversationMessages(conversationId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(m => m.conversation_id === conversationId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }

  async addMessage(conversationId: string, businessId: string, role: Message['role'], content: string, toolMeta?: any): Promise<Message> {
    const msg: Message = {
      id: crypto.randomUUID(),
      conversation_id: conversationId,
      business_id: businessId,
      role,
      content,
      tool_name: toolMeta?.tool_name,
      tool_args: toolMeta?.tool_args,
      created_at: new Date().toISOString()
    };
    this.messages.set(msg.id, msg);
    return msg;
  }

  // --- Integrations Lookup by Phone ---
  async findBusinessByPhoneNumber(phone: string): Promise<Business | null> {
    const clean = phone.replace(/[^0-9+]/g, '');
    for (const v of this.voiceIntegrations.values()) {
      if (v.phone_number.replace(/[^0-9+]/g, '') === clean) {
        return this.businesses.get(v.business_id) || null;
      }
    }
    // Default fallback to demo business if in dev
    return this.businesses.get(DEMO_BUSINESS_ID) || null;
  }

  // --- Dashboard Metrics Aggregator ---
  async getDashboardMetrics(businessId: string): Promise<DashboardMetrics> {
    const calls = await this.getCalls(businessId);
    const leads = await this.getLeads(businessId);
    const appts = await this.getAppointments(businessId);

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const todayCalls = calls.filter(c => c.start_time.startsWith(todayStr)).length;

    const transferredCount = calls.filter(c => c.was_transferred).length;
    const resolvedCount = calls.filter(c => c.status === 'COMPLETED' && !c.was_transferred).length;
    const aiResolutionRate = calls.length > 0 ? Math.round((resolvedCount / calls.length) * 100) : 95;

    const conversionRate = calls.length > 0 ? Math.round((appts.length / calls.length) * 100) : 48;
    const estimatedRev = appts.reduce((sum, a) => sum + (a.service?.price_cents || 14900), 0);

    return {
      total_calls: calls.length,
      today_calls: todayCalls,
      new_leads: leads.filter(l => l.status === 'NEW').length,
      appointments_count: appts.length,
      conversion_rate: conversionRate,
      ai_resolution_rate: aiResolutionRate,
      human_transfers: transferredCount,
      estimated_revenue_cents: estimatedRev
    };
  }
}

export const db = new DatabaseService();
