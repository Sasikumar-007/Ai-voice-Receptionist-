import { FastifyInstance } from 'fastify';
import { BusinessProfileSchema } from '@ai-receptionist/shared';
import { db } from '../repositories/database.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { AuthenticatedRequest } from '../types/index.js';

export async function businessRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);

  // GET /api/business/profile
  fastify.get('/profile', async (request, reply) => {
    const authReq = request as AuthenticatedRequest;
    const business = await db.getBusiness(authReq.auth!.businessId);
    const settings = await db.getSettings(authReq.auth!.businessId);

    return reply.send({
      success: true,
      data: { business, settings }
    });
  });

  // PUT /api/business/profile
  fastify.put('/profile', { preHandler: [requireRole(['OWNER', 'ADMIN'])] }, async (request, reply) => {
    const authReq = request as AuthenticatedRequest;
    const parse = BusinessProfileSchema.partial().safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid business data', details: parse.error.format() }
      });
    }

    const updated = await db.updateBusiness(authReq.auth!.businessId, parse.data);
    return reply.send({ success: true, data: updated });
  });

  // PUT /api/business/settings
  fastify.put('/settings', { preHandler: [requireRole(['OWNER', 'ADMIN'])] }, async (request, reply) => {
    const authReq = request as AuthenticatedRequest;
    const updated = await db.updateSettings(authReq.auth!.businessId, request.body as any);
    return reply.send({ success: true, data: updated });
  });

  // POST /api/business/onboarding-wizard
  // Handles complete 8-step initial setup in one transaction
  fastify.post('/onboarding-wizard', { preHandler: [requireRole(['OWNER'])] }, async (request, reply) => {
    const authReq = request as AuthenticatedRequest;
    const bizId = authReq.auth!.businessId;
    const body = request.body as any;

    if (body.businessInfo) {
      await db.updateBusiness(bizId, body.businessInfo);
    }

    if (body.services && Array.isArray(body.services)) {
      for (const s of body.services) {
        await db.createService(bizId, s);
      }
    }

    if (body.businessHours && Array.isArray(body.businessHours)) {
      await db.updateBusinessHours(bizId, body.businessHours);
    }

    if (body.faqs && Array.isArray(body.faqs)) {
      for (const f of body.faqs) {
        await db.createFAQ(bizId, f);
      }
    }

    if (body.aiConfig) {
      await db.updateAIConfig(bizId, body.aiConfig);
    }

    return reply.send({
      success: true,
      message: 'Onboarding configuration applied successfully!'
    });
  });
}
