import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import {
  Tag,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Percent,
  Plus,
  Trash2,
  X,
  Truck,
  DollarSign,
  ShieldCheck,
  Calendar,
  ArrowLeft,
} from 'lucide-react';

export const SellerPromotionsPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const {
    products,
    currentUser,
    stores,
    discounts,
    createDiscount,
    toggleDiscountStatus,
    deleteDiscount,
    promoteProduct,
    formatCurrency,
    addToast,
  } = useMarketplace();

  const userStore =
    stores.find(
      (s) =>
        (currentUser?.id && s.ownerId === currentUser.id) ||
        (currentUser?.storeUsername && s.username === currentUser.storeUsername)
    );
  const myProducts = products.filter(
    (p) =>
      (userStore?.username && p.storeUsername === userStore.username) ||
      (currentUser?.id && p.sellerId === currentUser.id)
  );

  const [activeTab, setActiveTab] = useState<'discounts' | 'boost'>('discounts');
  const [isAddDiscountModalOpen, setIsAddDiscountModalOpen] = useState(false);

  // New discount state
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percentage' | 'fixed_amount' | 'free_shipping'>('percentage');
  const [value, setValue] = useState<number>(10);
  const [minOrderValue, setMinOrderValue] = useState<number>(15000);
  const [usageLimit, setUsageLimit] = useState<number>(100);

  // Listing boost state
  const [selectedProductId, setSelectedProductId] = useState(myProducts[0]?.id || '');
  const [selectedTier, setSelectedTier] = useState<number>(3);

  const tiers = [
    { days: 1, cost: 3500, estViews: '1,500 – 3,000 views', label: '24-Hour Flash Boost' },
    { days: 3, cost: 8500, estViews: '5,000 – 10,000 views', label: '3-Day Featured Placement' },
    { days: 7, cost: 16000, estViews: '15,000 – 25,000 views', label: '7-Day Prime Placement' },
  ];

  const currentTier = tiers.find((t) => t.days === selectedTier) || tiers[1];

  const handleCreateDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      addToast('warning', 'Missing Code', 'Please enter a promotional code.');
      return;
    }

    createDiscount({
      code: code.trim().toUpperCase(),
      type,
      value: Number(value),
      minOrderValue: Number(minOrderValue) || 0,
      usageLimit: Number(usageLimit) || 100,
      active: true,
      storeId: userStore?.id || 'store-promos',
    });

    setIsAddDiscountModalOpen(false);
    setCode('');
    setValue(10);
  };

  const handlePromote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) return;
    promoteProduct(selectedProductId, currentTier.days, currentTier.cost);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4 mb-8">
        <div>
          <button
            onClick={() => navigate('/seller/dashboard')}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#7C4DFF]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Shopify Promotions & Growth</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Discounts & Marketing Engine
          </h1>
        </div>

        {/* Tab switch */}
        <div className="flex items-center bg-white/5 rounded-2xl p-1 border border-white/10">
          <button
            onClick={() => setActiveTab('discounts')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'discounts' ? 'bg-[#5B35F5] text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Coupons & Discounts</span>
          </button>
          <button
            onClick={() => setActiveTab('boost')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'boost' ? 'bg-[#5B35F5] text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Featured Boosts</span>
          </button>
        </div>
      </div>

      {/* DISCOUNTS TAB */}
      {activeTab === 'discounts' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Active Promotional Codes</h2>
              <p className="text-xs text-slate-400">Buyers can enter these codes at cart checkout for automatic deductions.</p>
            </div>
            <button
              onClick={() => setIsAddDiscountModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#00C896] hover:bg-[#00b084] text-slate-950 font-bold text-xs shadow-lg shadow-[#00C896]/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Discount Code</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {discounts.map((disc) => (
              <div
                key={disc.id}
                className="rounded-3xl bg-[#14141B] border border-white/10 p-5 shadow-xl flex flex-col justify-between hover:border-white/20 transition relative"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono font-black text-sm tracking-widest px-3 py-1 rounded-xl bg-[#5B35F5]/20 text-[#7C4DFF] border border-[#5B35F5]/30">
                      {disc.code}
                    </span>
                    <button
                      onClick={() => toggleDiscountStatus(disc.id)}
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-md cursor-pointer ${
                        disc.active
                          ? 'bg-[#00C896]/20 text-[#00C896]'
                          : 'bg-white/10 text-slate-500'
                      }`}
                    >
                      {disc.active ? 'Active' : 'Paused'}
                    </button>
                  </div>

                  <p className="text-sm font-bold text-white mb-1">
                    {disc.type === 'percentage'
                      ? `${disc.value}% OFF Entire Order`
                      : disc.type === 'fixed_amount'
                      ? `${formatCurrency(disc.value)} Discount`
                      : 'Free Shipping Waiver'}
                  </p>

                  <div className="text-xs text-slate-400 space-y-1 mt-2">
                    {disc.minOrderValue ? (
                      <p>Min. Spend: {formatCurrency(disc.minOrderValue)}</p>
                    ) : (
                      <p>No minimum spend required</p>
                    )}
                    <p className="font-mono-nums text-[11px]">
                      Used: {disc.usedCount} / {disc.usageLimit || '∞'} redemptions
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-500">Shopify Engine</span>
                  <button
                    onClick={() => deleteDiscount(disc.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BOOST TAB */}
      {activeTab === 'boost' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-7 rounded-3xl bg-[#14141B] border border-white/8 p-6 sm:p-8 space-y-6 shadow-xl">
            <form onSubmit={handlePromote} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Select Item to Boost</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full rounded-xl bg-[#1A1A24] border border-white/10 p-3 text-xs text-white focus:outline-none"
                >
                  {myProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({formatCurrency(p.price)}) {p.isPromoted ? '— [Currently Boosted]' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Promotion Duration Tier</label>
                <div className="space-y-2.5">
                  {tiers.map((tier) => (
                    <div
                      key={tier.days}
                      onClick={() => setSelectedTier(tier.days)}
                      className={`p-4 rounded-2xl border cursor-pointer transition ${
                        selectedTier === tier.days
                          ? 'border-[#5B35F5] bg-[#5B35F5]/10 shadow-lg shadow-[#5B35F5]/10'
                          : 'border-white/8 bg-white/5 hover:border-white/15'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white text-xs">{tier.label}</span>
                        <span className="font-bold text-white text-xs font-mono-nums">{formatCurrency(tier.cost)}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">Est. Reach: {tier.estViews}</p>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#5B35F5] to-[#7C4DFF] hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-[#5B35F5]/30 transition cursor-pointer"
              >
                Launch Sponsored Boost ({formatCurrency(currentTier.cost)})
              </button>
            </form>
          </div>

          <div className="md:col-span-5 rounded-3xl bg-[#14141B] border border-white/8 p-6 sm:p-8 space-y-4 shadow-xl text-xs text-slate-300">
            <h3 className="font-bold text-white text-sm">Sponsored Placement Benefits</h3>
            <ul className="space-y-3 text-slate-400">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00C896] shrink-0 mt-0.5" />
                <span>Featured on homepage carousel and top banner slots.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00C896] shrink-0 mt-0.5" />
                <span>Priority algorithmic matching for search queries.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00C896] shrink-0 mt-0.5" />
                <span>"PROMOTED" badge highlights listing over competitor items.</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Add Discount Modal */}
      {isAddDiscountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl bg-[#14141B] border border-white/10 p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setIsAddDiscountModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display text-xl font-bold text-white mb-1">Create Promotional Code</h3>
            <p className="text-xs text-slate-400 mb-6">Buyers enter this code at checkout to receive automated discounts.</p>

            <form onSubmit={handleCreateDiscount} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Promo Code *
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. FLASH20, SUMMER5K"
                  required
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-xs text-white uppercase font-mono font-bold placeholder-slate-500 focus:outline-none focus:border-[#5B35F5]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Discount Type *
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full rounded-xl bg-[#1A1A24] border border-white/10 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#5B35F5]"
                >
                  <option value="percentage">Percentage Off (%)</option>
                  <option value="fixed_amount">Fixed Amount Off (₦)</option>
                  <option value="free_shipping">Free Shipping</option>
                </select>
              </div>

              {type !== 'free_shipping' && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Discount Value ({type === 'percentage' ? '%' : '₦'}) *
                  </label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    min={1}
                    required
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-[#5B35F5]"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Minimum Order Value (₦)
                </label>
                <input
                  type="number"
                  value={minOrderValue}
                  onChange={(e) => setMinOrderValue(Number(e.target.value))}
                  min={0}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-[#5B35F5]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Total Usage Limit (Total orders)
                </label>
                <input
                  type="number"
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(Number(e.target.value))}
                  min={1}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-[#5B35F5]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#5B35F5] hover:bg-[#4d2ad4] text-white font-bold text-xs shadow-lg shadow-[#5B35F5]/30 transition cursor-pointer mt-2"
              >
                Activate Promotional Code
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
