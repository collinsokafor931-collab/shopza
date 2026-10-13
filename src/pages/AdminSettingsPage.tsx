import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { Percent, Shield, DollarSign, Plus, X, Save, CheckCircle2 } from 'lucide-react';

export const AdminSettingsPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { config, updateCommissionRate, setConfig, addToast, formatCurrency } = useMarketplace() as any;

  const [rate, setRate] = useState<number>(config.commissionRatePercent);
  const [minWithdrawal, setMinWithdrawal] = useState<number>(config.minWithdrawalAmount);
  const [autoApprove, setAutoApprove] = useState<boolean>(config.autoApproveProducts);
  const [keywords, setKeywords] = useState<string[]>(config.prohibitedKeywords || []);
  const [newKeyword, setNewKeyword] = useState('');

  const handleSaveCommission = (e: React.FormEvent) => {
    e.preventDefault();
    updateCommissionRate(Number(rate));
  };

  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim().toLowerCase())) {
      setKeywords([...keywords, newKeyword.trim().toLowerCase()]);
      setNewKeyword('');
      addToast('Rule Added', 'Prohibited keyword added to filter', 'info');
    }
  };

  const handleRemoveKeyword = (word: string) => {
    setKeywords(keywords.filter((k) => k !== word));
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="mb-8">
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
          Platform Governance & Commission Engine
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Configure marketplace commission percentages, automated moderation filters, and payout limits.
        </p>
      </div>

      <div className="space-y-8">
        {/* 1. Centralized Commission Configuration Engine (Requirement 0 & 25) */}
        <form onSubmit={handleSaveCommission} className="rounded-3xl bg-[#14141B] border border-white/8 p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 pb-4 border-b border-white/5">
            <Percent className="w-5 h-5 text-[#5B35F5]" />
            <div>
              <h3 className="font-bold text-base text-white">Marketplace Transaction Commission</h3>
              <p className="text-xs text-slate-400">Deducted from gross seller fulfillment proceeds upon escrow release.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Active Fee Rate ({rate}%)
              </label>
              <input
                type="range"
                min="0.5"
                max="10.0"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full accent-[#5B35F5] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-mono-nums">
                <span>0.5% (Promo)</span>
                <span>3.0% (Standard)</span>
                <span>10.0% (Max)</span>
              </div>
            </div>

            <div className="rounded-2xl bg-[#1A1A24] p-4 text-xs text-slate-300 space-y-2 border border-white/5">
              <span className="text-slate-400">Transaction Example:</span>
              <div className="flex justify-between">
                <span>Buyer Pays:</span>
                <span className="font-mono-nums font-bold text-white">₦100,000</span>
              </div>
              <div className="flex justify-between text-rose-400">
                <span>SHOPZA Fee ({rate}%):</span>
                <span className="font-mono-nums font-bold">-{formatCurrency(Math.round((100000 * rate) / 100))}</span>
              </div>
              <div className="flex justify-between text-[#00C896] pt-1 border-t border-white/5 font-semibold">
                <span>Seller Receives:</span>
                <span className="font-mono-nums">{formatCurrency(Math.round(100000 - (100000 * rate) / 100))}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="rounded-xl bg-[#5B35F5] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#4d2ad4] shadow-md transition cursor-pointer"
            >
              Update Commission Rate
            </button>
          </div>
        </form>

        {/* 2. Prohibited Goods & Policy Rules (Requirement 34) */}
        <div className="rounded-3xl bg-[#14141B] border border-white/8 p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 pb-4 border-b border-white/5">
            <Shield className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-base text-white">Prohibited Items Filter</h3>
              <p className="text-xs text-slate-400">Listings matching these prohibited patterns trigger automated moderation hold.</p>
            </div>
          </div>

          <form onSubmit={handleAddKeyword} className="flex gap-2">
            <input
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              placeholder="Add prohibited item keyword..."
              className="flex-1 rounded-xl bg-[#1A1A24] border border-white/10 px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/15 cursor-pointer"
            >
              Add Rule
            </button>
          </form>

          <div className="flex flex-wrap gap-2 pt-2">
            {keywords.map((word) => (
              <span
                key={word}
                className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 px-3 py-1 text-xs text-rose-300"
              >
                <span>{word}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveKeyword(word)}
                  className="hover:text-white cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
