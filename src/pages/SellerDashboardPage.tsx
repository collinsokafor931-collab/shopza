import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Users,
  PlusCircle,
  Store,
  ExternalLink,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
  Package,
  Palette,
  Barcode,
  Tag,
  MessageCircle,
} from 'lucide-react';

interface SellerDashboardPageProps {
  navigate: (path: string) => void;
}

export const SellerDashboardPage: React.FC<SellerDashboardPageProps> = ({ navigate }) => {
  const { currentUser, products, orders, formatCurrency, config, stores } = useMarketplace();

  // If user is logged in as a buyer and has not launched a store yet, show onboarding invitation
  if (currentUser && !currentUser.isSeller) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#5B35F5] to-[#7C4DFF] flex items-center justify-center text-white shadow-2xl shadow-[#5B35F5]/30 mb-6">
          <Store className="w-8 h-8" />
        </div>
        <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">
          Launch Your Shopify-Grade Storefront
        </h1>
        <p className="text-sm text-slate-300 mt-3 max-w-md mx-auto leading-relaxed">
          You are currently browsing as a shopper. Launch your branded storefront in 2 minutes to access the merchant hub, theme customizer, product variants, and live POS terminal.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => navigate('/seller/onboarding')}
            className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-[#5B35F5] to-[#7C4DFF] px-8 py-3.5 text-xs font-bold text-white shadow-xl shadow-[#5B35F5]/30 hover:brightness-110 transition cursor-pointer"
          >
            Launch Your Store Now
          </button>
          <button
            onClick={() => navigate('/sell')}
            className="w-full sm:w-auto rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-xs font-semibold text-slate-300 hover:text-white transition cursor-pointer"
          >
            Learn Seller Benefits
          </button>
        </div>
      </div>
    );
  }

  const userStore =
    stores.find(
      (s) =>
        (currentUser?.id && s.ownerId === currentUser.id) ||
        (currentUser?.storeUsername && s.username === currentUser.storeUsername)
    ) || {
      id: `store-${currentUser?.id || 'default'}`,
      name: currentUser?.name ? `${currentUser.name}'s Store` : 'My Store',
      username: currentUser?.storeUsername || `store-${currentUser?.id?.slice(-4) || 'merchant'}`,
      ownerId: currentUser?.id || 'default',
      ownerName: currentUser?.name || 'Merchant',
      logo: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=200&auto=format&fit=crop&q=80',
      banner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80',
      description: 'Official digital storefront',
      categories: ['Fashion & Apparel'],
      location: currentUser?.location || 'Lagos, Nigeria',
      state: 'Lagos',
      rating: 5.0,
      reviewCount: 0,
      followerCount: 0,
      isVerified: false,
      joinedDate: 'Just now',
      responseTime: '< 15 mins',
      operatingHours: 'Mon - Sat: 8:00 AM - 7:00 PM',
      policies: {
        shipping: 'Dispatches within 24 hours',
        returns: '7-day inspection window',
        cancellation: 'Cancel anytime prior to dispatch',
      },
      productCount: 0,
      serviceCount: 0,
    };

  const myStoreUsername = userStore.username;
  const myProducts = products.filter((p) => p.storeUsername === myStoreUsername);
  const myOrders = orders.filter((o) => o.sellerIds.includes(currentUser?.id || userStore.ownerId));

  const grossSales = myOrders.reduce((acc, o) => acc + o.subtotal, 0);
  const platformFee = Math.round((grossSales * config.commissionRatePercent) / 100);
  const netEarnings = grossSales - platformFee;

  const availableBalance = Math.round(netEarnings * 0.7);
  const avgOrderValue = myOrders.length > 0 ? Math.round(grossSales / myOrders.length) : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              Shopify Merchant Hub
            </h1>
            <span className="rounded-md bg-[#00C896]/15 px-2 py-0.5 text-xs font-bold text-[#00C896]">
              @{myStoreUsername}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Storefront theme customization, multi-option variant matrix, live POS register, and automated bank settlements.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => navigate(`/store/${myStoreUsername}`)}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <Store className="w-4 h-4 text-slate-400" />
            <span>View Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => navigate('/seller/theme-customizer')}
            className="flex items-center gap-1.5 rounded-xl border border-amber-500/20 bg-amber-500/10 px-3.5 py-2.5 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition cursor-pointer"
          >
            <Palette className="w-4 h-4" />
            <span>Theme Editor</span>
          </button>

          <button
            onClick={() => navigate('/seller/pos')}
            className="flex items-center gap-1.5 rounded-xl border border-[#00C896]/20 bg-[#00C896]/10 px-3.5 py-2.5 text-xs font-bold text-[#00C896] hover:bg-[#00C896]/20 transition cursor-pointer"
          >
            <Barcode className="w-4 h-4" />
            <span>Open POS</span>
          </button>

          <button
            onClick={() => navigate('/seller/products/new')}
            className="flex items-center gap-1.5 rounded-xl bg-[#5B35F5] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#4d2ad4] shadow-lg shadow-[#5B35F5]/30 transition active:scale-95 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="rounded-2xl bg-[#14141B] border border-white/10 p-5 shadow-xl">
          <span className="text-xs font-medium text-slate-400 block">Gross Sales (GMV)</span>
          <p className="font-mono-nums text-2xl font-bold text-white mt-1">
            {formatCurrency(grossSales)}
          </p>
          <span className="text-[11px] text-[#00C896] flex items-center gap-0.5 mt-1 font-medium">
            <ArrowUpRight className="w-3 h-3" />
            <span>+24.6% this cycle</span>
          </span>
        </div>

        <div className="rounded-2xl bg-[#14141B] border border-white/10 p-5 shadow-xl">
          <span className="text-xs font-medium text-slate-400 block">Average Order (AOV)</span>
          <p className="font-mono-nums text-2xl font-bold text-[#00C896] mt-1">
            {formatCurrency(avgOrderValue)}
          </p>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Across {myOrders.length} confirmed orders
          </span>
        </div>

        <div className="rounded-2xl bg-[#14141B] border border-white/10 p-5 shadow-xl">
          <span className="text-xs font-medium text-slate-400 block">Active Listings</span>
          <p className="font-mono-nums text-2xl font-bold text-white mt-1">
            {myProducts.length}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {myProducts.filter((p) => p.stock > 0).length} items in stock
          </span>
        </div>

        <div className="rounded-2xl bg-[#14141B] border border-white/10 p-5 shadow-xl">
          <span className="text-xs font-medium text-slate-400 block">Available Payout</span>
          <p className="font-mono-nums text-2xl font-bold text-amber-400 mt-1">
            {formatCurrency(availableBalance)}
          </p>
          <button
            onClick={() => navigate('/seller/earnings')}
            className="text-[11px] text-[#7C4DFF] hover:underline font-semibold mt-1 block cursor-pointer"
          >
            Request Payout →
          </button>
        </div>
      </div>

      {/* Revenue & Shortcuts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* Sales & Channel Performance (8 cols) */}
        <div className="lg:col-span-8 rounded-3xl bg-[#14141B] border border-white/10 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/5">
            <div>
              <h3 className="font-bold text-base text-white">Sales by Channel</h3>
              <p className="text-xs text-slate-400">Online Storefront vs Physical POS Terminal vs WhatsApp Direct</p>
            </div>
            <span className="rounded-lg bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-300">
              Live Channels
            </span>
          </div>

          {/* Channel Breakdown Progress */}
          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1 font-semibold">
                <span className="text-white flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5 text-[#5B35F5]" />
                  <span>Online Storefront (Web & Mobile PWA)</span>
                </span>
                <span className="font-mono text-[#5B35F5]">65%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-[#5B35F5] rounded-full" style={{ width: '65%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-semibold">
                <span className="text-white flex items-center gap-1.5">
                  <Barcode className="w-3.5 h-3.5 text-[#00C896]" />
                  <span>Physical Store POS Register (Walk-ins)</span>
                </span>
                <span className="font-mono text-[#00C896]">23%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-[#00C896] rounded-full" style={{ width: '23%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-semibold">
                <span className="text-white flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp Direct Orders</span>
                </span>
                <span className="font-mono text-emerald-400">12%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: '12%' }} />
              </div>
            </div>
          </div>

          {/* Bar Graph Simulation */}
          <div className="pt-4 border-t border-white/5">
            <span className="text-xs font-semibold text-slate-400 block mb-2">Weekly Settled Revenue</span>
            <div className="h-40 flex items-end justify-between gap-3 px-2">
              {[
                { day: 'Mon', val: 45, label: '₦450k' },
                { day: 'Tue', val: 70, label: '₦720k' },
                { day: 'Wed', val: 30, label: '₦310k' },
                { day: 'Thu', val: 90, label: '₦940k' },
                { day: 'Fri', val: 65, label: '₦680k' },
                { day: 'Sat', val: 100, label: '₦1.2M' },
                { day: 'Sun', val: 85, label: '₦890k' },
              ].map((bar) => (
                <div key={bar.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono-nums text-slate-300 font-semibold">
                    {bar.label}
                  </span>
                  <div
                    className="w-full bg-[#5B35F5]/30 group-hover:bg-[#5B35F5] rounded-t-xl transition-all duration-300 relative"
                    style={{ height: `${bar.val}%` }}
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-[#00C896] rounded-t-xl" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-400">{bar.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Shopify Suite Tools (4 cols) */}
        <div className="lg:col-span-4 rounded-3xl bg-[#14141B] border border-white/10 p-6 shadow-xl space-y-3">
          <h3 className="font-bold text-base text-white mb-2">Shopify Tools</h3>

          <button
            onClick={() => navigate('/seller/theme-customizer')}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#1A1A24] border border-white/5 hover:border-amber-500/30 transition cursor-pointer text-left group"
          >
            <div className="flex items-center gap-3">
              <Palette className="w-5 h-5 text-amber-400" />
              <div>
                <h4 className="font-bold text-xs text-white group-hover:text-amber-300 transition">Store Theme Customizer</h4>
                <p className="text-[10px] text-slate-400">Palette, banner layout & fonts</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>

          <button
            onClick={() => navigate('/seller/pos')}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#1A1A24] border border-white/5 hover:border-[#00C896]/30 transition cursor-pointer text-left group"
          >
            <div className="flex items-center gap-3">
              <Barcode className="w-5 h-5 text-[#00C896]" />
              <div>
                <h4 className="font-bold text-xs text-white group-hover:text-[#00C896] transition">Point of Sale (POS)</h4>
                <p className="text-[10px] text-slate-400">Walk-in checkout & printed receipts</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>

          <button
            onClick={() => navigate('/seller/products')}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#1A1A24] border border-white/5 hover:border-white/15 transition cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-[#5B35F5]" />
              <div>
                <h4 className="font-bold text-xs text-white">Products & Variants</h4>
                <p className="text-[10px] text-slate-400">SKUs, sizes, colors & stock</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>

          <button
            onClick={() => navigate('/seller/promotions')}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#1A1A24] border border-white/5 hover:border-white/15 transition cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <Tag className="w-5 h-5 text-pink-400" />
              <div>
                <h4 className="font-bold text-xs text-white">Discounts & Promos</h4>
                <p className="text-[10px] text-slate-400">Coupons, percentages & boosts</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>

          <button
            onClick={() => navigate('/seller/customers')}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#1A1A24] border border-white/5 hover:border-white/15 transition cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-[#7C4DFF]" />
              <div>
                <h4 className="font-bold text-xs text-white">Customers (CRM)</h4>
                <p className="text-[10px] text-slate-400">LTV, repeat rates & tags</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>

          <button
            onClick={() => navigate('/seller/orders')}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#1A1A24] border border-white/5 hover:border-white/15 transition cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-blue-400" />
              <div>
                <h4 className="font-bold text-xs text-white">Seller Orders</h4>
                <p className="text-[10px] text-slate-400">Fulfillment & dispatch tracking</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="rounded-3xl bg-[#14141B] border border-white/10 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
          <h3 className="font-bold text-base text-white">Orders Requiring Dispatch</h3>
          <button
            onClick={() => navigate('/seller/orders')}
            className="text-xs font-semibold text-[#7C4DFF] hover:underline cursor-pointer"
          >
            View All ({myOrders.length})
          </button>
        </div>

        {myOrders.length > 0 ? (
          <div className="divide-y divide-white/5">
            {myOrders.slice(0, 5).map((ord) => (
              <div
                key={ord.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono-nums font-bold text-white">#{ord.orderNumber}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#00C896]/10 text-[#00C896] capitalize">
                      {ord.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Customer: <strong className="text-white">{ord.buyerName}</strong> · {ord.items.length} items
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-mono-nums font-bold text-white">{formatCurrency(ord.total)}</span>
                  <button
                    onClick={() => navigate(`/account/orders/${ord.id}`)}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-semibold text-[11px] transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 py-6 text-center">No orders requiring fulfillment right now.</p>
        )}
      </div>
    </div>
  );
};
