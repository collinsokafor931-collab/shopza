import React, { useState } from 'react';
import { ShieldCheck, UserCheck, UserPlus, MapPin, MessageSquare, Store as StoreIcon } from 'lucide-react';
import { Store } from '../../types';
import { useMarketplace } from '../../context/MarketplaceContext';
import { StarRating } from './StarRating';
import { StorefrontChatModal } from './StorefrontChatModal';

export const StoreCard: React.FC<{ store: Store; navigate?: (path: string) => void }> = ({ store }) => {
  const { navigate: contextNavigate, toggleFollowStore, isStoreFollowed } = useMarketplace();
  const navigate = contextNavigate;
  const [bannerError, setBannerError] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const followed = isStoreFollowed(store.username);

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    navigate(`/store/${store.username}`);
  };

  const handleVisitStore = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/store/${store.username}`);
  };

  const handleFollowToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFollowStore(store.username);
  };

  const handleMessageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setChatOpen(true);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group flex flex-col rounded-2xl bg-[#14141B] border border-white/[0.08] hover:border-white/20 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl cursor-pointer overflow-hidden"
    >
      {/* Banner */}
      <div className="relative h-28 w-full bg-[#1A1A24] overflow-hidden">
        {!bannerError ? (
          <img
            src={store.banner}
            alt={`${store.name} banner`}
            referrerPolicy="no-referrer"
            onError={() => setBannerError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-[#5B35F5]/30 to-[#7C4DFF]/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      </div>

      {/* Body with overlapping Avatar */}
      <div className="relative flex flex-col flex-1 p-4 pt-0">
        {/* Avatar & Follow Button Row */}
        <div className="flex items-end justify-between -mt-7 mb-3">
          <div className="relative w-14 h-14 rounded-2xl bg-[#14141B] p-0.5 border-2 border-[#14141B] overflow-hidden shadow-lg shrink-0">
            {!logoError ? (
              <img
                src={store.logo}
                alt={store.name}
                referrerPolicy="no-referrer"
                onError={() => setLogoError(true)}
                className="w-full h-full rounded-[14px] object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-[14px] bg-[#5B35F5] flex items-center justify-center text-white font-bold text-lg">
                {store.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleVisitStore}
              title="Visit Store"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors cursor-pointer"
            >
              <StoreIcon className="w-3.5 h-3.5 text-[#00C896]" />
              <span>Visit</span>
            </button>

            <button
              onClick={handleMessageClick}
              title="Chat with seller"
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#7C4DFF]" />
            </button>

            <button
              onClick={handleFollowToggle}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                followed
                  ? 'bg-white/10 hover:bg-white/15 text-slate-200'
                  : 'bg-[#5B35F5] hover:bg-[#7C4DFF] text-white'
              }`}
            >
              {followed ? (
                <>
                  <UserCheck className="w-3.5 h-3.5 text-[#00C896]" />
                  <span>Following</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Follow</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Store Title & Badges */}
        <div className="flex items-center gap-1.5 mb-1">
          <h3 className="font-semibold text-white text-base group-hover:text-[#7C4DFF] transition-colors truncate">
            {store.name}
          </h3>
          {store.isVerified && (
            <span title="Verified Store">
              <ShieldCheck className="w-4 h-4 text-[#00C896] shrink-0" />
            </span>
          )}
        </div>

        {/* Categories & Location */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
          <span>
            {Array.isArray(store.categories)
              ? store.categories.join(', ')
              : (store as any).category || 'Verified Merchant'}
          </span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1 truncate">
            <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
            {store.location || 'Lagos, Nigeria'}
          </span>
        </div>

        {/* Description snippet */}
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {store.description || 'Verified merchant storefront on SHOPZA.'}
        </p>

        {/* Stats Footer */}
        <div className="mt-auto pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-300">
          <StarRating rating={store.rating || 5.0} count={store.reviewCount || 0} size="sm" />
          <div className="flex items-center gap-3 text-slate-400 font-mono-nums">
            <span>{(store.followerCount || 0).toLocaleString()} followers</span>
            <span>·</span>
            <span>{store.productCount || 0} products</span>
          </div>
        </div>
      </div>

      {/* Instant Storefront Chat from StoreCard */}
      <StorefrontChatModal
        store={store}
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
      />
    </div>
  );
};
