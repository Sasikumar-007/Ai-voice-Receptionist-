import { FastifyInstance } from 'fastify';
import { AIConfigSchema, VoiceChatTurnSchema } from '@ai-receptionist/shared';
import { db } from '../repositories/database.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { AuthenticatedRequest } from '../types/index.js';
import { geminiService } from '../services/geminiService.js';

export async function aiRoutes(fastify: FastifyInstance) {
  // Public or token-authenticated turn processing
  // POST /api/ai/chat-turn
  fastify.post('/chat-turn', async (request, reply) => {
    // Check if auth token present, otherwise fall back to demo business
    let businessId: string = '22222222-2222-2222-2222-222222222222';
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        await authenticate(request, reply);
        const authReq = request as AuthenticatedRequest;
        if (authReq.auth) {
          businessId = authReq.auth.businessId;
        }
      } catch (e) {
        // fallback
      }
    }

    const parse = VoiceChatTurnSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid turn payload', details: parse.error.format() }
      });
    }

    const { user_speech, caller_phone, conversation_history } = parse.data;

    const result = await geminiService.processTurn({
      businessId,
      callerPhone: caller_phone,
      userSpeech: user_speech,
      conversationHistory: conversation_history as any
    });

    return reply.send({
      success: true,
      data: result
    });
  });

  // Protected AI configuration endpoints
  fastify.register(async (subFastify) => {
    subFastify.addHook('preHandler', authenticate);

    // GET /api/ai/config
    subFastify.get('/config', async (request, reply) => {
      const authReq = request as AuthenticatedRequest;
      const config = await db.getAIConfig(authReq.auth!.businessId);
      return reply.send({ success: true, data: config });
    });

    // PUT /api/ai/config
    subFastify.put('/config', { preHandler: [requireRole(['OWNER', 'ADMIN'])] }, async (request, reply) => {
      const authReq = request as AuthenticatedRequest;
      const parse = AIConfigSchema.partial().safeParse(request.body);
      if (!parse.success) {
        return reply.status(400).send({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Invalid AI config', details: parse.error.format() }
        });
      }

      const updated = await db.updateAIConfig(authReq.auth!.businessId, parse.data);
      return reply.send({ success: true, data: updated });
    });
  });
}
