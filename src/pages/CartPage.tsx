import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

interface CartPageProps {
  navigate: (path: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ navigate }) => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    formatCurrency,
    config,
    appliedCoupon,
    couponDiscount,
    applyCoupon,
    removeCoupon,
  } = useMarketplace();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  const subtotal = cart.reduce((acc, curr) => acc + curr.product.price * curr.quantity, 0);
  const estimatedDelivery = cart.length > 0 ? 3500 : 0;
  const platformFee = Math.round((subtotal * config.commissionRatePercent) / 100);
  const total = Math.max(0, subtotal + estimatedDelivery - couponDiscount);

  // Group items by seller/store
  const groupedByStore = cart.reduce((acc, item) => {
    const sName = item.product.storeUsername || 'independent-seller';
    if (!acc[sName]) acc[sName] = [];
    acc[sName].push(item);
    return acc;
  }, {} as Record<string, typeof cart>);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponCode.trim()) return;
    const ok = applyCoupon(couponCode);
    if (!ok) {
      setCouponError('Invalid or expired discount code. Try "WELCOME10", "FREESHIP", or "SHOPZA5".');
    } else {
      setCouponCode('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-display text-2xl font-bold text-white tracking-tight">Your shopping bag is empty</h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-sm">
          Discover unique products from verified merchants and creators across Nigeria.
        </p>
        <button
          onClick={() => navigate('/marketplace')}
          className="mt-6 rounded-xl bg-[#5B35F5] px-6 py-3 text-xs font-semibold text-white hover:bg-[#4d2ad4] transition cursor-pointer"
        >
          Explore Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">
          Shopping Bag
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Review your items before proceeding to secure escrow checkout.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Cart Items grouped by seller (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {Object.entries(groupedByStore).map(([storeName, items]) => (
            <div
              key={storeName}
              className="rounded-3xl bg-[#14141B] border border-white/8 p-6 shadow-sm overflow-hidden"
            >
              {/* Seller Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/8">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Store:</span>
                  <button
                    onClick={() => navigate(`/store/${storeName}`)}
                    className="font-bold text-sm text-white hover:text-[#7C4DFF] transition cursor-pointer"
                  >
                    @{storeName}
                  </button>
                </div>
                <span className="text-[11px] text-slate-500 font-mono-nums">{items.length} item(s)</span>
              </div>

              {/* Items in store */}
              <div className="divide-y divide-white/5">
                {items.map((item) => (
                  <div key={item.productId} className="py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    {/* Thumbnail & Title */}
                    <div className="flex items-center gap-4">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title}
                        referrerPolicy="no-referrer"
                        className="h-20 w-20 rounded-2xl object-cover bg-[#1A1A24] ring-1 ring-white/10 shrink-0 cursor-pointer"
                        onClick={() => navigate(`/product/${item.product.id}`)}
                      />
                      <div>
                        <h4
                          onClick={() => navigate(`/product/${item.product.id}`)}
                          className="font-semibold text-sm text-white hover:text-[#7C4DFF] transition cursor-pointer line-clamp-2 max-w-sm"
                        >
                          {item.product.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">{item.product.condition}</p>
                        <p className="font-mono-nums text-sm font-bold text-white mt-1">
                          {formatCurrency(item.product.price)}
                        </p>
                      </div>
                    </div>

                    {/* Quantity controls & Remove */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                      <div className="flex items-center gap-3 rounded-xl bg-[#1A1A24] border border-white/10 p-1">
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                          className="p-1 text-slate-400 hover:text-white cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-mono-nums text-xs font-bold text-white px-2">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                          className="p-1 text-slate-400 hover:text-white cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="font-mono-nums text-sm font-bold text-white hidden sm:block">
                        {formatCurrency(item.product.price * item.quantity)}
                      </span>

                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-slate-500 hover:text-rose-400 transition p-1 cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
            <button
              onClick={() => navigate('/marketplace')}
              className="text-[#7C4DFF] hover:underline"
            >
              ← Continue Shopping
            </button>
            <button
              onClick={clearCart}
              className="text-rose-400 hover:underline"
            >
              Clear Entire Bag
            </button>
          </div>
        </div>

        {/* Right Column: Order Summary & Coupon (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-3xl bg-[#14141B] border border-white/8 p-6 shadow-xl space-y-5">
            <h3 className="font-bold text-base text-white">Order Summary</h3>

            {/* Coupon Code input */}
            <form onSubmit={handleApplyCoupon} className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">Discount Code</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. SHOPZA5"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 rounded-xl bg-[#1A1A24] border border-white/10 px-3 py-2 text-xs text-white uppercase placeholder-slate-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-white/10 px-3.5 py-2 text-xs font-semibold text-white hover:bg-white/15 transition cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {couponDiscount > 0 && (
                <div className="flex items-center justify-between text-[11px] text-[#00C896] font-medium mt-1">
                  <span>✓ {appliedCoupon} applied: -{formatCurrency(couponDiscount)}</span>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-slate-400 hover:text-rose-400 underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}
              {couponError && (
                <p className="text-[11px] text-rose-400 mt-1">{couponError}</p>
              )}
            </form>

            {/* Summary calculation rows */}
            <dl className="space-y-2.5 pt-4 border-t border-white/8 text-xs">
              <div className="flex justify-between text-slate-300">
                <dt>Subtotal</dt>
                <dd className="font-mono-nums font-semibold text-white">{formatCurrency(subtotal)}</dd>
              </div>

              <div className="flex justify-between text-slate-300">
                <dt>Estimated Delivery</dt>
                <dd className="font-mono-nums font-semibold text-white">{formatCurrency(estimatedDelivery)}</dd>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-[#00C896]">
                  <dt>Promo Discount ({appliedCoupon})</dt>
                  <dd className="font-mono-nums font-semibold">-{formatCurrency(couponDiscount)}</dd>
                </div>
              )}

              <div className="flex justify-between text-slate-400 text-[11px] pt-1">
                <dt>Seller Platform Commission ({config.commissionRatePercent}%)</dt>
                <dd className="font-mono-nums">Included in seller gross</dd>
              </div>

              <div className="flex justify-between pt-4 border-t border-white/8 text-sm font-bold text-white">
                <dt>Total Amount</dt>
                <dd className="font-mono-nums text-lg text-white">{formatCurrency(total)}</dd>
              </div>
            </dl>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#5B35F5] py-3.5 text-xs font-bold text-white hover:bg-[#4d2ad4] shadow-lg shadow-[#5B35F5]/30 transition active:scale-95 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="rounded-xl bg-[#1A1A24] p-3 text-[11px] text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#00C896] shrink-0" />
              <span>SHOPZA Escrow protects your money until delivery confirmation.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
