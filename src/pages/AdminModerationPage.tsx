import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { ShieldAlert, DollarSign, CheckCircle2, XCircle, AlertTriangle, Users } from 'lucide-react';

export const AdminModerationPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { reports, withdrawals, stores, resolveReport, approveWithdrawal, formatCurrency } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'reports' | 'payouts'>('reports');

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="mb-8">
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
          Trust, Safety & Payout Queues
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Review community reports, verify seller complaints, and approve automated bank settlements.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
            activeTab === 'reports' ? 'bg-[#5B35F5] text-white shadow-md' : 'bg-white/5 text-slate-400 hover:text-white'
          }`}
        >
          Flagged Reports ({reports.length})
        </button>

        <button
          onClick={() => setActiveTab('payouts')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
            activeTab === 'payouts' ? 'bg-[#5B35F5] text-white shadow-md' : 'bg-white/5 text-slate-400 hover:text-white'
          }`}
        >
          Withdrawal Requests ({withdrawals.length})
        </button>
      </div>

      {activeTab === 'reports' && (
        <div className="space-y-4">
          {reports.map((r) => (
            <div key={r.id} className="rounded-2xl bg-[#14141B] border border-white/8 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white">{r.targetTitle}</h4>
                  <span className="text-[11px] text-slate-400">
                    Reported by {r.reporterName} · Reason: <strong className="text-rose-400 uppercase">{r.reason}</strong>
                  </span>
                </div>
                <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                  r.status === 'resolved' ? 'bg-[#00C896]/10 text-[#00C896]' : 'bg-amber-400/10 text-amber-400'
                }`}>
                  {r.status}
                </span>
              </div>

              <p className="text-xs text-slate-300 bg-[#1A1A24] p-3 rounded-xl border border-white/5">
                "{r.details}"
              </p>

              {r.status === 'pending' ? (
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => resolveReport(r.id, 'Listing removed and seller notified.')}
                    className="rounded-xl bg-rose-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-rose-700"
                  >
                    Take Action & Remove
                  </button>
                  <button
                    onClick={() => resolveReport(r.id, 'Report reviewed and determined to be compliant.')}
                    className="rounded-xl bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white"
                  >
                    Dismiss Flag
                  </button>
                </div>
              ) : (
                <p className="text-[11px] text-[#00C896]">Action taken: {r.adminActionTaken}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'payouts' && (
        <div className="space-y-4">
          {withdrawals.map((w) => (
            <div key={w.id} className="rounded-2xl bg-[#14141B] border border-white/8 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono-nums font-bold text-base text-white">{formatCurrency(w.amount)}</span>
                  <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                    w.status === 'processed' ? 'bg-[#00C896]/10 text-[#00C896]' : 'bg-amber-400/10 text-amber-400'
                  }`}>
                    {w.status}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Merchant: <strong className="text-white">{w.sellerName}</strong> (@{w.storeName})
                </p>
                <p className="text-[11px] text-slate-400">
                  {w.bankName} · Acc: {w.accountNumber} ({w.accountName})
                </p>
              </div>

              {w.status === 'pending' && (
                <button
                  onClick={() => approveWithdrawal(w.id)}
                  className="rounded-xl bg-[#00C896] px-4 py-2 text-xs font-bold text-black hover:bg-[#05e2aa] shadow-md cursor-pointer"
                >
                  Approve & Release Funds
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
