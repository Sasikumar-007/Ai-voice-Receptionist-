import { FastifyInstance } from 'fastify';
import { db } from '../repositories/database.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { AuthenticatedRequest } from '../types/index.js';

export async function hoursRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);

  // GET /api/hours
  fastify.get('/', async (request, reply) => {
    const authReq = request as AuthenticatedRequest;
    const hours = await db.getBusinessHours(authReq.auth!.businessId);
    return reply.send({ success: true, data: hours });
  });

  // PUT /api/hours
  fastify.put('/', { preHandler: [requireRole(['OWNER', 'ADMIN'])] }, async (request, reply) => {
    const authReq = request as AuthenticatedRequest;
    const hoursList = request.body as any[];
    const updated = await db.updateBusinessHours(authReq.auth!.businessId, hoursList);
    return reply.send({ success: true, data: updated });
  });
}
