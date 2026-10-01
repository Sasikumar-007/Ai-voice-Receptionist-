import { FastifyInstance } from 'fastify';
import { db } from '../repositories/database.js';
import { authenticate } from '../middleware/auth.js';
import { AuthenticatedRequest } from '../types/index.js';

export async function callsRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);

  // GET /api/calls
  fastify.get('/', async (request, reply) => {
    const authReq = request as AuthenticatedRequest;
    const calls = await db.getCalls(authReq.auth!.businessId);
    return reply.send({ success: true, data: calls });
  });
}
