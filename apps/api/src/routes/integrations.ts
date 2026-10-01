import { FastifyInstance } from 'fastify';
import { authenticate } from '../middleware/auth.js';
import { config } from '../config.js';

export async function integrationsRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);

  // GET /api/integrations
  fastify.get('/', async (request, reply) => {
    return reply.send({
      success: true,
      data: {
        voice: {
          provider: 'Twilio Voice',
          status: 'CONNECTED',
          phoneNumber: config.twilioPhoneNumber,
          features: ['Inbound Calls', 'Speech-To-Text', 'TwiML', 'Call Recording']
        },
        calendar: {
          provider: 'Google Calendar',
          status: 'CONNECTED',
          features: ['Real-Time Availability', 'Conflict Detection', 'Calendar Sync']
        },
        email: {
          provider: 'Resend',
          status: config.resendApiKey ? 'CONNECTED' : 'MOCK_ACTIVE',
          features: ['Lead Alerts', 'Appointment Confirmations', 'Handoff Alerts']
        },
        whatsapp: {
          provider: 'Meta WhatsApp Cloud API',
          status: config.whatsappAccessToken ? 'CONNECTED' : 'MOCK_ACTIVE',
          features: ['Direct Instant Messaging', 'Confirmations', 'Reminders']
        },
        ai: {
          provider: 'Google Gemini (1.5 Flash)',
          status: config.geminiApiKey ? 'CONNECTED' : 'SIMULATION_ACTIVE',
          features: ['Contextual Reasoning', 'Structured Tools', 'Dynamic Turn-Taking']
        }
      }
    });
  });
}
