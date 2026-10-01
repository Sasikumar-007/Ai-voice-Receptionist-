import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../lib/api';
import { Cpu, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginAsDemo } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await apiRequest<any>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      login(res.token, res.user, res.business, res.role);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = async () => {
    setLoading(true);
    try {
      await loginAsDemo();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
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
        <h2 className="font-serif text-3xl font-normal text-[#140206]">Access your voice console</h2>
        <p className="mt-2 text-xs font-mono text-[#5e5850]">
          Or{' '}
          <Link to="/register" className="font-bold underline text-[#140206] hover:text-[#1bd944]">
            register a new enterprise tenant
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 border-2 border-[#140206] rounded-3xl shadow-brutal-lg sm:px-10">
          {/* Quick 1-Click Demo Login Banner */}
          <div className="mb-6 p-4 rounded-2xl bg-[#fbf8f1] border-2 border-[#140206] shadow-brutal-sm text-center">
            <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-[#fd7f00] mb-1">
              <ShieldCheck className="w-4 h-4" />
              EVALUATION ACCESS
            </div>
            <p className="text-xs font-sans text-[#4b2c22] mb-3">
              One-click evaluation using seed data for <strong>SwiftFix Plumbing</strong>.
            </p>
            <button
              type="button"
              onClick={handleDemoClick}
              disabled={loading}
              className="w-full py-2.5 bg-[#1bd944] hover:bg-[#3bdb5d] text-[#140206] rounded-full text-xs font-mono uppercase tracking-wider font-extrabold border-2 border-[#140206] shadow-brutal-sm transition flex items-center justify-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              <Sparkles className="w-3.5 h-3.5" />
              1-Click SwiftFix Demo Login
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t-2 border-[#140206]" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 font-mono text-[#856f58] font-bold">Or credentials</span></div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-[#ffb4c5]/40 border-2 border-[#140206] text-xs font-mono font-bold text-[#140206]">
              {error}
            </div>
          )}

          <form className="space-y-4 font-sans" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-mono uppercase font-bold text-[#140206] mb-1">Account Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@swiftfixplumbing.com"
                className="w-full px-3.5 py-2.5 bg-[#fbf8f1] border-2 border-[#140206] rounded-xl text-xs text-[#140206] focus:outline-none focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase font-bold text-[#140206] mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-[#fbf8f1] border-2 border-[#140206] rounded-xl text-xs text-[#140206] focus:outline-none focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#140206] text-[#f5f3ef] hover:bg-[#1bd944] hover:text-[#140206] rounded-full text-xs font-mono uppercase tracking-wider font-extrabold border-2 border-[#140206] shadow-brutal transition mt-2 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              {loading ? 'Authenticating...' : 'Sign In To Console'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
