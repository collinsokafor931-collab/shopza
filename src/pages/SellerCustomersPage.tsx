import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { Customer } from '../types';
import {
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  Tag,
  FileText,
  DollarSign,
  TrendingUp,
  UserCheck,
  X,
  CheckCircle2,
  Calendar,
  ArrowLeft,
} from 'lucide-react';

export const SellerCustomersPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { customers, addCustomer, formatCurrency, addToast, stores, currentUser } = useMarketplace();

  const userStore =
    stores.find(
      (s) =>
        (currentUser?.id && s.ownerId === currentUser.id) ||
        (currentUser?.storeUsername && s.username === currentUser.storeUsername)
    );

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New customer form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [tagInput, setTagInput] = useState('New');
  const [notes, setNotes] = useState('');

  const storeCustomers = customers.filter(
    (c) => Boolean(userStore?.id && c.storeId === userStore.id)
  );

  const filteredCustomers = storeCustomers.filter((c) => {
    if (!c) return false;
    if (selectedTag !== 'all' && !(c.tags || []).includes(selectedTag)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        (c.name || '').toLowerCase().includes(q) ||
        (c.email || '').toLowerCase().includes(q) ||
        (c.phone || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalSpendAll = storeCustomers.reduce((acc, c) => acc + c.totalSpend, 0);
  const avgLtv = storeCustomers.length > 0 ? Math.round(totalSpendAll / storeCustomers.length) : 0;
  const repeatCount = storeCustomers.filter((c) => c.totalOrders > 1).length;
  const repeatRate = storeCustomers.length > 0 ? Math.round((repeatCount / storeCustomers.length) * 100) : 0;

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      addToast('warning', 'Missing Details', 'Name and email are required.');
      return;
    }

    addCustomer({
      storeId: userStore?.id || 'store-default',
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      totalOrders: 0,
      totalSpend: 0,
      tags: tagInput.split(',').map((t) => t.trim()).filter(Boolean),
      notes: notes.trim() || undefined,
      lastOrderDate: new Date().toISOString(),
    });

    addToast('success', 'Customer Added', `${name} is now registered in your CRM directory.`);
    setIsAddModalOpen(false);
    setName('');
    setEmail('');
    setPhone('');
    setNotes('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={() => navigate('/seller/dashboard')}
              className="p-1 rounded-lg text-slate-400 hover:text-white transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Shopify Customers (CRM)
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Track customer relationship profiles, lifetime spending value, tags, and notes.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#5B35F5] hover:bg-[#4d2ad4] text-white font-bold text-xs shadow-lg shadow-[#5B35F5]/30 transition flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="rounded-3xl bg-[#14141B] border border-white/10 p-5 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Customers</span>
            <Users className="w-4 h-4 text-[#5B35F5]" />
          </div>
          <p className="text-2xl font-extrabold text-white font-mono-nums">{storeCustomers.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">Active registered directory</p>
        </div>

        <div className="rounded-3xl bg-[#14141B] border border-white/10 p-5 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Average LTV</span>
            <DollarSign className="w-4 h-4 text-[#00C896]" />
          </div>
          <p className="text-2xl font-extrabold text-[#00C896] font-mono-nums">{formatCurrency(avgLtv)}</p>
          <p className="text-[11px] text-slate-500 mt-1">Average lifetime customer spend</p>
        </div>

        <div className="rounded-3xl bg-[#14141B] border border-white/10 p-5 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Repeat Rate</span>
            <TrendingUp className="w-4 h-4 text-[#7C4DFF]" />
          </div>
          <p className="text-2xl font-extrabold text-white font-mono-nums">{repeatRate}%</p>
          <p className="text-[11px] text-slate-500 mt-1">{repeatCount} returning multi-order buyers</p>
        </div>
      </div>

      {/* Search & Tag Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or phone number..."
            className="w-full rounded-xl bg-[#14141B] border border-white/10 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#5B35F5]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['all', 'VIP', 'Repeat', 'Wholesale', 'New'].map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedTag === tag
                  ? 'bg-[#5B35F5] text-white shadow-md shadow-[#5B35F5]/30'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {tag === 'all' ? 'All Customers' : tag}
            </button>
          ))}
        </div>
      </div>

      {/* Customer Table / Grid */}
      <div className="rounded-3xl bg-[#14141B] border border-white/10 shadow-2xl overflow-hidden">
        <div className="divide-y divide-white/5">
          {filteredCustomers.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-xs">
              No customers match your current filter.
            </div>
          ) : (
            filteredCustomers.map((cust) => (
              <div
                key={cust.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition"
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#5B35F5]/30 to-[#7C4DFF]/20 border border-[#5B35F5]/30 flex items-center justify-center text-[#7C4DFF] font-bold text-sm shrink-0">
                    {cust.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-white text-sm">{cust.name}</h4>
                      <div className="flex items-center gap-1">
                        {cust.tags.map((t, idx) => (
                          <span
                            key={idx}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              t === 'VIP'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : t === 'Wholesale'
                                ? 'bg-[#00C896]/10 text-[#00C896] border border-[#00C896]/20'
                                : 'bg-white/5 text-slate-400 border border-white/10'
                            }`}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-slate-500" />
                        <span>{cust.email}</span>
                      </span>
                      {cust.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-500" />
                          <span>{cust.phone}</span>
                        </span>
                      )}
                    </div>

                    {cust.notes && (
                      <p className="text-[11px] text-slate-500 mt-1 italic flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        <span>"{cust.notes}"</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Metrics & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-white/5">
                  <div className="text-left sm:text-right">
                    <span className="text-[11px] text-slate-500 block">Orders</span>
                    <span className="font-mono-nums font-bold text-white text-xs">{cust.totalOrders}</span>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[11px] text-slate-500 block">Lifetime Spend</span>
                    <span className="font-mono-nums font-bold text-[#00C896] text-xs">
                      {formatCurrency(cust.totalSpend)}
                    </span>
                  </div>

                  <a
                    href={`mailto:${cust.email}`}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition"
                    title="Send Email"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Customer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl bg-[#14141B] border border-white/10 p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display text-xl font-bold text-white mb-1">Add Customer Record</h3>
            <p className="text-xs text-slate-400 mb-6">Create a new customer profile for offline sales and tracking.</p>

            <form onSubmit={handleCreateCustomer} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Babatunde Fashola"
                  required
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#5B35F5]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="client@gmail.com"
                  required
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#5B35F5]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+234 802 123 4567"
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#5B35F5]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="VIP, Repeat, Wholesale"
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#5B35F5]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Private Merchant Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Special delivery instructions or sizing preferences..."
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#5B35F5]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#5B35F5] hover:bg-[#4d2ad4] text-white font-bold text-xs shadow-lg shadow-[#5B35F5]/30 transition cursor-pointer mt-2"
              >
                Save Customer Profile
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
