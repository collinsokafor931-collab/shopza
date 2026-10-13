import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { ProductCard } from '../components/marketplace/ProductCard';
import { Tag, Sparkles } from 'lucide-react';

export const DealsPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { products } = useMarketplace();
  const dealProducts = products.filter((p) => p.originalPrice && p.originalPrice > p.price);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-rose-400 mb-1">
          <Tag className="w-3.5 h-3.5" />
          <span>Verified Merchant Discounts</span>
        </div>
        <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">
          Deals & Special Offers
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Genuine discounted listings with verified original price baselines across all categories.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {dealProducts.map((p) => (
          <ProductCard key={p.id} product={p} navigate={navigate} />
        ))}
      </div>
    </div>
  );
};
