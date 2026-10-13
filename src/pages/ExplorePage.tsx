import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { CATEGORIES_LIST } from '../constants/marketplace';
import { ProductCard } from '../components/marketplace/ProductCard';
import { StoreCard } from '../components/marketplace/StoreCard';
import { Compass, Sparkles, Flame, Tag, ArrowRight } from 'lucide-react';

export const ExplorePage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { products, stores } = useMarketplace();

  const curatedHighlights = products.slice(0, 6);
  const featuredStores = stores.slice(0, 4);

  const discoveryPills = [
    { label: 'Wireless Audio', query: 'wireless' },
    { label: 'Raw Denim', query: 'denim' },
    { label: 'MacBook Pro', query: 'macbook' },
    { label: 'Lagos Fashion', query: 'fashion' },
    { label: 'Terracotta Decor', query: 'terracotta' },
    { label: 'Solar Inverters', query: 'inverter' },
    { label: 'Skincare Serums', query: 'serum' },
    { label: 'Ofada Rice', query: 'rice' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#5B35F5] mb-1">
          <Compass className="w-3.5 h-3.5" />
          <span>Curated Discovery</span>
        </div>
        <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">
          Explore the Ecosystem
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Hand-picked merchandise, emerging Nigerian storefronts, and trending community collections.
        </p>

        {/* Popular Tags Filter Pills */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {discoveryPills.map((pill) => (
            <button
              key={pill.label}
              onClick={() => navigate(`/search?q=${encodeURIComponent(pill.query)}`)}
              className="rounded-full bg-white/5 border border-white/10 px-3.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition cursor-pointer"
            >
              #{pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Collection Grid */}
      <section className="mb-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-bold text-white tracking-tight">
            Curated Picks This Week
          </h2>
          <button
            onClick={() => navigate('/marketplace')}
            className="text-xs font-semibold text-[#00C896] hover:underline"
          >
            All Products
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
          {curatedHighlights.map((p) => (
            <ProductCard key={p.id} product={p} navigate={navigate} />
          ))}
        </div>
      </section>

      {/* Featured Stores Banner */}
      <section className="mb-14 pt-8 border-t border-white/8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-bold text-white tracking-tight">
            Independent Stores to Follow
          </h2>
          <button
            onClick={() => navigate('/stores')}
            className="text-xs font-semibold text-[#7C4DFF] hover:underline"
          >
            View All Stores
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredStores.map((st) => (
            <StoreCard key={st.id} store={st} navigate={navigate} />
          ))}
        </div>
      </section>
    </div>
  );
};
