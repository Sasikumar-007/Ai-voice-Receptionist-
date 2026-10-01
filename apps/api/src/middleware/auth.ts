import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { db } from '../repositories/database.js';
import { AuthenticatedRequest } from '../types/index.js';
import { UserRole } from '@ai-receptionist/shared';

export interface TokenPayload {
  userId: string;
  email: string;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' });
}

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.status(401).send({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Authentication token missing or invalid' }
    });
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as TokenPayload;
    const user = await db.getUserById(decoded.userId);

    if (!user) {
      return reply.status(401).send({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'User does not exist' }
      });
    }

    // Resolve tenant membership server-side. Never trust business_id from query/body!
    const membership = await db.getBusinessMember(user.id);
    if (!membership) {
      return reply.status(403).send({
        success: false,
        error: { code: 'NO_BUSINESS_MEMBERSHIP', message: 'User is not linked to any active business' }
      });
    }

    (request as AuthenticatedRequest).auth = {
      userId: user.id,
      businessId: membership.business.id,
      role: membership.member.role,
      email: user.email
    };
  } catch (err) {
    return reply.status(401).send({
      success: false,
      error: { code: 'INVALID_TOKEN', message: 'Token expired or invalid' }
    });
  }
}

export function requireRole(allowedRoles: UserRole[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const authReq = request as AuthenticatedRequest;
    if (!authReq.auth) {
      return reply.status(401).send({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Not authenticated' }
      });
    }

    if (!allowedRoles.includes(authReq.auth.role)) {
      return reply.status(403).send({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: `Insufficient permissions. Required role: ${allowedRoles.join(', ')}`
        }
      });
    }
  };
}
