import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { ProductCard } from '../components/marketplace/ProductCard';
import { Heart, ShoppingBag } from 'lucide-react';

export const FavoritesPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { products, favorites, wishlistSyncStatus, currentUser } = useMarketplace();
  const savedProducts = products.filter((p) => favorites.includes(p.id));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-rose-500 mb-1">
            <Heart className="w-3.5 h-3.5 fill-rose-500" />
            <span>Saved Collection</span>
          </div>
          <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">
            Favorites & Wishlist
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Items you have saved across SHOPZA for quick access and automated price drop alerts.
          </p>
        </div>

        {/* Cloud Sync Status Indicator */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl text-xs">
          <div className="flex items-center gap-2">
            {wishlistSyncStatus === 'syncing' ? (
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            ) : wishlistSyncStatus === 'synced' ? (
              <span className="w-2.5 h-2.5 rounded-full bg-[#00C896]" />
            ) : (
              <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
            )}
            <span className="font-medium text-slate-200">
              {wishlistSyncStatus === 'syncing'
                ? 'Syncing to Cloud...'
                : wishlistSyncStatus === 'synced'
                ? 'Cloud-Synced via Firebase'
                : 'Offline Storage Active'}
            </span>
          </div>
          {currentUser && (
            <span className="text-[11px] text-slate-400 border-l border-white/10 pl-2">
              {currentUser.email}
            </span>
          )}
        </div>
      </div>

      {/* Price Drop Banner */}
      <div className="mb-8 p-3.5 rounded-2xl bg-gradient-to-r from-[#5B35F5]/10 via-[#00C896]/10 to-transparent border border-white/10 flex items-center gap-3 text-xs text-slate-300">
        <span className="w-8 h-8 rounded-xl bg-[#5B35F5]/20 flex items-center justify-center shrink-0 text-base">
          🔔
        </span>
        <div>
          <p className="font-semibold text-white">Automated Price Drop Alerts Active</p>
          <p className="text-slate-400 text-[11px]">
            We automatically monitor and ping you via in-app notifications whenever any saved item gets discounted or drops in price.
          </p>
        </div>
      </div>

      {savedProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {savedProducts.map((p) => (
            <ProductCard key={p.id} product={p} navigate={navigate} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl bg-[#14141B] border border-white/8 p-16 text-center text-slate-400">
          <Heart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No saved items yet</h3>
          <p className="text-xs text-slate-400 mt-1">Tap the heart icon on any listing to save it to your wishlist.</p>
          <button
            onClick={() => navigate('/marketplace')}
            className="mt-5 rounded-xl bg-[#5B35F5] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#4d2ad4] transition"
          >
            Explore Marketplace
          </button>
        </div>
      )}
    </div>
  );
};
