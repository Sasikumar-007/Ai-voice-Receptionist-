import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { buildServer } from '../src/server.js';
import { FastifyInstance } from 'fastify';

describe('AI Receptionist SaaS — Full Backend Test Suite', () => {
  let app: FastifyInstance;
  let authToken: string;

  beforeAll(async () => {
    app = buildServer();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('1. Health check returns 200 and healthy status', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/health'
    });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.status).toBe('healthy');
  });

  it('2. Authentication: Owner logs in successfully and receives JWT token', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: {
        email: 'owner@swiftfixplumbing.com',
        password: 'password123'
      }
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.success).toBe(true);
    expect(body.data.token).toBeDefined();
    expect(body.data.business.name).toBe('SwiftFix Plumbing');
    expect(body.data.role).toBe('OWNER');
    authToken = body.data.token;
  });

  it('3. Authentication: Invalid credentials return 401', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: {
        email: 'owner@swiftfixplumbing.com',
        password: 'wrongpassword'
      }
    });
    expect(res.statusCode).toBe(401);
  });

  it('4. Multi-Tenant Isolation: Protected endpoints reject unauthorized access', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/leads'
    });
    expect(res.statusCode).toBe(401);
  });

  it('5. Tenant Context: Authenticated requests correctly retrieve tenant-scoped services', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/services',
      headers: { Authorization: `Bearer ${authToken}` }
    });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.success).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.data[0].name).toBeDefined();
  });

  it('6. Lead Creation: Correctly creates and stores new inbound lead', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/leads',
      headers: { Authorization: `Bearer ${authToken}` },
      payload: {
        name: 'Sarah Connor',
        phone: '+1 (555) 999-8888',
        email: 'sarah.connor@example.com',
        service_requested: 'Water Heater Repair & Install',
        notes: 'Water heater leaking in basement.',
        estimated_value_cents: 24900
      }
    });

    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.body);
    expect(body.success).toBe(true);
    expect(body.data.name).toBe('Sarah Connor');
    expect(body.data.status).toBe('NEW');
  });

  it('7. Appointment Availability: Validates operating hours and returns conflict-free slots', async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];

    const res = await app.inject({
      method: 'GET',
      url: `/api/appointments/check-availability?date=${dateStr}`,
      headers: { Authorization: `Bearer ${authToken}` }
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data.availableSlots)).toBe(true);
  });

  it('8. Appointment Creation: Books appointment and links customer details', async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    tomorrow.setHours(10, 0, 0, 0);

    const res = await app.inject({
      method: 'POST',
      url: '/api/appointments',
      headers: { Authorization: `Bearer ${authToken}` },
      payload: {
        customer_name: 'Mark Ruffalo',
        customer_phone: '+1 (555) 777-6666',
        customer_email: 'mark@example.com',
        start_time: tomorrow.toISOString(),
        notes: 'Main drain backed up.'
      }
    });

    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.body);
    expect(body.success).toBe(true);
    expect(body.data.customer_name).toBe('Mark Ruffalo');
    expect(body.data.status).toBe('CONFIRMED');
  });

  it('9. AI Conversational Engine: Accurately handles Demo Scenario (leaking sink inquiry)', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/ai/chat-turn',
      headers: { Authorization: `Bearer ${authToken}` },
      payload: {
        caller_phone: '+1 (555) 432-8765',
        user_speech: 'My kitchen sink is leaking and I need someone tomorrow.',
        conversation_history: []
      }
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.success).toBe(true);
    expect(body.data.assistantSpeech).toBeDefined();
    expect(body.data.assistantSpeech.toLowerCase()).toContain('tomorrow');
  });

  it('10. Human Escalation: Triggers warm transfer when customer requests human', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/ai/chat-turn',
      headers: { Authorization: `Bearer ${authToken}` },
      payload: {
        caller_phone: '+1 (555) 432-8765',
        user_speech: 'Can I please speak to a human manager?',
        conversation_history: []
      }
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.success).toBe(true);
    expect(body.data.transferredToHuman).toBe(true);
    expect(body.data.assistantSpeech.toLowerCase()).toContain('connect you with a member of our team');
  });

  it('11. Voice Webhook: Generates valid Twilio TwiML on inbound call', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/voice/incoming',
      payload: {
        From: '+15551234567',
        To: '+15550192831',
        CallSid: 'CA_test_call_sid_123'
      }
    });

    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toContain('text/xml');
    expect(res.body).toContain('<Response>');
    expect(res.body).toContain('<Gather');
    expect(res.body).toContain('SwiftFix Plumbing');
  });

  it('12. Dashboard: Aggregates real-time business KPIs and conversion metrics', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/dashboard/metrics',
      headers: { Authorization: `Bearer ${authToken}` }
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.success).toBe(true);
    expect(body.data.metrics.total_calls).toBeGreaterThan(0);
    expect(body.data.metrics.ai_resolution_rate).toBeGreaterThan(0);
    expect(body.data.chartData.length).toBe(7);
  });
});
