import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { CreditCard, Building2, Smartphone, ShieldCheck, Lock, CheckCircle2, AlertCircle, RefreshCw, Copy, Check } from 'lucide-react';

interface PaymentPageProps {
  pendingCheckout: any;
  navigate: (path: string) => void;
  setConfirmedOrder: (order: any) => void;
}

export const PaymentPage: React.FC<PaymentPageProps> = ({
  pendingCheckout,
  navigate,
  setConfirmedOrder,
}) => {
  const { createOrder, formatCurrency, addToast } = useMarketplace();

  const [activeMethod, setActiveMethod] = useState<'card' | 'bank_transfer' | 'ussd'>(
    pendingCheckout?.paymentMethod || 'card'
  );

  // Card form state
  const [cardNumber, setCardNumber] = useState('5399 4120 8829 4102');
  const [cardExpiry, setCardExpiry] = useState('09/28');
  const [cardCvv, setCardCvv] = useState('819');
  const [cardPin, setCardPin] = useState('1234');

  // Virtual bank account for transfer simulation
  const [copiedAccount, setCopiedAccount] = useState(false);
  const virtualAccount = {
    bank: 'Wema Bank (SHOPZA Checkout)',
    accountNumber: '9082' + Math.floor(Math.random() * 900000 + 100000),
    accountName: 'SHOPZA ESCROW / ' + (pendingCheckout?.shippingAddress?.fullName || 'Tunde Balogun'),
  };

  // Processing state
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyStep, setVerifyStep] = useState('');

  if (!pendingCheckout) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-white">No pending payment session</h2>
        <button onClick={() => navigate('/cart')} className="mt-4 rounded-xl bg-[#5B35F5] px-4 py-2 text-xs font-semibold text-white">
          Return to Cart
        </button>
      </div>
    );
  }

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(virtualAccount.accountNumber);
    setCopiedAccount(true);
    addToast('Account Copied', 'Virtual account number copied to clipboard', 'info');
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const handleProcessPayment = (simulateFailure = false) => {
    setIsVerifying(true);
    setVerifyStep('Connecting to licensed payment gateway switch...');

    setTimeout(() => {
      setVerifyStep('Authorizing funds with bank switch...');
    }, 1000);

    setTimeout(() => {
      if (simulateFailure) {
        setIsVerifying(false);
        navigate('/payment/failed');
        return;
      }

      setVerifyStep('Payment verified. Creating authoritative escrow records...');
      setTimeout(() => {
        const order = createOrder({
          items: pendingCheckout.items,
          shippingAddress: pendingCheckout.shippingAddress,
          deliveryMethod: pendingCheckout.deliveryMethod,
          deliveryFee: pendingCheckout.deliveryFee,
          paymentMethod: activeMethod,
          discount: 0,
        });

        setIsVerifying(false);
        setConfirmedOrder(order);
        navigate('/payment/success');
      }, 1000);
    }, 2200);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#00C896]/10 px-3 py-1 text-xs font-semibold text-[#00C896] mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>256-bit Encrypted Escrow Gateway</span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Complete Your Payment
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Amount Payable: <strong className="text-white font-mono-nums text-base">{formatCurrency(pendingCheckout.total)}</strong>
        </p>
      </div>

      {/* Payment Container Card */}
      <div className="rounded-3xl bg-[#14141B] border border-white/10 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Verification Loading Overlay */}
        {isVerifying && (
          <div className="absolute inset-0 bg-[#14141B]/95 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
            <RefreshCw className="w-10 h-10 text-[#5B35F5] animate-spin mb-4" />
            <h3 className="font-bold text-lg text-white">Verifying Transaction</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">{verifyStep}</p>
            <div className="mt-4 flex items-center gap-2 text-[11px] text-[#00C896]">
              <Lock className="w-3 h-3" />
              <span>Bank 3-D Secure Authorization</span>
            </div>
          </div>
        )}

        {/* Method Switcher Tabs */}
        <div className="grid grid-cols-3 gap-2 mb-8 bg-[#1A1A24] p-1.5 rounded-2xl border border-white/5">
          <button
            type="button"
            onClick={() => setActiveMethod('card')}
            className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold transition cursor-pointer ${
              activeMethod === 'card' ? 'bg-[#5B35F5] text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Card</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMethod('bank_transfer')}
            className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold transition cursor-pointer ${
              activeMethod === 'bank_transfer' ? 'bg-[#5B35F5] text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Transfer</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMethod('ussd')}
            className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold transition cursor-pointer ${
              activeMethod === 'ussd' ? 'bg-[#5B35F5] text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>USSD</span>
          </button>
        </div>

        {/* 1. Debit Card Payment View */}
        {activeMethod === 'card' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Card Number</label>
              <div className="relative">
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full rounded-xl bg-[#1A1A24] border border-white/10 p-3 text-xs text-white font-mono-nums focus:outline-none"
                  placeholder="5399 0000 0000 0000"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] text-slate-400">
                  <CreditCard className="w-4 h-4 text-[#00C896]" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Expiry Date</label>
                <input
                  type="text"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  className="w-full rounded-xl bg-[#1A1A24] border border-white/10 p-3 text-xs text-white font-mono-nums focus:outline-none"
                  placeholder="MM/YY"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">CVV Security Code</label>
                <input
                  type="password"
                  maxLength={3}
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value)}
                  className="w-full rounded-xl bg-[#1A1A24] border border-white/10 p-3 text-xs text-white font-mono-nums focus:outline-none"
                  placeholder="•••"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={() => handleProcessPayment(false)}
                className="w-full rounded-xl bg-[#00C896] py-3.5 text-xs font-bold text-black hover:bg-[#05e2aa] shadow-lg shadow-[#00C896]/20 transition active:scale-95 cursor-pointer"
              >
                Pay {formatCurrency(pendingCheckout.total)} via Card
              </button>
            </div>
          </div>
        )}

        {/* 2. Bank Transfer Payment View */}
        {activeMethod === 'bank_transfer' && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-[#1A1A24] border border-white/10 p-5 text-center space-y-3">
              <p className="text-xs text-slate-400">
                Transfer exact amount to the temporary virtual account below:
              </p>

              <div className="my-2 p-3 bg-black/40 rounded-xl inline-block w-full">
                <span className="text-[11px] text-slate-500 uppercase tracking-wider block">Account Number</span>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="font-mono-nums text-2xl font-black text-white tracking-wider">
                    {virtualAccount.accountNumber}
                  </span>
                  <button
                    onClick={handleCopyAccount}
                    className="p-1 text-slate-400 hover:text-white cursor-pointer"
                    title="Copy"
                  >
                    {copiedAccount ? <Check className="w-4 h-4 text-[#00C896]" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="text-xs text-slate-300 space-y-1">
                <p><strong>Bank:</strong> {virtualAccount.bank}</p>
                <p><strong>Account Name:</strong> {virtualAccount.accountName}</p>
                <p><strong>Amount:</strong> <span className="font-mono-nums font-bold text-[#00C896]">{formatCurrency(pendingCheckout.total)}</span></p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleProcessPayment(false)}
              className="w-full rounded-xl bg-[#00C896] py-3.5 text-xs font-bold text-black hover:bg-[#05e2aa] shadow-lg shadow-[#00C896]/20 transition active:scale-95 cursor-pointer"
            >
              I Have Sent {formatCurrency(pendingCheckout.total)}
            </button>
          </div>
        )}

        {/* 3. USSD Payment View */}
        {activeMethod === 'ussd' && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-[#1A1A24] border border-white/10 p-5 text-center space-y-3">
              <p className="text-xs text-slate-400">
                Dial the USSD string on your registered mobile banking phone:
              </p>
              <div className="p-3 bg-black/40 rounded-xl">
                <span className="font-mono-nums text-xl font-bold text-[#00C896]">
                  *737*000*819#
                </span>
                <p className="text-[11px] text-slate-500 mt-1">Follow mobile prompts to approve payment of {formatCurrency(pendingCheckout.total)}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleProcessPayment(false)}
              className="w-full rounded-xl bg-[#00C896] py-3.5 text-xs font-bold text-black hover:bg-[#05e2aa] shadow-lg shadow-[#00C896]/20 transition active:scale-95 cursor-pointer"
            >
              Verify USSD Payment
            </button>
          </div>
        )}

        {/* Test simulation button to trigger failure state */}
        <div className="mt-8 pt-4 border-t border-white/8 flex items-center justify-between text-[11px] text-slate-500">
          <span>Testing & QA controls:</span>
          <button
            type="button"
            onClick={() => handleProcessPayment(true)}
            className="text-rose-400 hover:underline cursor-pointer"
          >
            Simulate Failed Transaction Flow
          </button>
        </div>
      </div>
    </div>
  );
};
