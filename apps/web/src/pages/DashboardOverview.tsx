import React, { useEffect, useState } from 'react';
import { apiRequest } from '../lib/api';
import { DashboardMetrics, Call } from '@ai-receptionist/shared';
import {
  PhoneCall, Users, CalendarCheck, TrendingUp, Sparkles, UserX, DollarSign,
  ArrowUpRight, Clock, ShieldCheck, CheckCircle2, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

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
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Calls', val: metrics?.total_calls ?? 0, icon: PhoneCall, change: '+18%', color: 'from-blue-500/20 to-indigo-500/20 text-blue-400' },
    { label: "Today's Calls", val: metrics?.today_calls ?? 0, icon: Clock, change: '+5', color: 'from-sky-500/20 to-blue-500/20 text-sky-400' },
    { label: 'New Leads', val: metrics?.new_leads ?? 0, icon: Users, change: '+12%', color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400' },
    { label: 'Appointments Booked', val: metrics?.appointments_count ?? 0, icon: CalendarCheck, change: '+24%', color: 'from-violet-500/20 to-purple-500/20 text-violet-400' },
    { label: 'AI Resolution Rate', val: `${metrics?.ai_resolution_rate ?? 95}%`, icon: Sparkles, change: '+2.1%', color: 'from-amber-500/20 to-orange-500/20 text-amber-400' },
    { label: 'Call-to-Lead Conversion', val: `${metrics?.conversion_rate ?? 48}%`, icon: TrendingUp, change: '+6.4%', color: 'from-teal-500/20 to-cyan-500/20 text-teal-400' },
    { label: 'Human Transfers', val: metrics?.human_transfers ?? 0, icon: UserX, change: 'Low (6%)', color: 'from-rose-500/20 to-red-500/20 text-rose-400' },
    { label: 'Est. Booked Revenue', val: `$${((metrics?.estimated_revenue_cents ?? 0) / 100).toLocaleString()}`, icon: DollarSign, change: '+31%', color: 'from-emerald-500/20 to-green-500/20 text-emerald-400' }
  ];

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Operations Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">Live metrics, call performance, and automated bookings</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/voice-studio"
            className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-lg shadow-brand-500/25 transition"
          >
            <Sparkles className="w-4 h-4" />
            Launch AI Voice Studio
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 p-5 rounded-xl hover:border-slate-700 transition">
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium text-slate-400">{card.label}</div>
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                <card.icon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <div className="text-2xl font-bold text-white tracking-tight">{card.val}</div>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" />
                {card.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Visual Analytics / Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Call Activity Bar Visualization */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-white">Weekly Call & Booking Volume</h2>
              <p className="text-xs text-slate-400">Total answered calls vs confirmed appointments</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-brand-500"></span> Inbound Calls
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span> Appointments
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
                      className="w-1/2 max-w-[20px] bg-brand-500/80 hover:bg-brand-400 rounded-t transition"
                      title={`${d.day}: ${d.calls} calls`}
                    ></div>
                    <div
                      style={{ height: `${apptH}%` }}
                      className="w-1/2 max-w-[20px] bg-emerald-500/80 hover:bg-emerald-400 rounded-t transition"
                      title={`${d.day}: ${d.appointments} appointments`}
                    ></div>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call Outcomes Distribution */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">AI Resolution Breakdown</h2>
            <p className="text-xs text-slate-400">Distribution of caller resolutions</p>

            <div className="mt-6 space-y-4">
              {outcomes.map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">{item.name}</span>
                    <span className="text-slate-400 font-semibold">{item.value}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${item.value}%`, backgroundColor: item.color }}
                      className="h-full rounded-full"
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-3 bg-slate-850 border border-slate-800 rounded-lg flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="text-xs text-slate-300">
              Sarah resolved <span className="text-white font-bold">95%</span> of caller inquiries without human staff intervention.
            </div>
          </div>
        </div>
      </div>

      {/* Recent Inbound Calls Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">Recent Calls</h2>
            <p className="text-xs text-slate-400">Latest telephone calls handled by the AI receptionist</p>
          </div>
          <Link to="/dashboard/calls" className="text-xs text-brand-400 hover:text-brand-300 font-medium flex items-center gap-1">
            View all calls <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-850/60 text-slate-400 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-6 py-3.5">Caller</th>
                <th className="px-6 py-3.5">Duration</th>
                <th className="px-6 py-3.5">Outcome</th>
                <th className="px-6 py-3.5">Sentiment</th>
                <th className="px-6 py-3.5">Date / Time</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {calls.map((call) => (
                <tr key={call.id} className="hover:bg-slate-800/30 transition">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{call.caller_phone}</div>
                    <div className="text-xs text-slate-400 truncate max-w-xs">{call.summary || 'Caller inquiry'}</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-300">
                    {Math.floor(call.duration_seconds / 60)}m {call.duration_seconds % 60}s
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                      call.outcome === 'APPOINTMENT_BOOKED'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : call.was_transferred
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      {call.outcome?.replace('_', ' ') || 'COMPLETED'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium ${
                      call.sentiment === 'POSITIVE' ? 'text-emerald-400' : 'text-slate-400'
                    }`}>
                      ● {call.sentiment}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400">
                    {new Date(call.start_time).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      to="/dashboard/conversations"
                      className="text-xs text-brand-400 hover:text-brand-300 font-medium underline underline-offset-4"
                    >
                      Transcript
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
