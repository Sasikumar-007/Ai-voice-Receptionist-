import React, { useState, useEffect } from 'react';
import { apiRequest } from '../lib/api';
import { Subscription } from '@ai-receptionist/shared';
import { BarChart3, Phone, Sparkles, CheckCircle2, Zap } from 'lucide-react';

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
        <h1 className="font-serif text-3xl font-normal tracking-tight text-[#140206] flex items-center gap-3">
          <span className="w-10 h-10 rounded-full bg-[#140206] text-[#1bd944] flex items-center justify-center border-2 border-[#140206] shadow-brutal-sm">
            <BarChart3 className="w-5 h-5" />
          </span>
          Resource Quotas & Telephony Metering
        </h1>
        <p className="text-xs font-mono text-[#5e5850] mt-1">
          Monitor your live consumed voice minutes, Gemini reasoning queries, and SLA allocations.
        </p>
      </div>

      <div className="bg-white border-2 border-[#140206] rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-brutal">
        <div>
          <span className="text-[11px] uppercase font-mono font-bold tracking-wider text-[#856f58]">Active Production Tier</span>
          <h2 className="font-serif text-2xl font-normal text-[#140206] mt-0.5">Professional Enterprise Cluster</h2>
          <p className="text-xs font-mono text-[#5e5850] mt-1">Allocated 1,000 monthly PSTN voice minutes & sub-second LLM synthesis.</p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#ade2d8] text-[#140206] border-2 border-[#140206] shadow-brutal-sm">
          <CheckCircle2 className="w-3.5 h-3.5" /> Plan Active & Healthy
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Voice Minutes Card */}
        <div className="bg-white border-2 border-[#140206] rounded-3xl p-6 shadow-brutal hover:shadow-brutal-lg transition">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#856f58]">Voice Telephony Minutes</span>
            <div className="w-8 h-8 rounded-full bg-[#ffda95] border-2 border-[#140206] shadow-brutal-sm flex items-center justify-center text-[#140206]">
              <Phone className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-normal text-[#140206]">
            {minutesUsed} <span className="font-mono text-sm font-normal text-[#856f58]">/ 1,000 mins</span>
          </div>
          <div className="h-3 w-full bg-[#fbf8f1] border-2 border-[#140206] rounded-full mt-4 overflow-hidden p-0.5">
            <div
              style={{ width: `${(minutesUsed / 1000) * 100}%` }}
              className="h-full bg-[#1bd944] rounded-full transition-all duration-500"
            ></div>
          </div>
          <div className="text-xs font-mono text-[#5e5850] mt-2.5">
            752 minutes remaining before rollover on Nov 1.
          </div>
        </div>

        {/* AI Requests Card */}
        <div className="bg-white border-2 border-[#140206] rounded-3xl p-6 shadow-brutal hover:shadow-brutal-lg transition">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#856f58]">AI Reasoning Turns</span>
            <div className="w-8 h-8 rounded-full bg-[#ffb4c5] border-2 border-[#140206] shadow-brutal-sm flex items-center justify-center text-[#140206]">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-normal text-[#140206]">
            {aiUsed} <span className="font-mono text-sm font-normal text-[#856f58]">/ 5,000 turns</span>
          </div>
          <div className="h-3 w-full bg-[#fbf8f1] border-2 border-[#140206] rounded-full mt-4 overflow-hidden p-0.5">
            <div
              style={{ width: `${(aiUsed / 5000) * 100}%` }}
              className="h-full bg-[#fd7f00] rounded-full transition-all duration-500"
            ></div>
          </div>
          <div className="text-xs font-mono text-[#5e5850] mt-2.5">
            3,860 requests remaining under current quota.
          </div>
        </div>
      </div>
    </div>
  );
};
