import React, { useState, useEffect } from 'react';
import { apiRequest } from '../lib/api';
import { Lead, LeadStatus } from '@ai-receptionist/shared';
import {
  Users, Search, Filter, Plus, Phone, Mail, Clock, CheckCircle2,
  Calendar, FileText, ChevronRight, X, ArrowUpRight
} from 'lucide-react';

const STATUS_PILLS: Record<LeadStatus, string> = {
  NEW: 'bg-[#91d0ff] text-[#140206]',
  CONTACTED: 'bg-[#ffda95] text-[#140206]',
  QUALIFIED: 'bg-[#fed7ff] text-[#140206]',
  BOOKED: 'bg-[#1bd944] text-[#140206]',
  COMPLETED: 'bg-[#d0c9ed] text-[#140206]',
  LOST: 'bg-[#ffb4c5] text-[#140206]'
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b-2 border-[#140206] pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#856f58] font-bold block mb-1">
            QUALIFIED PIPELINE // CALL INTAKE
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#140206]">
            Lead Management
          </h1>
          <p className="text-xs font-mono text-[#5e5850] mt-1">
            Prospective clients automatically screened and captured by the AI voice receptionist.
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border-2 border-[#140206] p-4 rounded-2xl shadow-brutal">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#856f58] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search leads by name, phone, or service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#fbf8f1] border-2 border-[#140206] rounded-full text-xs text-[#140206] placeholder-[#856f58] focus:outline-none"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'NEW', 'CONTACTED', 'QUALIFIED', 'BOOKED', 'COMPLETED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider border-2 border-[#140206] transition ${
                statusFilter === st
                  ? 'bg-[#140206] text-white shadow-brutal-sm'
                  : 'bg-[#fbf8f1] text-[#140206] hover:bg-[#eae5de]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white border-2 border-[#140206] rounded-2xl overflow-hidden shadow-brutal">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-sans">
            <thead className="bg-[#fbf8f1] text-[#856f58] text-[11px] font-mono uppercase tracking-wider font-bold border-b-2 border-[#140206]">
              <tr>
                <th className="px-6 py-3.5">Prospect Name</th>
                <th className="px-6 py-3.5">Contact Line</th>
                <th className="px-6 py-3.5">Service Requested</th>
                <th className="px-6 py-3.5">Est. Value</th>
                <th className="px-6 py-3.5">Pipeline Status</th>
                <th className="px-6 py-3.5">Channel</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5 text-right">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y border-[#140206] text-[#140206]">
              {filtered.map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => {
                    setSelectedLead(lead);
                    setNewStatus(lead.status);
                  }}
                  className="hover:bg-[#f3eee7] cursor-pointer transition"
                >
                  <td className="px-6 py-4 font-serif font-bold text-base text-[#140206]">{lead.name}</td>
                  <td className="px-6 py-4">
                    <div className="text-xs font-mono font-bold text-[#140206]">{lead.phone}</div>
                    <div className="text-[11px] font-mono text-[#856f58]">{lead.email || 'No email provided'}</div>
                  </td>
                  <td className="px-6 py-4 text-xs font-sans text-[#140206]">
                    {lead.service_requested || 'General Inquiry'}
                  </td>
                  <td className="px-6 py-4 text-xs font-mono font-extrabold text-[#0cb531]">
                    ${((lead.estimated_value_cents || 0) / 100).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold border border-[#140206] ${STATUS_PILLS[lead.status]}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-[#5e5850]">
                    {lead.source?.replace('_', ' ')}
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-[#5e5850]">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-xs font-mono uppercase font-bold text-[#140206] hover:text-[#1bd944] inline-flex items-center gap-1 underline underline-offset-4">
                      Profile <ChevronRight className="w-3.5 h-3.5" />
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
        <div className="fixed inset-0 z-50 bg-[#140206]/50 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-lg bg-white border-l-2 border-[#140206] h-full p-6 overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b-2 border-[#140206] pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#856f58] font-bold">LEAD DOSSIER</span>
                <h3 className="font-serif text-2xl font-normal text-[#140206]">{selectedLead.name}</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 mt-1 rounded-full text-xs font-mono uppercase font-bold border border-[#140206] ${STATUS_PILLS[selectedLead.status]}`}>
                  {selectedLead.status}
                </span>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-2 border-2 border-[#140206] hover:bg-[#ffb4c5] rounded-full transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Contact Details */}
            <div className="space-y-3 bg-[#fbf8f1] p-4 rounded-2xl border-2 border-[#140206] shadow-brutal-sm">
              <div className="text-[10px] font-mono uppercase font-bold text-[#856f58] tracking-wider">Contact Telemetry</div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#140206]">
                <Phone className="w-4 h-4 text-[#ff6183]" />
                <span>{selectedLead.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#140206]">
                <Mail className="w-4 h-4 text-[#ff6183]" />
                <span>{selectedLead.email || 'None'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#5e5850]">
                <Calendar className="w-4 h-4 text-[#ff6183]" />
                <span>Timestamp: {new Date(selectedLead.created_at).toLocaleString()}</span>
              </div>
            </div>

            {/* Journey Timeline */}
            <div className="space-y-3">
              <div className="text-[10px] font-mono uppercase font-bold text-[#856f58] tracking-wider">Customer Journey Lifecycle</div>
              <div className="relative pl-6 space-y-4 border-l-2 border-[#140206]">
                <div className="relative">
                  <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-[#140206] border-2 border-white"></span>
                  <div className="text-xs font-mono font-bold text-[#140206]">1. INBOUND CALL RECEIVED</div>
                  <div className="text-xs font-sans text-[#5e5850]">Caller connected through SwiftFix PSTN trunk</div>
                </div>
                <div className="relative">
                  <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-[#1bd944] border-2 border-[#140206]"></span>
                  <div className="text-xs font-mono font-bold text-[#140206]">2. QUALIFIED BY AI AGENT</div>
                  <div className="text-xs font-sans text-[#5e5850]">Sarah extracted issue: {selectedLead.service_requested}</div>
                </div>
                <div className="relative">
                  <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-[#fed7ff] border-2 border-[#140206]"></span>
                  <div className="text-xs font-mono font-bold text-[#140206]">3. CALENDAR RESERVATION</div>
                  <div className="text-xs font-sans text-[#5e5850]">Google Calendar availability committed</div>
                </div>
                <div className="relative">
                  <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-[#ffb4c5] border-2 border-[#140206]"></span>
                  <div className="text-xs font-mono font-bold text-[#140206]">4. MULTI-CHANNEL DISPATCH</div>
                  <div className="text-xs font-sans text-[#5e5850]">Confirmation sent via Resend & WhatsApp API</div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <div className="text-[10px] font-mono uppercase font-bold text-[#856f58] tracking-wider">Acoustic Call Notes</div>
              <div className="p-3 bg-[#fbf8f1] rounded-2xl border-2 border-[#140206] text-xs font-sans text-[#140206] whitespace-pre-line leading-relaxed">
                {selectedLead.notes || 'No extra notes recorded.'}
              </div>
            </div>

            {/* Status & Update Actions */}
            <div className="space-y-3 pt-4 border-t-2 border-[#140206]">
              <label className="block text-xs font-mono uppercase font-bold text-[#140206]">Update Pipeline Stage</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as LeadStatus)}
                className="w-full p-2.5 bg-[#fbf8f1] border-2 border-[#140206] rounded-xl text-xs font-mono font-bold text-[#140206]"
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
                placeholder="Log internal follow-up comment..."
                value={updateNote}
                onChange={(e) => setUpdateNote(e.target.value)}
                className="w-full p-2.5 bg-[#fbf8f1] border-2 border-[#140206] rounded-xl text-xs font-sans text-[#140206]"
              />

              <button
                onClick={handleUpdateStatus}
                className="w-full py-3 bg-[#1bd944] hover:bg-[#3bdb5d] text-[#140206] rounded-full text-xs font-mono uppercase font-bold border-2 border-[#140206] shadow-brutal transition active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                Save Record Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
