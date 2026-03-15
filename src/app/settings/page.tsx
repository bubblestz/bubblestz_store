'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { useSettings, StoreSettings } from '@/hooks/useSettings';
import { Save, Store, User, Phone, Mail, MapPin, ShieldCheck, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { settings, saveSettings } = useSettings();
  const [formData, setFormData] = useState<StoreSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 800));
    
    saveSettings(formData);
    toast.success('Settings saved successfully!');
    setIsSaving(false);
  };

  return (
    <AppLayout
      pageTitle="Settings"
      pageSubtitle="Configure your store and profile information"
    >
      <div className="max-w-4xl space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Store Details Section */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(10, 16, 35, 0.6)',
              border: '1px solid rgba(99, 102, 241, 0.15)',
              backdropFilter: 'blur(16px)',
            }}
          >
            <div className="px-5 py-4 border-b border-white/5 bg-white/5">
              <div className="flex items-center gap-2">
                <Store size={18} className="text-emerald-400" />
                <h3 className="text-sm font-semibold text-slate-100">Store Information</h3>
              </div>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400 ml-1">Store Name</label>
                <input
                  type="text"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-100 focus:outline-none focus:border-emerald-500/40 transition-all"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400 ml-1">Store Address</label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-100 focus:outline-none focus:border-emerald-500/40 transition-all"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* User Details Section */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(10, 16, 35, 0.6)',
              border: '1px solid rgba(99, 102, 241, 0.15)',
              backdropFilter: 'blur(16px)',
            }}
          >
            <div className="px-5 py-4 border-b border-white/5 bg-white/5">
              <div className="flex items-center gap-2">
                <User size={18} className="text-indigo-400" />
                <h3 className="text-sm font-semibold text-slate-100">Operator Profile</h3>
              </div>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400 ml-1">Full Name</label>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-100 focus:outline-none focus:border-emerald-500/40 transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400 ml-1">Role / Designation</label>
                <div className="relative">
                  <ShieldCheck size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    name="userRole"
                    value={formData.userRole}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-100 focus:outline-none focus:border-emerald-500/40 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400 ml-1">Phone Number</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-100 focus:outline-none focus:border-emerald-500/40 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400 ml-1">Email Address</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-100 focus:outline-none focus:border-emerald-500/40 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="
                flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm
                bg-emerald-500 text-emerald-950 hover:bg-emerald-400
                transition-all duration-200 active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed
                shadow-lg shadow-emerald-500/20
              "
            >
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
