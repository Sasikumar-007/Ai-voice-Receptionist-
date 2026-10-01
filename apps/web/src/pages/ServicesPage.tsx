import React, { useState, useEffect } from 'react';
import { apiRequest } from '../lib/api';
import { Service } from '@ai-receptionist/shared';
import { Wrench, Plus, CheckCircle2, Clock, Trash2, Tag } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(60);
  const [price, setPrice] = useState(149);

  const fetchServices = async () => {
    try {
      const data = await apiRequest<Service[]>('/services');
      setServices(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/services', {
        method: 'POST',
        body: JSON.stringify({
          name,
          description,
          duration_minutes: duration,
          price_cents: price * 100,
          is_booking_enabled: true
        })
      });
      setShowAdd(false);
      setName('');
      setDescription('');
      fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this service?')) return;
    try {
      await apiRequest(`/services/${id}`, { method: 'DELETE' });
      fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-normal tracking-tight text-[#140206] flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-[#140206] text-[#1bd944] flex items-center justify-center border-2 border-[#140206] shadow-brutal-sm">
              <Wrench className="w-5 h-5" />
            </span>
            Service Catalog & Rate Cards
          </h1>
          <p className="text-xs font-mono text-[#5e5850] mt-1">
            Standardized offerings Sarah quotes to callers and syncs with scheduling availability.
          </p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="px-5 py-2.5 bg-[#140206] hover:bg-[#1bd944] text-[#f5f3ef] hover:text-[#140206] rounded-full text-xs font-mono uppercase tracking-wider font-extrabold border-2 border-[#140206] shadow-brutal transition flex items-center gap-2 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          <Plus className="w-4 h-4" /> Provision Service
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleCreate} className="bg-white border-2 border-[#140206] p-6 rounded-3xl space-y-4 shadow-brutal-lg">
          <h3 className="font-serif text-xl font-normal text-[#140206]">Create New Service Offering</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase font-bold text-[#140206] mb-1">Service Title</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sump Pump Replacement"
                className="w-full px-3.5 py-2.5 bg-[#fbf8f1] border-2 border-[#140206] rounded-xl text-xs font-mono text-[#140206] focus:outline-none focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase font-bold text-[#140206] mb-1">Base Price ($ USD)</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-[#fbf8f1] border-2 border-[#140206] rounded-xl text-xs font-mono text-[#140206] focus:outline-none focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase font-bold text-[#140206] mb-1">Duration (Minutes)</label>
              <input
                type="number"
                required
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-[#fbf8f1] border-2 border-[#140206] rounded-xl text-xs font-mono text-[#140206] focus:outline-none focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase font-bold text-[#140206] mb-1">Customer-Facing Summary</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of service scope"
                className="w-full px-3.5 py-2.5 bg-[#fbf8f1] border-2 border-[#140206] rounded-xl text-xs font-mono text-[#140206] focus:outline-none focus:bg-white"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="px-4 py-2 bg-[#fbf8f1] text-[#140206] border-2 border-[#140206] rounded-full text-xs font-mono uppercase font-bold hover:bg-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#1bd944] text-[#140206] border-2 border-[#140206] rounded-full text-xs font-mono uppercase font-extrabold shadow-brutal-sm hover:bg-[#3bdb5d] transition"
            >
              Save Service Offering
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((srv) => (
          <div key={srv.id} className="bg-white border-2 border-[#140206] p-6 rounded-3xl flex flex-col justify-between shadow-brutal hover:shadow-brutal-lg transition">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-serif text-xl font-normal text-[#140206]">{srv.name}</h3>
                <span className="font-serif text-2xl font-normal text-[#140206]">${srv.price_cents / 100}</span>
              </div>
              <p className="text-xs font-sans text-[#5e5850] leading-relaxed mb-4">{srv.description}</p>
            </div>

            <div className="pt-4 border-t-2 border-[#140206]/10 flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="flex items-center gap-1 text-[#4b2c22] font-bold">
                  <Clock className="w-3.5 h-3.5 text-[#140206]" />
                  {srv.duration_minutes} mins
                </span>
                <span className="flex items-center gap-1 text-[#140206] bg-[#ade2d8] px-2.5 py-0.5 rounded-full border border-[#140206] font-bold">
                  <CheckCircle2 className="w-3 h-3" />
                  Active for AI Booking
                </span>
              </div>

              <button
                onClick={() => handleDelete(srv.id)}
                className="p-2 text-[#856f58] hover:text-[#ff6183] hover:bg-[#ffb4c5]/20 rounded-xl border border-transparent hover:border-[#140206] transition"
                title="Delete service"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
