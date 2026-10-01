import { FastifyRequest } from 'fastify';
import { UserRole } from '@ai-receptionist/shared';

export interface AuthContext {
  userId: string;
  businessId: string;
  role: UserRole;
  email: string;
}

export interface AuthenticatedRequest extends FastifyRequest {
  auth?: AuthContext;
}
