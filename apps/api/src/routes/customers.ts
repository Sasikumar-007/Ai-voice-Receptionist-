import { FastifyInstance } from 'fastify';
import { db } from '../repositories/database.js';
import { authenticate } from '../middleware/auth.js';
import { AuthenticatedRequest } from '../types/index.js';

export async function customersRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);

  // GET /api/customers
  fastify.get('/', async (request, reply) => {
    const authReq = request as AuthenticatedRequest;
    const customers = await db.getCustomers(authReq.auth!.businessId);
    return reply.send({ success: true, data: customers });
  });
}
