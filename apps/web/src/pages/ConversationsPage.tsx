import React, { useState, useEffect } from 'react';
import { apiRequest } from '../lib/api';
import { Conversation, Message } from '@ai-receptionist/shared';
import {
  MessageSquare, User, Bot, Clock, Calendar, CheckCircle2,
  ChevronRight, PhoneCall, Sparkles, Cpu
} from 'lucide-react';

export const ConversationsPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiRequest<Conversation[]>('/conversations');
        setConversations(data);
        if (data.length > 0) {
          setSelectedConv(data[0]);
          setMessages(data[0].messages || []);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const selectConversation = async (conv: Conversation) => {
    setSelectedConv(conv);
    if (conv.messages) {
      setMessages(conv.messages);
    } else {
      const msgs = await apiRequest<Message[]>(`/conversations/${conv.id}/messages`);
      setMessages(msgs);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b-2 border-[#140206] pb-6">
        <span className="text-xs font-mono uppercase tracking-widest text-[#856f58] font-bold block mb-1">
          DIALOGUE LOGS // SPEECH-TO-TEXT ARCHIVE
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#140206] flex items-center gap-2">
          Call Conversations & Transcripts
        </h1>
        <p className="text-xs font-mono text-[#5e5850] mt-1">
          Full turn-by-turn conversational dialogs between callers and Sarah.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[650px]">
        {/* Left Column: List of conversations */}
        <div className="bg-white border-2 border-[#140206] rounded-3xl overflow-y-auto divide-y border-[#140206] shadow-brutal">
          <div className="p-4 bg-[#f5f3ef] sticky top-0 z-10 border-b-2 border-[#140206]">
            <h3 className="text-xs font-mono uppercase font-bold tracking-wider text-[#140206]">Acoustic Sessions</h3>
          </div>
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => selectConversation(conv)}
              className={`p-4 cursor-pointer transition ${
                selectedConv?.id === conv.id
                  ? 'bg-[#1bd944]/20 border-l-4 border-[#140206]'
                  : 'hover:bg-[#f3eee7]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-serif font-bold text-[#140206]">Voice Dialogue</span>
                <span className="text-[11px] font-mono text-[#856f58]">
                  {new Date(conv.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-xs font-sans text-[#5e5850] mt-1 line-clamp-2">
                {conv.summary || 'Customer scheduled an appointment.'}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full bg-[#1bd944] text-[#140206] border border-[#140206]">
                  {conv.sentiment}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right 2 Columns: Message Thread Viewer */}
        <div className="lg:col-span-2 bg-white border-2 border-[#140206] rounded-3xl flex flex-col overflow-hidden shadow-brutal">
          {/* Header */}
          <div className="p-4 bg-[#f5f3ef] border-b-2 border-[#140206] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#856f58] font-bold">TRANSCRIPT VIEW</span>
              <h3 className="font-serif text-xl font-normal text-[#140206]">
                {selectedConv?.summary || 'Appointment booking conversation'}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#140206] bg-[#1bd944] px-3 py-1 rounded-full border border-[#140206] shadow-brutal-sm">
              <CheckCircle2 className="w-3.5 h-3.5" /> Booked & Resolved
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#fbf8f1]">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 ${
                  m.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full border-2 border-[#140206] flex items-center justify-center shrink-0 ${
                    m.role === 'user' ? 'bg-[#140206] text-white' : 'bg-[#1bd944] text-[#140206]'
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
                    {m.role === 'user' ? 'Caller' : 'Sarah (AI Receptionist)'}
                  </div>
                  <div className="text-sm font-sans">{m.content}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
