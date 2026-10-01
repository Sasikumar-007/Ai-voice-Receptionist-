import { FastifyInstance } from 'fastify';
import { LoginSchema, RegisterSchema } from '@ai-receptionist/shared';
import { db } from '../repositories/database.js';
import { generateToken, authenticate } from '../middleware/auth.js';
import { AuthenticatedRequest } from '../types/index.js';

export async function authRoutes(fastify: FastifyInstance) {
  // POST /api/auth/login
  fastify.post('/login', async (request, reply) => {
    const parse = LoginSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: parse.error.format() }
      });
    }

    const { email, password } = parse.data;
    const user = await db.getUserByEmail(email);

    if (!user) {
      return reply.status(401).send({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' }
      });
    }

    const isValid = await db.verifyPassword(email, password);
    if (!isValid) {
      return reply.status(401).send({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' }
      });
    }

    const membership = await db.getBusinessMember(user.id);
    const token = generateToken({ userId: user.id, email: user.email });

    return reply.send({
      success: true,
      data: {
        token,
        user,
        business: membership?.business || null,
        role: membership?.member.role || 'STAFF'
      }
    });
  });

  // POST /api/auth/register
  fastify.post('/register', async (request, reply) => {
    const parse = RegisterSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid input', details: parse.error.format() }
      });
    }

    const { email, password, full_name, business_name, phone } = parse.data;
    const existing = await db.getUserByEmail(email);
    if (existing) {
      return reply.status(409).send({
        success: false,
        error: { code: 'EMAIL_EXISTS', message: 'An account with this email already exists' }
      });
    }

    const user = await db.createUser({ email, full_name, phone }, password);
    const { business, member } = await db.createBusinessWithMembership(user.id, {
      name: business_name,
      email: email,
      phone: phone
    });

    const token = generateToken({ userId: user.id, email: user.email });

    return reply.status(201).send({
      success: true,
      data: {
        token,
        user,
        business,
        role: member.role
      }
    });
  });

  // GET /api/auth/me
  fastify.get('/me', { preHandler: [authenticate] }, async (request, reply) => {
    const authReq = request as AuthenticatedRequest;
    const user = await db.getUserById(authReq.auth!.userId);
    const membership = await db.getBusinessMember(authReq.auth!.userId);

    return reply.send({
      success: true,
      data: {
        user,
        business: membership?.business || null,
        role: authReq.auth!.role
      }
    });
  });
}
