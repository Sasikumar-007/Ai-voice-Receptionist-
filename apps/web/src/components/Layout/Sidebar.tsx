import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  PhoneCall,
  MessageSquare,
  UserCheck,
  Wrench,
  BookOpen,
  Sparkles,
  Layers,
  Settings,
  BarChart3,
  Cpu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavItem {
  name: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { name: 'Leads', to: '/dashboard/leads', icon: Users, badge: 'New' },
  { name: 'Appointments', to: '/dashboard/appointments', icon: Calendar },
  { name: 'Calls', to: '/dashboard/calls', icon: PhoneCall },
  { name: 'Conversations', to: '/dashboard/conversations', icon: MessageSquare },
  { name: 'Customers', to: '/dashboard/customers', icon: UserCheck },
  { name: 'Services', to: '/dashboard/services', icon: Wrench },
  { name: 'Knowledge Base', to: '/dashboard/knowledge', icon: BookOpen },
  { name: 'Voice Studio', to: '/dashboard/voice-studio', icon: Sparkles, badge: '3D AI' },
  { name: 'Integrations', to: '/dashboard/integrations', icon: Layers },
  { name: 'Settings', to: '/dashboard/settings', icon: Settings },
  { name: 'Usage & Limits', to: '/dashboard/usage', icon: BarChart3 }
];

export const Sidebar: React.FC = () => {
  const { business } = useAuth();

  return (
    <aside className="w-64 bg-[#ffffff] border-r-2 border-[#140206] flex flex-col h-screen sticky top-0 select-none z-30">
      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 border-b-2 border-[#140206] gap-3 bg-[#f5f3ef]">
        <div className="w-10 h-10 rounded-full bg-[#140206] flex items-center justify-center border-2 border-[#140206] shadow-brutal-sm">
          <Cpu className="w-5 h-5 text-[#1bd944]" />
        </div>
        <div>
          <span className="font-serif italic font-bold text-xl text-[#140206] tracking-tight block">
            Tavus Voice
          </span>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#856f58] font-bold block">
            HUMAN COMPUTING
          </span>
        </div>
      </div>

      {/* Tenant Context Display */}
      <div className="px-4 py-3 mx-3 my-3 bg-[#fbf8f1] rounded-2xl border-2 border-[#140206] shadow-brutal-sm">
        <div className="text-[10px] font-mono uppercase tracking-widest text-[#856f58] font-bold mb-1">Active Business</div>
        <div className="font-serif font-bold text-sm text-[#140206] truncate">{business?.name || 'SwiftFix Plumbing'}</div>
        <div className="text-[11px] font-mono text-[#5e5850] truncate">{business?.business_type || 'Plumbing & HVAC'}</div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider font-bold transition-all ${
                isActive
                  ? 'bg-[#1bd944] text-[#140206] border-2 border-[#140206] shadow-brutal-sm'
                  : 'text-[#4b2c22] hover:bg-[#eae5de] hover:text-[#140206]'
              }`
            }
          >
            <item.icon className="w-4 h-4 shrink-0" />
            <span className="flex-1 truncate">{item.name}</span>
            {item.badge && (
              <span className={`text-[10px] font-mono uppercase font-extrabold px-2 py-0.5 rounded-full border border-[#140206] ${
                item.badge === '3D AI'
                  ? 'bg-[#ffb4c5] text-[#140206]'
                  : 'bg-[#fed7ff] text-[#140206]'
              }`}>
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t-2 border-[#140206] bg-[#f5f3ef] text-[11px] font-mono text-[#5e5850] text-center font-semibold">
        TAVUS_OS_v18 • Multi-Tenant
      </div>
    </aside>
  );
};
