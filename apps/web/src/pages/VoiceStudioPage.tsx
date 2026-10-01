import React, { useState, useEffect, useRef } from 'react';
import { apiRequest } from '../lib/api';
import {
  Phone, PhoneOff, Mic, MicOff, Sparkles, User, Bot, AlertTriangle,
  CheckCircle, ArrowRight, Play, RefreshCw, Volume2, Cpu, Radio
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { HumanComputingCore3D } from '../components/Three/HumanComputingCore3D';

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

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b-2 border-[#140206] pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#ff6183] font-bold block mb-1">
            LABORATORY // INTERACTIVE 3D VOICE
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#140206] flex items-center gap-2">
            3D Human Computing Voice Studio
          </h1>
          <p className="text-xs font-mono text-[#5e5850] mt-1">
            Real-time acoustic neural turn-taking with live 3D waveform displacement.
          </p>
        </div>

        {inCall ? (
          <button
            onClick={handleEndCall}
            className="px-6 py-3 bg-[#ff6183] hover:bg-[#ffb4c5] text-[#140206] rounded-full text-xs font-mono uppercase tracking-wider font-extrabold border-2 border-[#140206] shadow-brutal transition active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center gap-2"
          >
            <PhoneOff className="w-4 h-4" />
            Terminate Call
          </button>
        ) : (
          <button
            onClick={handleStartCall}
            className="px-6 py-3 bg-[#1bd944] hover:bg-[#3bdb5d] text-[#140206] rounded-full text-xs font-mono uppercase tracking-wider font-extrabold border-2 border-[#140206] shadow-brutal transition active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center gap-2"
          >
            <Phone className="w-4 h-4" />
            Connect 3D Voice Call
          </button>
        )}
      </div>

      {/* Main Studio Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Live Call Conversation */}
        <div className="lg:col-span-7 bg-white border-2 border-[#140206] rounded-3xl flex flex-col h-[650px] shadow-brutal overflow-hidden">
          {/* Header */}
          <div className="p-4 bg-[#f5f3ef] border-b-2 border-[#140206] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#140206] border-2 border-[#140206] flex items-center justify-center text-[#1bd944]">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <div className="font-serif font-bold text-sm text-[#140206]">Sarah • Neural Voice Agent</div>
                <div className="text-[11px] font-mono text-[#856f58]">
                  {inCall ? (
                    <span className="text-[#0cb531] font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#1bd944] animate-ping"></span> PSTN STREAMING
                    </span>
                  ) : (
                    'IDLE / DISCONNECTED'
                  )}
                </div>
              </div>
            </div>

            {isSpeaking && (
              <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#140206] px-3 py-1 bg-[#1bd944] border border-[#140206] rounded-full shadow-brutal-sm animate-pulse">
                <Volume2 className="w-3.5 h-3.5" />
                SARAH SPEAKING...
              </div>
            )}
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#fbf8f1]">
            {!inCall ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 rounded-full bg-white border-2 border-[#140206] shadow-brutal flex items-center justify-center text-[#140206] mb-4">
                  <Phone className="w-7 h-7 text-[#1bd944]" />
                </div>
                <h3 className="font-serif text-2xl font-normal text-[#140206]">Awaiting Inbound Call</h3>
                <p className="text-xs font-mono text-[#5e5850] max-w-sm mt-1 mb-6">
                  Initiate a simulated customer session with Sarah for SwiftFix Plumbing.
                </p>
                <button
                  onClick={handleStartCall}
                  className="px-6 py-3 bg-[#1bd944] hover:bg-[#3bdb5d] text-[#140206] rounded-full text-xs font-mono uppercase tracking-wider font-extrabold border-2 border-[#140206] shadow-brutal transition active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Answer Call Line
                </button>
              </div>
            ) : (
              <>
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 ${
                      m.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full border-2 border-[#140206] flex items-center justify-center shrink-0 ${
                        m.role === 'user'
                          ? 'bg-[#140206] text-white'
                          : 'bg-[#1bd944] text-[#140206]'
                      }`}
                    >
                      {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div
                      className={`max-w-[78%] rounded-2xl px-4 py-3 text-xs leading-relaxed border-2 border-[#140206] shadow-brutal-sm ${
                        m.role === 'user'
                          ? 'bg-[#140206] text-[#f5f3ef] rounded-tr-none'
                          : 'bg-white text-[#140206] rounded-tl-none font-sans'
                      }`}
                    >
                      <div className="text-[10px] font-mono font-bold uppercase tracking-wider mb-1 opacity-70">
                        {m.role === 'user' ? 'Caller' : 'Sarah (AI)'}
                      </div>
                      <div className="text-sm font-sans">{m.content}</div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#1bd944] border-2 border-[#140206] text-[#140206] flex items-center justify-center">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div className="bg-white border-2 border-[#140206] rounded-2xl rounded-tl-none px-4 py-2.5 shadow-brutal-sm flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#140206]">Reasoning with Gemini...</span>
                      <span className="w-2 h-2 rounded-full bg-[#1bd944] animate-bounce"></span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Controls */}
          {inCall && (
            <div className="p-4 bg-white border-t-2 border-[#140206]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendTurn(inputText);
                }}
                className="flex items-center gap-2"
              >
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`p-3 rounded-full border-2 border-[#140206] transition shadow-brutal-sm ${
                    isListening
                      ? 'bg-[#ff6183] text-[#140206] animate-pulse'
                      : 'bg-[#f5f3ef] hover:bg-[#eae5de] text-[#140206]'
                  }`}
                  title={isListening ? 'Stop Listening' : 'Speak into Microphone'}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={isListening ? 'Acoustic mic active: speak now...' : 'Type caller speech or use microphone...'}
                  className="flex-1 bg-[#f3eee7] border-2 border-[#140206] rounded-full px-4 py-2.5 text-xs font-sans text-[#140206] placeholder-[#856f58] focus:outline-none"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim() || isLoading}
                  className="px-5 py-2.5 bg-[#140206] hover:bg-[#1bd944] hover:text-[#140206] text-white rounded-full text-xs font-mono uppercase font-bold border-2 border-[#140206] shadow-brutal-sm transition disabled:opacity-40"
                >
                  Dispatch
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right 5 Cols: 3D Core Visualizer & Test Scenarios */}
        <div className="lg:col-span-5 space-y-6">
          {/* 3D Human Computing Core Box */}
          <div className="bg-white border-2 border-[#140206] rounded-3xl p-6 shadow-brutal flex flex-col items-center text-center">
            <div className="w-full flex items-center justify-between border-b-2 border-[#140206] pb-3 mb-2 font-mono text-[11px]">
              <div className="flex items-center gap-1.5 font-bold text-[#140206]">
                <Radio className="w-3.5 h-3.5 text-[#1bd944]" />
                <span>3D ACOUSTIC CORE</span>
              </div>
              <span className="text-[#ff6183] font-bold">THREE.JS WEBGL</span>
            </div>

            <HumanComputingCore3D size={240} isSpeaking={isSpeaking} />

            <div className="w-full pt-3 border-t-2 border-[#140206] flex items-center justify-between text-[11px] font-mono">
              <span className="text-[#856f58]">LAST ACTION:</span>
              <span className="font-bold text-[#140206] bg-[#1bd944]/30 px-2 py-0.5 rounded border border-[#140206]">
                {lastAction || 'IDLE_LISTENING'}
              </span>
            </div>
          </div>

          {/* Master Prompt Scenarios */}
          <div className="bg-white border-2 border-[#140206] rounded-3xl p-6 shadow-brutal space-y-3">
            <div className="border-b-2 border-[#140206] pb-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#856f58] font-bold">MACRO PRESETS</span>
              <h3 className="font-serif text-xl font-normal text-[#140206]">1-Click Evaluation Scenarios</h3>
            </div>

            <div className="space-y-2">
              <button
                disabled={!inCall}
                onClick={() => handleSendTurn("My kitchen sink is leaking and I need someone tomorrow.")}
                className="w-full text-left p-3 rounded-2xl bg-[#fbf8f1] hover:bg-[#1bd944]/20 border-2 border-[#140206] shadow-brutal-sm transition disabled:opacity-40"
              >
                <div className="text-[11px] font-mono font-bold text-[#fd7f00]">SCENARIO A — INQUIRY</div>
                <div className="text-xs font-sans text-[#140206] mt-0.5 font-medium">"My kitchen sink is leaking and I need someone tomorrow."</div>
              </button>

              <button
                disabled={!inCall}
                onClick={() => handleSendTurn("2:00 PM works great. My name is John Smith and my address is 124 Elm Street.")}
                className="w-full text-left p-3 rounded-2xl bg-[#fbf8f1] hover:bg-[#1bd944]/20 border-2 border-[#140206] shadow-brutal-sm transition disabled:opacity-40"
              >
                <div className="text-[11px] font-mono font-bold text-[#0cb531]">SCENARIO B — BOOKING & DETAILS</div>
                <div className="text-xs font-sans text-[#140206] mt-0.5 font-medium">"2:00 PM works great. My name is John Smith and my address is 124 Elm Street."</div>
              </button>

              <button
                disabled={!inCall}
                onClick={() => handleSendTurn("Can you transfer me to a human manager right away?")}
                className="w-full text-left p-3 rounded-2xl bg-[#fbf8f1] hover:bg-[#ff6183]/20 border-2 border-[#140206] shadow-brutal-sm transition disabled:opacity-40"
              >
                <div className="text-[11px] font-mono font-bold text-[#ff6183]">SCENARIO C — HUMAN HANDOFF</div>
                <div className="text-xs font-sans text-[#140206] mt-0.5 font-medium">"Can you transfer me to a human manager right away?"</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
