import { FastifyInstance } from 'fastify';
import { CreateLeadSchema, UpdateLeadStatusSchema } from '@ai-receptionist/shared';
import { db } from '../repositories/database.js';
import { authenticate } from '../middleware/auth.js';
import { AuthenticatedRequest } from '../types/index.js';
import { notificationService } from '../services/notificationService.js';

export async function leadsRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);

  // GET /api/leads
  fastify.get('/', async (request, reply) => {
    const authReq = request as AuthenticatedRequest;
    const leads = await db.getLeads(authReq.auth!.businessId);
    return reply.send({ success: true, data: leads });
  });

  // GET /api/leads/:id
  fastify.get('/:id', async (request, reply) => {
    const authReq = request as AuthenticatedRequest;
    const { id } = request.params as { id: string };
    const lead = await db.getLeadById(authReq.auth!.businessId, id);
    if (!lead) {
      return reply.status(404).send({ success: false, error: { code: 'NOT_FOUND', message: 'Lead not found' } });
    }
    return reply.send({ success: true, data: lead });
  });

  // POST /api/leads
  fastify.post('/', async (request, reply) => {
    const authReq = request as AuthenticatedRequest;
    const parse = CreateLeadSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid lead data', details: parse.error.format() }
      });
    }

    const lead = await db.createLead(authReq.auth!.businessId, {
      ...parse.data,
      status: 'NEW',
      estimated_value_cents: parse.data.estimated_value_cents || 0
    });

    // Notify business via Email
    const settings = await db.getSettings(authReq.auth!.businessId);
    if (settings?.enable_lead_alerts && settings?.notification_email) {
      const emailHtml = notificationService.generateNewLeadHtml({
        customerName: lead.name,
        phone: lead.phone,
        email: lead.email,
        service: lead.service_requested,
        notes: lead.notes,
        source: lead.source
      });
      notificationService.sendEmail({
        to: settings.notification_email,
        subject: `New Lead: ${lead.name}`,
        html: emailHtml
      }).catch(err => console.error('[Notification] Error sending lead alert:', err));
    }

    return reply.status(201).send({ success: true, data: lead });
  });

  // PATCH /api/leads/:id/status
  fastify.patch('/:id/status', async (request, reply) => {
    const authReq = request as AuthenticatedRequest;
    const { id } = request.params as { id: string };
    const parse = UpdateLeadStatusSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid status data', details: parse.error.format() }
      });
    }

    const updated = await db.updateLeadStatus(authReq.auth!.businessId, id, parse.data.status, parse.data.notes);
    if (!updated) {
      return reply.status(404).send({ success: false, error: { code: 'NOT_FOUND', message: 'Lead not found' } });
    }

    return reply.send({ success: true, data: updated });
  });
}
