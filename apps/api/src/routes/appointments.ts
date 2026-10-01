import { FastifyInstance } from 'fastify';
import { CheckAvailabilitySchema, CreateAppointmentSchema } from '@ai-receptionist/shared';
import { db } from '../repositories/database.js';
import { authenticate } from '../middleware/auth.js';
import { AuthenticatedRequest } from '../types/index.js';
import { notificationService } from '../services/notificationService.js';
import { calendarService } from '../services/calendarService.js';

export async function appointmentsRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', authenticate);

  // GET /api/appointments
  fastify.get('/', async (request, reply) => {
    const authReq = request as AuthenticatedRequest;
    const appointments = await db.getAppointments(authReq.auth!.businessId);
    return reply.send({ success: true, data: appointments });
  });

  // GET /api/appointments/check-availability?date=YYYY-MM-DD
  fastify.get('/check-availability', async (request, reply) => {
    const authReq = request as AuthenticatedRequest;
    const query = request.query as any;
    const parse = CheckAvailabilitySchema.safeParse(query);
    if (!parse.success) {
      return reply.status(400).send({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Date is required (YYYY-MM-DD)', details: parse.error.format() }
      });
    }

    const slots = await db.checkAvailability(authReq.auth!.businessId, parse.data.date);
    return reply.send({
      success: true,
      data: {
        date: parse.data.date,
        availableSlots: slots
      }
    });
  });

  // POST /api/appointments
  fastify.post('/', async (request, reply) => {
    const authReq = request as AuthenticatedRequest;
    const parse = CreateAppointmentSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid appointment details', details: parse.error.format() }
      });
    }

    const { customer_name, customer_phone, customer_email, service_id, start_time, notes, lead_id } = parse.data;

    // Create appointment in database
    const appt = await db.createAppointment(authReq.auth!.businessId, {
      customer_name,
      customer_phone,
      customer_email,
      service_id,
      start_time,
      notes,
      lead_id
    });

    const business = await db.getBusiness(authReq.auth!.businessId);

    // Google Calendar Sync
    calendarService.createCalendarEvent('mock_access_token', 'primary', {
      summary: `Service Appointment - ${customer_name}`,
      description: `Appointment for ${customer_name} (${customer_phone}). Notes: ${notes || 'None'}`,
      startTime: appt.start_time,
      endTime: appt.end_time,
      attendeeEmail: customer_email,
      location: business?.address
    }).catch(err => console.error('[CalendarSync] Error syncing event:', err));

    // Email Confirmation
    if (customer_email) {
      const emailHtml = notificationService.generateAppointmentConfirmationHtml({
        businessName: business?.name || 'SwiftFix Plumbing',
        serviceName: 'Service Visit',
        dateTime: new Date(appt.start_time).toLocaleString(),
        location: business?.address || 'Your provided address',
        contactPhone: business?.phone || '+1 (555) 019-2831'
      });
      notificationService.sendEmail({
        to: customer_email,
        subject: `Appointment Confirmed - ${business?.name}`,
        html: emailHtml
      }).catch(err => console.error('[Notification] Error sending appointment email:', err));
    }

    // WhatsApp Confirmation
    notificationService.sendWhatsApp({
      to: customer_phone,
      bodyText: `Hello ${customer_name}! Your appointment with ${business?.name || 'SwiftFix'} is confirmed for ${new Date(appt.start_time).toLocaleString()}. Reply CANCEL if you need to reschedule.`
    }).catch(err => console.error('[Notification] Error sending WhatsApp message:', err));

    return reply.status(201).send({ success: true, data: appt });
  });

  // PATCH /api/appointments/:id/cancel
  fastify.patch('/:id/cancel', async (request, reply) => {
    const authReq = request as AuthenticatedRequest;
    const { id } = request.params as { id: string };
    const { reason } = (request.body as any) || {};

    const updated = await db.updateAppointmentStatus(authReq.auth!.businessId, id, 'CANCELLED', reason);
    if (!updated) {
      return reply.status(404).send({ success: false, error: { code: 'NOT_FOUND', message: 'Appointment not found' } });
    }
    return reply.send({ success: true, data: updated });
  });
}
