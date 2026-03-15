'use client';

import { useState, useEffect } from 'react';
import Sidebars from './Sidebars';
import { Menu, X } from 'lucide-react';
import NotificationDropdown from './ui/NotificationDropdown';
import { useSettings } from '@/hooks/useSettings';

interface AppLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  pageSubtitle?: string;
  headerActions?: React.ReactNode;
}

export default function AppLayout({
  children,
  pageTitle,
  pageSubtitle,
  headerActions,
}: AppLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
<div className="hidden lg:flex lg:shrink-0">
        <Sidebars isOnline={isOnline} />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
<div className="absolute left-0 top-0 bottom-0 w-64 z-10">
            <Sidebars isOnline={isOnline} />
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header
          className="shrink-0 flex items-center gap-4 px-4 lg:px-6 py-3 border-b"
          style={{
            background: 'rgba(8, 14, 28, 0.8)',
            backdropFilter: 'blur(16px)',
            borderColor: 'rgba(99, 102, 241, 0.1)',
          }}
        >
          {/* Mobile menu */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Menu size={20} />
          </button>

          {/* Page title */}
          <div className="flex-1 min-w-0">
            {pageTitle && (
              <div>
                <h1 className="text-base font-semibold text-slate-100 truncate">{pageTitle}</h1>
                {pageSubtitle && <p className="text-xs text-slate-500 truncate">{pageSubtitle}</p>}
              </div>
            )}
          </div>

          {/* Header actions */}
          <div className="flex items-center gap-2">
            {headerActions}

            <NotificationDropdown />

            {/* Connection indicator */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
              style={{
                background: isOnline ? 'rgba(110, 231, 183, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                border: `1px solid ${isOnline ? 'rgba(110, 231, 183, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                color: isOnline ? 'rgb(110, 231, 183)' : 'rgb(248, 113, 113)',
              }}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-400 pulse-dot' : 'bg-red-400'}`}
              />
              <span className="hidden sm:inline">{isOnline ? 'Live' : 'Offline'}</span>
            </div>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-screen-2xl mx-auto px-4 lg:px-6 xl:px-8 2xl:px-10 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
