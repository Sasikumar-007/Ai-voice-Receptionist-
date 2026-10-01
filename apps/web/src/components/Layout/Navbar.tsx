import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Phone, ShieldCheck, Sparkles, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { user, business, role, logout } = useAuth();

  return (
    <header className="h-20 bg-[#ffffff] border-b-2 border-[#140206] flex items-center justify-between px-8 sticky top-0 z-20">
      {/* Left: Business Name & Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#f5f3ef] border-2 border-[#140206] rounded-full text-xs font-mono font-bold shadow-brutal-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1bd944] animate-ping"></span>
          <span className="uppercase text-[#140206]">VOICE AGENT ACTIVE</span>
        </div>
        <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 bg-[#fbf8f1] rounded-full border-2 border-[#140206] text-xs font-mono text-[#140206]">
          <Phone className="w-3.5 h-3.5 text-[#ff6183]" />
          <span>{business?.phone || '+1 (555) 019-2831'}</span>
        </div>
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-[#fff5e3] border-2 border-[#140206] rounded-full text-[11px] font-mono font-bold text-[#fd7f00]">
          <ShieldCheck className="w-3.5 h-3.5" />
          SWIFTFIX PLUMBING DEMO
        </div>
      </div>

      {/* Right: Actions & User Menu */}
      <div className="flex items-center gap-4">
        <Link
          to="/dashboard/voice-studio"
          className="flex items-center gap-2 px-4 py-2 bg-[#1bd944] hover:bg-[#3bdb5d] text-[#140206] rounded-full text-xs font-mono uppercase tracking-wider font-extrabold border-2 border-[#140206] shadow-brutal transition active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>3D Voice Studio</span>
        </Link>

        {/* User Card */}
        <div className="flex items-center gap-3 pl-4 border-l-2 border-[#140206]">
          <div className="w-9 h-9 rounded-full bg-[#140206] text-[#f5f3ef] border-2 border-[#140206] flex items-center justify-center font-mono font-bold text-xs uppercase shadow-brutal-sm">
            {user?.full_name ? user.full_name.charAt(0) : 'U'}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-[#140206]">{user?.full_name || 'David Miller'}</div>
            <div className="text-[10px] font-mono text-[#856f58] uppercase font-bold">{role || 'OWNER'}</div>
          </div>

          <button
            onClick={logout}
            title="Log out"
            className="p-2 text-[#140206] hover:bg-[#ffb4c5] border-2 border-transparent hover:border-[#140206] rounded-xl transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
