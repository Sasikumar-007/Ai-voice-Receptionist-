import React, { useState, useEffect } from 'react';
import { apiRequest } from '../lib/api';
import { Call } from '@ai-receptionist/shared';
import {
  PhoneCall, Play, Pause, Volume2, UserX, CheckCircle2,
  Clock, ArrowUpRight, ShieldCheck, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const CallsPage: React.FC = () => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiRequest<Call[]>('/calls');
        setCalls(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const toggleAudioSimulation = (callId: string, summary?: string) => {
    if (playingId === callId) {
      window.speechSynthesis?.cancel();
      setPlayingId(null);
      return;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = summary || "Call recording simulation playback.";
      const u = new SpeechSynthesisUtterance(text);
      u.onend = () => setPlayingId(null);
      u.onerror = () => setPlayingId(null);
      window.speechSynthesis.speak(u);
      setPlayingId(callId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <PhoneCall className="w-6 h-6 text-brand-400" />
            Inbound Call History
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Complete telephonic call logs, call outcomes, durations, and audio simulation.
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-850/60 text-slate-400 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-6 py-3.5">Caller</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Duration</th>
                <th className="px-6 py-3.5">Outcome</th>
                <th className="px-6 py-3.5">Sentiment</th>
                <th className="px-6 py-3.5">Audio Audio</th>
                <th className="px-6 py-3.5 text-right">Transcript</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {calls.map((call) => (
                <tr key={call.id} className="hover:bg-slate-800/30 transition">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-white">{call.caller_phone}</div>
                    <div className="text-xs text-slate-400 mt-0.5 max-w-sm truncate">
                      {call.summary || 'General inquiry'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {call.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-300">
                    {Math.floor(call.duration_seconds / 60)}m {call.duration_seconds % 60}s
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold text-brand-400">
                      {call.outcome?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-emerald-400">
                    ● {call.sentiment}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleAudioSimulation(call.id, call.summary)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border transition ${
                        playingId === call.id
                          ? 'bg-brand-600 text-white border-brand-500'
                          : 'bg-slate-850 hover:bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {playingId === call.id ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{playingId === call.id ? 'Playing' : 'Listen'}</span>
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to="/dashboard/conversations"
                      className="text-xs text-brand-400 hover:text-brand-300 font-semibold inline-flex items-center gap-1"
                    >
                      Transcript <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
