'use client';

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AppLogo from '@/components/ui/AppLogo';
import {
  LayoutDashboard,
  ClipboardList,
  FileText,
  ChevronLeft,
  ChevronRight,
  Wifi,
  WifiOff,
  Settings,
  LogOut,
} from 'lucide-react';
import { getOrders } from '@/lib/orders';
import { useSettings } from '@/hooks/useSettings';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

interface SidebarProps {
  isOnline?: boolean;
}

export default function Sidebar({ isOnline = true }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const { settings } = useSettings();
  const location = useLocation();
  const pathname = location.pathname;

  const refreshPendingCount = async () => {
    const orders = await getOrders();
    const pending = orders.filter(o => o.status !== 'Delivered').length;
    setPendingCount(pending);
  };

  useEffect(() => {
    refreshPendingCount();
    const interval = setInterval(refreshPendingCount, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const navItems: NavItem[] = [
    { label: 'Orders Dashboard', href: '/order-dashboard', icon: LayoutDashboard, badge: pendingCount },
    { label: 'Order History', href: '/order-history', icon: ClipboardList },
    { label: 'Order Details', href: '/order-details', icon: FileText },
  ];

  return (
    <aside
      className={`
        relative flex flex-col h-full
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-16' : 'w-60'}
        shrink-0
      `}
      style={{
        background: 'rgba(10, 16, 35, 0.85)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(99, 102, 241, 0.12)',
      }}
    >
      {/* Logo */}
      <div
        className={`flex items-center gap-3 px-4 py-5 border-b border-white/5 ${collapsed ? 'justify-center px-2' : ''}`}
      >
        <div className="shrink-0">
          <AppLogo size={32} />
        </div>
        {!collapsed && (
          <span className="font-bold text-lg tracking-tight text-emerald-300 whitespace-nowrap overflow-hidden">
            {settings.storeName}
          </span>
        )}

      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="
          absolute -right-3 top-16 z-10
          w-6 h-6 rounded-full
          flex items-center justify-center
          bg-slate-800 border border-slate-700
          text-slate-400 hover:text-emerald-300
          transition-colors duration-150
          shadow-lg
        "
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Nav section */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {!collapsed && (
          <p className="px-3 mb-3 text-xs font-600 tracking-widest uppercase text-slate-500">
            Navigation
          </p>
        )}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`
                group relative flex items-center gap-3 px-3 py-2.5 rounded-xl
                transition-all duration-150
                ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                }
                ${collapsed ? 'justify-center' : ''}
              `}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                size={18}
                className={`shrink-0 transition-colors ${isActive ? 'text-emerald-300' : 'text-slate-500 group-hover:text-slate-300'}`}
              />
              {!collapsed && (
                <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
              )}
              {!collapsed && item.badge !== undefined && item.badge > 0 && (
                <span className="ml-auto text-xs font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 tabular">
                  {item.badge}
                </span>
              )}
              {collapsed && item.badge !== undefined && item.badge > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400" />
              )}
              {/* Tooltip for collapsed */}
              {collapsed && (
                <div
                  className="
                  absolute left-full ml-3 px-2.5 py-1.5 rounded-lg
                  bg-slate-800 border border-slate-700
                  text-xs text-slate-200 font-medium whitespace-nowrap
                  opacity-0 group-hover:opacity-100 pointer-events-none
                  transition-opacity duration-150 z-50
                  shadow-xl
                "
                >
                  {item.label}
                  {item.badge ? ` (${item.badge})` : ''}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-white/5 p-2 space-y-1">
        {/* Connection status */}
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-lg ${collapsed ? 'justify-center' : ''}`}
        >
          {isOnline ? (
            <Wifi size={14} className="text-emerald-400 shrink-0" />
          ) : (
            <WifiOff size={14} className="text-red-400 shrink-0" />
          )}
          {!collapsed && (
            <span
              className={`text-xs font-medium ${isOnline ? 'text-emerald-400' : 'text-red-400'}`}
            >
              {isOnline ? 'Live Connected' : 'Offline'}
            </span>
          )}
        </div>

        {/* Settings */}
        <Link
          to="/settings"
          className={`
          group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
          transition-all duration-150
          ${pathname === '/settings' 
            ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' 
            : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
          }
          ${collapsed ? 'justify-center' : ''}
        `}
        >
          <Settings size={18} className="shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Settings</span>}
        </Link>

        {/* User profile */}
        <div
          className={`flex items-center gap-3 px-3 py-3 mt-1 rounded-xl hover:bg-white/5 cursor-pointer transition-colors ${collapsed ? 'justify-center' : ''}`}
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-indigo-500 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-white">
              {settings.userName.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">{settings.userName}</p>
              <p className="text-xs text-slate-500 truncate">{settings.userRole}</p>
            </div>
          )}
          {!collapsed && (
            <LogOut size={14} className="text-slate-500 hover:text-red-400 shrink-0" />
          )}
        </div>
      </div>
    </aside>
  );
}
