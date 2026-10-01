import React, { useState, useEffect } from 'react';
import { apiRequest } from '../lib/api';
import {
  Layers, PhoneCall, Calendar, Mail, MessageSquare, Sparkles,
  CheckCircle2, ExternalLink, ShieldCheck
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
      name: 'Twilio Voice',
      category: 'Telephony & SIP Trunks',
      icon: PhoneCall,
      status: 'ACTIVE',
      desc: 'Handles incoming telephone calls, voice speech-to-text, TwiML generation, and PSTN routing.',
      color: 'from-rose-500/20 to-red-500/20 text-rose-400',
      connected: true
    },
    {
      name: 'Google Calendar',
      category: 'Scheduling & Availability',
      icon: Calendar,
      status: 'ACTIVE',
      desc: 'OAuth 2.0 two-way synchronization for real-time booking, conflict avoidance, and event reminders.',
      color: 'from-blue-500/20 to-indigo-500/20 text-blue-400',
      connected: true
    },
    {
      name: 'Google Gemini (1.5 Flash)',
      category: 'AI Reasoning Engine',
      icon: Sparkles,
      status: 'ACTIVE',
      desc: 'Powers natural conversation, tool calling, intent detection, and structured safety guardrails.',
      color: 'from-violet-500/20 to-purple-500/20 text-violet-400',
      connected: true
    },
    {
      name: 'Resend Email',
      category: 'Transactional Alerts',
      icon: Mail,
      status: 'ACTIVE',
      desc: 'Instant lead notifications, appointment confirmations, and cancellation notices.',
      color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400',
      connected: true
    },
    {
      name: 'Meta WhatsApp Cloud API',
      category: 'Instant Messaging',
      icon: MessageSquare,
      status: 'ACTIVE',
      desc: 'Automated SMS & WhatsApp appointment confirmations and 24-hour reminder broadcasts.',
      color: 'from-emerald-500/20 to-green-500/20 text-emerald-400',
      connected: true
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Layers className="w-6 h-6 text-brand-400" />
          Integration Hub
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Connected third-party voice, AI, calendar, and messaging infrastructure.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((c, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center`}>
                  <c.icon className="w-5 h-5" />
                </div>
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                </span>
              </div>
              <h3 className="font-bold text-white text-base">{c.name}</h3>
              <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold mb-2">{c.category}</div>
              <p className="text-xs text-slate-400 leading-relaxed">{c.desc}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Status: Operational</span>
              <span className="text-brand-400 font-semibold cursor-pointer hover:underline flex items-center gap-1">
                Configure <ExternalLink className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
