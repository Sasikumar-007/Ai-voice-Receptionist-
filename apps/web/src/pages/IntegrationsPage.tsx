import React, { useState, useEffect } from 'react';
import { apiRequest } from '../lib/api';
import {
  Layers, PhoneCall, Calendar, Mail, MessageSquare, Sparkles,
  CheckCircle2, ExternalLink
} from 'lucide-react';

export const IntegrationsPage: React.FC = () => {
  const [integrations, setIntegrations] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await apiRequest('/integrations');
        setIntegrations(res);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const cards = [
    {
      name: 'Twilio Voice PSTN',
      category: 'Telephony & SIP Trunks',
      icon: PhoneCall,
      status: 'OPERATIONAL',
      desc: 'Inbound carrier SIP trunking, real-time bi-directional audio gathering, TwiML compilation, and human supervisor transfer.',
      bg: 'bg-[#ffda95]'
    },
    {
      name: 'Google Calendar API',
      category: 'Scheduling Engine',
      icon: Calendar,
      status: 'OPERATIONAL',
      desc: 'OAuth 2.0 dual-way calendar sync, intelligent conflict-free slot reservation, and immediate caller invites.',
      bg: 'bg-[#ade2d8]'
    },
    {
      name: 'Google Gemini 1.5 Flash',
      category: 'Neural Reasoning Core',
      icon: Sparkles,
      status: 'OPERATIONAL',
      desc: 'Sub-second tool calling, intent detection, deterministic schema validation, and conversational fallback safety guards.',
      bg: 'bg-[#d0c9ed]'
    },
    {
      name: 'Resend Transactional',
      category: 'Email Pipeline',
      icon: Mail,
      status: 'OPERATIONAL',
      desc: 'Instant owner dispatch emails, caller booking confirmations, and human handoff incident logs.',
      bg: 'bg-[#ffb4c5]'
    },
    {
      name: 'Meta WhatsApp Cloud',
      category: 'Instant Messaging API',
      icon: MessageSquare,
      status: 'OPERATIONAL',
      desc: 'Automated WhatsApp confirmation broadcasts, booking modifications, and emergency dispatch alerts.',
      bg: 'bg-[#1bd944]'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-normal tracking-tight text-[#140206] flex items-center gap-3">
          <span className="w-10 h-10 rounded-full bg-[#140206] text-[#1bd944] flex items-center justify-center border-2 border-[#140206] shadow-brutal-sm">
            <Layers className="w-5 h-5" />
          </span>
          Infrastructure & Protocol Connectors
        </h1>
        <p className="text-xs font-mono text-[#5e5850] mt-1">
          Active integrations powering real-time human computing, calendar bookings, and voice handoffs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((c, i) => (
          <div key={i} className="bg-white border-2 border-[#140206] p-6 rounded-3xl flex flex-col justify-between shadow-brutal hover:shadow-brutal-lg transition">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-full ${c.bg} border-2 border-[#140206] shadow-brutal-sm flex items-center justify-center text-[#140206]`}>
                  <c.icon className="w-5 h-5" />
                </div>
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#ade2d8] text-[#140206] border-2 border-[#140206] shadow-brutal-sm">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {c.status}
                </span>
              </div>
              <h3 className="font-serif text-xl font-normal text-[#140206]">{c.name}</h3>
              <div className="text-[11px] font-mono text-[#856f58] uppercase tracking-wider font-bold mb-2">{c.category}</div>
              <p className="text-xs font-sans text-[#4b2c22] leading-relaxed">{c.desc}</p>
            </div>

            <div className="mt-6 pt-4 border-t-2 border-[#140206]/10 flex items-center justify-between text-xs font-mono">
              <span className="text-[#856f58]">Health: 100% OK</span>
              <span className="text-[#140206] font-bold cursor-pointer hover:underline flex items-center gap-1">
                Protocol Details <ExternalLink className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
