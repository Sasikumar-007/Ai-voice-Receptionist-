import React, { useState, useEffect } from 'react';
import { apiRequest } from '../lib/api';
import { AIConfiguration, Business, BusinessSettings } from '@ai-receptionist/shared';
import { Settings, Bot, Shield, Save, CheckCircle2, AlertTriangle, Trash2 } from 'lucide-react';
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
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-brand-400" />
          System Settings & AI Guardrails
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Configure Sarah's conversational instructions, guardrails, and compliance retention settings.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          Settings updated and synchronized across all active voice channels!
        </div>
      )}

      {/* AI Receptionist Persona & Guardrails */}
      <form onSubmit={handleSaveAI} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">AI Voice Receptionist Configuration</h2>
            <p className="text-xs text-slate-400">Controls personality, greeting, instructions, and strict boundaries.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">AI Assistant Name</label>
            <input
              type="text"
              value={aiConfig.ai_name}
              onChange={(e) => setAiConfig({ ...aiConfig, ai_name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-850 border border-slate-700 rounded-lg text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Personality Tone</label>
            <input
              type="text"
              value={aiConfig.personality}
              onChange={(e) => setAiConfig({ ...aiConfig, personality: e.target.value })}
              className="w-full px-3 py-2 bg-slate-850 border border-slate-700 rounded-lg text-sm text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Inbound Voice Call Greeting</label>
          <textarea
            rows={2}
            value={aiConfig.greeting_message}
            onChange={(e) => setAiConfig({ ...aiConfig, greeting_message: e.target.value })}
            className="w-full p-3 bg-slate-850 border border-slate-700 rounded-xl text-xs text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Core Business Instructions & Mission</label>
          <textarea
            rows={4}
            value={aiConfig.business_instructions}
            onChange={(e) => setAiConfig({ ...aiConfig, business_instructions: e.target.value })}
            className="w-full p-3 bg-slate-850 border border-slate-700 rounded-xl text-xs text-white leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-rose-400 mb-1 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            Things the AI Should NEVER Say (Strict Guardrails)
          </label>
          <textarea
            rows={3}
            value={aiConfig.things_never_to_say}
            onChange={(e) => setAiConfig({ ...aiConfig, things_never_to_say: e.target.value })}
            placeholder="Never guarantee pricing without an on-site visit. Never offer legal or medical advice."
            className="w-full p-3 bg-slate-850 border border-slate-700 rounded-xl text-xs text-white leading-relaxed"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-brand-500/25 transition"
          >
            <Save className="w-4 h-4" /> Save AI Configuration
          </button>
        </div>
      </form>

      {/* Privacy, Retention & Compliance */}
      <form onSubmit={handleSavePrivacy} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Privacy, Retention & Compliance</h2>
            <p className="text-xs text-slate-400">Configure data retention limits and voice recording consent policies.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Data Retention Period (Days)</label>
            <input
              type="number"
              value={settings.retention_days}
              onChange={(e) => setSettings({ ...settings, retention_days: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-850 border border-slate-700 rounded-lg text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Lead Alert Notification Email</label>
            <input
              type="email"
              value={settings.notification_email || ''}
              onChange={(e) => setSettings({ ...settings, notification_email: e.target.value })}
              className="w-full px-3 py-2 bg-slate-850 border border-slate-700 rounded-lg text-sm text-white"
            />
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.allow_call_recording}
              onChange={(e) => setSettings({ ...settings, allow_call_recording: e.target.checked })}
              className="w-4 h-4 text-brand-600 rounded bg-slate-850 border-slate-700"
            />
            <span className="text-xs text-slate-300 font-medium">
              Enable inbound audio recording (Only where consent requirements are satisfied)
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.record_transcription}
              onChange={(e) => setSettings({ ...settings, record_transcription: e.target.checked })}
              className="w-4 h-4 text-brand-600 rounded bg-slate-850 border-slate-700"
            />
            <span className="text-xs text-slate-300 font-medium">
              Store conversation text transcripts for quality auditing and search
            </span>
          </label>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition"
          >
            <Save className="w-4 h-4" /> Save Privacy & Retention
          </button>
        </div>
      </form>
    </div>
  );
};
