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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b-2 border-[#140206] pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#856f58] font-bold block mb-1">
            TELEPHONY LOGS // PSTN TRUNKS
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#140206] flex items-center gap-2">
            Inbound Call Audio Logs
          </h1>
          <p className="text-xs font-mono text-[#5e5850] mt-1">
            Detailed telephone sessions, outcomes, durations, and audio simulation playback.
          </p>
        </div>
      </div>

      <div className="bg-white border-2 border-[#140206] rounded-3xl overflow-hidden shadow-brutal">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-sans">
            <thead className="bg-[#fbf8f1] text-[#856f58] text-[11px] font-mono uppercase tracking-wider font-bold border-b-2 border-[#140206]">
              <tr>
                <th className="px-6 py-3.5">Caller Line</th>
                <th className="px-6 py-3.5">Connection</th>
                <th className="px-6 py-3.5">Duration</th>
                <th className="px-6 py-3.5">Outcome</th>
                <th className="px-6 py-3.5">Sentiment</th>
                <th className="px-6 py-3.5">Acoustic Playback</th>
                <th className="px-6 py-3.5 text-right">Transcript</th>
              </tr>
            </thead>
            <tbody className="divide-y border-[#140206] text-[#140206]">
              {calls.map((call) => (
                <tr key={call.id} className="hover:bg-[#f3eee7] transition">
                  <td className="px-6 py-4">
                    <div className="font-mono font-bold text-xs text-[#140206]">{call.caller_phone}</div>
                    <div className="text-xs text-[#5e5850] mt-0.5 max-w-sm truncate">
                      {call.summary || 'General inquiry'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold bg-[#1bd944] text-[#140206] border border-[#140206]">
                      {call.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-[#140206]">
                    {Math.floor(call.duration_seconds / 60)}m {call.duration_seconds % 60}s
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono font-bold text-[#140206]">
                      {call.outcome?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono font-bold text-[#0cb531]">
                    ● {call.sentiment}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleAudioSimulation(call.id, call.summary)}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono uppercase font-bold border-2 border-[#140206] shadow-brutal-sm transition ${
                        playingId === call.id
                          ? 'bg-[#140206] text-white'
                          : 'bg-[#f5f3ef] hover:bg-[#1bd944] text-[#140206]'
                      }`}
                    >
                      {playingId === call.id ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{playingId === call.id ? 'Playing' : 'Playback'}</span>
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to="/dashboard/conversations"
                      className="text-xs font-mono uppercase font-bold text-[#140206] hover:text-[#1bd944] underline underline-offset-4"
                    >
                      Dialogue
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
