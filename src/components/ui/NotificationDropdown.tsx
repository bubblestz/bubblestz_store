'use client';

import { useState, useRef, useEffect } from 'react';
import { useNotifications, Notification } from '@/hooks/useNotifications';
import { formatRelativeTime } from '@/lib/mockData';
import { Bell, X, Check, Trash2, Info, CheckCircle2, AlertTriangle, AlertCircle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return <CheckCircle2 size={14} className="text-emerald-400" />;
      case 'warning': return <AlertTriangle size={14} className="text-amber-400" />;
      case 'error': return <AlertCircle size={14} className="text-red-400" />;
      default: return <Info size={14} className="text-blue-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative w-8 h-8 rounded-lg flex items-center justify-center 
          transition-all duration-150
          ${isOpen ? 'bg-white/10 text-slate-100' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}
        `}
      >
        <Bell size={17} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 border-2 border-[#080e1c] pulse-dot" />
        )}
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl overflow-hidden z-50 slide-up"
          style={{
            background: 'rgba(10, 18, 38, 0.98)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 48px rgba(0,0,0,0.5)',
          }}
        >
          {/* Header */}
          <div className="px-4 py-3.5 border-b border-white/5 flex items-center justify-between bg-white/5">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-100">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  {unreadCount} NEW
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => markAllAsRead()}
                className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
                title="Mark all as read"
              >
                <Check size={14} />
              </button>
              <button 
                onClick={() => clearAll()}
                className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                title="Clear all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-[400px] overflow-y-auto scrollbar-none">
            {notifications.length === 0 ? (
              <div className="py-12 px-4 text-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-800/50 flex items-center justify-center mx-auto mb-3">
                  <Bell size={20} className="text-slate-600" />
                </div>
                <p className="text-slate-400 text-sm font-medium">All caught up!</p>
                <p className="text-slate-600 text-xs mt-1">No new notifications at the moment.</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {notifications.map((n) => (
                  <div 
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className={`
                      group relative px-4 py-3.5 flex gap-3 cursor-pointer transition-colors
                      ${n.isRead ? 'opacity-60 hover:bg-white/[0.02]' : 'bg-indigo-500/[0.03] hover:bg-indigo-500/[0.06]'}
                    `}
                  >
                    {!n.isRead && (
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-emerald-500" />
                    )}
                    
                    <div className="mt-0.5 shrink-0">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        n.type === 'success' ? 'bg-emerald-500/10' : 
                        n.type === 'warning' ? 'bg-amber-500/10' : 
                        n.type === 'error' ? 'bg-red-500/10' : 'bg-blue-500/10'
                      }`}>
                        {getIcon(n.type)}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-0.5">
                        <p className={`text-xs font-bold truncate ${n.isRead ? 'text-slate-300' : 'text-slate-100'}`}>
                          {n.title}
                        </p>
                        <span className="text-[10px] text-slate-500 whitespace-nowrap tabular">
                          {formatRelativeTime(n.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {n.description}
                      </p>
                      
                      {n.link && (
                        <Link 
                          to={n.link}
                          onClick={() => setIsOpen(false)}
                          className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                          View Details
                          <ExternalLink size={10} />
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2 border-t border-white/5 bg-white/[0.02]">
              <p className="text-[10px] text-center text-slate-600 font-medium uppercase tracking-widest">
                Showing last 50 notifications
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
