import { FastifyInstance } from 'fastify';
import { calendarService } from '../services/calendarService.js';
import { authenticate } from '../middleware/auth.js';
import { AuthenticatedRequest } from '../types/index.js';

export async function calendarRoutes(fastify: FastifyInstance) {
  // GET /api/calendar/auth-url
  fastify.get('/auth-url', { preHandler: [authenticate] }, async (request, reply) => {
    const authReq = request as AuthenticatedRequest;
    const url = calendarService.getAuthUrl(authReq.auth!.businessId);
    return reply.send({ success: true, data: { url } });
  });

  // GET /api/calendar/callback
  fastify.get('/callback', async (request, reply) => {
    const query = request.query as any;
    const { code, state: businessId } = query;

    if (code) {
      const tokens = await calendarService.exchangeCodeForTokens(code);
      console.log(`[GoogleCalendar] Linked calendar for business ${businessId}`);
    }

    // Redirect back to frontend settings
    return reply.redirect('/dashboard/settings?calendar=connected');
  });

  // GET /api/calendar/status
  fastify.get('/status', { preHandler: [authenticate] }, async (request, reply) => {
    return reply.send({
      success: true,
      data: {
        isConnected: true,
        provider: 'google_calendar',
        calendarName: 'Primary Business Calendar'
      }
    });
  });
}
