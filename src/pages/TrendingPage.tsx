import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { ProductCard } from '../components/marketplace/ProductCard';
import { TrendingUp, Flame } from 'lucide-react';

export const TrendingPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { products } = useMarketplace();
  const trending = products.filter((p) => p.isTrending || p.rating >= 4.8);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#7C4DFF] mb-1">
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span>Real-time Velocity</span>
        </div>
        <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">
          Trending on SHOPZA
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Top-viewed, most saved, and highest customer-satisfaction products this week.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {trending.map((p) => (
          <ProductCard key={p.id} product={p} navigate={navigate} />
        ))}
      </div>
    </div>
  );
};
