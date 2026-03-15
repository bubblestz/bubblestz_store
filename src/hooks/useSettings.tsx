'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface StoreSettings {
  storeName: string;
  userName: string;
  userRole: string;
  address: string;
  phone: string;
  email: string;
}

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'Bubbletz-store',
  userName: 'James Rivera',
  userRole: 'Operator',
  address: '123 Main St, Manila',
  phone: '0912-345-6789',
  email: 'james@bubbletz.com',
};

interface SettingsContextType {
  settings: StoreSettings;
  saveSettings: (newSettings: StoreSettings) => void;
}

const Ctx = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const saved = localStorage.getItem('store_settings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse settings', e);
      }
    }
  }, []);

  const saveSettings = (newSettings: StoreSettings) => {
    setSettings(newSettings);
    localStorage.setItem('store_settings', JSON.stringify(newSettings));
  };

  const providerValue = {
    settings,
    saveSettings
  };

  const Provider = Ctx.Provider;

  return (
    <Provider value={providerValue}>
      {children}
    </Provider>
  );
}

export function useSettings() {
  const context = useContext(Ctx);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
