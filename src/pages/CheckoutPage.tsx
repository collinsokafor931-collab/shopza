import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { ShieldCheck, Truck, CreditCard, Building2, Smartphone, ChevronRight, Lock } from 'lucide-react';

interface CheckoutPageProps {
  navigate: (path: string) => void;
  setPendingCheckout: (data: any) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ navigate, setPendingCheckout }) => {
  const { cart, currentUser, formatCurrency, config } = useMarketplace();

  // Form states
  const [fullName, setFullName] = useState(currentUser?.name || 'Tunde Balogun');
  const [phone, setPhone] = useState(currentUser?.phone || '+234 803 123 4567');
  const [email, setEmail] = useState(currentUser?.email || 'tunde.balogun@example.com');
  const [addressLine, setAddressLine] = useState('Plot 14, Admiralty Way, Lekki Phase 1');
  const [city, setCity] = useState('Lagos');
  const [state, setState] = useState('Lagos');
  const [deliveryMethod, setDeliveryMethod] = useState<'express' | 'standard' | 'pickup'>('express');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank_transfer' | 'ussd'>('card');
  const [termsAccepted, setTermsAccepted] = useState(true);

  const subtotal = cart.reduce((acc, curr) => acc + curr.product.price * curr.quantity, 0);
  const deliveryFee = deliveryMethod === 'express' ? 4500 : deliveryMethod === 'standard' ? 2500 : 0;
  const platformFee = Math.round((subtotal * config.commissionRatePercent) / 100);
  const total = subtotal + deliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) return;

    const payload = {
      items: cart,
      shippingAddress: {
        fullName,
        phone,
        addressLine1: addressLine,
        city,
        state,
      },
      deliveryMethod: deliveryMethod === 'express' ? 'Express Lagos (Same Day)' : deliveryMethod === 'standard' ? 'Standard Courier (2-3 Days)' : 'Store Pickup',
      deliveryFee,
      paymentMethod,
      subtotal,
      platformFee,
      total,
    };

    setPendingCheckout(payload);
    navigate('/payment');
  };

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-white">Your bag is empty</h2>
        <button onClick={() => navigate('/marketplace')} className="mt-4 rounded-xl bg-[#5B35F5] px-4 py-2 text-xs font-semibold text-white">
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">
          Checkout & Fulfillment
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Complete your delivery destination and select your verified payment method.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Form Fields (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* 1. Recipient & Delivery Address */}
          <div className="rounded-3xl bg-[#14141B] border border-white/8 p-6 space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#00C896]" />
              <span>1. Delivery Destination</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl bg-[#1A1A24] border border-white/10 p-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl bg-[#1A1A24] border border-white/10 p-2.5 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Street Address *</label>
              <input
                type="text"
                required
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                placeholder="Apartment, house number, street name"
                className="w-full rounded-xl bg-[#1A1A24] border border-white/10 p-2.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">City / Town *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-xl bg-[#1A1A24] border border-white/10 p-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">State in Nigeria *</label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full rounded-xl bg-[#1A1A24] border border-white/10 p-2.5 text-xs text-white focus:outline-none"
                >
                  <option value="Lagos">Lagos</option>
                  <option value="Abuja (FCT)">Abuja (FCT)</option>
                  <option value="Rivers">Rivers</option>
                  <option value="Oyo">Oyo</option>
                  <option value="Kano">Kano</option>
                  <option value="Enugu">Enugu</option>
                  <option value="Ogun">Ogun</option>
                </select>
              </div>
            </div>
          </div>

          {/* 2. Delivery Options */}
          <div className="rounded-3xl bg-[#14141B] border border-white/8 p-6 space-y-4">
            <h3 className="font-bold text-base text-white">2. Courier Delivery Speed</h3>

            <div className="space-y-3">
              <label
                onClick={() => setDeliveryMethod('express')}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition cursor-pointer ${
                  deliveryMethod === 'express' ? 'border-[#5B35F5] bg-[#5B35F5]/10 text-white' : 'border-white/10 bg-[#1A1A24] text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    checked={deliveryMethod === 'express'}
                    onChange={() => setDeliveryMethod('express')}
                    className="text-[#5B35F5]"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">Express Same-Day Dispatch</h4>
                    <p className="text-[11px] text-slate-400">Insured express delivery within 24 hours</p>
                  </div>
                </div>
                <span className="font-mono-nums text-xs font-bold text-white">{formatCurrency(4500)}</span>
              </label>

              <label
                onClick={() => setDeliveryMethod('standard')}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition cursor-pointer ${
                  deliveryMethod === 'standard' ? 'border-[#5B35F5] bg-[#5B35F5]/10 text-white' : 'border-white/10 bg-[#1A1A24] text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    checked={deliveryMethod === 'standard'}
                    onChange={() => setDeliveryMethod('standard')}
                    className="text-[#5B35F5]"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">Standard Courier Dispatch</h4>
                    <p className="text-[11px] text-slate-400">Delivered within 2–3 business days</p>
                  </div>
                </div>
                <span className="font-mono-nums text-xs font-bold text-white">{formatCurrency(2500)}</span>
              </label>

              <label
                onClick={() => setDeliveryMethod('pickup')}
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition cursor-pointer ${
                  deliveryMethod === 'pickup' ? 'border-[#5B35F5] bg-[#5B35F5]/10 text-white' : 'border-white/10 bg-[#1A1A24] text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    checked={deliveryMethod === 'pickup'}
                    onChange={() => setDeliveryMethod('pickup')}
                    className="text-[#5B35F5]"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">Store Hub Pickup</h4>
                    <p className="text-[11px] text-slate-400">Collect in-person directly from merchant hub</p>
                  </div>
                </div>
                <span className="font-mono-nums text-xs font-bold text-[#00C896]">FREE</span>
              </label>
            </div>
          </div>

          {/* 3. Payment Method Choice */}
          <div className="rounded-3xl bg-[#14141B] border border-white/8 p-6 space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#7C4DFF]" />
              <span>3. Payment Gateway Method</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label
                onClick={() => setPaymentMethod('card')}
                className={`flex flex-col items-start p-3.5 rounded-2xl border transition cursor-pointer ${
                  paymentMethod === 'card' ? 'border-[#00C896] bg-[#00C896]/10 text-white' : 'border-white/10 bg-[#1A1A24] text-slate-400'
                }`}
              >
                <CreditCard className="w-5 h-5 mb-2 text-[#00C896]" />
                <span className="text-xs font-bold text-white">Debit / Credit Card</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Mastercard, Visa, Verve</span>
              </label>

              <label
                onClick={() => setPaymentMethod('bank_transfer')}
                className={`flex flex-col items-start p-3.5 rounded-2xl border transition cursor-pointer ${
                  paymentMethod === 'bank_transfer' ? 'border-[#00C896] bg-[#00C896]/10 text-white' : 'border-white/10 bg-[#1A1A24] text-slate-400'
                }`}
              >
                <Building2 className="w-5 h-5 mb-2 text-blue-400" />
                <span className="text-xs font-bold text-white">Bank Transfer</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Instant Virtual Account</span>
              </label>

              <label
                onClick={() => setPaymentMethod('ussd')}
                className={`flex flex-col items-start p-3.5 rounded-2xl border transition cursor-pointer ${
                  paymentMethod === 'ussd' ? 'border-[#00C896] bg-[#00C896]/10 text-white' : 'border-white/10 bg-[#1A1A24] text-slate-400'
                }`}
              >
                <Smartphone className="w-5 h-5 mb-2 text-amber-400" />
                <span className="text-xs font-bold text-white">USSD Mobile</span>
                <span className="text-[10px] text-slate-400 mt-0.5">GTB, Zenith, Access, UBA</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Review & Submit (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl bg-[#14141B] border border-white/8 p-6 shadow-xl space-y-5">
            <h3 className="font-bold text-base text-white">Order Summary</h3>

            {/* Items Mini List */}
            <div className="divide-y divide-white/5 max-h-56 overflow-y-auto pr-1">
              {cart.map((i) => (
                <div key={i.productId} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 truncate max-w-[70%]">
                    <img src={i.product.images[0]} alt={i.product.title} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                    <div className="truncate">
                      <p className="font-medium text-white truncate">{i.product.title}</p>
                      <p className="text-[10px] text-slate-400">Qty: {i.quantity} · @{i.product.storeUsername}</p>
                    </div>
                  </div>
                  <span className="font-mono-nums font-semibold text-white">
                    {formatCurrency(i.product.price * i.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <dl className="space-y-2 pt-4 border-t border-white/8 text-xs">
              <div className="flex justify-between text-slate-300">
                <dt>Subtotal</dt>
                <dd className="font-mono-nums font-semibold text-white">{formatCurrency(subtotal)}</dd>
              </div>

              <div className="flex justify-between text-slate-300">
                <dt>Delivery Fee</dt>
                <dd className="font-mono-nums font-semibold text-white">{formatCurrency(deliveryFee)}</dd>
              </div>

              <div className="flex justify-between text-slate-400 text-[11px] pt-1">
                <dt>Marketplace Commission ({config.commissionRatePercent}%)</dt>
                <dd className="font-mono-nums">{formatCurrency(platformFee)} (deducted from seller payout)</dd>
              </div>

              <div className="flex justify-between pt-4 border-t border-white/8 text-sm font-bold text-white">
                <dt>Total to Pay</dt>
                <dd className="font-mono-nums text-xl text-[#00C896]">{formatCurrency(total)}</dd>
              </div>
            </dl>

            <label className="flex items-start gap-2 text-[11px] text-slate-400 cursor-pointer pt-2">
              <input
                type="checkbox"
                required
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 rounded border-white/20 text-[#5B35F5]"
              />
              <span>I accept SHOPZA Terms of Service and Escrow Purchase Protection Guidelines.</span>
            </label>

            <button
              type="submit"
              disabled={!termsAccepted}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#5B35F5] py-3.5 text-xs font-bold text-white hover:bg-[#4d2ad4] shadow-lg shadow-[#5B35F5]/30 transition active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <span>Continue to Secure Payment</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
