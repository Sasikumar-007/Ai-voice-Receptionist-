import { config } from '../config.js';

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export interface WhatsAppPayload {
  to: string;
  templateName?: string;
  bodyText: string;
}

export interface IMessagingProvider {
  name: string;
  sendWhatsApp(payload: WhatsAppPayload): Promise<{ success: boolean; messageId?: string; error?: string }>;
}

export class MetaWhatsAppProvider implements IMessagingProvider {
  name = 'meta_cloud_api';

  async sendWhatsApp(payload: WhatsAppPayload): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!config.whatsappAccessToken || !config.whatsappPhoneNumberId) {
      console.log(`[WhatsApp:Mock] Sent to ${payload.to}: ${payload.bodyText}`);
      return { success: true, messageId: `wa_mock_${Date.now()}` };
    }

    try {
      const url = `https://graph.facebook.com/v19.0/${config.whatsappPhoneNumberId}/messages`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.whatsappAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: payload.to.replace(/[^0-9]/g, ''),
          type: 'text',
          text: { body: payload.bodyText }
        })
      });

      const data = await res.json() as any;
      if (!res.ok) {
        return { success: false, error: data.error?.message || 'Meta API error' };
      }
      return { success: true, messageId: data.messages?.[0]?.id };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
}

export class NotificationService {
  private messagingProvider: IMessagingProvider;

  constructor(provider?: IMessagingProvider) {
    this.messagingProvider = provider || new MetaWhatsAppProvider();
  }

  setMessagingProvider(provider: IMessagingProvider) {
    this.messagingProvider = provider;
  }

  async sendEmail(payload: EmailPayload): Promise<{ success: boolean; id?: string; error?: string }> {
    if (!config.resendApiKey) {
      console.log(`[Email:Mock] Subject: "${payload.subject}" to ${payload.to}`);
      return { success: true, id: `email_mock_${Date.now()}` };
    }

    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: config.notificationFromEmail,
          to: payload.to,
          subject: payload.subject,
          html: payload.html
        })
      });

      const data = await res.json() as any;
      if (!res.ok) {
        return { success: false, error: data.message || 'Resend error' };
      }
      return { success: true, id: data.id };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async sendWhatsApp(payload: WhatsAppPayload) {
    return this.messagingProvider.sendWhatsApp(payload);
  }

  // --- Email Templates ---
  generateNewLeadHtml(data: { customerName: string; phone: string; email?: string; service?: string; notes?: string; source?: string }): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #1e3a8a;">New Lead Received</h2>
        <p>A new prospective customer just called into your AI Voice Receptionist.</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Customer:</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${data.customerName}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Phone:</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${data.phone}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Email:</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${data.email || 'N/A'}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Service:</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${data.service || 'General Inquiry'}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Source:</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${data.source || 'AI_VOICE_CALL'}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Notes:</td><td style="padding: 8px;">${data.notes || 'None'}</td></tr>
        </table>
      </div>
    `;
  }

  generateAppointmentConfirmationHtml(data: { businessName: string; serviceName: string; dateTime: string; location: string; contactPhone: string }): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
        <h2 style="color: #2563eb;">Appointment Confirmed!</h2>
        <p>Your appointment with <strong>${data.businessName}</strong> has been successfully booked.</p>
        <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 15px 0;">
          <p><strong>Service:</strong> ${data.serviceName}</p>
          <p><strong>Date & Time:</strong> ${data.dateTime}</p>
          <p><strong>Location:</strong> ${data.location}</p>
          <p><strong>Questions or Changes:</strong> Call ${data.contactPhone}</p>
        </div>
        <p style="color: #64748b; font-size: 13px;">This appointment was scheduled automatically via AI Voice Receptionist.</p>
      </div>
    `;
  }

  generateHumanHandoffHtml(data: { callerPhone: string; callerName?: string; reason: string; timestamp: string }): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ef4444; border-radius: 8px;">
        <h2 style="color: #dc2626;">Human Escalation Required</h2>
        <p>A customer call required human transfer or escalation.</p>
        <p><strong>Caller:</strong> ${data.callerName || 'Unknown'} (${data.callerPhone})</p>
        <p><strong>Reason:</strong> ${data.reason}</p>
        <p><strong>Time:</strong> ${data.timestamp}</p>
        <p>Please follow up with this customer as soon as possible.</p>
      </div>
    `;
  }
}

export const notificationService = new NotificationService();
