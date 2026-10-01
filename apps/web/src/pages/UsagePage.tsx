import React, { useState, useEffect } from 'react';
import { apiRequest } from '../lib/api';
import { Subscription } from '@ai-receptionist/shared';
import { BarChart3, Phone, Bot, Mail, Sparkles, CheckCircle2 } from 'lucide-react';

export const UsagePage: React.FC = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    // demo subscription
    setSubscription({
      id: 'sub-1',
      business_id: 'demo',
      plan_tier: 'PROFESSIONAL',
      status: 'ACTIVE',
      call_minutes_limit: 1000,
      ai_requests_limit: 5000,
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 30 * 86400000).toISOString()
    });
  }, []);

  const minutesUsed = 248;
  const aiUsed = 1140;

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-brand-400" />
          Usage & Subscription Quotas
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Monitor your consumed voice minutes, Gemini AI reasoning requests, and subscription tier.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase font-bold tracking-wider text-slate-500">Active SaaS Plan</span>
          <h2 className="text-xl font-extrabold text-white mt-0.5">Professional Tier</h2>
          <p className="text-xs text-slate-400 mt-1">Includes 1,000 telephony minutes & Google Calendar two-way sync.</p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="w-3.5 h-3.5" /> Plan Active
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Voice Minutes Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Voice Telephony Minutes</span>
            <Phone className="w-4 h-4 text-brand-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {minutesUsed} <span className="text-sm font-normal text-slate-400">/ 1,000 mins</span>
          </div>
          <div className="h-2.5 w-full bg-slate-800 rounded-full mt-4 overflow-hidden">
            <div
              style={{ width: `${(minutesUsed / 1000) * 100}%` }}
              className="h-full bg-brand-500 rounded-full"
            ></div>
          </div>
          <div className="text-xs text-slate-400 mt-2">752 minutes remaining this billing cycle.</div>
        </div>

        {/* AI Requests Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">AI Reasoning Turns</span>
            <Sparkles className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">
            {aiUsed} <span className="text-sm font-normal text-slate-400">/ 5,000 requests</span>
          </div>
          <div className="h-2.5 w-full bg-slate-800 rounded-full mt-4 overflow-hidden">
            <div
              style={{ width: `${(aiUsed / 5000) * 100}%` }}
              className="h-full bg-violet-500 rounded-full"
            ></div>
          </div>
          <div className="text-xs text-slate-400 mt-2">3,860 requests remaining.</div>
        </div>
      </div>
    </div>
  );
};
