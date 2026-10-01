import { FastifyInstance } from 'fastify';
import { ServiceSchema } from '@ai-receptionist/shared';
import { db } from '../repositories/database.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { AuthenticatedRequest } from '../types/index.js';

export async function servicesRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);

  // GET /api/services
  fastify.get('/', async (request, reply) => {
    const authReq = request as AuthenticatedRequest;
    const services = await db.getServices(authReq.auth!.businessId);
    return reply.send({ success: true, data: services });
  });

  // POST /api/services
  fastify.post('/', { preHandler: [requireRole(['OWNER', 'ADMIN'])] }, async (request, reply) => {
    const authReq = request as AuthenticatedRequest;
    const parse = ServiceSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid service data', details: parse.error.format() }
      });
    }

    const service = await db.createService(authReq.auth!.businessId, parse.data);
    return reply.status(201).send({ success: true, data: service });
  });

  // PUT /api/services/:id
  fastify.put('/:id', { preHandler: [requireRole(['OWNER', 'ADMIN'])] }, async (request, reply) => {
    const authReq = request as AuthenticatedRequest;
    const { id } = request.params as { id: string };
    const parse = ServiceSchema.partial().safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid service data', details: parse.error.format() }
      });
    }

    const updated = await db.updateService(authReq.auth!.businessId, id, parse.data);
    if (!updated) {
      return reply.status(404).send({ success: false, error: { code: 'NOT_FOUND', message: 'Service not found' } });
    }
    return reply.send({ success: true, data: updated });
  });

  // DELETE /api/services/:id
  fastify.delete('/:id', { preHandler: [requireRole(['OWNER', 'ADMIN'])] }, async (request, reply) => {
    const authReq = request as AuthenticatedRequest;
    const { id } = request.params as { id: string };
    const deleted = await db.deleteService(authReq.auth!.businessId, id);
    return reply.send({ success: deleted });
  });
}
