import { FastifyInstance } from 'fastify';
import { db } from '../repositories/database.js';
import { voiceService } from '../services/voiceService.js';
import { geminiService } from '../services/geminiService.js';
import { config } from '../config.js';

export async function voiceRoutes(fastify: FastifyInstance) {
  // Inbound Call webhook from Twilio
  // POST /api/voice/incoming
  fastify.post('/incoming', async (request, reply) => {
    const body = (request.body as any) || {};
    const toPhone = body.To || config.twilioPhoneNumber;
    const fromPhone = body.From || '+15550001111';
    const callSid = body.CallSid || `CS_${Date.now()}`;

    // Resolve tenant from phone number
    const business = await db.findBusinessByPhoneNumber(toPhone);
    const bizId = business?.id || '22222222-2222-2222-2222-222222222222';
    const aiConfig = await db.getAIConfig(bizId);

    // Record incoming call
    await db.createCall(bizId, {
      caller_phone: fromPhone,
      business_phone: toPhone,
      twilio_call_sid: callSid,
      start_time: new Date().toISOString(),
      status: 'IN_PROGRESS',
      outcome: 'IN_PROGRESS',
      was_transferred: false,
      duration_seconds: 0,
      sentiment: 'NEUTRAL'
    });

    const greeting = (aiConfig?.greeting_message || 'Thank you for calling {{business_name}}! How can I help you?')
      .replace('{{business_name}}', business?.name || 'our business');

    const gatherUrl = `${config.apiUrl}/api/voice/gather?business_id=${bizId}&call_sid=${callSid}`;
    const twiml = voiceService.getProvider().generateGreetingResponse(greeting, gatherUrl);

    reply.header('Content-Type', 'text/xml');
    return reply.send(twiml);
  });

  // Twilio Speech Recognition callback
  // POST /api/voice/gather
  fastify.post('/gather', async (request, reply) => {
    const body = (request.body as any) || {};
    const query = (request.query as any) || {};
    const bizId = query.business_id || '22222222-2222-2222-2222-222222222222';
    const speechResult = body.SpeechResult || 'Hello';
    const callerPhone = body.From || '+1 (555) 432-8765';

    // Process conversational reasoning turn
    const turnResult = await geminiService.processTurn({
      businessId: bizId,
      callerPhone,
      userSpeech: speechResult,
      conversationHistory: []
    });

    reply.header('Content-Type', 'text/xml');

    if (turnResult.transferredToHuman) {
      const twiml = voiceService.getProvider().generateTransferResponse(
        config.twilioPhoneNumber,
        turnResult.assistantSpeech
      );
      return reply.send(twiml);
    }

    const nextGatherUrl = `${config.apiUrl}/api/voice/gather?business_id=${bizId}`;
    const twiml = voiceService.getProvider().generateSpeechResponse(turnResult.assistantSpeech, nextGatherUrl);
    return reply.send(twiml);
  });

  // Call status updates (duration, completion, recording)
  // POST /api/voice/status
  fastify.post('/status', async (request, reply) => {
    const body = (request.body as any) || {};
    console.log('[VoiceStatusWebhook] Call SID:', body.CallSid, 'Status:', body.CallStatus, 'Duration:', body.CallDuration);
    return reply.send({ received: true });
  });
}
