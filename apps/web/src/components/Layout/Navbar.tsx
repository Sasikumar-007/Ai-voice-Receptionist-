import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Bell, Sparkles, Phone, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { user, business, role, logout } = useAuth();

  return (
    <header className="h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-8 sticky top-0 z-20">
      {/* Left: Business Name & Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Agent Active</span>
        </div>
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-800/80 rounded-full border border-slate-700/60 text-xs text-slate-300">
          <Phone className="w-3.5 h-3.5 text-brand-400" />
          <span>{business?.phone || '+1 (555) 019-2831'}</span>
        </div>
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded text-[11px] font-medium text-amber-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          Demo Mode (SwiftFix Plumbing)
        </div>
      </div>

      {/* Right: Actions & User Menu */}
      <div className="flex items-center gap-4">
        <Link
          to="/dashboard/voice-studio"
          className="flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-brand-500/20 transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Test AI Voice</span>
        </Link>

        {/* User Card */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center font-bold text-xs text-slate-200 uppercase">
            {user?.full_name ? user.full_name.charAt(0) : 'U'}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-medium text-slate-200">{user?.full_name || 'Business Owner'}</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{role || 'OWNER'}</div>
          </div>

          <button
            onClick={logout}
            title="Log out"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
