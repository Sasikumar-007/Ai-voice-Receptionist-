import React, { useState, useEffect, useRef } from 'react';
import { apiRequest } from '../lib/api';
import {
  Phone, PhoneOff, Mic, MicOff, Sparkles, User, Bot, AlertTriangle,
  CheckCircle, ArrowRight, Play, RefreshCw, Volume2, Cpu, Radio, Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TavusHumanAvatar3D } from '../components/Three/TavusHumanAvatar3D';
import { RetroPhoneHardware3D } from '../components/Three/RetroPhoneHardware3D';
import { HumanComputingCore3D } from '../components/Three/HumanComputingCore3D';
import { SpectrumRibbon3D } from '../components/Three/SpectrumRibbon3D';
import { TiltCard3D } from '../components/Three/TiltCard3D';

interface ChatMessage {
  role: 'system' | 'assistant' | 'user' | 'tool';
  content: string;
}

export const VoiceStudioPage: React.FC = () => {
  const { business } = useAuth();
  const [inCall, setInCall] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [active3DMode, setActive3DMode] = useState<'avatar' | 'phone' | 'core'>('avatar');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Voice synthesis helper
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.05;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  // Start Call
  const handleStartCall = () => {
    setInCall(true);
    const greeting = `Thank you for calling ${business?.name || 'SwiftFix Plumbing'}! My name is Sarah, your AI receptionist. How can I help you today?`;
    setMessages([
      { role: 'assistant', content: greeting }
    ]);
    speakText(greeting);
  };

  // End Call
  const handleEndCall = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setInCall(false);
    setIsListening(false);
    setIsSpeaking(false);
  };

  // Toggle Microphone
  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported on this browser. You can type in the prompt box!');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const speech = event.results[0][0].transcript;
      setIsListening(false);
      handleSendTurn(speech);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  // Process Turn
  const handleSendTurn = async (userText: string) => {
    if (!userText.trim() || isLoading) return;

    const newHistory: ChatMessage[] = [...messages, { role: 'user', content: userText }];
    setMessages(newHistory);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await apiRequest<any>('/ai/chat-turn', {
        method: 'POST',
        body: JSON.stringify({
          caller_phone: '+1 (555) 432-8765',
          user_speech: userText,
          conversation_history: newHistory
        })
      });

      const reply = res.assistantSpeech;
      setMessages([...newHistory, { role: 'assistant', content: reply }]);
      speakText(reply);

      if (res.actionExecuted) {
        setLastAction(res.actionExecuted);
      }
    } catch (err: any) {
      const errMsg = "I'm having trouble processing that right now, but our team can help you shortly.";
      setMessages([...newHistory, { role: 'assistant', content: errMsg }]);
      speakText(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialDTMF = (digit: string) => {
    if (!inCall) {
      handleStartCall();
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b-2 border-[#140206] pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#ff6183] font-bold block mb-1">
            LABORATORY // INTERACTIVE 3D CVI HUMAN COMPUTING
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#140206] flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-[#140206] text-[#1bd944] flex items-center justify-center border-2 border-[#140206] shadow-brutal-sm">
              <Radio className="w-5 h-5" />
            </span>
            3D Human Computing Voice Studio
          </h1>
          <p className="text-xs font-mono text-[#5e5850] mt-1">
            Real-time biometric gaze tracking, phoneme articulation, and sub-second acoustic turn-taking.
          </p>
        </div>

        {inCall ? (
          <button
            onClick={handleEndCall}
            className="px-6 py-3 bg-[#ff6183] hover:bg-[#ffb4c5] text-[#140206] rounded-full text-xs font-mono uppercase tracking-wider font-extrabold border-2 border-[#140206] shadow-brutal transition active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center gap-2"
          >
            <PhoneOff className="w-4 h-4" />
            Terminate Active Call
          </button>
        ) : (
          <button
            onClick={handleStartCall}
            className="px-6 py-3 bg-[#1bd944] hover:bg-[#3bdb5d] text-[#140206] rounded-full text-xs font-mono uppercase tracking-wider font-extrabold border-2 border-[#140206] shadow-brutal transition active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center gap-2"
          >
            <Phone className="w-4 h-4" />
            Initiate Voice Stream
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive 3D Visualizer & Hardware Stage */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white border-2 border-[#140206] rounded-3xl p-6 shadow-brutal-lg relative overflow-hidden">
            {/* Top Bar with 3D Mode Switcher */}
            <div className="flex flex-wrap items-center justify-between border-b-2 border-[#140206] pb-3 gap-2">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#140206]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1bd944] animate-ping"></span>
                <span>SARAH_v2.4 // 3D CVI</span>
              </div>

              {/* 3D Mode Selector Pills */}
              <div className="flex items-center gap-1.5 p-1 bg-[#fbf8f1] border-2 border-[#140206] rounded-full text-[10px] font-mono font-bold">
                <button
                  onClick={() => setActive3DMode('avatar')}
                  className={`px-3 py-1 rounded-full transition ${
                    active3DMode === 'avatar'
                      ? 'bg-[#140206] text-[#1bd944]'
                      : 'text-[#5e5850] hover:text-[#140206]'
                  }`}
                >
                  3D AVATAR
                </button>
                <button
                  onClick={() => setActive3DMode('phone')}
                  className={`px-3 py-1 rounded-full transition ${
                    active3DMode === 'phone'
                      ? 'bg-[#140206] text-[#1bd944]'
                      : 'text-[#5e5850] hover:text-[#140206]'
                  }`}
                >
                  3D TERMINAL
                </button>
                <button
                  onClick={() => setActive3DMode('core')}
                  className={`px-3 py-1 rounded-full transition ${
                    active3DMode === 'core'
                      ? 'bg-[#140206] text-[#1bd944]'
                      : 'text-[#5e5850] hover:text-[#140206]'
                  }`}
                >
                  3D QUANTUM CORE
                </button>
              </div>
            </div>

            {/* 3D WebGL Canvas Display */}
            <div className="relative min-h-[380px] flex items-center justify-center py-2 bg-[#fbf8f1] rounded-2xl border-2 border-[#140206] my-4 overflow-hidden">
              {active3DMode === 'avatar' && (
                <TavusHumanAvatar3D size={380} isSpeaking={isSpeaking} interactive={true} showHUD={true} />
              )}
              {active3DMode === 'phone' && (
                <RetroPhoneHardware3D size={360} isActive={inCall} onDial={handleDialDTMF} />
              )}
              {active3DMode === 'core' && (
                <HumanComputingCore3D size={320} isSpeaking={isSpeaking} />
              )}
            </div>

            {/* 3D Audio Frequency Ribbon */}
            <div className="border-2 border-[#140206] rounded-2xl overflow-hidden bg-[#140206]">
              <SpectrumRibbon3D isActive={inCall || isSpeaking || isListening} height={100} />
            </div>

            {/* Control Bar: Mic, Quick Simulation */}
            <div className="mt-4 pt-4 border-t-2 border-[#140206]/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  disabled={!inCall}
                  onClick={toggleListening}
                  className={`px-4 py-2 rounded-full text-xs font-mono uppercase font-bold border-2 border-[#140206] shadow-brutal-sm transition flex items-center gap-2 ${
                    isListening
                      ? 'bg-[#ff6183] text-[#140206] animate-pulse'
                      : 'bg-white hover:bg-[#fbf8f1] text-[#140206] disabled:opacity-40'
                  }`}
                >
                  {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  <span>{isListening ? 'Listening to mic...' : 'Speak via Mic'}</span>
                </button>

                {isSpeaking && (
                  <span className="px-3 py-1 rounded-full bg-[#1bd944] text-[#140206] border-2 border-[#140206] shadow-brutal-sm text-[10px] font-mono font-bold uppercase animate-bounce">
                    ● Speech Synthesis
                  </span>
                )}
              </div>

              <div className="text-[11px] font-mono text-[#856f58]">
                Mode: <strong className="text-[#140206]">Full-Duplex Audio</strong>
              </div>
            </div>
          </div>

          {/* Quick Caller Prompts */}
          <div className="bg-white border-2 border-[#140206] rounded-3xl p-5 shadow-brutal space-y-3">
            <span className="text-[11px] font-mono uppercase font-bold text-[#856f58] block">
              Sample Voice Queries (Click to Simulate Inbound Speech)
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                'My basement pipe burst and is leaking water! Can you send a plumber today?',
                'What are your diagnostic fees and hourly service rates?',
                'Can I book a drain cleaning appointment for Friday at 10 AM?',
                'I need to speak directly with the business owner right now.'
              ].map((q, idx) => (
                <button
                  key={idx}
                  disabled={!inCall || isLoading}
                  onClick={() => handleSendTurn(q)}
                  className="px-3 py-1.5 bg-[#fbf8f1] hover:bg-white text-[#140206] border-2 border-[#140206] rounded-xl text-xs font-sans text-left disabled:opacity-40 transition shadow-brutal-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                >
                  "{q}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Telemetry & Conversation Transcript */}
        <div className="lg:col-span-6 flex flex-col h-[740px] bg-white border-2 border-[#140206] rounded-3xl shadow-brutal-lg overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b-2 border-[#140206] bg-[#fbf8f1] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${inCall ? 'bg-[#1bd944]' : 'bg-[#856f58]'}`} />
              <span className="font-mono text-xs uppercase font-bold text-[#140206]">
                {inCall ? 'CALL IN PROGRESS // 00:01:24' : 'TELEPHONY STANDBY'}
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#856f58] uppercase">
              TENANT: {business?.name || 'SwiftFix Plumbing'}
            </span>
          </div>

          {/* Action Trigger Banner */}
          {lastAction && (
            <div className="p-3 bg-[#ade2d8] border-b-2 border-[#140206] text-xs font-mono font-bold text-[#140206] flex items-center gap-2 animate-fadeIn">
              <CheckCircle className="w-4 h-4 text-[#140206]" />
              <span>Tool Executed: {lastAction}</span>
            </div>
          )}

          {/* Transcript Scroll Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 font-sans text-xs">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-[#856f58] space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#fbf8f1] border-2 border-[#140206] shadow-brutal flex items-center justify-center">
                  <Phone className="w-5 h-5 text-[#140206]" />
                </div>
                <p className="font-mono text-xs font-bold text-[#140206]">No Active Telephony Stream</p>
                <p className="text-xs text-[#5e5850] max-w-xs font-sans">
                  Click <strong>"Initiate Voice Stream"</strong> to start testing Sarah with real-time speech and 3D visual articulation.
                </p>
              </div>
            ) : (
              messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-[#140206] text-[#1bd944] border-2 border-[#140206] shadow-brutal-sm flex items-center justify-center shrink-0 text-xs font-serif font-bold">
                      S
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] p-4 rounded-2xl border-2 border-[#140206] shadow-brutal-sm leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-[#140206] text-[#f5f3ef]'
                        : 'bg-[#fbf8f1] text-[#140206]'
                    }`}
                  >
                    <div className="text-[10px] font-mono uppercase font-bold mb-1 opacity-70">
                      {m.role === 'user' ? 'Caller (Customer)' : 'Sarah (AI Voice Receptionist)'}
                    </div>
                    {m.content}
                  </div>

                  {m.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-[#d5997d] text-[#140206] border-2 border-[#140206] shadow-brutal-sm flex items-center justify-center shrink-0 text-xs font-mono font-bold">
                      U
                    </div>
                  )}
                </div>
              ))
            )}

            {isLoading && (
              <div className="flex gap-3 items-center text-xs font-mono text-[#5e5850]">
                <div className="w-8 h-8 rounded-full bg-[#140206] text-[#1bd944] border-2 border-[#140206] flex items-center justify-center animate-spin">
                  <RefreshCw className="w-4 h-4" />
                </div>
                <span>Sarah is analyzing intent & checking tools...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Prompt Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendTurn(inputText);
            }}
            className="p-4 border-t-2 border-[#140206] bg-[#fbf8f1] flex items-center gap-2"
          >
            <input
              type="text"
              disabled={!inCall || isLoading}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={inCall ? "Type caller message or click 'Speak via Mic'..." : "Start call to enable input..."}
              className="flex-1 px-4 py-2.5 bg-white border-2 border-[#140206] rounded-full text-xs font-mono text-[#140206] focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inCall || !inputText.trim() || isLoading}
              className="px-5 py-2.5 bg-[#140206] text-[#1bd944] hover:bg-[#1bd944] hover:text-[#140206] rounded-full text-xs font-mono uppercase font-bold border-2 border-[#140206] shadow-brutal-sm disabled:opacity-40 transition active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center gap-1.5"
            >
              <span>Transmit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
