import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { StoreCard } from '../components/marketplace/StoreCard';
import { Store, Users } from 'lucide-react';

export const FollowingPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { stores, followedStores } = useMarketplace();
  const followingList = stores.filter((s) => followedStores.includes(s.username));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#00C896] mb-1">
          <Users className="w-3.5 h-3.5" />
          <span>Subscriptions</span>
        </div>
        <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">
          Followed Stores
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Receive real-time drop notifications and collections from your favorite merchants.
        </p>
      </div>

      {followingList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {followingList.map((st) => (
            <StoreCard key={st.id} store={st} navigate={navigate} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl bg-[#14141B] border border-white/8 p-16 text-center text-slate-400">
          <Store className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">You aren't following any stores yet</h3>
          <p className="text-xs text-slate-400 mt-1">Browse our store directory and follow verified creators.</p>
          <button
            onClick={() => navigate('/stores')}
            className="mt-5 rounded-xl bg-[#5B35F5] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#4d2ad4] transition"
          >
            Browse Stores
          </button>
        </div>
      )}
    </div>
  );
};
