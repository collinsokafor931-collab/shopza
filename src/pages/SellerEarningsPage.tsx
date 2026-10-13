import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { DollarSign, ArrowDownToLine, Clock, CheckCircle2, Building2, AlertCircle, X } from 'lucide-react';

export const SellerEarningsPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { orders, currentUser, config, withdrawals, requestWithdrawal, formatCurrency, stores } = useMarketplace();

  const userStore = stores.find((s) => s.ownerId === currentUser?.id || s.username === currentUser?.storeUsername);
  const myOrders = orders.filter((o) => currentUser?.id ? o.sellerIds.includes(currentUser.id) : false);
  const myWithdrawals = withdrawals.filter((w) => currentUser?.id ? w.sellerId === currentUser.id : false);

  const grossSales = myOrders.reduce((acc, o) => acc + o.subtotal, 0);
  const platformFee = Math.round((grossSales * config.commissionRatePercent) / 100);
  const netEarnings = grossSales - platformFee;

  const availableBalance = Math.round(netEarnings * 0.7);
  const pendingBalance = Math.round(netEarnings * 0.3);

  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number | ''>(availableBalance > 0 ? availableBalance : 50000);
  const [bankName, setBankName] = useState(userStore?.bankDetails?.bankName || 'Access Bank PLC');
  const [accountNumber, setAccountNumber] = useState(userStore?.bankDetails?.accountNumber || '0123456789');
  const [accountName, setAccountName] = useState(userStore?.bankDetails?.accountName || currentUser?.name || 'Verified Merchant');

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawAmount) return;
    const success = requestWithdrawal(Number(withdrawAmount), { bankName, accountNumber, accountName });
    if (success) {
      setPayoutModalOpen(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/8 gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
            Earnings & Settlements
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Transparent commission reporting and automated bank withdrawal requests.
          </p>
        </div>

        <button
          onClick={() => setPayoutModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-[#00C896] px-5 py-2.5 text-xs font-bold text-black hover:bg-[#05e2aa] shadow-lg shadow-[#00C896]/20 transition active:scale-95 cursor-pointer self-start sm:self-auto"
        >
          <ArrowDownToLine className="w-4 h-4" />
          <span>Request Payout</span>
        </button>
      </div>

      {/* Balance Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="rounded-3xl bg-[#14141B] border border-white/8 p-6 shadow-xl">
          <span className="text-xs font-medium text-slate-400">Available for Payout</span>
          <p className="font-mono-nums text-3xl font-extrabold text-white mt-1">
            {formatCurrency(availableBalance)}
          </p>
          <p className="text-[11px] text-[#00C896] mt-2 flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Ready for instant bank settlement</span>
          </p>
        </div>

        <div className="rounded-3xl bg-[#14141B] border border-white/8 p-6 shadow-xl">
          <span className="text-xs font-medium text-slate-400">Pending in Escrow</span>
          <p className="font-mono-nums text-3xl font-extrabold text-amber-400 mt-1">
            {formatCurrency(pendingBalance)}
          </p>
          <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Releases upon parcel delivery confirmation</span>
          </p>
        </div>

        <div className="rounded-3xl bg-[#14141B] border border-white/8 p-6 shadow-xl">
          <span className="text-xs font-medium text-slate-400">Configured Platform Fee</span>
          <p className="font-mono-nums text-3xl font-extrabold text-[#7C4DFF] mt-1">
            {config.commissionRatePercent}%
          </p>
          <p className="text-[11px] text-slate-400 mt-2">
            Total Commission Paid: <strong className="font-mono-nums text-white">{formatCurrency(platformFee)}</strong>
          </p>
        </div>
      </div>

      {/* Transparent Financial Calculation Explainer */}
      <div className="rounded-3xl bg-[#14141B] border border-white/8 p-6 sm:p-8 mb-8 shadow-xl">
        <h3 className="font-bold text-base text-white mb-4">Marketplace Fee Transparency</h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-[#1A1A24] border border-white/5">
            <span className="text-slate-400">Total Gross Merchandise</span>
            <p className="font-mono-nums text-lg font-bold text-white mt-1">{formatCurrency(grossSales)}</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#1A1A24] border border-white/5">
            <span className="text-slate-400">SHOPZA Fee ({config.commissionRatePercent}%)</span>
            <p className="font-mono-nums text-lg font-bold text-rose-400 mt-1">-{formatCurrency(platformFee)}</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#1A1A24] border border-white/5">
            <span className="text-slate-400">Payment Gateway Charge</span>
            <p className="font-mono-nums text-lg font-bold text-slate-300 mt-1">₦0 (Covered)</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#1A1A24] border border-[#00C896]/20 bg-[#00C896]/5">
            <span className="text-slate-300 font-semibold">Net Seller Earnings</span>
            <p className="font-mono-nums text-lg font-bold text-[#00C896] mt-1">{formatCurrency(netEarnings)}</p>
          </div>
        </div>
      </div>

      {/* Withdrawals History */}
      <div className="rounded-3xl bg-[#14141B] border border-white/8 p-6 shadow-xl">
        <h3 className="font-bold text-base text-white mb-4">Payout History</h3>

        {myWithdrawals.length > 0 ? (
          <div className="divide-y divide-white/5">
            {myWithdrawals.map((w) => (
              <div key={w.id} className="py-3.5 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono-nums font-bold text-white">{formatCurrency(w.amount)}</span>
                    <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold capitalize ${
                      w.status === 'processed' ? 'bg-[#00C896]/10 text-[#00C896]' : 'bg-amber-400/10 text-amber-400'
                    }`}>
                      {w.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {w.bankName} · Acc: {w.accountNumber} ({w.accountName})
                  </p>
                </div>
                <span className="font-mono-nums text-[11px] text-slate-500">
                  {new Date(w.requestedAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 py-4 text-center">No previous payouts requested.</p>
        )}
      </div>

      {/* Withdrawal Modal */}
      {payoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#14141B] border border-white/10 p-6 shadow-2xl text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="font-bold text-sm text-white">Request Settlement Payout</h3>
              <button onClick={() => setPayoutModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Withdrawal Amount (₦)</label>
                <input
                  type="number"
                  min={config.minWithdrawalAmount}
                  max={availableBalance || 500000}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value ? Number(e.target.value) : '')}
                  className="w-full rounded-xl bg-[#1A1A24] border border-white/10 p-2.5 text-xs text-white font-mono-nums focus:outline-none"
                  required
                />
                <p className="text-[10px] text-slate-500 mt-1">Minimum payout: {formatCurrency(config.minWithdrawalAmount)}</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Bank Name</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full rounded-xl bg-[#1A1A24] border border-white/10 p-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Account Number</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full rounded-xl bg-[#1A1A24] border border-white/10 p-2 text-xs text-white font-mono-nums focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Account Name</label>
                <input
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="w-full rounded-xl bg-[#1A1A24] border border-white/10 p-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPayoutModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#00C896] px-5 py-2 text-xs font-bold text-black hover:bg-[#05e2aa]"
                >
                  Submit Payout Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
