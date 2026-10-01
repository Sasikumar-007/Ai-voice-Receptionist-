import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PhoneCall, Calendar, Users, Sparkles, Shield, Clock, CheckCircle2,
  ArrowRight, MessageSquare, Wrench, Building2, Stethoscope, Scale, Car,
  ChevronRight, Bot, Zap, Globe, Volume2, ArrowUpRight, Cpu, Radio, Phone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TavusHumanAvatar3D } from '../components/Three/TavusHumanAvatar3D';
import { RetroPhoneHardware3D } from '../components/Three/RetroPhoneHardware3D';
import { HumanComputingCore3D } from '../components/Three/HumanComputingCore3D';
import { SpectrumRibbon3D } from '../components/Three/SpectrumRibbon3D';
import { TiltCard3D } from '../components/Three/TiltCard3D';

export const LandingPage: React.FC = () => {
  const { loginAsDemo } = useAuth();
  const [isDemoSpeaking, setIsDemoSpeaking] = useState(false);
  const [hero3DMode, setHero3DMode] = useState<'avatar' | 'phone' | 'core'>('avatar');

  const simulateGreetingSpeech = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance("Hello! You're connected to the Tavus human computing voice agent. How can I direct your call today?");
    u.rate = 1.0;
    u.pitch = 1.05;
    u.onstart = () => setIsDemoSpeaking(true);
    u.onend = () => setIsDemoSpeaking(false);
    u.onerror = () => setIsDemoSpeaking(false);
    window.speechSynthesis.speak(u);
  };

  return (
    <div className="min-h-screen bg-[#f3eee7] text-[#140206] selection:bg-[#1bd944] selection:text-[#140206]">
      {/* Sticky Editorial Nav */}
      <header className="h-20 border-b-2 border-[#140206] bg-[#f3eee7]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1416px] mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#140206] flex items-center justify-center border-2 border-[#140206] shadow-brutal-sm">
              <Cpu className="w-5 h-5 text-[#1bd944]" />
            </div>
            <div>
              <span className="font-serif italic font-bold text-2xl tracking-tight text-[#140206] leading-none block">
                Tavus Voice
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#4b2c22] font-semibold block mt-0.5">
                The Human Computing Company
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-wider font-semibold text-[#140206]">
            <a href="#how-it-works" className="hover:text-[#1bd944] transition">Architecture</a>
            <a href="#features" className="hover:text-[#1bd944] transition">Capabilities</a>
            <a href="#pricing" className="hover:text-[#1bd944] transition">Plans</a>
            <Link to="/dashboard/voice-studio" className="hover:text-[#1bd944] transition flex items-center gap-1">
              <span>3D Studio</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff6183] animate-ping" />
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-xs font-mono uppercase tracking-wider font-bold text-[#140206] px-4 py-2 hover:underline underline-offset-4"
            >
              Sign In
            </Link>
            <button
              onClick={loginAsDemo}
              className="px-5 py-2.5 bg-[#140206] text-[#f5f3ef] hover:bg-[#1bd944] hover:text-[#140206] rounded-full text-xs font-mono uppercase tracking-wider font-bold border-2 border-[#140206] shadow-brutal transition flex items-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              <span>Explore Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Marquee Ticker */}
      <div className="bg-[#140206] text-[#1bd944] py-2.5 border-b-2 border-[#140206] overflow-hidden select-none font-mono text-xs uppercase tracking-widest">
        <div className="animate-marquee whitespace-nowrap flex gap-12 font-bold">
          <span>● 3D HUMAN COMPUTING GAUSSIAN AVATAR</span>
          <span>· TWILIO PSTN & SIP VOICE STREAMING</span>
          <span>· REAL-TIME APPOINTMENTS IN GOOGLE CALENDAR</span>
          <span>· MULTI-TENANT POSTGRESQL ARCHITECTURE</span>
          <span>· 30+ LANGUAGES POWERED BY GEMINI 1.5 FLASH</span>
          <span>· ZERO HALLUCINATION STRUCTURED TOOLING</span>
          <span>· INSTANT EMAIL & WHATSAPP DISPATCH</span>
          <span>● 3D HUMAN COMPUTING GAUSSIAN AVATAR</span>
          <span>· TWILIO PSTN & SIP VOICE STREAMING</span>
        </div>
      </div>

      {/* Hero Section with Interactive 3D Canvas */}
      <section className="pt-16 pb-20 px-6 relative border-b-2 border-[#140206]">
        <div className="max-w-[1416px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f5f3ef] border-2 border-[#140206] text-xs font-mono font-bold shadow-brutal-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1bd944] animate-ping"></span>
              <span>Voice Agents That Hear, Reason & Talk 24/7 in 3D</span>
            </div>

            <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-normal leading-[0.98] tracking-tight text-[#140206]">
              The voice <br />
              <span className="italic font-normal">intelligence</span> <br />
              for your business.
            </h1>

            <p className="text-base sm:text-lg text-[#4b2c22] max-w-xl leading-relaxed font-sans font-normal pt-2">
              Deploy human-like conversational voice agents that answer telephone calls face-to-ear in real time. Backed by verified business knowledge, real-time Google Calendar scheduling, and instant human escalation.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={loginAsDemo}
                className="px-8 py-4 bg-[#1bd944] text-[#140206] hover:bg-[#3bdb5d] rounded-full text-sm font-mono uppercase tracking-wider font-extrabold border-2 border-[#140206] shadow-brutal transition active:translate-x-1 active:translate-y-1 active:shadow-none flex items-center justify-center gap-2"
              >
                <span>Launch SwiftFix Demo</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                to="/dashboard/voice-studio"
                className="px-7 py-4 bg-[#ffffff] hover:bg-[#f5f3ef] text-[#140206] rounded-full text-sm font-mono uppercase tracking-wider font-bold border-2 border-[#140206] shadow-brutal transition active:translate-x-1 active:translate-y-1 active:shadow-none flex items-center justify-center gap-2"
              >
                <Radio className="w-4 h-4 text-[#ff6183]" />
                <span>3D Voice Studio</span>
              </Link>
            </div>

            {/* Quick Metrics Line */}
            <div className="pt-6 flex flex-wrap items-center gap-6 text-xs font-mono text-[#5e5850]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1bd944]"></span>
                <strong className="text-[#140206]">95%</strong> AI Resolution Rate
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ff6183]"></span>
                <strong className="text-[#140206]">&lt; 800ms</strong> Turn-Taking Latency
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#fd7f00]"></span>
                <strong className="text-[#140206]">100%</strong> Tenant Isolation
              </div>
            </div>
          </div>

          {/* Right Column: Interactive 3D Human Computing Stage */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="w-full max-w-lg bg-[#ffffff] border-2 border-[#140206] rounded-3xl p-6 shadow-brutal-lg relative overflow-hidden">
              <div className="flex items-center justify-between border-b-2 border-[#140206] pb-3 mb-2 font-mono text-xs">
                <div className="flex items-center gap-2 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1bd944]"></span>
                  <span>TAVUS_3D_CVI</span>
                </div>

                {/* 3D Mode Switcher */}
                <div className="flex items-center gap-1 p-0.5 bg-[#fbf8f1] border border-[#140206] rounded-full text-[9px]">
                  <button
                    onClick={() => setHero3DMode('avatar')}
                    className={`px-2 py-0.5 rounded-full font-bold transition ${
                      hero3DMode === 'avatar' ? 'bg-[#140206] text-[#1bd944]' : 'text-[#856f58]'
                    }`}
                  >
                    AVATAR
                  </button>
                  <button
                    onClick={() => setHero3DMode('phone')}
                    className={`px-2 py-0.5 rounded-full font-bold transition ${
                      hero3DMode === 'phone' ? 'bg-[#140206] text-[#1bd944]' : 'text-[#856f58]'
                    }`}
                  >
                    TERMINAL
                  </button>
                  <button
                    onClick={() => setHero3DMode('core')}
                    className={`px-2 py-0.5 rounded-full font-bold transition ${
                      hero3DMode === 'core' ? 'bg-[#140206] text-[#1bd944]' : 'text-[#856f58]'
                    }`}
                  >
                    CORE
                  </button>
                </div>
              </div>

              {/* 3D WebGL Canvas */}
              <div className="py-2 flex justify-center bg-[#fbf8f1] border-2 border-[#140206] rounded-2xl my-2 overflow-hidden min-h-[320px]">
                {hero3DMode === 'avatar' && (
                  <TavusHumanAvatar3D size={320} isSpeaking={isDemoSpeaking} interactive={true} showHUD={true} />
                )}
                {hero3DMode === 'phone' && (
                  <RetroPhoneHardware3D size={300} isActive={isDemoSpeaking} />
                )}
                {hero3DMode === 'core' && (
                  <HumanComputingCore3D size={280} isSpeaking={isDemoSpeaking} />
                )}
              </div>

              {/* 3D Audio Ribbon Visualizer */}
              <div className="border-2 border-[#140206] rounded-xl overflow-hidden bg-[#140206] mb-3">
                <SpectrumRibbon3D isActive={isDemoSpeaking} height={70} />
              </div>

              {/* Interactive Audio Trigger */}
              <div className="pt-3 border-t-2 border-[#140206] flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono font-bold text-[#140206]">Sarah Voice Agent</div>
                  <div className="text-[11px] font-mono text-[#856f58]">Sub-Second Speech & Viseme Lip-Sync</div>
                </div>
                <button
                  type="button"
                  onClick={simulateGreetingSpeech}
                  className="px-4 py-2 bg-[#ffb4c5] hover:bg-[#ff6183] text-[#140206] rounded-full text-xs font-mono uppercase font-bold border-2 border-[#140206] shadow-brutal-sm transition flex items-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Test Audio</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logo Cloud / Social Proof */}
      <section className="py-12 border-b-2 border-[#140206] bg-[#f5f3ef] px-6">
        <div className="max-w-[1416px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-xs font-mono uppercase tracking-widest text-[#5e5850] font-bold">
            Trusted by service companies across North America:
          </div>
          <div className="flex flex-wrap items-center gap-8 text-sm font-serif italic text-[#140206] font-bold">
            <span className="px-3 py-1 bg-white border-2 border-[#140206] rounded shadow-brutal-sm">SwiftFix Plumbing</span>
            <span className="px-3 py-1 bg-white border-2 border-[#140206] rounded shadow-brutal-sm">Vanguard Dental Care</span>
            <span className="px-3 py-1 bg-white border-2 border-[#140206] rounded shadow-brutal-sm">Apex Legal Partners</span>
            <span className="px-3 py-1 bg-white border-2 border-[#140206] rounded shadow-brutal-sm">Precision Auto Fleet</span>
          </div>
        </div>
      </section>

      {/* Macrostructure: Architectural Workflow with 3D Tilt Cards */}
      <section id="how-it-works" className="py-24 px-6 border-b-2 border-[#140206]">
        <div className="max-w-[1416px] mx-auto">
          <div className="max-w-2xl mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-[#fd7f00] font-bold block mb-2">
              End-to-End Orchestration
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-normal tracking-tight text-[#140206]">
              How the human computing voice pipeline operates.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <TiltCard3D>
              <div className="bg-[#ffffff] border-2 border-[#140206] rounded-3xl p-6 shadow-brutal h-full flex flex-col justify-between">
                <div>
                  <div className="font-mono text-xs font-bold text-[#ff6183] mb-4">PHASE 01</div>
                  <h3 className="font-serif text-2xl font-normal text-[#140206] mb-2">PSTN Inbound</h3>
                  <p className="text-xs text-[#5e5850] leading-relaxed font-sans">
                    Customer dials your telephone line. Twilio Voice connects in &lt; 200ms and triggers the verified business greeting.
                  </p>
                </div>
              </div>
            </TiltCard3D>

            <TiltCard3D>
              <div className="bg-[#ffffff] border-2 border-[#140206] rounded-3xl p-6 shadow-brutal h-full flex flex-col justify-between">
                <div>
                  <div className="font-mono text-xs font-bold text-[#1bd944] mb-4">PHASE 02</div>
                  <h3 className="font-serif text-2xl font-normal text-[#140206] mb-2">Knowledge Retrieval</h3>
                  <p className="text-xs text-[#5e5850] leading-relaxed font-sans">
                    Gemini processes customer speech, retrieves verified diagnostic pricing, policies, and operating hours without fabricating data.
                  </p>
                </div>
              </div>
            </TiltCard3D>

            <TiltCard3D>
              <div className="bg-[#ffffff] border-2 border-[#140206] rounded-3xl p-6 shadow-brutal h-full flex flex-col justify-between">
                <div>
                  <div className="font-mono text-xs font-bold text-[#fd7f00] mb-4">PHASE 03</div>
                  <h3 className="font-serif text-2xl font-normal text-[#140206] mb-2">Calendar Booking</h3>
                  <p className="text-xs text-[#5e5850] leading-relaxed font-sans">
                    Executes <code className="text-[#140206] font-mono bg-[#eae5de] px-1 rounded">check_availability()</code> to prevent double bookings, adding confirmed events directly to Google Calendar.
                  </p>
                </div>
              </div>
            </TiltCard3D>

            <TiltCard3D>
              <div className="bg-[#ffffff] border-2 border-[#140206] rounded-3xl p-6 shadow-brutal h-full flex flex-col justify-between">
                <div>
                  <div className="font-mono text-xs font-bold text-[#9e94c8] mb-4">PHASE 04</div>
                  <h3 className="font-serif text-2xl font-normal text-[#140206] mb-2">Instant Dispatch</h3>
                  <p className="text-xs text-[#5e5850] leading-relaxed font-sans">
                    Dispatches confirmation emails via Resend and WhatsApp Cloud API, logging leads, transcripts, and telemetry to the dashboard.
                  </p>
                </div>
              </div>
            </TiltCard3D>
          </div>
        </div>
      </section>

      {/* Capabilities Grid with 3D Tilt */}
      <section id="features" className="py-24 px-6 border-b-2 border-[#140206] bg-[#f5f3ef]">
        <div className="max-w-[1416px] mx-auto">
          <div className="max-w-2xl mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-[#1bd944] font-bold block mb-2">
              SaaS Capabilities
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-normal tracking-tight text-[#140206]">
              Built with Swiss precision & zero hallucination.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TiltCard3D>
              <div className="bg-white border-2 border-[#140206] rounded-3xl p-8 shadow-brutal h-full">
                <div className="w-12 h-12 rounded-full bg-[#1bd944]/20 border-2 border-[#140206] flex items-center justify-center mb-6 shadow-brutal-sm">
                  <Sparkles className="w-6 h-6 text-[#140206]" />
                </div>
                <h4 className="font-serif text-2xl font-normal text-[#140206] mb-2">Structured Tool Calling</h4>
                <p className="text-xs text-[#5e5850] leading-relaxed font-sans">
                  Sarah executes deterministic backend functions for booking, lead capture, and knowledge search. Arbitrary SQL generation is strictly prohibited.
                </p>
              </div>
            </TiltCard3D>

            <TiltCard3D>
              <div className="bg-white border-2 border-[#140206] rounded-3xl p-8 shadow-brutal h-full">
                <div className="w-12 h-12 rounded-full bg-[#ffb4c5]/40 border-2 border-[#140206] flex items-center justify-center mb-6 shadow-brutal-sm">
                  <Calendar className="w-6 h-6 text-[#140206]" />
                </div>
                <h4 className="font-serif text-2xl font-normal text-[#140206] mb-2">Google Calendar OAuth</h4>
                <p className="text-xs text-[#5e5850] leading-relaxed font-sans">
                  Secure server-side token management verifies real-time calendar openings, respects shop operating hours, and creates synchronized appointments.
                </p>
              </div>
            </TiltCard3D>

            <TiltCard3D>
              <div className="bg-white border-2 border-[#140206] rounded-3xl p-8 shadow-brutal h-full">
                <div className="w-12 h-12 rounded-full bg-[#d0c9ed]/50 border-2 border-[#140206] flex items-center justify-center mb-6 shadow-brutal-sm">
                  <Shield className="w-6 h-6 text-[#140206]" />
                </div>
                <h4 className="font-serif text-2xl font-normal text-[#140206] mb-2">PostgreSQL RLS Multi-Tenancy</h4>
                <p className="text-xs text-[#5e5850] leading-relaxed font-sans">
                  Strict database Row-Level Security ensures Business A can never access Business B's leads, calls, or calendar events.
                </p>
              </div>
            </TiltCard3D>
          </div>
        </div>
      </section>

      {/* Pricing with 3D Tilt Cards */}
      <section id="pricing" className="py-24 px-6 border-b-2 border-[#140206]">
        <div className="max-w-[1416px] mx-auto">
          <div className="max-w-2xl mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-[#ff6183] font-bold block mb-2">
              Subscription Tiers
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-normal tracking-tight text-[#140206]">
              Predictable, transparent voice pricing.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <TiltCard3D>
              <div className="bg-white border-2 border-[#140206] rounded-3xl p-8 shadow-brutal flex flex-col justify-between h-full">
                <div>
                  <div className="font-mono text-xs font-bold uppercase text-[#856f58]">Tier 01</div>
                  <h4 className="font-serif text-3xl font-normal text-[#140206] mt-1">Starter</h4>
                  <div className="mt-6 mb-6">
                    <span className="font-serif text-5xl font-bold text-[#140206]">$49</span>
                    <span className="font-mono text-xs text-[#5e5850]"> / month</span>
                  </div>
                  <ul className="space-y-3 font-sans text-xs text-[#4b2c22]">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1bd944]" /> 200 Voice Minutes / mo</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1bd944]" /> Dedicated Inbound Phone Number</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1bd944]" /> Lead Capture & Email Notifications</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1bd944]" /> Custom Business FAQs</li>
                  </ul>
                </div>
                <button
                  onClick={loginAsDemo}
                  className="mt-8 w-full py-3 bg-[#eae5de] hover:bg-[#140206] hover:text-white text-[#140206] rounded-full text-xs font-mono uppercase font-bold border-2 border-[#140206] shadow-brutal-sm transition"
                >
                  Select Starter
                </button>
              </div>
            </TiltCard3D>

            {/* Professional (Featured) */}
            <TiltCard3D scale={1.03}>
              <div className="bg-[#fbf8f1] border-2 border-[#140206] rounded-3xl p-8 shadow-brutal-lg relative flex flex-col justify-between h-full">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#1bd944] text-[#140206] text-[10px] font-mono uppercase font-extrabold tracking-widest rounded-full border-2 border-[#140206] shadow-brutal-sm">
                  RECOMMENDED
                </div>
                <div>
                  <div className="font-mono text-xs font-bold uppercase text-[#fd7f00]">Tier 02</div>
                  <h4 className="font-serif text-3xl font-normal text-[#140206] mt-1">Professional</h4>
                  <div className="mt-6 mb-6">
                    <span className="font-serif text-5xl font-bold text-[#140206]">$149</span>
                    <span className="font-mono text-xs text-[#5e5850]"> / month</span>
                  </div>
                  <ul className="space-y-3 font-sans text-xs text-[#4b2c22]">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1bd944]" /> 1,000 Voice Minutes / mo</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1bd944]" /> Google Calendar Real-Time Scheduling</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1bd944]" /> WhatsApp Cloud API & Email Dispatches</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1bd944]" /> Live Call Transfer to Human Staff</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1bd944]" /> Unlimited Services & Knowledge Items</li>
                  </ul>
                </div>
                <button
                  onClick={loginAsDemo}
                  className="mt-8 w-full py-3.5 bg-[#1bd944] hover:bg-[#3bdb5d] text-[#140206] rounded-full text-xs font-mono uppercase font-extrabold border-2 border-[#140206] shadow-brutal transition active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                >
                  Launch Professional
                </button>
              </div>
            </TiltCard3D>

            {/* Enterprise */}
            <TiltCard3D>
              <div className="bg-white border-2 border-[#140206] rounded-3xl p-8 shadow-brutal flex flex-col justify-between h-full">
                <div>
                  <div className="font-mono text-xs font-bold uppercase text-[#856f58]">Tier 03</div>
                  <h4 className="font-serif text-3xl font-normal text-[#140206] mt-1">Enterprise</h4>
                  <div className="mt-6 mb-6">
                    <span className="font-serif text-5xl font-bold text-[#140206]">$399</span>
                    <span className="font-mono text-xs text-[#5e5850]"> / month</span>
                  </div>
                  <ul className="space-y-3 font-sans text-xs text-[#4b2c22]">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1bd944]" /> 5,000 Voice Minutes / mo</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1bd944]" /> Multi-Location Inbound Pool</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1bd944]" /> Custom Speech Model Fine-Tuning</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#1bd944]" /> Dedicated Technical Account Architect</li>
                  </ul>
                </div>
                <button
                  onClick={loginAsDemo}
                  className="mt-8 w-full py-3 bg-[#eae5de] hover:bg-[#140206] hover:text-white text-[#140206] rounded-full text-xs font-mono uppercase font-bold border-2 border-[#140206] shadow-brutal-sm transition"
                >
                  Contact Sales
                </button>
              </div>
            </TiltCard3D>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-[#f3eee7] text-[#140206]">
        <div className="max-w-[1416px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6 border-t-2 border-[#140206] pt-12">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#140206] flex items-center justify-center">
              <Cpu className="w-4 h-4 text-[#1bd944]" />
            </div>
            <span className="font-serif italic font-bold text-xl text-[#140206]">Tavus Voice</span>
          </div>

          <div className="text-xs font-mono text-[#5e5850]">
            © 2026 Tavus Human Computing Company • AI Receptionist SaaS Architecture
          </div>

          <button
            onClick={loginAsDemo}
            className="px-5 py-2 bg-[#140206] text-white hover:bg-[#1bd944] hover:text-[#140206] rounded-full text-xs font-mono uppercase font-bold border-2 border-[#140206] shadow-brutal-sm transition"
          >
            Launch SwiftFix Demo
          </button>
        </div>
      </footer>
    </div>
  );
};
