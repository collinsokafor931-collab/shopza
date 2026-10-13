import React, { useState } from 'react';
import { Search, Store as StoreIcon } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { StoreCard } from '../components/marketplace/StoreCard';

export const StoresPage: React.FC = () => {
  const { stores } = useMarketplace();
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState('all');

  const filteredStores = (stores || []).filter((s) => {
    if (!s) return false;
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      const matchName = (s.name || '').toLowerCase().includes(q);
      const matchDesc = (s.description || '').toLowerCase().includes(q);
      const matchCat = Array.isArray(s.categories)
        ? s.categories.some((c) => typeof c === 'string' && c.toLowerCase().includes(q))
        : typeof (s as any).category === 'string'
        ? (s as any).category.toLowerCase().includes(q)
        : false;
      if (!matchName && !matchDesc && !matchCat) return false;
    }
    if (selectedState !== 'all' && (s.state || '').toLowerCase() !== selectedState.toLowerCase()) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08] mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            Verified Merchant Directory
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-mono-nums">
            Discover {filteredStores.length} certified independent stores across Nigeria
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search store name or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#14141B] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#5B35F5]"
            />
          </div>

          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="bg-[#14141B] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
          >
            <option value="all">All States</option>
            <option value="Lagos">Lagos</option>
            <option value="Abuja (FCT)">Abuja (FCT)</option>
            <option value="Rivers">Rivers</option>
            <option value="Oyo">Oyo</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStores.map((store) => (
          <StoreCard key={store.id} store={store} />
        ))}
      </div>
    </div>
  );
};
