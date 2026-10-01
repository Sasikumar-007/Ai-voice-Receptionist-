import { config } from '../config.js';
import { db } from '../repositories/database.js';

export interface IVoiceProvider {
  name: string;
  generateGreetingResponse(greetingText: string, callbackUrl: string): string;
  generateSpeechResponse(speechText: string, callbackUrl: string, shouldHangup?: boolean): string;
  generateTransferResponse(transferPhoneNumber: string, message: string): string;
  verifyWebhookSignature(signature: string, url: string, params: Record<string, any>): boolean;
}

export class TwilioVoiceProvider implements IVoiceProvider {
  name = 'twilio';

  generateGreetingResponse(greetingText: string, callbackUrl: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna-Neural">${this.escapeXml(greetingText)}</Say>
  <Gather input="speech" action="${this.escapeXml(callbackUrl)}" speechTimeout="auto" timeout="4" method="POST">
    <Say voice="Polly.Joanna-Neural">How can I help you?</Say>
  </Gather>
  <Say voice="Polly.Joanna-Neural">I didn't hear anything. If you're still there, feel free to speak or call back anytime.</Say>
</Response>`;
  }

  generateSpeechResponse(speechText: string, callbackUrl: string, shouldHangup: boolean = false): string {
    if (shouldHangup) {
      return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna-Neural">${this.escapeXml(speechText)}</Say>
  <Hangup/>
</Response>`;
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna-Neural">${this.escapeXml(speechText)}</Say>
  <Gather input="speech" action="${this.escapeXml(callbackUrl)}" speechTimeout="auto" timeout="5" method="POST">
  </Gather>
  <Say voice="Polly.Joanna-Neural">Are you still there? Please let me know how I can assist you.</Say>
</Response>`;
  }

  generateTransferResponse(transferPhoneNumber: string, message: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna-Neural">${this.escapeXml(message)}</Say>
  <Dial callerId="${config.twilioPhoneNumber}" timeout="30">
    <Number>${this.escapeXml(transferPhoneNumber)}</Number>
  </Dial>
  <Say voice="Polly.Joanna-Neural">The transfer could not be completed right now. We have notified our dispatch team to call you right back.</Say>
</Response>`;
  }

  verifyWebhookSignature(signature: string, url: string, params: Record<string, any>): boolean {
    // In production, verify using twilio.validateRequest(authToken, signature, url, params)
    if (!config.twilioAuthToken || config.enableMockFallback) {
      return true; // Bypass in dev/test
    }
    return Boolean(signature);
  }

  private escapeXml(unsafe: string): string {
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });
  }
}

export class VoiceService {
  private provider: IVoiceProvider;

  constructor(provider?: IVoiceProvider) {
    this.provider = provider || new TwilioVoiceProvider();
  }

  setProvider(provider: IVoiceProvider) {
    this.provider = provider;
  }

  getProvider(): IVoiceProvider {
    return this.provider;
  }
}

export const voiceService = new VoiceService();
