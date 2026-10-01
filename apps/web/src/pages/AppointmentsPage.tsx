import React, { useState, useEffect } from 'react';
import { apiRequest } from '../lib/api';
import { Appointment } from '@ai-receptionist/shared';
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b-2 border-[#140206] pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#856f58] font-bold block mb-1">
            SCHEDULE ENGINE // GOOGLE CALENDAR SYNC
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#140206]">
            Appointments & Schedule
          </h1>
          <p className="text-xs font-mono text-[#5e5850] mt-1">
            Real-time conflict-free bookings synchronized with Google Calendar and shop hours.
          </p>
        </div>
      </div>

      {/* Real-Time Availability Inspector */}
      <div className="bg-white border-2 border-[#140206] p-6 rounded-3xl shadow-brutal">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-4 h-4 text-[#ff6183]" />
          <h3 className="font-serif text-xl font-normal text-[#140206]">
            Real-Time Slot Engine
          </h3>
        </div>
        <p className="text-xs font-mono text-[#5e5850] mb-4">
          Test the real-time availability generator that Sarah consults during incoming telephone calls.
        </p>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              checkAvailabilityForDate(e.target.value);
            }}
            className="px-4 py-2 bg-[#fbf8f1] border-2 border-[#140206] rounded-full text-xs font-mono font-bold text-[#140206]"
          />

          <div className="flex flex-wrap items-center gap-2">
            {checkingSlots ? (
              <span className="text-xs font-mono text-[#856f58]">Verifying Google Calendar conflicts...</span>
            ) : availableSlots.length === 0 ? (
              <span className="text-xs font-mono text-[#ff6183] font-bold">No open slots (Shop closed or fully booked).</span>
            ) : (
              availableSlots.map((slot, i) => (
                <span
                  key={i}
                  className="px-3.5 py-1.5 bg-[#1bd944] text-[#140206] border-2 border-[#140206] rounded-full text-xs font-mono font-bold shadow-brutal-sm"
                >
                  {new Date(slot).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white border-2 border-[#140206] rounded-3xl overflow-hidden shadow-brutal">
        <div className="p-6 border-b-2 border-[#140206] bg-[#f5f3ef] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#856f58] font-bold">RESERVATIONS</span>
            <h2 className="font-serif text-2xl font-normal text-[#140206]">Scheduled Service Visits</h2>
          </div>
        </div>

        <div className="divide-y border-[#140206]">
          {appointments.map((appt) => (
            <div key={appt.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#fbf8f1] transition">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#140206] text-white flex flex-col items-center justify-center shrink-0 border-2 border-[#140206] shadow-brutal-sm">
                  <span className="text-[10px] font-mono uppercase font-bold text-[#1bd944]">
                    {new Date(appt.start_time).toLocaleDateString([], { month: 'short' })}
                  </span>
                  <span className="font-serif text-xl font-bold text-white leading-none">
                    {new Date(appt.start_time).getDate()}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-lg text-[#140206]">{appt.customer_name}</span>
                    <span className={`text-[10px] font-mono uppercase font-bold px-2.5 py-0.5 rounded-full border border-[#140206] ${
                      appt.status === 'CONFIRMED'
                        ? 'bg-[#1bd944] text-[#140206]'
                        : 'bg-[#ffb4c5] text-[#140206]'
                    }`}>
                      {appt.status}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-[#5e5850] flex items-center gap-4 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#ff6183]" />
                      {new Date(appt.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-[#1bd944]" />
                      {appt.customer_phone}
                    </span>
                  </div>
                  {appt.notes && (
                    <div className="text-xs font-sans text-[#140206] mt-2 bg-[#f3eee7] p-2.5 rounded-xl border-1.5 border-[#140206]">
                      {appt.notes}
                    </div>
                  )}
                </div>
              </div>

              {appt.status === 'CONFIRMED' && (
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleCancel(appt.id)}
                    className="px-4 py-2 bg-[#ffb4c5] hover:bg-[#ff6183] text-[#140206] border-2 border-[#140206] rounded-full text-xs font-mono uppercase font-bold shadow-brutal-sm transition active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
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
