import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../lib/api';
import {
  Building2, Wrench, Clock, BookOpen, Bot, Calendar, Bell, Phone,
  CheckCircle2, ArrowRight, ArrowLeft, Sparkles
} from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Business Info', icon: Building2 },
  { id: 2, title: 'Services', icon: Wrench },
  { id: 3, title: 'Business Hours', icon: Clock },
  { id: 4, title: 'FAQs', icon: BookOpen },
  { id: 5, title: 'AI Personality', icon: Bot },
  { id: 6, title: 'Google Calendar', icon: Calendar },
  { id: 7, title: 'Notifications', icon: Bell },
  { id: 8, title: 'Phone & Voice', icon: Phone }
];

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { business } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form states
  const [bizInfo, setBizInfo] = useState({
    name: business?.name || 'SwiftFix Plumbing',
    business_type: 'Plumbing & HVAC',
    website: 'https://swiftfixplumbing.demo',
    phone: '+1 (555) 019-2831',
    email: 'contact@swiftfixplumbing.com',
    address: '742 Evergreen Terrace',
    city: 'Springfield',
    state: 'OR',
    country: 'United States',
    timezone: 'America/Los_Angeles'
  });

  const [services, setServices] = useState([
    { name: 'Emergency Plumbing', duration_minutes: 60, price_cents: 18900, is_booking_enabled: true },
    { name: 'Pipe Repair & Leak Detection', duration_minutes: 90, price_cents: 14900, is_booking_enabled: true }
  ]);

  const [aiPersonality, setAiPersonality] = useState('Friendly and professional');
  const [greeting, setGreeting] = useState("Thank you for calling {{business_name}}! My name is Sarah, your AI receptionist. How can I help you today?");

  const handleNext = async () => {
    if (step < 8) {
      setStep(step + 1);
    } else {
      // Complete Onboarding
      setLoading(true);
      try {
        await apiRequest('/business/onboarding-wizard', {
          method: 'POST',
          body: JSON.stringify({
            businessInfo: bizInfo,
            services,
            aiConfig: {
              personality: aiPersonality,
              greeting_message: greeting
            }
          })
        });
        navigate('/dashboard');
      } catch (err) {
        console.error(err);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between py-8 px-6">
      <div className="max-w-4xl mx-auto w-full">
        {/* Progress Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-semibold text-brand-400 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Setup Wizard • Step {step} of 8</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Configure Your AI Receptionist</h1>
          <p className="text-xs text-slate-400 mt-1">Sarah will use this information to answer calls and book visits accurately.</p>

          {/* Stepper Navigation */}
          <div className="mt-8 flex items-center justify-center gap-2 overflow-x-auto pb-2">
            {STEPS.map((s) => (
              <div
                key={s.id}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  s.id === step
                    ? 'bg-brand-600 text-white'
                    : s.id < step
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-slate-900 text-slate-500 border border-slate-800'
                }`}
              >
                <s.icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{s.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white mb-4">Step 1 — Business Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Business Name</label>
                  <input
                    type="text"
                    value={bizInfo.name}
                    onChange={(e) => setBizInfo({ ...bizInfo, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-850 border border-slate-700 rounded-lg text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Industry / Business Type</label>
                  <input
                    type="text"
                    value={bizInfo.business_type}
                    onChange={(e) => setBizInfo({ ...bizInfo, business_type: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-850 border border-slate-700 rounded-lg text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={bizInfo.phone}
                    onChange={(e) => setBizInfo({ ...bizInfo, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-850 border border-slate-700 rounded-lg text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={bizInfo.email}
                    onChange={(e) => setBizInfo({ ...bizInfo, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-850 border border-slate-700 rounded-lg text-sm text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-400 mb-1">Street Address</label>
                  <input
                    type="text"
                    value={bizInfo.address}
                    onChange={(e) => setBizInfo({ ...bizInfo, address: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-850 border border-slate-700 rounded-lg text-sm text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white mb-2">Step 2 — Services Catalog</h3>
              <p className="text-xs text-slate-400 mb-4">Sarah will offer these services and prices to callers.</p>
              {services.map((srv, idx) => (
                <div key={idx} className="p-4 bg-slate-850 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white text-sm">{srv.name}</div>
                    <div className="text-xs text-slate-400">{srv.duration_minutes} mins • ${srv.price_cents / 100}</div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Booking Enabled
                  </span>
                </div>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white mb-2">Step 3 — Operating Business Hours</h3>
              <p className="text-xs text-slate-400 mb-4">Sarah checks these hours before booking any appointments.</p>
              <div className="p-4 bg-slate-850 border border-slate-800 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-white font-medium">Monday — Friday</span>
                  <span className="text-slate-300">8:00 AM — 6:00 PM</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-white font-medium">Saturday</span>
                  <span className="text-slate-300">9:00 AM — 2:00 PM</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-white font-medium">Sunday</span>
                  <span className="text-rose-400 font-semibold">Closed (Emergency Dispatch Only)</span>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white mb-2">Step 4 — Business FAQs</h3>
              <div className="p-4 bg-slate-850 border border-slate-800 rounded-xl space-y-3">
                <div>
                  <div className="text-xs font-bold text-brand-400">What is your diagnostic fee?</div>
                  <div className="text-xs text-slate-300 mt-0.5">$49 service call fee, waived when repair is approved.</div>
                </div>
                <div className="border-t border-slate-800 pt-2">
                  <div className="text-xs font-bold text-brand-400">Are technicians licensed?</div>
                  <div className="text-xs text-slate-300 mt-0.5">Yes, all SwiftFix plumbers are fully licensed, insured, and bonded.</div>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white mb-2">Step 5 — AI Personality & Greeting</h3>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {['Friendly and professional', 'Concise and direct', 'Warm and empathetic', 'Formal and corporate'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setAiPersonality(p)}
                    className={`p-3 rounded-xl border text-left text-xs transition ${
                      aiPersonality === p
                        ? 'bg-brand-600/20 border-brand-500 text-white font-bold'
                        : 'bg-slate-850 border-slate-800 text-slate-400'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Greeting Message</label>
                <textarea
                  rows={2}
                  value={greeting}
                  onChange={(e) => setGreeting(e.target.value)}
                  className="w-full p-3 bg-slate-850 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4 text-center py-6">
              <div className="w-14 h-14 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white">Step 6 — Connect Google Calendar</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Authorize Google Calendar so Sarah can verify real-time availability and add confirmed bookings directly to your schedule.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs font-semibold text-emerald-400 mt-2">
                <CheckCircle2 className="w-4 h-4" /> Connected in Evaluation Mode
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="space-y-4 text-center py-6">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-3">
                <Bell className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white">Step 7 — Notifications & Alerts</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Lead alerts and booking confirmations are enabled for Resend Email and WhatsApp Cloud API.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs font-semibold text-emerald-400 mt-2">
                <CheckCircle2 className="w-4 h-4" /> Email & WhatsApp Channels Ready
              </div>
            </div>
          )}

          {step === 8 && (
            <div className="space-y-4 text-center py-6">
              <div className="w-14 h-14 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center mx-auto mb-3">
                <Phone className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white">Step 8 — Dedicated Twilio Phone Number</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Your assigned Twilio voice line is <strong className="text-white">+1 (555) 019-2831</strong>. Callers dialing this number will be greeted by Sarah.
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              disabled={step === 1}
              onClick={() => setStep(step - 1)}
              className="px-4 py-2.5 bg-slate-850 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 disabled:opacity-40 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Previous
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={handleNext}
              className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-500/25 flex items-center gap-1.5 transition"
            >
              {loading ? (
                'Finalizing Setup...'
              ) : step === 8 ? (
                <>
                  <span>Complete Setup & Enter Dashboard</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Next Step</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
