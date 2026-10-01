import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../lib/api';
import { Cpu, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await apiRequest<any>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          full_name: fullName,
          business_name: businessName,
          email,
          password,
          phone
        })
      });
      login(res.token, res.user, res.business, res.role);
      navigate('/onboarding');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3eee7] flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-[#140206]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#140206] flex items-center justify-center border-2 border-[#140206] shadow-brutal-sm">
            <Cpu className="w-5 h-5 text-[#1bd944]" />
          </div>
          <span className="font-serif italic text-2xl font-bold text-[#140206] tracking-tight">Tavus Voice</span>
        </Link>
        <h2 className="font-serif text-3xl font-normal text-[#140206]">Create your enterprise tenant</h2>
        <p className="mt-2 text-xs font-mono text-[#5e5850]">
          Already provisioned?{' '}
          <Link to="/login" className="font-bold underline text-[#140206] hover:text-[#1bd944]">
            Sign in to console
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 border-2 border-[#140206] rounded-3xl shadow-brutal-lg sm:px-10">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-[#ffb4c5]/40 border-2 border-[#140206] text-xs font-mono font-bold text-[#140206]">
              {error}
            </div>
          )}

          <form className="space-y-4 font-sans" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-mono uppercase font-bold text-[#140206] mb-1">Your Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="David Miller"
                className="w-full px-3.5 py-2.5 bg-[#fbf8f1] border-2 border-[#140206] rounded-xl text-xs text-[#140206] focus:outline-none focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase font-bold text-[#140206] mb-1">Business / Brand Name</label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="SwiftFix Plumbing & HVAC"
                className="w-full px-3.5 py-2.5 bg-[#fbf8f1] border-2 border-[#140206] rounded-xl text-xs text-[#140206] focus:outline-none focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase font-bold text-[#140206] mb-1">Business Phone Line</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 234-5678"
                className="w-full px-3.5 py-2.5 bg-[#fbf8f1] border-2 border-[#140206] rounded-xl text-xs text-[#140206] focus:outline-none focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase font-bold text-[#140206] mb-1">Work Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="david@swiftfix.com"
                className="w-full px-3.5 py-2.5 bg-[#fbf8f1] border-2 border-[#140206] rounded-xl text-xs text-[#140206] focus:outline-none focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase font-bold text-[#140206] mb-1">Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full px-3.5 py-2.5 bg-[#fbf8f1] border-2 border-[#140206] rounded-xl text-xs text-[#140206] focus:outline-none focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#140206] text-[#f5f3ef] hover:bg-[#1bd944] hover:text-[#140206] rounded-full text-xs font-mono uppercase tracking-wider font-extrabold border-2 border-[#140206] shadow-brutal transition mt-2 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-2"
            >
              {loading ? 'Creating Account...' : (
                <>
                  <span>Continue to 8-Step Setup</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
