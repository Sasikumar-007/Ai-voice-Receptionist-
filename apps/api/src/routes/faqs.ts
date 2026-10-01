import { FastifyInstance } from 'fastify';
import { FAQSchema } from '@ai-receptionist/shared';
import { db } from '../repositories/database.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { AuthenticatedRequest } from '../types/index.js';

export async function faqsRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);

  // GET /api/faqs
  fastify.get('/', async (request, reply) => {
    const authReq = request as AuthenticatedRequest;
    const faqs = await db.getFAQs(authReq.auth!.businessId);
    return reply.send({ success: true, data: faqs });
  });

  // POST /api/faqs
  fastify.post('/', { preHandler: [requireRole(['OWNER', 'ADMIN'])] }, async (request, reply) => {
    const authReq = request as AuthenticatedRequest;
    const parse = FAQSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid FAQ data', details: parse.error.format() }
      });
    }

    const faq = await db.createFAQ(authReq.auth!.businessId, parse.data);
    return reply.status(201).send({ success: true, data: faq });
  });

  // DELETE /api/faqs/:id
  fastify.delete('/:id', { preHandler: [requireRole(['OWNER', 'ADMIN'])] }, async (request, reply) => {
    const authReq = request as AuthenticatedRequest;
    const { id } = request.params as { id: string };
    const deleted = await db.deleteFAQ(authReq.auth!.businessId, id);
    return reply.send({ success: deleted });
  });
}
