import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import {
  ShieldCheck,
  TrendingUp,
  Users,
  Store,
  ShoppingBag,
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
  Settings,
  ChevronRight,
} from 'lucide-react';

interface AdminDashboardPageProps {
  navigate: (path: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ navigate }) => {
  const { products, stores, orders, reports, withdrawals, config, formatCurrency } = useMarketplace();

  const totalGMV = orders.reduce((acc, o) => acc + o.total, 0);
  const totalCommissionRevenue = orders.reduce((acc, o) => acc + (o.platformFee || 0), 0);
  const pendingReports = reports.filter((r) => r.status === 'pending');
  const pendingWithdrawals = withdrawals.filter((w) => w.status === 'pending');

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/8 gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              Platform Administration
            </h1>
            <span className="rounded-md bg-amber-400/15 px-2 py-0.5 text-xs font-bold text-amber-400">
              Ops Control
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Marketplace volume supervision, commission configuration, and Trust & Safety operations.
          </p>
        </div>

        <button
          onClick={() => navigate('/admin/settings')}
          className="flex items-center gap-2 rounded-xl bg-[#5B35F5] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#4d2ad4] transition cursor-pointer self-start sm:self-auto"
        >
          <Settings className="w-4 h-4" />
          <span>Platform Settings & Fees</span>
        </button>
      </div>

      {/* Global Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="rounded-2xl bg-[#14141B] border border-white/8 p-5">
          <span className="text-xs font-medium text-slate-400">Gross Marketplace Volume</span>
          <p className="font-mono-nums text-2xl font-bold text-white mt-1">
            {formatCurrency(totalGMV || 1420000)}
          </p>
          <span className="text-[11px] text-[#00C896] flex items-center gap-0.5 mt-1 font-medium">
            <ArrowUpRight className="w-3 h-3" />
            <span>+24.1% MoM</span>
          </span>
        </div>

        <div className="rounded-2xl bg-[#14141B] border border-white/8 p-5">
          <span className="text-xs font-medium text-slate-400">Commission Revenue</span>
          <p className="font-mono-nums text-2xl font-bold text-[#00C896] mt-1">
            {formatCurrency(totalCommissionRevenue || 42600)}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Rate configured at: <strong className="text-white">{config.commissionRatePercent}%</strong>
          </span>
        </div>

        <div className="rounded-2xl bg-[#14141B] border border-white/8 p-5">
          <span className="text-xs font-medium text-slate-400">Merchant Stores</span>
          <p className="font-mono-nums text-2xl font-bold text-white mt-1">{stores.length}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {stores.filter((s) => s.isVerified).length} verified sellers
          </span>
        </div>

        <div className="rounded-2xl bg-[#14141B] border border-white/8 p-5">
          <span className="text-xs font-medium text-slate-400">Active Listings</span>
          <p className="font-mono-nums text-2xl font-bold text-white mt-1">{products.length}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Auto-publishing: <strong className="text-[#00C896]">{config.autoApproveProducts ? 'ON' : 'OFF'}</strong>
          </span>
        </div>
      </div>

      {/* Moderation Alert Queues */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Pending Payout Requests */}
        <div className="rounded-3xl bg-[#14141B] border border-white/8 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#00C896]" />
              <h3 className="font-bold text-base text-white">Pending Withdrawals ({pendingWithdrawals.length})</h3>
            </div>
            <button
              onClick={() => navigate('/admin/moderation')}
              className="text-xs text-[#7C4DFF] hover:underline"
            >
              Review Queue
            </button>
          </div>

          {pendingWithdrawals.length > 0 ? (
            <div className="space-y-3">
              {pendingWithdrawals.map((w) => (
                <div key={w.id} className="p-3 rounded-2xl bg-[#1A1A24] border border-white/5 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-white">{w.sellerName} (@{w.storeName})</p>
                    <p className="text-[11px] text-slate-400">{w.bankName} · Acc: {w.accountNumber}</p>
                  </div>
                  <span className="font-mono-nums font-bold text-[#00C896]">{formatCurrency(w.amount)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-3 text-center">No pending withdrawal requests.</p>
          )}
        </div>

        {/* Flagged Item Reports */}
        <div className="rounded-3xl bg-[#14141B] border border-white/8 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-base text-white">Trust & Safety Reports ({pendingReports.length})</h3>
            </div>
            <button
              onClick={() => navigate('/admin/moderation')}
              className="text-xs text-[#7C4DFF] hover:underline"
            >
              Resolve Reports
            </button>
          </div>

          {pendingReports.length > 0 ? (
            <div className="space-y-3">
              {pendingReports.map((r) => (
                <div key={r.id} className="p-3 rounded-2xl bg-[#1A1A24] border border-white/5 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{r.targetTitle}</span>
                    <span className="text-[10px] uppercase font-bold text-rose-400">{r.reason}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{r.details}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-3 text-center">No open user flags or safety complaints.</p>
          )}
        </div>
      </div>
    </div>
  );
};
