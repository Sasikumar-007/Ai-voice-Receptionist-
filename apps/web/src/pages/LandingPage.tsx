import React from 'react';
import { Link } from 'react-router-dom';
import {
  PhoneCall, Calendar, Users, Sparkles, Shield, Clock, CheckCircle2,
  ArrowRight, MessageSquare, Wrench, Building2, Stethoscope, Scale, Car,
  ChevronRight, Bot, Zap, Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const { loginAsDemo } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-brand-500 selection:text-white">
      {/* Top Navigation */}
      <header className="h-20 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-brand-500/25">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white block">AI Receptionist</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-brand-400 block">Enterprise Voice SaaS</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#how-it-works" className="hover:text-white transition">How It Works</a>
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#integrations" className="hover:text-white transition">Integrations</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
            <a href="#faq" className="hover:text-white transition">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-semibold text-slate-300 hover:text-white px-3 py-2 transition"
            >
              Sign In
            </Link>
            <button
              onClick={loginAsDemo}
              className="px-4 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white rounded-lg text-sm font-semibold shadow-md shadow-brand-500/20 transition flex items-center gap-1.5"
            >
              <span>Explore Demo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-500/10 blur-[140px] pointer-events-none rounded-full"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-brand-400 mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen Voice AI Engine Powered by Gemini & Twilio</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            Your AI Receptionist, <br />
            <span className="bg-gradient-to-r from-brand-400 via-indigo-300 to-teal-300 bg-clip-text text-transparent">
              Working 24/7.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Answer every inbound call, answer questions using your business knowledge, capture leads, and book appointments directly to Google Calendar.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={loginAsDemo}
              className="w-full sm:w-auto px-8 py-4 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-base font-bold shadow-xl shadow-brand-500/30 transition flex items-center justify-center gap-2"
            >
              <span>Start Free (Launch Demo)</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <Link
              to="/dashboard/voice-studio"
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl text-base font-semibold transition flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-5 h-5 text-brand-400" />
              <span>Try Live Voice Tester</span>
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 24/7 Zero Missed Calls</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Google Calendar Synced</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> WhatsApp & Email Alerts</span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-slate-900/50 border-y border-slate-800/80 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-bold tracking-widest text-brand-400 mb-2">Automated Workflow</h2>
            <h3 className="text-3xl font-extrabold text-white">How the AI Voice Receptionist Works</h3>
            <p className="text-sm text-slate-400 mt-2">From customer phone ring to calendar booking in under 2 minutes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl relative">
              <div className="text-4xl font-extrabold text-slate-800 mb-4">01</div>
              <h4 className="text-lg font-bold text-white mb-2">Inbound Ring</h4>
              <p className="text-sm text-slate-400">Customer dials your business number. Sarah answers on the very first ring with your personalized business greeting.</p>
            </div>
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl relative">
              <div className="text-4xl font-extrabold text-slate-800 mb-4">02</div>
              <h4 className="text-lg font-bold text-white mb-2">Knowledge Retrieval</h4>
              <p className="text-sm text-slate-400">AI reasons with Gemini, answers service questions, explains diagnostic rates, and checks business hours without making things up.</p>
            </div>
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl relative">
              <div className="text-4xl font-extrabold text-slate-800 mb-4">03</div>
              <h4 className="text-lg font-bold text-white mb-2">Real-Time Booking</h4>
              <p className="text-sm text-slate-400">Checks operating hours and live Google Calendar availability, proposes conflict-free times, and books the slot.</p>
            </div>
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl relative">
              <div className="text-4xl font-extrabold text-slate-800 mb-4">04</div>
              <h4 className="text-lg font-bold text-white mb-2">Instant Alerts</h4>
              <p className="text-sm text-slate-400">Sends appointment confirmations via Email (Resend) and WhatsApp Cloud API, logging leads and transcripts into your dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-bold tracking-widest text-brand-400 mb-2">Enterprise Capabilities</h2>
            <h3 className="text-3xl font-extrabold text-white">Engineered for Real-World Businesses</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl hover:border-brand-500/40 transition">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Structured Tool Execution</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                The AI does not hallucinate. It executes validated backend functions for availability checking, appointment creation, and lead capture.
              </p>
            </div>

            <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl hover:border-brand-500/40 transition">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6">
                <Calendar className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Google Calendar Two-Way Sync</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Seamless OAuth 2.0 integration prevents double-bookings, honors business operating hours, and writes events directly to your calendar.
              </p>
            </div>

            <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl hover:border-brand-500/40 transition">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Strict Multi-Tenant Isolation</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Tenant isolation powered by PostgreSQL RLS and server-side authentication. Never trust client-supplied business IDs.
              </p>
            </div>

            <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl hover:border-brand-500/40 transition">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-6">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">WhatsApp & Email Notifications</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Automated confirmations via Resend and Meta WhatsApp Business Cloud API keep both the business owner and customer informed.
              </p>
            </div>

            <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl hover:border-brand-500/40 transition">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-6">
                <PhoneCall className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Human Handoff & Escalation</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                When a caller asks for a manager or in emergency situations, Sarah gracefully transfers the live call or triggers immediate dispatch alerts.
              </p>
            </div>

            <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl hover:border-brand-500/40 transition">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Full Call & Conversation History</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Review call recordings, complete turn-by-turn transcripts, sentiment scores, and customer journey timelines in a clean dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Target Use Cases */}
      <section className="py-20 bg-slate-900/40 border-y border-slate-800/80 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-bold tracking-widest text-brand-400 mb-2">Industry Solutions</h2>
            <h3 className="text-3xl font-extrabold text-white">Built for High-Call Volume Businesses</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl text-center">
              <Wrench className="w-8 h-8 text-brand-400 mx-auto mb-3" />
              <h5 className="font-bold text-white text-sm">Plumbing & HVAC</h5>
              <p className="text-xs text-slate-400 mt-1">24/7 leak dispatch & bookings</p>
            </div>
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl text-center">
              <Stethoscope className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
              <h5 className="font-bold text-white text-sm">Dental & Clinics</h5>
              <p className="text-xs text-slate-400 mt-1">Patient scheduling & intake</p>
            </div>
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl text-center">
              <Scale className="w-8 h-8 text-amber-400 mx-auto mb-3" />
              <h5 className="font-bold text-white text-sm">Law Firms</h5>
              <p className="text-xs text-slate-400 mt-1">Client qualification & screening</p>
            </div>
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl text-center">
              <Car className="w-8 h-8 text-violet-400 mx-auto mb-3" />
              <h5 className="font-bold text-white text-sm">Auto Repair</h5>
              <p className="text-xs text-slate-400 mt-1">Service visit estimation & appointments</p>
            </div>
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl text-center">
              <Building2 className="w-8 h-8 text-teal-400 mx-auto mb-3" />
              <h5 className="font-bold text-white text-sm">Real Estate</h5>
              <p className="text-xs text-slate-400 mt-1">Showing requests & buyer leads</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase font-bold tracking-widest text-brand-400 mb-2">Simple SaaS Pricing</h2>
            <h3 className="text-3xl font-extrabold text-white">Invest in Zero Missed Business</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between">
              <div>
                <h4 className="text-lg font-bold text-white">Starter</h4>
                <p className="text-xs text-slate-400 mt-1">Solo operators & small service shops</p>
                <div className="mt-6 mb-6">
                  <span className="text-4xl font-extrabold text-white">$49</span>
                  <span className="text-xs text-slate-400"> / month</span>
                </div>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 200 Voice Minutes / mo</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 1 Phone Number</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Lead Capture & Email Alerts</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Custom Business FAQ</li>
                </ul>
              </div>
              <button
                onClick={loginAsDemo}
                className="mt-8 w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-semibold transition"
              >
                Get Started
              </button>
            </div>

            {/* Professional (Featured) */}
            <div className="p-8 bg-slate-900 border-2 border-brand-500 rounded-2xl relative shadow-xl shadow-brand-500/10 flex flex-col justify-between">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-brand-600 text-white text-[11px] uppercase font-bold tracking-wider rounded-full">
                Most Popular
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Professional</h4>
                <p className="text-xs text-slate-400 mt-1">Growing businesses with daily calls</p>
                <div className="mt-6 mb-6">
                  <span className="text-4xl font-extrabold text-white">$149</span>
                  <span className="text-xs text-slate-400"> / month</span>
                </div>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-400" /> 1,000 Voice Minutes / mo</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-400" /> Google Calendar Real-Time Booking</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-400" /> WhatsApp & Email Confirmations</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-400" /> Human Transfer & Escalation</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-brand-400" /> Unlimited Services & FAQs</li>
                </ul>
              </div>
              <button
                onClick={loginAsDemo}
                className="mt-8 w-full py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-500/30 transition"
              >
                Launch Professional
              </button>
            </div>

            {/* Business */}
            <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between">
              <div>
                <h4 className="text-lg font-bold text-white">Business</h4>
                <p className="text-xs text-slate-400 mt-1">Multi-location & enterprise fleets</p>
                <div className="mt-6 mb-6">
                  <span className="text-4xl font-extrabold text-white">$399</span>
                  <span className="text-xs text-slate-400"> / month</span>
                </div>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 5,000 Voice Minutes / mo</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Multiple Phone Numbers</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Custom Voice Clone & Fine-Tuning</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Dedicated Account Architect</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Custom Webhook Integration</li>
                </ul>
              </div>
              <button
                onClick={loginAsDemo}
                className="mt-8 w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-semibold transition"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-slate-900/40 border-t border-slate-800/80 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-xs uppercase font-bold tracking-widest text-brand-400 mb-2">Got Questions?</h2>
            <h3 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h3>
          </div>

          <div className="space-y-4">
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
              <h5 className="font-bold text-white text-base">Does the AI invent or hallucinate pricing and hours?</h5>
              <p className="text-sm text-slate-400 mt-2">
                No. The AI engine strictly uses structured tool calls (`get_services`, `get_business_hours`, `check_availability`) and business knowledge you configure. If information isn't available, it politely informs the caller and offers human transfer.
              </p>
            </div>
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
              <h5 className="font-bold text-white text-base">Can I keep my existing business phone number?</h5>
              <p className="text-sm text-slate-400 mt-2">
                Yes! You can either forward calls from your existing carrier (e.g., when unanswered or after-hours) to your Twilio number, or port your number directly into your dedicated voice pool.
              </p>
            </div>
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
              <h5 className="font-bold text-white text-base">How does Google Calendar appointment booking work?</h5>
              <p className="text-sm text-slate-400 mt-2">
                Through official Google OAuth 2.0. The AI receptionist checks real-time availability to avoid conflicts with your personal and business schedule, then adds the event with customer phone, address, and notes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="py-16 border-t border-slate-800 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Ready to Never Miss Another Phone Lead?</h3>
          <p className="text-sm text-slate-400 mt-2 mb-8">Deploy your intelligent voice receptionist in under 10 minutes.</p>
          <button
            onClick={loginAsDemo}
            className="px-8 py-3.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-base font-bold shadow-xl shadow-brand-500/25 transition"
          >
            Launch SwiftFix Demo Dashboard
          </button>
          <div className="mt-12 text-xs text-slate-500">
            © 2026 AI Receptionist Inc. All rights reserved. Multi-Tenant Enterprise Voice Architecture.
          </div>
        </div>
      </footer>
    </div>
  );
};
