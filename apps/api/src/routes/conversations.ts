import { FastifyInstance } from 'fastify';
import { db } from '../repositories/database.js';
import { authenticate } from '../middleware/auth.js';
import { AuthenticatedRequest } from '../types/index.js';

export async function conversationsRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);

  // GET /api/conversations
  fastify.get('/', async (request, reply) => {
    const authReq = request as AuthenticatedRequest;
    const convs = await db.getConversations(authReq.auth!.businessId);

    // Attach messages for each
    const enriched = await Promise.all(
      convs.map(async (c) => {
        const messages = await db.getConversationMessages(c.id);
        return { ...c, messages };
      })
    );

    return reply.send({ success: true, data: enriched });
  });

  // GET /api/conversations/:id/messages
  fastify.get('/:id/messages', async (request, reply) => {
    const { id } = request.params as { id: string };
    const messages = await db.getConversationMessages(id);
    return reply.send({ success: true, data: messages });
  });
}
