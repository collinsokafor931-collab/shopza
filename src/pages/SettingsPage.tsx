import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { User, Bell, Lock, Shield, Building2, Save } from 'lucide-react';

export const SettingsPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { currentUser, setCurrentUser, addToast } = useMarketplace();

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [location, setLocation] = useState(currentUser?.location || '');

  const [notifOrders, setNotifOrders] = useState(true);
  const [notifMessages, setNotifMessages] = useState(true);
  const [notifPromos, setNotifPromos] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setCurrentUser({
      ...currentUser,
      name,
      email,
      phone,
      location,
    });
    addToast('Profile Saved', 'Your account settings were updated successfully', 'success');
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">
          Account Settings
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your personal identity, contact details, and notification preferences.
        </p>
      </div>

      <div className="space-y-8">
        {/* Profile Card */}
        <form onSubmit={handleSave} className="rounded-3xl bg-[#14141B] border border-white/8 p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 pb-4 border-b border-white/5">
            <User className="w-5 h-5 text-[#5B35F5]" />
            <h3 className="font-bold text-base text-white">Personal Information</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl bg-[#1A1A24] border border-white/10 p-2.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl bg-[#1A1A24] border border-white/10 p-2.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl bg-[#1A1A24] border border-white/10 p-2.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Location / State</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-xl bg-[#1A1A24] border border-white/10 p-2.5 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-[#5B35F5] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#4d2ad4] shadow-md transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>

        {/* Notifications Preference */}
        <div className="rounded-3xl bg-[#14141B] border border-white/8 p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center gap-3 pb-4 border-b border-white/5">
            <Bell className="w-5 h-5 text-[#00C896]" />
            <h3 className="font-bold text-base text-white">Notifications Channels</h3>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-[#1A1A24] border border-white/5 cursor-pointer">
              <div>
                <p className="font-semibold text-white">Order Status Updates</p>
                <p className="text-slate-400 text-[11px]">Receive in-app & courier dispatch alerts</p>
              </div>
              <input
                type="checkbox"
                checked={notifOrders}
                onChange={(e) => setNotifOrders(e.target.checked)}
                className="rounded border-white/20 text-[#5B35F5]"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-[#1A1A24] border border-white/5 cursor-pointer">
              <div>
                <p className="font-semibold text-white">Merchant Inquiries & Messages</p>
                <p className="text-slate-400 text-[11px]">Direct messages from sellers and buyers</p>
              </div>
              <input
                type="checkbox"
                checked={notifMessages}
                onChange={(e) => setNotifMessages(e.target.checked)}
                className="rounded border-white/20 text-[#5B35F5]"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-[#1A1A24] border border-white/5 cursor-pointer">
              <div>
                <p className="font-semibold text-white">Promotions & Trending Drops</p>
                <p className="text-slate-400 text-[11px]">Weekly curated newsletter & special offers</p>
              </div>
              <input
                type="checkbox"
                checked={notifPromos}
                onChange={(e) => setNotifPromos(e.target.checked)}
                className="rounded border-white/20 text-[#5B35F5]"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
