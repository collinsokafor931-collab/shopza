import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { CheckCircle2, ArrowRight, ShoppingBag, Truck } from 'lucide-react';

interface PaymentSuccessPageProps {
  confirmedOrder: any;
  navigate: (path: string) => void;
}

export const PaymentSuccessPage: React.FC<PaymentSuccessPageProps> = ({ confirmedOrder, navigate }) => {
  const { formatCurrency } = useMarketplace();

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center min-h-[70vh] flex flex-col items-center justify-center">
      <div className="w-16 h-16 rounded-full bg-[#00C896]/20 border border-[#00C896]/40 flex items-center justify-center text-[#00C896] mb-6 animate-in zoom-in-75 duration-300">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">
        Payment Confirmed!
      </h1>
      <p className="text-sm text-slate-400 mt-2 max-w-sm leading-relaxed">
        Your payment was authorized and safely placed in SHOPZA Escrow. The merchant has received notification to dispatch your parcel.
      </p>

      {/* Order Reference Box */}
      <div className="mt-8 w-full rounded-2xl bg-[#14141B] border border-white/10 p-6 text-left space-y-3">
        <div className="flex justify-between items-center text-xs pb-3 border-b border-white/5">
          <span className="text-slate-400">Order Number</span>
          <span className="font-mono-nums font-bold text-white">{confirmedOrder?.orderNumber || 'SHP-90823'}</span>
        </div>

        <div className="flex justify-between items-center text-xs pb-3 border-b border-white/5">
          <span className="text-slate-400">Total Paid</span>
          <span className="font-mono-nums font-bold text-[#00C896]">
            {formatCurrency(confirmedOrder?.total || 72000)}
          </span>
        </div>

        <div className="flex justify-between items-center text-xs pb-3 border-b border-white/5">
          <span className="text-slate-400">Payment Reference</span>
          <span className="font-mono-nums text-slate-300">{confirmedOrder?.paymentReference || 'TXN-SHP-88192'}</span>
        </div>

        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400">Fulfillment Method</span>
          <span className="text-slate-200">{confirmedOrder?.deliveryMethod || 'Express Lagos'}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full">
        <button
          onClick={() => navigate(confirmedOrder ? `/account/orders/${confirmedOrder.id}` : '/account/orders')}
          className="w-full sm:w-1/2 rounded-xl bg-[#5B35F5] py-3 text-xs font-bold text-white hover:bg-[#4d2ad4] shadow-lg shadow-[#5B35F5]/30 transition active:scale-95 cursor-pointer"
        >
          Track Order Details
        </button>
        <button
          onClick={() => navigate('/marketplace')}
          className="w-full sm:w-1/2 rounded-xl border border-white/15 bg-white/5 py-3 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 transition active:scale-95 cursor-pointer"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};
