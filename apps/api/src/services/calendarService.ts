import { config } from '../config.js';

export interface CalendarEventPayload {
  summary: string;
  description: string;
  startTime: string; // ISO
  endTime: string;   // ISO
  attendeeEmail?: string;
  location?: string;
}

export class GoogleCalendarService {
  getAuthUrl(businessId: string): string {
    if (!config.googleClientId) {
      return `${config.apiUrl}/api/calendar/mock-connected?business_id=${businessId}`;
    }

    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const options = {
      redirect_uri: config.googleRedirectUri,
      client_id: config.googleClientId,
      access_type: 'offline',
      response_type: 'code',
      prompt: 'consent',
      scope: 'https://www.googleapis.com/auth/calendar.events',
      state: businessId
    };

    const qs = new URLSearchParams(options).toString();
    return `${rootUrl}?${qs}`;
  }

  async exchangeCodeForTokens(code: string): Promise<{ accessToken: string; refreshToken?: string; expiry: Date } | null> {
    if (!config.googleClientId || !config.googleClientSecret) {
      return {
        accessToken: `mock_access_token_${Date.now()}`,
        refreshToken: `mock_refresh_token_${Date.now()}`,
        expiry: new Date(Date.now() + 3600 * 1000)
      };
    }

    try {
      const res = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: config.googleClientId,
          client_secret: config.googleClientSecret,
          redirect_uri: config.googleRedirectUri,
          grant_type: 'authorization_code'
        }).toString()
      });

      const data = await res.json() as any;
      if (!res.ok) {
        throw new Error(data.error_description || 'OAuth token exchange failed');
      }

      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiry: new Date(Date.now() + (data.expires_in || 3600) * 1000)
      };
    } catch (err) {
      console.error('[GoogleCalendarService] Exchange error:', err);
      return null;
    }
  }

  async createCalendarEvent(accessToken: string, calendarId: string = 'primary', event: CalendarEventPayload): Promise<{ id: string; link?: string } | null> {
    if (!accessToken || accessToken.startsWith('mock_')) {
      console.log(`[GoogleCalendar:Mock] Created event "${event.summary}" from ${event.startTime} to ${event.endTime}`);
      return {
        id: `mock_gcal_${Date.now()}`,
        link: 'https://calendar.google.com/calendar'
      };
    }

    try {
      const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          summary: event.summary,
          description: event.description,
          location: event.location,
          start: { dateTime: event.startTime },
          end: { dateTime: event.endTime },
          attendees: event.attendeeEmail ? [{ email: event.attendeeEmail }] : []
        })
      });

      const data = await res.json() as any;
      if (!res.ok) {
        throw new Error(data.error?.message || 'Google Calendar API error');
      }
      return { id: data.id, link: data.htmlLink };
    } catch (err) {
      console.error('[GoogleCalendarService] Create event error:', err);
      return null;
    }
  }
}

export const calendarService = new GoogleCalendarService();
