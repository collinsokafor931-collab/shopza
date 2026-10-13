import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { CATEGORIES_LIST } from '../constants/marketplace';
import { ProductCard } from '../components/marketplace/ProductCard';
import { ChevronRight, ArrowUpDown, ShoppingBag } from 'lucide-react';

interface CategoryDetailPageProps {
  categorySlug: string;
  navigate: (path: string) => void;
}

export const CategoryDetailPage: React.FC<CategoryDetailPageProps> = ({
  categorySlug,
  navigate,
}) => {
  const { products } = useMarketplace();
  const [sortBy, setSortBy] = useState<'recommended' | 'price_asc' | 'price_desc' | 'rating'>('recommended');

  const categoryInfo = CATEGORIES_LIST.find((c) => c.slug === categorySlug) || {
    name: categorySlug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
    slug: categorySlug,
    description: `All items listed under ${categorySlug}.`,
    image: '',
    count: 0,
  };

  const categoryProducts = (products || [])
    .filter((p) => p && (p.categorySlug === categorySlug || (p.category || '').toLowerCase().includes(categorySlug)))
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
        <button onClick={() => navigate('/')} className="hover:text-white transition">Home</button>
        <ChevronRight className="w-3 h-3 text-slate-600" />
        <button onClick={() => navigate('/categories')} className="hover:text-white transition">Categories</button>
        <ChevronRight className="w-3 h-3 text-slate-600" />
        <span className="text-white font-medium">{categoryInfo.name}</span>
      </nav>

      {/* Category Hero Banner */}
      <div className="relative rounded-3xl bg-[#14141B] border border-white/8 p-6 sm:p-8 mb-8 overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#00C896]">Department</span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
            {categoryInfo.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
            {categoryInfo.description}
          </p>
          <p className="font-mono-nums text-xs text-slate-500 mt-3">
            {categoryProducts.length} items available from verified merchants
          </p>
        </div>
      </div>

      {/* Sorting bar */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/8 text-xs text-slate-400">
        <span>Showing <strong className="text-white font-mono-nums">{categoryProducts.length}</strong> items</span>
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#14141B] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
          >
            <option value="recommended">Featured</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {categoryProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {categoryProducts.map((p) => (
            <ProductCard key={p.id} product={p} navigate={navigate} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-[#14141B] border border-white/8 p-12 text-center">
          <ShoppingBag className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No products yet in {categoryInfo.name}</h3>
          <p className="text-xs text-slate-400 mt-1">Be the first seller to list an item in this category.</p>
          <button
            onClick={() => navigate('/sell')}
            className="mt-4 rounded-xl bg-[#5B35F5] px-4 py-2 text-xs font-semibold text-white hover:bg-[#4d2ad4] transition"
          >
            List a Product Here
          </button>
        </div>
      )}
    </div>
  );
};
