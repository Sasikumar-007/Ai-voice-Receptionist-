import React, { useState, useEffect } from 'react';
import { apiRequest } from '../lib/api';
import { Lead, LeadStatus } from '@ai-receptionist/shared';
import {
  Users, Search, Filter, Plus, Phone, Mail, Clock, CheckCircle2,
  Calendar, FileText, ChevronRight, X, ArrowUpRight
} from 'lucide-react';

const STATUS_COLORS: Record<LeadStatus, string> = {
  NEW: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  CONTACTED: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  QUALIFIED: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  BOOKED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  COMPLETED: 'bg-slate-500/10 text-slate-300 border-slate-500/20',
  LOST: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
};

export const LeadsPage: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState<LeadStatus>('NEW');
  const [updateNote, setUpdateNote] = useState('');

  const fetchLeads = async () => {
    try {
      const data = await apiRequest<Lead[]>('/leads');
      setLeads(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleUpdateStatus = async () => {
    if (!selectedLead) return;
    try {
      const updated = await apiRequest<Lead>(`/leads/${selectedLead.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus, notes: updateNote })
      });
      setSelectedLead(updated);
      setUpdateNote('');
      fetchLeads();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = leads.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search) ||
      (l.service_requested && l.service_requested.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-400" />
            Lead Management
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Inbound prospective callers automatically qualified and captured by the AI voice receptionist.
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search leads by name, phone, or service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-850 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'NEW', 'CONTACTED', 'QUALIFIED', 'BOOKED', 'COMPLETED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                statusFilter === st
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-850 text-slate-400 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-850/60 text-slate-400 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-6 py-3.5">Name</th>
                <th className="px-6 py-3.5">Phone & Email</th>
                <th className="px-6 py-3.5">Service Requested</th>
                <th className="px-6 py-3.5">Est. Value</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Source</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filtered.map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => {
                    setSelectedLead(lead);
                    setNewStatus(lead.status);
                  }}
                  className="hover:bg-slate-800/40 cursor-pointer transition"
                >
                  <td className="px-6 py-4 font-semibold text-white">{lead.name}</td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-slate-200">{lead.phone}</div>
                    <div className="text-[11px] text-slate-500">{lead.email || 'No email provided'}</div>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-300">
                    {lead.service_requested || 'General Inquiry'}
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-emerald-400">
                    ${((lead.estimated_value_cents || 0) / 100).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${STATUS_COLORS[lead.status]}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400">
                    {lead.source?.replace('_', ' ')}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-xs text-brand-400 hover:text-brand-300 font-semibold inline-flex items-center gap-1">
                      View Profile <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Profile Drawer */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-lg bg-slate-900 border-l border-slate-800 h-full p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">{selectedLead.name}</h3>
                <span className={`inline-flex items-center px-2 py-0.5 mt-1 rounded text-xs font-semibold border ${STATUS_COLORS[selectedLead.status]}`}>
                  {selectedLead.status}
                </span>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contact Details */}
            <div className="space-y-3 bg-slate-850 p-4 rounded-xl border border-slate-800">
              <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">Contact Details</div>
              <div className="flex items-center gap-2 text-sm text-slate-200">
                <Phone className="w-4 h-4 text-brand-400" />
                <span>{selectedLead.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-200">
                <Mail className="w-4 h-4 text-brand-400" />
                <span>{selectedLead.email || 'None'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-200">
                <Calendar className="w-4 h-4 text-brand-400" />
                <span>Created: {new Date(selectedLead.created_at).toLocaleString()}</span>
              </div>
            </div>

            {/* Journey Timeline */}
            <div className="space-y-3">
              <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">Customer Journey Timeline</div>
              <div className="relative pl-6 space-y-4 border-l border-slate-800">
                <div className="relative">
                  <span className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  <div className="text-xs font-bold text-white">INBOUND CALL RECEIVED</div>
                  <div className="text-[11px] text-slate-400">Caller contacted SwiftFix Plumbing phone line</div>
                </div>
                <div className="relative">
                  <span className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <div className="text-xs font-bold text-white">LEAD CREATED BY AI</div>
                  <div className="text-[11px] text-slate-400">Sarah identified service request: {selectedLead.service_requested}</div>
                </div>
                <div className="relative">
                  <span className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-violet-500"></span>
                  <div className="text-xs font-bold text-white">APPOINTMENT BOOKED</div>
                  <div className="text-[11px] text-slate-400">Google Calendar reservation confirmed</div>
                </div>
                <div className="relative">
                  <span className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <div className="text-xs font-bold text-white">CONFIRMATIONS DISPATCHED</div>
                  <div className="text-[11px] text-slate-400">Email sent via Resend & WhatsApp notification delivered</div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">Conversation Notes</div>
              <div className="p-3 bg-slate-850 rounded-xl border border-slate-800 text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                {selectedLead.notes || 'No extra notes recorded.'}
              </div>
            </div>

            {/* Status & Update Actions */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <label className="block text-xs font-medium text-slate-400">Update Lead Pipeline Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as LeadStatus)}
                className="w-full p-2.5 bg-slate-850 border border-slate-700 rounded-xl text-xs text-white"
              >
                <option value="NEW">NEW</option>
                <option value="CONTACTED">CONTACTED</option>
                <option value="QUALIFIED">QUALIFIED</option>
                <option value="BOOKED">BOOKED</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="LOST">LOST</option>
              </select>

              <textarea
                rows={2}
                placeholder="Add internal follow-up note..."
                value={updateNote}
                onChange={(e) => setUpdateNote(e.target.value)}
                className="w-full p-2.5 bg-slate-850 border border-slate-700 rounded-xl text-xs text-white"
              />

              <button
                onClick={handleUpdateStatus}
                className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
