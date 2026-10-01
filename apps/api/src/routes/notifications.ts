import { FastifyInstance } from 'fastify';
import { authenticate } from '../middleware/auth.js';
import { AuthenticatedRequest } from '../types/index.js';
import { notificationService } from '../services/notificationService.js';
import { db } from '../repositories/database.js';

export async function notificationsRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);

  // POST /api/notifications/test-email
  fastify.post('/test-email', async (request, reply) => {
    const authReq = request as AuthenticatedRequest;
    const body = (request.body as any) || {};
    const to = body.to || authReq.auth!.email;

    const res = await notificationService.sendEmail({
      to,
      subject: 'AI Receptionist Test Notification',
      html: '<p>This is a test notification confirming your email dispatch configuration is active and working!</p>'
    });

    return reply.send({ success: res.success, data: res });
  });

  // POST /api/notifications/test-whatsapp
  fastify.post('/test-whatsapp', async (request, reply) => {
    const body = (request.body as any) || {};
    const to = body.to || '+15551234567';

    const res = await notificationService.sendWhatsApp({
      to,
      bodyText: 'This is a test message from your AI Receptionist WhatsApp integration.'
    });

    return reply.send({ success: res.success, data: res });
  });
}
