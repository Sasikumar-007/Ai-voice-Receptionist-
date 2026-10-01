import React, { useState, useEffect, useRef } from 'react';
import { apiRequest } from '../lib/api';
import {
  Phone, PhoneOff, Mic, MicOff, Sparkles, User, Bot, AlertTriangle,
  CheckCircle, ArrowRight, Play, RefreshCw, Volume2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-brand-400" />
            Interactive Voice Studio
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Simulate live phone calls with Sarah. Speak via microphone or type test queries.
          </p>
        </div>

        {inCall ? (
          <button
            onClick={handleEndCall}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-rose-600/30 transition"
          >
            <PhoneOff className="w-4 h-4" />
            Hang Up Call
          </button>
        ) : (
          <button
            onClick={handleStartCall}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition"
          >
            <Phone className="w-4 h-4" />
            Simulate Inbound Call
          </button>
        )}
      </div>

      {/* Main Studio Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Call Conversation */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-[600px] overflow-hidden">
          {/* Header */}
          <div className="p-4 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-white text-sm">Sarah (AI Receptionist)</div>
                <div className="text-xs text-slate-400">
                  {inCall ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> Live Call in Progress
                    </span>
                  ) : (
                    'Call Disconnected'
                  )}
                </div>
              </div>
            </div>

            {isSpeaking && (
              <div className="flex items-center gap-2 text-xs text-brand-400 px-3 py-1 bg-brand-500/10 border border-brand-500/20 rounded-full animate-pulse">
                <Volume2 className="w-3.5 h-3.5" />
                Sarah is speaking...
              </div>
            )}
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {!inCall ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 mb-4">
                  <Phone className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-white text-base">Ready for Phone Simulation</h3>
                <p className="text-sm text-slate-400 max-w-sm mt-1 mb-6">
                  Click below to answer a simulated customer call to SwiftFix Plumbing.
                </p>
                <button
                  onClick={handleStartCall}
                  className="px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-brand-500/25 transition"
                >
                  <Phone className="w-4 h-4" />
                  Answer Incoming Call
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
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        m.role === 'user'
                          ? 'bg-slate-700 text-slate-200'
                          : 'bg-brand-600 text-white'
                      }`}
                    >
                      {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        m.role === 'user'
                          ? 'bg-brand-600 text-white rounded-tr-none'
                          : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700/60'
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="bg-slate-800 rounded-2xl rounded-tl-none px-4 py-2.5 border border-slate-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce"></span>
                      <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Controls */}
          {inCall && (
            <div className="p-4 bg-slate-850 border-t border-slate-800">
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
                  className={`p-3 rounded-xl transition ${
                    isListening
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                  title={isListening ? 'Stop Listening' : 'Speak into Microphone'}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={isListening ? 'Listening to your speech...' : 'Type caller speech or press the mic to talk...'}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim() || isLoading}
                  className="px-4 py-2.5 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition"
                >
                  Send
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right Col: Scenario Presets & Live Tool Execution Monitor */}
        <div className="space-y-6">
          {/* Quick Scenario Triggers */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3">1-Click Test Scenarios</h3>
            <div className="space-y-2.5">
              <button
                disabled={!inCall}
                onClick={() => handleSendTurn("My kitchen sink is leaking and I need someone tomorrow.")}
                className="w-full text-left p-3 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700/60 transition disabled:opacity-40"
              >
                <div className="text-xs font-semibold text-brand-400">Master Prompt Scenario</div>
                <div className="text-xs text-slate-300 mt-1">"My kitchen sink is leaking and I need someone tomorrow."</div>
              </button>

              <button
                disabled={!inCall}
                onClick={() => handleSendTurn("2:00 PM works great. My name is John Smith and my address is 124 Elm Street.")}
                className="w-full text-left p-3 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700/60 transition disabled:opacity-40"
              >
                <div className="text-xs font-semibold text-emerald-400">Confirm Booking & Details</div>
                <div className="text-xs text-slate-300 mt-1">"2:00 PM works great. My name is John Smith..."</div>
              </button>

              <button
                disabled={!inCall}
                onClick={() => handleSendTurn("Can you transfer me to a human manager right away?")}
                className="w-full text-left p-3 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700/60 transition disabled:opacity-40"
              >
                <div className="text-xs font-semibold text-rose-400">Human Escalation Trigger</div>
                <div className="text-xs text-slate-300 mt-1">"Can you transfer me to a human manager?"</div>
              </button>

              <button
                disabled={!inCall}
                onClick={() => handleSendTurn("What are your business hours?")}
                className="w-full text-left p-3 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700/60 transition disabled:opacity-40"
              >
                <div className="text-xs font-semibold text-amber-400">Business Hours Inquiry</div>
                <div className="text-xs text-slate-300 mt-1">"What are your business hours?"</div>
              </button>
            </div>
          </div>

          {/* AI Tool Execution Monitor */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Live Tool Execution Monitor</h3>
            <div className="space-y-3">
              <div className="p-3 bg-slate-850 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">Last Action:</span>
                <span className="text-xs font-mono font-bold text-emerald-400">{lastAction || 'idle'}</span>
              </div>
              <div className="text-xs text-slate-400 leading-relaxed">
                When Sarah reasons over caller requests, she executes structured tools:
                <ul className="list-disc pl-4 mt-2 space-y-1 text-slate-300">
                  <li><code className="text-brand-400">check_availability()</code></li>
                  <li><code className="text-brand-400">create_appointment()</code></li>
                  <li><code className="text-brand-400">create_lead()</code></li>
                  <li><code className="text-brand-400">transfer_to_human()</code></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
