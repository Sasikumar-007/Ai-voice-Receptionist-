import { FastifyInstance } from 'fastify';
import { db } from '../repositories/database.js';
import { authenticate } from '../middleware/auth.js';
import { AuthenticatedRequest } from '../types/index.js';

export async function dashboardRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);

  // GET /api/dashboard/metrics
  fastify.get('/metrics', async (request, reply) => {
    const authReq = request as AuthenticatedRequest;
    const metrics = await db.getDashboardMetrics(authReq.auth!.businessId);

    // Activity timeline & charts data
    const chartData = [
      { day: 'Mon', calls: 14, leads: 6, appointments: 3 },
      { day: 'Tue', calls: 22, leads: 11, appointments: 7 },
      { day: 'Wed', dayFormatted: 'Today', calls: 19, leads: 9, appointments: 5 },
      { day: 'Thu', calls: 25, leads: 13, appointments: 8 },
      { day: 'Fri', calls: 31, leads: 18, appointments: 12 },
      { day: 'Sat', calls: 12, leads: 5, appointments: 4 },
      { day: 'Sun', calls: 7, leads: 3, appointments: 1 }
    ];

    const outcomes = [
      { name: 'Appointment Booked', value: 48, color: '#3b82f6' },
      { name: 'FAQ Answered', value: 32, color: '#10b981' },
      { name: 'General Lead Captured', value: 14, color: '#f59e0b' },
      { name: 'Human Transferred', value: 6, color: '#ef4444' }
    ];

    return reply.send({
      success: true,
      data: {
        metrics,
        chartData,
        outcomes
      }
    });
  });
}
