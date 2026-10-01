import React, { useEffect, useState } from 'react';
import { apiRequest } from '../lib/api';
import { DashboardMetrics, Call } from '@ai-receptionist/shared';
import {
  PhoneCall, Users, CalendarCheck, TrendingUp, Sparkles, UserX, DollarSign,
  ArrowUpRight, Clock, ShieldCheck, CheckCircle2, ChevronRight, Cpu, Radio
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { TiltCard3D } from '../components/Three/TiltCard3D';
import { TavusHumanAvatar3D } from '../components/Three/TavusHumanAvatar3D';

export const DashboardOverview: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [calls, setCalls] = useState<Call[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [outcomes, setOutcomes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [dashRes, callsRes] = await Promise.all([
          apiRequest<{ metrics: DashboardMetrics; chartData: any[]; outcomes: any[] }>('/dashboard/metrics'),
          apiRequest<Call[]>('/calls')
        ]);
        setMetrics(dashRes.metrics);
        setChartData(dashRes.chartData);
        setOutcomes(dashRes.outcomes);
        setCalls(callsRes.slice(0, 5));
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#140206] border-t-[#1bd944] rounded-full animate-spin"></div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Calls', val: metrics?.total_calls ?? 0, icon: PhoneCall, change: '+18%', bg: 'bg-[#ffffff]', accent: '#1bd944' },
    { label: "Today's Calls", val: metrics?.today_calls ?? 0, icon: Clock, change: '+5', bg: 'bg-[#ffffff]', accent: '#cbe7ff' },
    { label: 'New Leads', val: metrics?.new_leads ?? 0, icon: Users, change: '+12%', bg: 'bg-[#ffffff]', accent: '#ffb4c5' },
    { label: 'Appointments Booked', val: metrics?.appointments_count ?? 0, icon: CalendarCheck, change: '+24%', bg: 'bg-[#ffffff]', accent: '#fed7ff' },
    { label: 'AI Resolution Rate', val: `${metrics?.ai_resolution_rate ?? 95}%`, icon: Sparkles, change: '+2.1%', bg: 'bg-[#ffffff]', accent: '#ffda95' },
    { label: 'Call-to-Lead Ratio', val: `${metrics?.conversion_rate ?? 48}%`, icon: TrendingUp, change: '+6.4%', bg: 'bg-[#ffffff]', accent: '#ade2d8' },
    { label: 'Human Transfers', val: metrics?.human_transfers ?? 0, icon: UserX, change: 'Low (6%)', bg: 'bg-[#ffffff]', accent: '#ff6183' },
    { label: 'Est. Booked Revenue', val: `$${((metrics?.estimated_revenue_cents ?? 0) / 100).toLocaleString()}`, icon: DollarSign, change: '+31%', bg: 'bg-[#ffffff]', accent: '#1bd944' }
  ];

  return (
    <div className="space-y-8">
      {/* Page Title & Live 3D Agent Status Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b-2 border-[#140206] pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#856f58] font-bold block mb-1">
            CONTROL PLANE // TELEMETRY & HUMAN COMPUTING
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#140206]">
            Operations & Voice Telemetry
          </h1>
          <p className="text-xs font-mono text-[#5e5850] mt-1">Live metrics, call performance, and automated bookings</p>
        </div>

        {/* Mini 3D Avatar Status Widget */}
        <div className="flex items-center gap-4 bg-white border-2 border-[#140206] rounded-3xl p-3 shadow-brutal pr-5">
          <div className="w-16 h-16 rounded-2xl bg-[#fbf8f1] border-2 border-[#140206] overflow-hidden flex items-center justify-center relative">
            <TavusHumanAvatar3D size={80} isSpeaking={false} interactive={false} showHUD={false} />
            <span className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-[#1bd944] border border-[#140206]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#140206]">Sarah (3D CVI)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1bd944] text-[#140206] border border-[#140206] font-bold">ONLINE</span>
            </div>
            <div className="text-[11px] font-mono text-[#856f58] mt-0.5">Latency: 240ms • 24kHz Opus</div>
          </div>
          <Link
            to="/dashboard/voice-studio"
            className="ml-auto px-4 py-2 bg-[#140206] text-[#1bd944] hover:bg-[#1bd944] hover:text-[#140206] rounded-full text-xs font-mono uppercase font-bold border-2 border-[#140206] shadow-brutal-sm transition active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center gap-1.5"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Launch Studio</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid with 3D Tilt */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => (
          <TiltCard3D key={idx} maxTilt={10} scale={1.02}>
            <div className="bg-white border-2 border-[#140206] p-5 rounded-3xl shadow-brutal h-full flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-mono uppercase tracking-wider font-bold text-[#856f58]">{card.label}</div>
                <div
                  style={{ backgroundColor: card.accent }}
                  className="w-8 h-8 rounded-full border-2 border-[#140206] flex items-center justify-center text-[#140206] shadow-brutal-sm"
                >
                  <card.icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <div className="font-serif text-3xl font-normal text-[#140206] tracking-tight">{card.val}</div>
                <span className="text-xs font-mono font-bold text-[#140206] bg-[#eae5de] px-2 py-0.5 rounded-full border border-[#140206] flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3 text-[#1bd944]" />
                  {card.change}
                </span>
              </div>
            </div>
          </TiltCard3D>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Call Activity Bar Visualization */}
        <div className="lg:col-span-2 bg-white border-2 border-[#140206] rounded-3xl p-6 shadow-brutal">
          <div className="flex items-center justify-between mb-6 border-b-2 border-[#140206] pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#856f58] font-bold">CALL TRAFFIC</span>
              <h2 className="font-serif text-2xl font-normal text-[#140206]">Weekly Call & Booking Density</h2>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono font-bold">
              <div className="flex items-center gap-1.5 text-[#140206]">
                <span className="w-3 h-3 rounded bg-[#140206] border border-[#140206]"></span> Inbound Calls
              </div>
              <div className="flex items-center gap-1.5 text-[#140206]">
                <span className="w-3 h-3 rounded bg-[#1bd944] border border-[#140206]"></span> Appointments
              </div>
            </div>
          </div>

          <div className="h-48 flex items-end gap-4 pt-6 px-2">
            {chartData.map((d, i) => {
              const maxVal = 35;
              const callH = Math.round((d.calls / maxVal) * 100);
              const apptH = Math.round((d.appointments / maxVal) * 100);

              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div className="w-full flex items-end justify-center gap-1.5 h-36">
                    <div
                      style={{ height: `${callH}%` }}
                      className="w-1/2 max-w-[20px] bg-[#140206] border-2 border-[#140206] rounded-t transition"
                      title={`${d.day}: ${d.calls} calls`}
                    ></div>
                    <div
                      style={{ height: `${apptH}%` }}
                      className="w-1/2 max-w-[20px] bg-[#1bd944] border-2 border-[#140206] rounded-t transition"
                      title={`${d.day}: ${d.appointments} appointments`}
                    ></div>
                  </div>
                  <span className="text-[11px] font-mono text-[#140206] font-bold">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call Outcomes Distribution */}
        <div className="bg-white border-2 border-[#140206] rounded-3xl p-6 shadow-brutal flex flex-col justify-between">
          <div>
            <div className="border-b-2 border-[#140206] pb-4 mb-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#856f58] font-bold">RESOLUTION SPECTRUM</span>
              <h2 className="font-serif text-2xl font-normal text-[#140206]">AI Resolution</h2>
            </div>

            <div className="space-y-4">
              {outcomes.map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-[#140206] font-bold">{item.name}</span>
                    <span className="text-[#856f58] font-semibold">{item.value}%</span>
                  </div>
                  <div className="h-3 w-full bg-[#f3eee7] border-2 border-[#140206] rounded-full overflow-hidden p-0.5">
                    <div
                      style={{ width: `${item.value}%` }}
                      className={`h-full rounded-full ${
                        idx === 0 ? 'bg-[#1bd944]' : idx === 1 ? 'bg-[#91d0ff]' : idx === 2 ? 'bg-[#ffda95]' : 'bg-[#ff6183]'
                      }`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-3 bg-[#fbf8f1] border-2 border-[#140206] rounded-2xl flex items-center gap-3 shadow-brutal-sm">
            <CheckCircle2 className="w-5 h-5 text-[#1bd944] shrink-0" />
            <div className="text-xs font-sans text-[#140206]">
              Sarah resolved <strong className="font-mono text-[#140206]">95%</strong> of inquiries with zero human intervention.
            </div>
          </div>
        </div>
      </div>

      {/* Recent Inbound Calls Table */}
      <div className="bg-white border-2 border-[#140206] rounded-3xl overflow-hidden shadow-brutal">
        <div className="p-6 border-b-2 border-[#140206] flex items-center justify-between bg-[#f5f3ef]">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#856f58] font-bold">VOICE LOGS</span>
            <h2 className="font-serif text-2xl font-normal text-[#140206]">Recent Inbound Telephony Audits</h2>
          </div>
          <Link to="/dashboard/calls" className="text-xs font-mono uppercase font-bold text-[#140206] hover:text-[#1bd944] flex items-center gap-1">
            View all calls <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-sans">
            <thead className="bg-[#fbf8f1] text-[#856f58] text-[11px] font-mono uppercase tracking-wider font-bold border-b-2 border-[#140206]">
              <tr>
                <th className="px-6 py-3.5">Caller</th>
                <th className="px-6 py-3.5">Duration</th>
                <th className="px-6 py-3.5">Outcome</th>
                <th className="px-6 py-3.5">Sentiment</th>
                <th className="px-6 py-3.5">Date / Time</th>
                <th className="px-6 py-3.5 text-right">Transcript</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 border-[#140206]/10 text-[#140206]">
              {calls.map((call) => (
                <tr key={call.id} className="hover:bg-[#f3eee7] transition">
                  <td className="px-6 py-4">
                    <div className="font-bold text-[#140206] font-mono text-xs">{call.caller_phone}</div>
                    <div className="text-xs text-[#5e5850] truncate max-w-xs">{call.summary || 'Caller inquiry'}</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-[#140206]">
                    {Math.floor(call.duration_seconds / 60)}m {call.duration_seconds % 60}s
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-mono uppercase font-bold border-2 border-[#140206] shadow-brutal-sm ${
                      call.outcome === 'APPOINTMENT_BOOKED'
                        ? 'bg-[#1bd944] text-[#140206]'
                        : call.was_transferred
                        ? 'bg-[#ff6183] text-[#140206]'
                        : 'bg-[#cbe7ff] text-[#140206]'
                    }`}>
                      {call.outcome?.replace('_', ' ') || 'COMPLETED'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-mono font-bold ${
                      call.sentiment === 'POSITIVE' ? 'text-[#0cb531]' : 'text-[#856f58]'
                    }`}>
                      ● {call.sentiment}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-[#5e5850]">
                    {new Date(call.start_time).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to="/dashboard/conversations"
                      className="text-xs font-mono font-bold uppercase text-[#140206] hover:text-[#1bd944] underline underline-offset-4"
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
