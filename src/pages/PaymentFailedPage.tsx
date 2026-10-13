import React from 'react';
import { XCircle, RefreshCw, ShoppingBag, ArrowLeft } from 'lucide-react';

interface PaymentFailedPageProps {
  navigate: (path: string) => void;
}

export const PaymentFailedPage: React.FC<PaymentFailedPageProps> = ({ navigate }) => {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center min-h-[70vh] flex flex-col items-center justify-center">
      <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-500 mb-6 animate-in zoom-in-75 duration-300">
        <XCircle className="w-10 h-10" />
      </div>

      <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
        Payment Unsuccessful
      </h1>
      <p className="text-sm text-slate-400 mt-2 max-w-sm leading-relaxed">
        Your card issuer or banking switch declined authorization for this transaction. No funds were deducted from your account.
      </p>

      <div className="mt-8 rounded-2xl bg-[#14141B] border border-white/8 p-5 text-left text-xs text-slate-300 space-y-2 w-full">
        <h4 className="font-semibold text-white">Suggested troubleshooting steps:</h4>
        <ul className="list-disc pl-4 space-y-1 text-slate-400 text-[11px]">
          <li>Confirm that your card is authorized for online transactions in Nigeria.</li>
          <li>Check that you have sufficient funds in your bank account.</li>
          <li>Try selecting <strong>Bank Transfer</strong> or <strong>USSD</strong> as an alternate gateway.</li>
        </ul>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full">
        <button
          onClick={() => navigate('/payment')}
          className="w-full sm:w-1/2 flex items-center justify-center gap-2 rounded-xl bg-[#5B35F5] py-3 text-xs font-bold text-white hover:bg-[#4d2ad4] shadow-lg shadow-[#5B35F5]/30 transition active:scale-95 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>

        <button
          onClick={() => navigate('/cart')}
          className="w-full sm:w-1/2 flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 py-3 text-xs font-bold text-slate-300 hover:text-white hover:bg-white/10 transition active:scale-95 cursor-pointer"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Return to Bag</span>
        </button>
      </div>
    </div>
  );
};
