import Fastify from 'fastify';
import cors from '@fastify/cors';
import formbody from '@fastify/formbody';
import websocket from '@fastify/websocket';
import { config } from './config.js';
import { authRoutes } from './routes/auth.js';
import { businessRoutes } from './routes/business.js';
import { servicesRoutes } from './routes/services.js';
import { hoursRoutes } from './routes/hours.js';
import { faqsRoutes } from './routes/faqs.js';
import { leadsRoutes } from './routes/leads.js';
import { customersRoutes } from './routes/customers.js';
import { appointmentsRoutes } from './routes/appointments.js';
import { callsRoutes } from './routes/calls.js';
import { conversationsRoutes } from './routes/conversations.js';
import { aiRoutes } from './routes/ai.js';
import { voiceRoutes } from './routes/voice.js';
import { calendarRoutes } from './routes/calendar.js';
import { notificationsRoutes } from './routes/notifications.js';
import { integrationsRoutes } from './routes/integrations.js';
import { dashboardRoutes } from './routes/dashboard.js';

export function buildServer() {
  const fastify = Fastify({
    logger: {
      level: config.env === 'development' ? 'info' : 'warn'
    }
  });

  // Plugins
  fastify.register(cors, {
    origin: true,
    credentials: true
  });
  fastify.register(formbody);
  fastify.register(websocket);

  // Health check
  fastify.get('/api/health', async () => {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      mockMode: config.enableMockFallback
    };
  });

  // Mount Domain Routes
  fastify.register(authRoutes, { prefix: '/api/auth' });
  fastify.register(businessRoutes, { prefix: '/api/business' });
  fastify.register(servicesRoutes, { prefix: '/api/services' });
  fastify.register(hoursRoutes, { prefix: '/api/hours' });
  fastify.register(faqsRoutes, { prefix: '/api/faqs' });
  fastify.register(leadsRoutes, { prefix: '/api/leads' });
  fastify.register(customersRoutes, { prefix: '/api/customers' });
  fastify.register(appointmentsRoutes, { prefix: '/api/appointments' });
  fastify.register(callsRoutes, { prefix: '/api/calls' });
  fastify.register(conversationsRoutes, { prefix: '/api/conversations' });
  fastify.register(aiRoutes, { prefix: '/api/ai' });
  fastify.register(voiceRoutes, { prefix: '/api/voice' });
  fastify.register(calendarRoutes, { prefix: '/api/calendar' });
  fastify.register(notificationsRoutes, { prefix: '/api/notifications' });
  fastify.register(integrationsRoutes, { prefix: '/api/integrations' });
  fastify.register(dashboardRoutes, { prefix: '/api/dashboard' });

  return fastify;
}

async function start() {
  const server = buildServer();
  try {
    const address = await server.listen({ port: config.port, host: '0.0.0.0' });
    console.log(`\n🚀 AI Receptionist Backend Server running on ${address}`);
    console.log(`📡 Inbound Twilio Voice Webhook: ${address}/api/voice/incoming`);
    console.log(`🤖 AI Interactive Engine: ${address}/api/ai/chat-turn\n`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== 'test') {
  start();
}
