import React, { useState, useEffect } from 'react';
import { apiRequest } from '../lib/api';
import { Customer } from '@ai-receptionist/shared';
import { UserCheck, Phone, Mail, MapPin, Search } from 'lucide-react';

export const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiRequest<Customer[]>('/customers');
        setCustomers(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-normal tracking-tight text-[#140206] flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-[#140206] text-[#1bd944] flex items-center justify-center border-2 border-[#140206] shadow-brutal-sm">
              <UserCheck className="w-5 h-5" />
            </span>
            Client Directory
          </h1>
          <p className="text-xs font-mono text-[#5e5850] mt-1">
            Profiles of repeat callers and clients captured autonomously by voice agents.
          </p>
        </div>
      </div>

      <div className="bg-white border-2 border-[#140206] p-2 rounded-2xl max-w-sm shadow-brutal-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-[#856f58] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search clients by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#fbf8f1] border border-[#140206]/20 rounded-xl text-xs font-mono text-[#140206] placeholder-[#856f58] focus:outline-none focus:bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((cust) => (
          <div key={cust.id} className="bg-white border-2 border-[#140206] rounded-3xl p-6 shadow-brutal hover:shadow-brutal-lg transition">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full bg-[#140206] text-[#1bd944] border-2 border-[#140206] shadow-brutal-sm flex items-center justify-center font-serif text-lg font-bold">
                {cust.name.charAt(0)}
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#ffda95] text-[#140206] border-2 border-[#140206] shadow-brutal-sm">
                {cust.total_calls} Calls
              </span>
            </div>

            <h3 className="font-serif text-xl font-normal text-[#140206]">{cust.name}</h3>

            <div className="mt-4 space-y-2.5 text-xs font-mono text-[#4b2c22]">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#140206]" />
                <span>{cust.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#140206]" />
                <span>{cust.email || 'No email registered'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#140206]" />
                <span>{cust.address || 'Springfield, OR'}</span>
              </div>
            </div>

            {cust.notes && (
              <div className="mt-4 p-3 bg-[#fbf8f1] rounded-2xl border-2 border-[#140206] text-xs font-sans text-[#5e5850]">
                {cust.notes}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
