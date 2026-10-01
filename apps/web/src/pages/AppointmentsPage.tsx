import React, { useState, useEffect } from 'react';
import { apiRequest } from '../lib/api';
import { Appointment, AppointmentStatus } from '@ai-receptionist/shared';
import {
  Calendar as CalendarIcon, Clock, User, Phone, CheckCircle2,
  XCircle, AlertCircle, Plus, CalendarCheck
} from 'lucide-react';

export const AppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [checkingSlots, setCheckingSlots] = useState(false);

  const fetchAppointments = async () => {
    try {
      const data = await apiRequest<Appointment[]>('/appointments');
      setAppointments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkAvailabilityForDate = async (dateStr: string) => {
    setCheckingSlots(true);
    try {
      const res = await apiRequest<{ date: string; availableSlots: string[] }>(`/appointments/check-availability?date=${dateStr}`);
      setAvailableSlots(res.availableSlots);
    } catch (err) {
      console.error(err);
    } finally {
      setCheckingSlots(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    checkAvailabilityForDate(selectedDate);
  }, []);

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await apiRequest(`/appointments/${id}/cancel`, {
        method: 'PATCH',
        body: JSON.stringify({ reason: 'Customer requested cancellation' })
      });
      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-brand-400" />
            Appointments & Schedule
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time bookings synchronized with Google Calendar and business hours.
          </p>
        </div>
      </div>

      {/* Real-Time Availability Inspector */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
          <Clock className="w-4 h-4 text-brand-400" />
          Real-Time Availability Checker
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Test the real-time slot generation that Sarah consults during incoming calls.
        </p>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              checkAvailabilityForDate(e.target.value);
            }}
            className="px-3 py-2 bg-slate-850 border border-slate-700 rounded-xl text-xs text-white"
          />

          <div className="flex flex-wrap items-center gap-2">
            {checkingSlots ? (
              <span className="text-xs text-slate-400">Verifying calendar conflicts...</span>
            ) : availableSlots.length === 0 ? (
              <span className="text-xs text-rose-400">No open slots available (Shop closed or fully booked).</span>
            ) : (
              availableSlots.map((slot, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-semibold"
                >
                  {new Date(slot).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-800">
          <h2 className="text-base font-semibold text-white">Scheduled Service Visits</h2>
          <p className="text-xs text-slate-400">Upcoming and completed bookings</p>
        </div>

        <div className="divide-y divide-slate-800">
          {appointments.map((appt) => (
            <div key={appt.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-850/40 transition">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-400 flex flex-col items-center justify-center shrink-0 border border-brand-500/20">
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    {new Date(appt.start_time).toLocaleDateString([], { month: 'short' })}
                  </span>
                  <span className="text-base font-extrabold text-white leading-none">
                    {new Date(appt.start_time).getDate()}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{appt.customer_name}</span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                      appt.status === 'CONFIRMED'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                      {appt.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-brand-400" />
                      {new Date(appt.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-brand-400" />
                      {appt.customer_phone}
                    </span>
                  </div>
                  {appt.notes && (
                    <div className="text-xs text-slate-300 mt-2 bg-slate-850 p-2 rounded-lg border border-slate-800">
                      {appt.notes}
                    </div>
                  )}
                </div>
              </div>

              {appt.status === 'CONFIRMED' && (
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleCancel(appt.id)}
                    className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg text-xs font-semibold transition"
                  >
                    Cancel Booking
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
