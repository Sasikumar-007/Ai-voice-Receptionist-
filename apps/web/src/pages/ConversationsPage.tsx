import React, { useState, useEffect } from 'react';
import { apiRequest } from '../lib/api';
import { Conversation, Message } from '@ai-receptionist/shared';
import {
  MessageSquare, User, Bot, Clock, Calendar, CheckCircle2,
  ChevronRight, PhoneCall, Sparkles
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
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-brand-400" />
          Call Conversations & Transcripts
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Full turn-by-turn conversational dialogs between callers and Sarah.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[650px]">
        {/* Left Column: List of conversations */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-y-auto divide-y divide-slate-800">
          <div className="p-4 bg-slate-850 sticky top-0 z-10 border-b border-slate-800">
            <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400">Recorded Sessions</h3>
          </div>
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => selectConversation(conv)}
              className={`p-4 cursor-pointer transition ${
                selectedConv?.id === conv.id
                  ? 'bg-brand-600/10 border-l-4 border-brand-500'
                  : 'hover:bg-slate-850/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">Voice Session</span>
                <span className="text-[11px] text-slate-500">
                  {new Date(conv.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                {conv.summary || 'Customer scheduled an appointment.'}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {conv.sentiment}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right 2 Columns: Message Thread Viewer */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Dialogue Transcript</h3>
              <p className="text-xs text-slate-400">
                {selectedConv?.summary || 'Appointment booking conversation'}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Booked & Resolved
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 ${
                  m.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    m.role === 'user' ? 'bg-slate-700 text-slate-200' : 'bg-brand-600 text-white'
                  }`}
                >
                  {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-brand-600 text-white rounded-tr-none'
                      : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700/60'
                  }`}
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">
                    {m.role === 'user' ? 'Customer' : 'Sarah (AI Receptionist)'}
                  </div>
                  <div>{m.content}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
