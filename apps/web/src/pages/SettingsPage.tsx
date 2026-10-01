import React, { useState, useEffect } from 'react';
import { apiRequest } from '../lib/api';
import { AIConfiguration, Business, BusinessSettings } from '@ai-receptionist/shared';
import { Settings, Bot, Shield, Save, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SettingsPage: React.FC = () => {
  const { business } = useAuth();
  const [aiConfig, setAiConfig] = useState<AIConfiguration | null>(null);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [aiRes, bizRes] = await Promise.all([
          apiRequest<AIConfiguration>('/ai/config'),
          apiRequest<{ business: Business; settings: BusinessSettings }>('/business/profile')
        ]);
        setAiConfig(aiRes);
        setSettings(bizRes.settings);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSaveAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiConfig) return;
    try {
      await apiRequest('/ai/config', {
        method: 'PUT',
        body: JSON.stringify(aiConfig)
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSavePrivacy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      await apiRequest('/business/settings', {
        method: 'PUT',
        body: JSON.stringify(settings)
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !aiConfig || !settings) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#140206] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="font-serif text-3xl font-normal tracking-tight text-[#140206] flex items-center gap-3">
          <span className="w-10 h-10 rounded-full bg-[#140206] text-[#1bd944] flex items-center justify-center border-2 border-[#140206] shadow-brutal-sm">
            <Settings className="w-5 h-5" />
          </span>
          System Governance & Guardrails
        </h1>
        <p className="text-xs font-mono text-[#5e5850] mt-1">
          Tune Sarah's conversational instructions, prompt boundaries, and enterprise compliance retention policies.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-[#ade2d8] border-2 border-[#140206] text-xs font-mono font-bold text-[#140206] flex items-center gap-2 shadow-brutal-sm">
          <CheckCircle2 className="w-4 h-4 text-[#140206]" />
          Configuration updated and hot-reloaded across live telephony trunks!
        </div>
      )}

      {/* AI Receptionist Persona & Guardrails */}
      <form onSubmit={handleSaveAI} className="bg-white border-2 border-[#140206] rounded-3xl p-6 sm:p-8 space-y-6 shadow-brutal">
        <div className="flex items-center gap-3 border-b-2 border-[#140206]/10 pb-4">
          <div className="w-10 h-10 rounded-full bg-[#ffda95] text-[#140206] border-2 border-[#140206] shadow-brutal-sm flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-normal text-[#140206]">AI Neural Receptionist Parameters</h2>
            <p className="text-xs font-mono text-[#5e5850]">Controls conversational personality, greeting, instructions, and strict boundaries.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase font-bold text-[#140206] mb-1">Agent Identifier Name</label>
            <input
              type="text"
              value={aiConfig.ai_name}
              onChange={(e) => setAiConfig({ ...aiConfig, ai_name: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#fbf8f1] border-2 border-[#140206] rounded-xl text-xs font-mono text-[#140206] focus:outline-none focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase font-bold text-[#140206] mb-1">Personality Profile</label>
            <input
              type="text"
              value={aiConfig.personality}
              onChange={(e) => setAiConfig({ ...aiConfig, personality: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#fbf8f1] border-2 border-[#140206] rounded-xl text-xs font-mono text-[#140206] focus:outline-none focus:bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase font-bold text-[#140206] mb-1">Inbound Voice Call Opening Line</label>
          <textarea
            rows={2}
            value={aiConfig.greeting_message}
            onChange={(e) => setAiConfig({ ...aiConfig, greeting_message: e.target.value })}
            className="w-full p-3.5 bg-[#fbf8f1] border-2 border-[#140206] rounded-2xl text-xs font-mono text-[#140206] focus:outline-none focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase font-bold text-[#140206] mb-1">Core Business Instructions & Mission</label>
          <textarea
            rows={4}
            value={aiConfig.business_instructions}
            onChange={(e) => setAiConfig({ ...aiConfig, business_instructions: e.target.value })}
            className="w-full p-3.5 bg-[#fbf8f1] border-2 border-[#140206] rounded-2xl text-xs font-sans text-[#140206] leading-relaxed focus:outline-none focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase font-bold text-[#ff6183] mb-1 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            Strict Guardrails (Things the AI must NEVER say or promise)
          </label>
          <textarea
            rows={3}
            value={aiConfig.things_never_to_say}
            onChange={(e) => setAiConfig({ ...aiConfig, things_never_to_say: e.target.value })}
            placeholder="Never guarantee pricing without an on-site visit. Never offer legal or medical advice."
            className="w-full p-3.5 bg-[#fbf8f1] border-2 border-[#140206] rounded-2xl text-xs font-sans text-[#140206] leading-relaxed focus:outline-none focus:bg-white"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#140206] hover:bg-[#1bd944] text-[#f5f3ef] hover:text-[#140206] rounded-full text-xs font-mono uppercase tracking-wider font-extrabold border-2 border-[#140206] shadow-brutal transition flex items-center gap-2 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            <Save className="w-4 h-4" /> Save AI Configuration
          </button>
        </div>
      </form>

      {/* Privacy, Retention & Compliance */}
      <form onSubmit={handleSavePrivacy} className="bg-white border-2 border-[#140206] rounded-3xl p-6 sm:p-8 space-y-6 shadow-brutal">
        <div className="flex items-center gap-3 border-b-2 border-[#140206]/10 pb-4">
          <div className="w-10 h-10 rounded-full bg-[#ade2d8] text-[#140206] border-2 border-[#140206] shadow-brutal-sm flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-normal text-[#140206]">Privacy, Retention & Compliance</h2>
            <p className="text-xs font-mono text-[#5e5850]">Configure automated data purging cycles and telephony consent protocols.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase font-bold text-[#140206] mb-1">Data Retention Cycle (Days)</label>
            <input
              type="number"
              value={settings.retention_days}
              onChange={(e) => setSettings({ ...settings, retention_days: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 bg-[#fbf8f1] border-2 border-[#140206] rounded-xl text-xs font-mono text-[#140206] focus:outline-none focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase font-bold text-[#140206] mb-1">Emergency Dispatch Notification Email</label>
            <input
              type="email"
              value={settings.notification_email || ''}
              onChange={(e) => setSettings({ ...settings, notification_email: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#fbf8f1] border-2 border-[#140206] rounded-xl text-xs font-mono text-[#140206] focus:outline-none focus:bg-white"
            />
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.allow_call_recording}
              onChange={(e) => setSettings({ ...settings, allow_call_recording: e.target.checked })}
              className="w-4 h-4 text-[#140206] border-2 border-[#140206] rounded accent-[#1bd944]"
            />
            <span className="text-xs font-mono text-[#140206] font-bold">
              Enable inbound audio recording (Only where bilateral consent requirements are satisfied)
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.record_transcription}
              onChange={(e) => setSettings({ ...settings, record_transcription: e.target.checked })}
              className="w-4 h-4 text-[#140206] border-2 border-[#140206] rounded accent-[#1bd944]"
            />
            <span className="text-xs font-mono text-[#140206] font-bold">
              Store conversation text transcripts for quality auditing and semantic search
            </span>
          </label>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#1bd944] text-[#140206] hover:bg-[#3bdb5d] rounded-full text-xs font-mono uppercase tracking-wider font-extrabold border-2 border-[#140206] shadow-brutal-sm transition flex items-center gap-2 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            <Save className="w-4 h-4" /> Save Privacy & Retention Policies
          </button>
        </div>
      </form>
    </div>
  );
};
