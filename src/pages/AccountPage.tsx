import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { User, ShoppingBag, Heart, Store, Bell, MessageSquare, ShieldCheck, ChevronRight, Settings } from 'lucide-react';

interface AccountPageProps {
  navigate: (path: string) => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ navigate }) => {
  const { currentUser, orders, favorites, followedStores, unreadNotificationsCount, formatCurrency } = useMarketplace();

  if (!currentUser) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-white">Sign in to view your account</h2>
        <button onClick={() => navigate('/login')} className="mt-4 rounded-xl bg-[#5B35F5] px-5 py-2.5 text-xs font-semibold text-white">
          Sign In
        </button>
      </div>
    );
  }

  const myOrders = orders.filter((o) => o.buyerId === currentUser.id);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      {/* Profile Header Box */}
      <div className="rounded-3xl bg-[#14141B] border border-white/8 p-6 sm:p-8 mb-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="h-16 w-16 rounded-2xl object-cover ring-2 ring-white/10"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl font-bold text-white">{currentUser.name}</h1>
                <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] uppercase font-semibold text-slate-300">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">@{currentUser.username} · {currentUser.email}</p>
              <p className="text-[11px] text-slate-500 mt-1">Location: {currentUser.location} · Joined {currentUser.joinedDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {currentUser.isSeller ? (
              <button
                onClick={() => navigate('/seller/dashboard')}
                className="rounded-xl bg-[#00C896] px-4 py-2 text-xs font-bold text-black hover:bg-[#05e2aa] transition cursor-pointer"
              >
                Seller Dashboard
              </button>
            ) : (
              <button
                onClick={() => navigate('/sell')}
                className="rounded-xl bg-[#5B35F5] px-4 py-2 text-xs font-bold text-white hover:bg-[#4d2ad4] transition cursor-pointer"
              >
                Become a Seller
              </button>
            )}
            <button
              onClick={() => navigate('/settings')}
              className="rounded-xl border border-white/10 p-2 text-slate-300 hover:text-white hover:bg-white/5 transition cursor-pointer"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Quick Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div
          onClick={() => navigate('/account/orders')}
          className="rounded-2xl bg-[#14141B] border border-white/8 p-4 hover:border-white/20 transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">My Orders</span>
            <ShoppingBag className="w-4 h-4 text-[#7C4DFF]" />
          </div>
          <p className="font-mono-nums text-2xl font-bold text-white">{myOrders.length}</p>
        </div>

        <div
          onClick={() => navigate('/account/favorites')}
          className="rounded-2xl bg-[#14141B] border border-white/8 p-4 hover:border-white/20 transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Saved Items</span>
            <Heart className="w-4 h-4 text-rose-500" />
          </div>
          <p className="font-mono-nums text-2xl font-bold text-white">{favorites.length}</p>
        </div>

        <div
          onClick={() => navigate('/account/following')}
          className="rounded-2xl bg-[#14141B] border border-white/8 p-4 hover:border-white/20 transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Followed Stores</span>
            <Store className="w-4 h-4 text-[#00C896]" />
          </div>
          <p className="font-mono-nums text-2xl font-bold text-white">{followedStores.length}</p>
        </div>

        <div
          onClick={() => navigate('/account/notifications')}
          className="rounded-2xl bg-[#14141B] border border-white/8 p-4 hover:border-white/20 transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Unread Updates</span>
            <Bell className="w-4 h-4 text-amber-400" />
          </div>
          <p className="font-mono-nums text-2xl font-bold text-white">{unreadNotificationsCount}</p>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="rounded-3xl bg-[#14141B] border border-white/8 p-6 shadow-xl mb-8">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
          <h2 className="font-bold text-base text-white">Recent Orders</h2>
          <button
            onClick={() => navigate('/account/orders')}
            className="text-xs font-semibold text-[#7C4DFF] hover:underline"
          >
            View All Orders
          </button>
        </div>

        {myOrders.length > 0 ? (
          <div className="divide-y divide-white/5">
            {myOrders.slice(0, 3).map((o) => (
              <div
                key={o.id}
                onClick={() => navigate(`/account/orders/${o.id}`)}
                className="py-3.5 flex items-center justify-between hover:bg-white/[0.02] transition px-2 rounded-xl cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono-nums text-xs font-bold text-white">#{o.orderNumber}</span>
                    <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] font-medium text-slate-300 capitalize">
                      {o.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {o.items.length} item(s) · {new Date(o.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono-nums text-sm font-bold text-white">{formatCurrency(o.total)}</span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 py-4 text-center">No orders yet.</p>
        )}
      </div>
    </div>
  );
};
