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
  Bot
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
  { name: 'Voice Studio', to: '/dashboard/voice-studio', icon: Sparkles, badge: 'Live AI' },
  { name: 'Integrations', to: '/dashboard/integrations', icon: Layers },
  { name: 'Settings', to: '/dashboard/settings', icon: Settings },
  { name: 'Usage & Limits', to: '/dashboard/usage', icon: BarChart3 }
];

export const Sidebar: React.FC = () => {
  const { business } = useAuth();

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0 select-none z-30">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="font-bold text-white tracking-tight text-base block">AI Receptionist</span>
          <span className="text-xs text-brand-400 font-medium block">Enterprise SaaS</span>
        </div>
      </div>

      {/* Tenant Context Display */}
      <div className="px-4 py-3 mx-3 my-3 bg-slate-850 rounded-lg border border-slate-800/80">
        <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">Active Business</div>
        <div className="font-medium text-sm text-slate-100 truncate">{business?.name || 'SwiftFix Plumbing'}</div>
        <div className="text-xs text-slate-400 truncate">{business?.business_type || 'Plumbing & HVAC'}</div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-brand-600/20 text-brand-400 border border-brand-500/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`
            }
          >
            <item.icon className="w-4 h-4 shrink-0" />
            <span className="flex-1 truncate">{item.name}</span>
            {item.badge && (
              <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-full ${
                item.badge === 'Live AI'
                  ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-brand-500/20 text-brand-400'
              }`}>
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
        v1.0.0 • Multi-Tenant Protected
      </div>
    </aside>
  );
};
