import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../lib/api';
import {
  Building2, Wrench, Clock, BookOpen, Bot, Calendar, Bell, Phone,
  CheckCircle2, ArrowRight, ArrowLeft, Sparkles, Cpu
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

  const [services] = useState([
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
    <div className="min-h-screen bg-[#f3eee7] text-[#140206] flex flex-col justify-between py-10 px-6">
      <div className="max-w-4xl mx-auto w-full">
        {/* Progress Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#140206] text-[#1bd944] border-2 border-[#140206] shadow-brutal-sm text-xs font-mono font-bold uppercase mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>Tenant Provisioning • Step {step} of 8</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#140206]">Configure Your Voice Agent</h1>
          <p className="text-xs font-mono text-[#5e5850] mt-1.5">Sarah will use this context to answer calls and schedule appointments with sub-second latency.</p>

          {/* Stepper Navigation */}
          <div className="mt-8 flex items-center justify-center gap-2 overflow-x-auto pb-2">
            {STEPS.map((s) => (
              <div
                key={s.id}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold transition border-2 border-[#140206] shadow-brutal-sm ${
                  s.id === step
                    ? 'bg-[#1bd944] text-[#140206]'
                    : s.id < step
                    ? 'bg-[#ade2d8] text-[#140206]'
                    : 'bg-white text-[#856f58]'
                }`}
              >
                <s.icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{s.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content Box */}
        <div className="bg-white border-2 border-[#140206] rounded-3xl p-6 sm:p-8 shadow-brutal-lg">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-serif text-2xl font-normal text-[#140206] mb-4">Step 1 — Business Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase font-bold text-[#140206] mb-1">Business Name</label>
                  <input
                    type="text"
                    value={bizInfo.name}
                    onChange={(e) => setBizInfo({ ...bizInfo, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#fbf8f1] border-2 border-[#140206] rounded-xl text-xs text-[#140206] focus:outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase font-bold text-[#140206] mb-1">Industry / Sector</label>
                  <input
                    type="text"
                    value={bizInfo.business_type}
                    onChange={(e) => setBizInfo({ ...bizInfo, business_type: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#fbf8f1] border-2 border-[#140206] rounded-xl text-xs text-[#140206] focus:outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase font-bold text-[#140206] mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={bizInfo.phone}
                    onChange={(e) => setBizInfo({ ...bizInfo, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#fbf8f1] border-2 border-[#140206] rounded-xl text-xs text-[#140206] focus:outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase font-bold text-[#140206] mb-1">Email</label>
                  <input
                    type="email"
                    value={bizInfo.email}
                    onChange={(e) => setBizInfo({ ...bizInfo, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#fbf8f1] border-2 border-[#140206] rounded-xl text-xs text-[#140206] focus:outline-none focus:bg-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono uppercase font-bold text-[#140206] mb-1">Street Address</label>
                  <input
                    type="text"
                    value={bizInfo.address}
                    onChange={(e) => setBizInfo({ ...bizInfo, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#fbf8f1] border-2 border-[#140206] rounded-xl text-xs text-[#140206] focus:outline-none focus:bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-serif text-2xl font-normal text-[#140206] mb-2">Step 2 — Services Catalog</h3>
              <p className="text-xs font-mono text-[#5e5850] mb-4">Sarah presents these active service offerings to inbound callers.</p>
              {services.map((srv, idx) => (
                <div key={idx} className="p-4 bg-[#fbf8f1] border-2 border-[#140206] rounded-2xl flex items-center justify-between shadow-brutal-sm">
                  <div>
                    <div className="font-bold text-[#140206] text-sm">{srv.name}</div>
                    <div className="text-xs font-mono text-[#5e5850]">{srv.duration_minutes} mins • ${srv.price_cents / 100}</div>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#140206] bg-[#1bd944] px-2.5 py-1 rounded-full border-2 border-[#140206]">
                    Booking Enabled
                  </span>
                </div>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-serif text-2xl font-normal text-[#140206] mb-2">Step 3 — Operating Business Hours</h3>
              <p className="text-xs font-mono text-[#5e5850] mb-4">Sarah verifies operational windows prior to committing appointment slots.</p>
              <div className="p-4 bg-[#fbf8f1] border-2 border-[#140206] rounded-2xl space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1.5 border-b border-[#140206]/20">
                  <span className="text-[#140206] font-bold">Monday — Friday</span>
                  <span className="text-[#5e5850]">8:00 AM — 6:00 PM</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#140206]/20">
                  <span className="text-[#140206] font-bold">Saturday</span>
                  <span className="text-[#5e5850]">9:00 AM — 2:00 PM</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#140206] font-bold">Sunday</span>
                  <span className="text-[#ff6183] font-bold">Closed (Emergency Dispatch Only)</span>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="font-serif text-2xl font-normal text-[#140206] mb-2">Step 4 — Business FAQs</h3>
              <div className="p-4 bg-[#fbf8f1] border-2 border-[#140206] rounded-2xl space-y-3 shadow-brutal-sm">
                <div>
                  <div className="text-xs font-mono font-bold text-[#140206]">What is your diagnostic fee?</div>
                  <div className="text-xs font-sans text-[#5e5850] mt-0.5">$49 service call fee, waived when repair is approved.</div>
                </div>
                <div className="border-t border-[#140206]/20 pt-2">
                  <div className="text-xs font-mono font-bold text-[#140206]">Are technicians licensed?</div>
                  <div className="text-xs font-sans text-[#5e5850] mt-0.5">Yes, all SwiftFix plumbers are fully licensed, insured, and bonded.</div>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <h3 className="font-serif text-2xl font-normal text-[#140206] mb-2">Step 5 — AI Personality & Greeting</h3>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {['Friendly and professional', 'Concise and direct', 'Warm and empathetic', 'Formal and corporate'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setAiPersonality(p)}
                    className={`p-3 rounded-2xl border-2 border-[#140206] text-left text-xs transition shadow-brutal-sm ${
                      aiPersonality === p
                        ? 'bg-[#1bd944] text-[#140206] font-bold'
                        : 'bg-[#fbf8f1] text-[#5e5850] hover:bg-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <div>
                <label className="block text-xs font-mono uppercase font-bold text-[#140206] mb-1">Greeting Message</label>
                <textarea
                  rows={2}
                  value={greeting}
                  onChange={(e) => setGreeting(e.target.value)}
                  className="w-full p-3 bg-[#fbf8f1] border-2 border-[#140206] rounded-2xl text-xs text-[#140206] focus:outline-none focus:bg-white"
                />
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4 text-center py-6">
              <div className="w-14 h-14 rounded-full bg-[#1bd944] text-[#140206] border-2 border-[#140206] shadow-brutal flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-normal text-[#140206]">Step 6 — Connect Google Calendar</h3>
              <p className="text-xs font-sans text-[#5e5850] max-w-md mx-auto">
                Authorize Google Calendar so Sarah can verify real-time availability and add confirmed bookings directly to your schedule.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ade2d8] border-2 border-[#140206] rounded-full text-xs font-mono font-bold text-[#140206] shadow-brutal-sm mt-2">
                <CheckCircle2 className="w-4 h-4 text-[#140206]" /> Connected in Evaluation Mode
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="space-y-4 text-center py-6">
              <div className="w-14 h-14 rounded-full bg-[#ffb835] text-[#140206] border-2 border-[#140206] shadow-brutal flex items-center justify-center mx-auto mb-3">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-normal text-[#140206]">Step 7 — Notifications & Alerts</h3>
              <p className="text-xs font-sans text-[#5e5850] max-w-md mx-auto">
                Lead alerts and booking confirmations are enabled for Resend Email and WhatsApp Cloud API.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ade2d8] border-2 border-[#140206] rounded-full text-xs font-mono font-bold text-[#140206] shadow-brutal-sm mt-2">
                <CheckCircle2 className="w-4 h-4 text-[#140206]" /> Email & WhatsApp Channels Ready
              </div>
            </div>
          )}

          {step === 8 && (
            <div className="space-y-4 text-center py-6">
              <div className="w-14 h-14 rounded-full bg-[#ffb4c5] text-[#140206] border-2 border-[#140206] shadow-brutal flex items-center justify-center mx-auto mb-3">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-normal text-[#140206]">Step 8 — Dedicated Twilio Phone Number</h3>
              <p className="text-xs font-sans text-[#5e5850] max-w-md mx-auto">
                Your assigned Twilio voice line is <strong className="text-[#140206] font-mono">+1 (555) 019-2831</strong>. Callers dialing this number will be greeted by Sarah.
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 pt-6 border-t-2 border-[#140206]/10 flex items-center justify-between">
            <button
              type="button"
              disabled={step === 1}
              onClick={() => setStep(step - 1)}
              className="px-4 py-2.5 bg-white hover:bg-[#fbf8f1] text-[#140206] border-2 border-[#140206] rounded-full text-xs font-mono uppercase font-bold flex items-center gap-1.5 disabled:opacity-40 transition shadow-brutal-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Previous
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={handleNext}
              className="px-6 py-2.5 bg-[#140206] hover:bg-[#1bd944] text-[#f5f3ef] hover:text-[#140206] border-2 border-[#140206] rounded-full text-xs font-mono uppercase tracking-wider font-extrabold shadow-brutal transition flex items-center gap-2 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              {loading ? (
                'Finalizing Setup...'
              ) : step === 8 ? (
                <>
                  <span>Complete Setup & Enter Dashboard</span>
                  <CheckCircle2 className="w-4 h-4 text-[#1bd944]" />
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
