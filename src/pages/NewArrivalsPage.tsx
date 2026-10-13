import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { ProductCard } from '../components/marketplace/ProductCard';
import { Sparkles } from 'lucide-react';

export const NewArrivalsPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { products } = useMarketplace();
  const sortedByNew = [...products].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#00C896] mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Fresh Drops</span>
        </div>
        <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">
          New Arrivals
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Newly published inventory and collections just listed by verified independent sellers.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {sortedByNew.map((p) => (
          <ProductCard key={p.id} product={p} navigate={navigate} />
        ))}
      </div>
    </div>
  );
};
