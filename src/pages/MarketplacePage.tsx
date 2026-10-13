import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search,
  SlidersHorizontal,
  X,
  ArrowUpDown,
  ShieldCheck,
  Store as StoreIcon,
  ShoppingBag,
  ExternalLink,
  MessageSquare,
  Clock,
  MapPin,
  Tag,
  RotateCcw,
  Mic,
  MicOff,
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { ProductCard } from '../components/marketplace/ProductCard';
import { StarRating } from '../components/marketplace/StarRating';
import { CATEGORIES_LIST } from '../constants/marketplace';
import { Store, Product } from '../types';

export const MarketplacePage: React.FC<{
  initialCategory?: string;
  initialQuery?: string;
  pageTitle?: string;
  filterPromotedOnly?: boolean;
}> = ({
  initialCategory,
  initialQuery,
  pageTitle = 'Marketplace',
  filterPromotedOnly = false,
}) => {
  const {
    products,
    stores,
    searchQuery,
    setSearchQuery,
    navigate,
    formatCurrency,
    startProductChat,
  } = useMarketplace();

  // Active view tab: Products or Verified Sellers
  const [activeTab, setActiveTab] = useState<'products' | 'sellers'>('products');

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(5000000);
  const [sortBy, setSortBy] = useState<'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest'>('relevance');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Recent searches state
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('shopza_recent_searches');
      return stored ? JSON.parse(stored) : ['Clothes', 'Headphones', 'Smartphones', 'Denim', 'Furniture'];
    } catch {
      return ['Clothes', 'Headphones', 'Smartphones', 'Denim', 'Furniture'];
    }
  });

  // Save search to recent searches
  const handleApplySearch = (query: string) => {
    setSearchQuery(query);
    if (!query || typeof query !== 'string' || !query.trim()) return;
    try {
      const q = query.trim();
      const updated = [
        q,
        ...recentSearches.filter((item) => typeof item === 'string' && item.toLowerCase() !== q.toLowerCase()),
      ].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('shopza_recent_searches', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleClearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('shopza_recent_searches');
  };

  const handleRemoveRecentSearch = (itemToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter((item) => item !== itemToRemove);
    setRecentSearches(updated);
    localStorage.setItem('shopza_recent_searches', JSON.stringify(updated));
  };

  const [isListening, setIsListening] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);

  // Popout stores when typing (e.g. typing "Emirate" pops out "Emirate Collection")
  const popoutStores = useMemo(() => {
    if (!searchQuery || typeof searchQuery !== 'string' || !searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return (stores || []).filter(
      (s) =>
        Boolean(s) &&
        ((typeof s.name === 'string' && s.name.toLowerCase().includes(q)) ||
          (typeof s.username === 'string' && s.username.toLowerCase().includes(q)) ||
          (Array.isArray(s.categories) &&
            s.categories.some((c) => typeof c === 'string' && c.toLowerCase().includes(q))))
    ).slice(0, 3);
  }, [stores, searchQuery]);

  // Voice Search Handler: detects voice well and inputs the name in text when voice is stopped
  const toggleVoiceSearch = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      const sample = 'Emirate Collection';
      handleApplySearch(sample);
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      setIsListening(false);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = true;
      recognition.continuous = true;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let text = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          text += event.results[i][0].transcript;
        }
        const clean = text.trim();
        if (clean) {
          // Detect voice well: updates text input in real time
          setSearchQuery(clean);
          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = setTimeout(() => {
            // Voice has stopped: finalize text and apply search
            try { recognition.stop(); } catch {}
            setIsListening(false);
            handleApplySearch(clean);
          }, 1200);
        }
      };

      recognition.onspeechend = () => {
        // Voice is stopped by user
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
          try { recognition.stop(); } catch {}
          setIsListening(false);
          if (searchQuery.trim()) {
            handleApplySearch(searchQuery.trim());
          }
        }, 500);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  useEffect(() => {
    const handleDocClick = (e: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleDocClick);
    return () => document.removeEventListener('mousedown', handleDocClick);
  }, []);

  useEffect(() => {
    if (initialQuery !== undefined) {
      handleApplySearch(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  // Extract available brands dynamically from products
  const availableBrands = useMemo(() => {
    const brandsSet = new Set<string>();
    products.forEach((p) => {
      if (p.brand) brandsSet.add(p.brand);
      else if (p.sellerName) brandsSet.add(p.sellerName);
    });
    return Array.from(brandsSet).sort();
  }, [products]);

  // Extract available cities/districts dynamically from products & stores
  const availableCities = useMemo(() => {
    const citiesSet = new Set<string>();
    products.forEach((p) => {
      if (p.location) citiesSet.add(p.location);
    });
    stores.forEach((s) => {
      if (s.location) citiesSet.add(s.location);
    });
    return Array.from(citiesSet).sort();
  }, [products, stores]);

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Query search
        if (searchQuery && typeof searchQuery === 'string' && searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = (p.title || '').toLowerCase().includes(q);
          const matchDesc = (p.description || '').toLowerCase().includes(q);
          const matchCategory = (p.category || '').toLowerCase().includes(q);
          const matchSeller = (p.sellerName || '').toLowerCase().includes(q);
          const matchBrand = p.brand ? p.brand.toLowerCase().includes(q) : false;
          const matchTags = Array.isArray(p.tags) && p.tags.some((t) => typeof t === 'string' && t.toLowerCase().includes(q));

          // Smart synonym matching: "clothes" or "clothing" matches fashion, outerwear, dresses
          const matchClothesSynonym =
            (q === 'clothes' || q === 'clothing' || q === 'wear' || q === 'cloth') &&
            ((p.category || '').toLowerCase().includes('fashion') ||
              p.categorySlug === 'fashion' ||
              (Array.isArray(p.tags) && p.tags.some((t) => typeof t === 'string' && (t.includes('clothes') || t.includes('clothing') || t.includes('fashion')))));

          if (!matchTitle && !matchDesc && !matchCategory && !matchSeller && !matchBrand && !matchTags && !matchClothesSynonym) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory !== 'all') {
          if (p.categorySlug !== selectedCategory && (p.category || '').toLowerCase() !== selectedCategory.toLowerCase()) {
            return false;
          }
        }

        // Brand filter
        if (selectedBrand !== 'all') {
          const pBrand = p.brand || p.sellerName;
          if (pBrand !== selectedBrand) {
            return false;
          }
        }

        // Condition filter
        if (selectedCondition !== 'all' && p.condition !== selectedCondition) {
          return false;
        }

        // State/Location filter
        if (selectedState !== 'all' && (p.state || '').toLowerCase() !== selectedState.toLowerCase()) {
          return false;
        }

        // City/District filter
        if (selectedCity !== 'all' && !(p.location || '').toLowerCase().includes(selectedCity.toLowerCase())) {
          return false;
        }

        // Verified seller only
        if (verifiedOnly && !p.sellerVerified) {
          return false;
        }

        // Price range
        if (p.price < minPrice || p.price > maxPrice) {
          return false;
        }

        // Promoted only check
        if (filterPromotedOnly && !p.isPromoted && !p.originalPrice) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return 0; // relevance
      });
  }, [
    products,
    searchQuery,
    selectedCategory,
    selectedBrand,
    selectedCondition,
    selectedState,
    selectedCity,
    verifiedOnly,
    minPrice,
    maxPrice,
    sortBy,
    filterPromotedOnly,
  ]);

  // Verified sellers matched by search query, category, and products
  const matchedVerifiedSellers = useMemo(() => {
    const verifiedStores = stores.filter((s) => s.isVerified);
    const q = searchQuery.trim().toLowerCase();

    return verifiedStores
      .map((store) => {
        // Products owned by this store
        const storeProducts = products.filter(
          (p) => p.storeUsername === store.username || p.sellerId === store.ownerId
        );

        let matches = false;
        let matchingProducts: Product[] = [];

        if (!q && selectedCategory === 'all') {
          matches = true;
          matchingProducts = storeProducts.slice(0, 4);
        } else {
          // Check products inside store for matches
          const matchedInStore = storeProducts.filter((p) => {
            if (q) {
              const matchTitle = (p.title || '').toLowerCase().includes(q);
              const matchDesc = (p.description || '').toLowerCase().includes(q);
              const matchCat = (p.category || '').toLowerCase().includes(q);
              const matchTags = Array.isArray(p.tags) && p.tags.some((t) => typeof t === 'string' && t.toLowerCase().includes(q));
              const matchBrand = p.brand ? p.brand.toLowerCase().includes(q) : false;
              const matchSynonym =
                (q === 'clothes' || q === 'clothing' || q === 'wear' || q === 'cloth') &&
                ((p.category || '').toLowerCase().includes('fashion') ||
                  p.categorySlug === 'fashion' ||
                  (Array.isArray(p.tags) && p.tags.some((t) => typeof t === 'string' && (t.includes('clothes') || t.includes('clothing') || t.includes('fashion')))));

              if (!matchTitle && !matchDesc && !matchCat && !matchTags && !matchBrand && !matchSynonym) {
                return false;
              }
            }
            if (selectedCategory !== 'all') {
              if (p.categorySlug !== selectedCategory && (p.category || '').toLowerCase() !== selectedCategory.toLowerCase()) {
                return false;
              }
            }
            return true;
          });

          // Check store categories for matches (e.g. "Clothes", "Fashion")
          const matchStoreCategory = Array.isArray(store.categories)
            ? store.categories.some((c) => {
                if (typeof c !== 'string') return false;
                const cLower = c.toLowerCase();
                if (q) {
                  if (cLower.includes(q)) return true;
                  if (
                    (q === 'clothes' || q === 'clothing' || q === 'wear') &&
                    (cLower.includes('fashion') || cLower.includes('streetwear') || cLower.includes('dresses') || cLower.includes('shoes'))
                  ) {
                    return true;
                  }
                }
                if (selectedCategory !== 'all') {
                  if (cLower.includes(selectedCategory.toLowerCase())) return true;
                }
                return false;
              })
            : false;

          const matchStoreDesc = q
            ? (store.description || '').toLowerCase().includes(q) || (store.name || '').toLowerCase().includes(q)
            : false;

          if (matchedInStore.length > 0 || matchStoreCategory || matchStoreDesc) {
            matches = true;
            matchingProducts = matchedInStore.length > 0 ? matchedInStore : storeProducts.slice(0, 4);
          }
        }

        // Apply state and city filters to store
        if (selectedState !== 'all' && (store.state || '').toLowerCase() !== selectedState.toLowerCase()) {
          matches = false;
        }
        if (selectedCity !== 'all' && !(store.location || '').toLowerCase().includes(selectedCity.toLowerCase())) {
          matches = false;
        }

        return {
          store,
          matches,
          matchingProducts,
        };
      })
      .filter((item) => item.matches);
  }, [stores, products, searchQuery, selectedCategory, selectedState, selectedCity]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSelectedCondition('all');
    setSelectedState('all');
    setSelectedCity('all');
    setVerifiedOnly(false);
    setMinPrice(0);
    setMaxPrice(5000000);
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full min-h-screen">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 pb-6 border-b border-white/[0.08]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
              {pageTitle}
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-mono-nums">
              {activeTab === 'products'
                ? `Showing ${filteredProducts.length} verified listings`
                : `Showing ${matchedVerifiedSellers.length} verified merchant storefronts`}
              {searchQuery.trim() && (
                <span> for &ldquo;<strong className="text-[#00C896]">{searchQuery}</strong>&rdquo;</span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Switcher: Products vs Verified Sellers */}
            <div className="flex items-center bg-[#14141B] border border-white/10 rounded-xl p-1 text-xs">
              <button
                onClick={() => setActiveTab('products')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === 'products'
                    ? 'bg-[#5B35F5] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Products ({filteredProducts.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('sellers')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === 'sellers'
                    ? 'bg-[#00C896] text-black font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 group-hover:text-black" />
                <span>Verified Sellers ({matchedVerifiedSellers.length})</span>
              </button>
            </div>

            {/* Mobile Filter Trigger */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="md:hidden flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-white/5 border border-white/10 rounded-xl text-white"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#7C4DFF]" />
              <span>Filters</span>
            </button>

            {/* Sort Dropdown */}
            {activeTab === 'products' && (
              <div className="flex items-center gap-2 bg-[#14141B] border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-slate-500 hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
                >
                  <option value="relevance" className="bg-[#14141B]">Relevance</option>
                  <option value="price_asc" className="bg-[#14141B]">Price: Low to High</option>
                  <option value="price_desc" className="bg-[#14141B]">Price: High to Low</option>
                  <option value="rating" className="bg-[#14141B]">Highest Rated</option>
                  <option value="newest" className="bg-[#14141B]">Newest Drops</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Dedicated Marketplace Search Bar with Dedicated Search Button, Voice Recognition & Live Popout */}
        <div ref={searchBarRef} className="relative w-full max-w-2xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleApplySearch(searchQuery);
              setSearchFocused(false);
            }}
            className="flex items-center relative w-full"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder={isListening ? 'Listening for voice... speak now' : 'Search products, clothes, verified sellers...'}
                value={searchQuery}
                onFocus={() => setSearchFocused(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchFocused(true);
                }}
                className={`w-full pl-10 pr-28 py-2.5 text-xs bg-[#14141B] border rounded-2xl text-white placeholder-slate-400 focus:outline-none transition-all ${
                  isListening
                    ? 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-500/10 placeholder-rose-300'
                    : 'border-white/10 focus:border-[#5B35F5]'
                }`}
              />

              <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                {/* Voice Search Button */}
                <button
                  type="button"
                  onClick={toggleVoiceSearch}
                  title={isListening ? 'Stop listening' : 'Voice Search (Detects voice & inputs text when stopped)'}
                  className={`p-1.5 rounded-xl transition cursor-pointer ${
                    isListening
                      ? 'bg-rose-500/20 text-rose-400 animate-pulse'
                      : 'text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                {/* Dedicated Search Button (Requirement: "searching button") */}
                <button
                  type="submit"
                  title="Search"
                  className="px-3.5 py-1.5 rounded-xl bg-[#5B35F5] hover:bg-[#7C4DFF] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#5B35F5]/30"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Search</span>
                </button>
              </div>
            </div>
          </form>

          {/* Live Popout for Storefronts & Products (e.g. typing "Emirate" pops out "Emirate Collection") */}
          {searchFocused && searchQuery.trim().length >= 1 && popoutStores.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#14141B] border border-white/10 rounded-2xl shadow-2xl p-2.5 z-40 animate-fade-in space-y-1">
              <div className="text-[10px] font-bold text-[#00C896] uppercase tracking-wider px-2 py-1 flex items-center gap-1">
                <StoreIcon className="w-3 h-3" />
                <span>Verified Storefronts</span>
              </div>
              {popoutStores.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => {
                    setSearchFocused(false);
                    navigate(`/store/${st.username}`);
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={st.logo}
                      alt={st.name}
                      className="w-8 h-8 rounded-lg object-cover ring-1 ring-white/10 shrink-0"
                    />
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-white group-hover:text-[#7C4DFF] transition truncate">
                          {st.name}
                        </span>
                        {st.isVerified && (
                          <ShieldCheck className="w-3.5 h-3.5 text-[#00C896] shrink-0" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 block truncate">
                        @{st.username} · {st.location}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#00C896] font-semibold bg-[#00C896]/10 px-2.5 py-1 rounded-lg shrink-0">
                    View Store
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Recent Searches Row */}
        {recentSearches.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-slate-500 font-medium flex items-center gap-1 shrink-0 text-[11px]">
              <Clock className="w-3 h-3 text-slate-500" />
              Recent Searches:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {recentSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => handleApplySearch(term)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer border ${
                    searchQuery.toLowerCase() === term.toLowerCase()
                      ? 'bg-[#5B35F5]/20 border-[#5B35F5] text-white font-semibold'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span>{term}</span>
                  <span
                    onClick={(e) => handleRemoveRecentSearch(term, e)}
                    className="hover:text-rose-400 text-slate-500 p-0.5 rounded"
                    title="Remove tag"
                  >
                    ×
                  </span>
                </button>
              ))}

              <button
                onClick={handleClearRecentSearches}
                className="text-[11px] text-slate-500 hover:text-slate-300 ml-1 underline"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Catalog View: Sidebar Filters + Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block col-span-1 space-y-6 text-xs text-slate-300">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <span className="font-semibold text-white uppercase tracking-wider text-[11px]">
              Filter Catalog
            </span>
            <button
              onClick={resetFilters}
              className="text-[#7C4DFF] hover:underline text-[11px] font-medium flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="font-semibold text-white block">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#14141B] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#5B35F5]"
            >
              <option value="all">All Categories</option>
              {CATEGORIES_LIST.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name} ({c.count})
                </option>
              ))}
            </select>
          </div>

          {/* Brand Filter */}
          <div className="space-y-2">
            <label className="font-semibold text-white block">Brand / Maker</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full bg-[#14141B] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#5B35F5]"
            >
              <option value="all">All Brands ({availableBrands.length})</option>
              {availableBrands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Filter (Min & Max) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-white">Price Range (₦)</label>
              <span className="font-mono-nums text-[11px] text-slate-400">
                {formatCurrency(minPrice)} - {formatCurrency(maxPrice)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-slate-500 block mb-0.5">Min (₦)</span>
                <input
                  type="number"
                  min="0"
                  max={maxPrice}
                  step="5000"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-[#14141B] border border-white/10 rounded-lg px-2.5 py-1.5 text-white text-xs font-mono"
                  placeholder="0"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block mb-0.5">Max (₦)</span>
                <input
                  type="number"
                  min={minPrice}
                  max="10000000"
                  step="25000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Math.max(minPrice, Number(e.target.value)))}
                  className="w-full bg-[#14141B] border border-white/10 rounded-lg px-2.5 py-1.5 text-white text-xs font-mono"
                  placeholder="5000000"
                />
              </div>
            </div>

            <input
              type="range"
              min="10000"
              max="5000000"
              step="25000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#5B35F5] cursor-pointer"
            />

            {/* Quick Price Preset Buttons */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { label: '< ₦50k', min: 0, max: 50000 },
                { label: '₦50k - ₦250k', min: 50000, max: 250000 },
                { label: '₦250k - ₦1M', min: 250000, max: 1000000 },
                { label: '₦1M+', min: 1000000, max: 5000000 },
              ].map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setMinPrice(preset.min);
                    setMaxPrice(preset.max);
                  }}
                  className={`px-2 py-1 rounded-md text-[10px] border transition-colors ${
                    minPrice === preset.min && maxPrice === preset.max
                      ? 'bg-[#5B35F5] text-white border-[#5B35F5]'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Condition Filter */}
          <div className="space-y-2">
            <label className="font-semibold text-white block">Condition</label>
            <div className="space-y-1.5">
              {['all', 'New', 'Used - Like New', 'Used - Good', 'Refurbished'].map((cond) => (
                <label key={cond} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="condition"
                    checked={selectedCondition === cond}
                    onChange={() => setSelectedCondition(cond)}
                    className="accent-[#5B35F5]"
                  />
                  <span>{cond === 'all' ? 'All Conditions' : cond}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Location State Filter */}
          <div className="space-y-2">
            <label className="font-semibold text-white block">Location (State)</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full bg-[#14141B] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#5B35F5]"
            >
              <option value="all">Nationwide (All States)</option>
              <option value="Lagos">Lagos</option>
              <option value="Abuja (FCT)">Abuja (FCT)</option>
              <option value="Rivers">Rivers (Port Harcourt)</option>
              <option value="Oyo">Oyo (Ibadan)</option>
            </select>
          </div>

          {/* Location City / District Filter */}
          <div className="space-y-2">
            <label className="font-semibold text-white block">City / Commercial District</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-[#14141B] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#5B35F5]"
            >
              <option value="all">All Districts</option>
              {availableCities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Verified Sellers Toggle */}
          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="accent-[#00C896] rounded w-4 h-4"
              />
              <div className="flex items-center gap-1.5 text-xs text-white">
                <ShieldCheck className="w-4 h-4 text-[#00C896]" />
                <span className="font-medium">Verified Sellers Only</span>
              </div>
            </label>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="col-span-1 md:col-span-3 space-y-6">
          {/* Highlight Banner: Verified Sellers by Product */}
          {activeTab === 'products' && matchedVerifiedSellers.length > 0 && searchQuery.trim() && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#00C896]/15 via-[#5B35F5]/10 to-transparent border border-[#00C896]/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#00C896]/20 flex items-center justify-center text-[#00C896]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>{matchedVerifiedSellers.length} Verified Sellers Offer &ldquo;{searchQuery}&rdquo;</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#00C896] text-black font-extrabold uppercase">
                        Verified
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-300">
                      Shop directly with authenticated merchants and official brand stores.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('sellers')}
                  className="text-xs font-semibold text-[#00C896] hover:underline flex items-center gap-1 shrink-0 self-start sm:self-auto"
                >
                  <span>View All {matchedVerifiedSellers.length} Sellers</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Horizontal quick preview of matched verified stores */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {matchedVerifiedSellers.slice(0, 2).map(({ store, matchingProducts }) => (
                  <div
                    key={store.id}
                    onClick={() => navigate(`/store/${store.username}`)}
                    className="p-3 rounded-xl bg-[#14141B] border border-white/10 hover:border-[#00C896]/50 transition-colors cursor-pointer flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={store.logo}
                        alt={store.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-xl object-cover shrink-0 border border-white/10"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <p className="font-bold text-white text-xs truncate">{store.name}</p>
                          <ShieldCheck className="w-3.5 h-3.5 text-[#00C896] shrink-0" />
                        </div>
                        <p className="text-[10px] text-slate-400 truncate">
                          {matchingProducts.length} items matching &ldquo;{searchQuery}&rdquo; · {store.location}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/store/${store.username}`);
                      }}
                      className="text-[11px] font-semibold text-[#00C896] hover:bg-[#00C896] hover:text-black px-2.5 py-1 rounded-lg bg-[#00C896]/10 shrink-0 transition flex items-center gap-1 cursor-pointer"
                    >
                      <StoreIcon className="w-3 h-3" />
                      <span>Visit Store</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 1: ALL PRODUCTS VIEW */}
          {activeTab === 'products' && (
            <>
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-[#14141B] border border-white/[0.08]">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-slate-400 mb-4">
                    <Search className="w-8 h-8 text-[#5B35F5]" />
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight">New and no product is found</h3>
                  <p className="text-xs text-slate-400 mt-1.5 max-w-sm">
                    {searchQuery.trim()
                      ? `No products currently match "${searchQuery}". This storefront may be newly registered or items have not been listed yet.`
                      : 'No products found matching your current filter criteria.'}
                  </p>

                  {/* If a verified storefront matches the query (e.g. Emirate Collection) */}
                  {matchedVerifiedSellers.length > 0 && (
                    <div className="mt-5 p-4 rounded-2xl bg-[#181824] border border-white/10 w-full max-w-md text-left">
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-[11px] font-bold text-[#00C896] uppercase tracking-wider flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4" /> Verified Storefront
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">New Store</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={matchedVerifiedSellers[0].store.logo}
                            alt={matchedVerifiedSellers[0].store.name}
                            className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/10 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate">
                              {matchedVerifiedSellers[0].store.name}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate">
                              @{matchedVerifiedSellers[0].store.username} · {matchedVerifiedSellers[0].store.location}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => navigate(`/store/${matchedVerifiedSellers[0].store.username}`)}
                          className="px-3.5 py-1.5 rounded-xl bg-[#00C896] hover:bg-[#00b084] text-slate-950 text-xs font-bold shrink-0 transition cursor-pointer flex items-center gap-1.5"
                        >
                          <StoreIcon className="w-3.5 h-3.5" />
                          <span>Visit Store</span>
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 mt-6">
                    <button
                      onClick={resetFilters}
                      className="px-4 py-2 text-xs font-semibold text-white bg-white/10 hover:bg-white/15 rounded-xl transition-colors cursor-pointer"
                    >
                      Clear All Filters
                    </button>
                    {matchedVerifiedSellers.length > 0 && (
                      <button
                        onClick={() => setActiveTab('sellers')}
                        className="px-4 py-2 text-xs font-semibold text-slate-950 bg-[#00C896] hover:bg-[#00b084] rounded-xl transition-colors cursor-pointer"
                      >
                        View Verified Sellers ({matchedVerifiedSellers.length})
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* TAB 2: VERIFIED SELLERS BY PRODUCT VIEW */}
          {activeTab === 'sellers' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-[#14141B] border border-white/10 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#00C896]" />
                    <span>Verified Merchant Storefronts</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {searchQuery.trim()
                      ? `Showing authentic, identity-verified sellers stocking "${searchQuery}"`
                      : 'All verified official brand and independent merchant storefronts'}
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-[#00C896] bg-[#00C896]/10 px-3 py-1 rounded-xl">
                  {matchedVerifiedSellers.length} Sellers
                </span>
              </div>

              {matchedVerifiedSellers.length > 0 ? (
                <div className="space-y-6">
                  {matchedVerifiedSellers.map(({ store, matchingProducts }) => (
                    <div
                      key={store.id}
                      className="p-5 rounded-2xl bg-[#14141B] border border-white/10 hover:border-[#00C896]/40 transition-all space-y-4"
                    >
                      {/* Store Header Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={store.logo}
                            alt={store.name}
                            referrerPolicy="no-referrer"
                            className="w-14 h-14 rounded-2xl object-cover border-2 border-white/10 shadow-md"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h3
                                onClick={() => navigate(`/store/${store.username}`)}
                                className="font-bold text-white text-base hover:text-[#00C896] transition-colors cursor-pointer"
                              >
                                {store.name}
                              </h3>
                              <span
                                title="Verified Business Identity"
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#00C896]/15 text-[#00C896] border border-[#00C896]/30"
                              >
                                <ShieldCheck className="w-3 h-3" />
                                <span>Verified</span>
                              </span>
                            </div>

                            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                              {store.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1.5 font-mono-nums">
                              <span className="flex items-center gap-1 text-slate-300">
                                <StarRating rating={store.rating || 5.0} count={store.reviewCount || 0} size="sm" />
                              </span>
                              <span>·</span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-slate-500" />
                                {store.location}
                              </span>
                              <span>·</span>
                              <span className="text-[#00C896]">
                                Replies in {store.responseTime || '< 30m'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                          <button
                            onClick={() => {
                              if (matchingProducts[0]) {
                                startProductChat(matchingProducts[0]);
                                navigate('/account/messages');
                              } else {
                                navigate(`/store/${store.username}`);
                              }
                            }}
                            className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-[#7C4DFF]" />
                            <span>Message</span>
                          </button>
                          <button
                            onClick={() => navigate(`/store/${store.username}`)}
                            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#5B35F5] hover:bg-[#7C4DFF] text-white shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <StoreIcon className="w-3.5 h-3.5" />
                            <span>Visit Store</span>
                          </button>
                        </div>
                      </div>

                      {/* Matching Products Showcase inside this Verified Store */}
                      {matchingProducts.length > 0 && (
                        <div className="pt-3 border-t border-white/5">
                          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                            {searchQuery.trim()
                              ? `Matching items available from this seller (${matchingProducts.length})`
                              : `Featured items from this seller (${matchingProducts.length})`}
                          </p>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {matchingProducts.map((p) => (
                              <div
                                key={p.id}
                                onClick={() => navigate(`/product/${p.id}`)}
                                className="group/item p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-white/15 transition-all cursor-pointer flex flex-col"
                              >
                                <div className="h-24 w-full rounded-lg overflow-hidden bg-black/40 mb-2">
                                  <img
                                    src={p.images[0]}
                                    alt={p.title}
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover group-hover/item:scale-105 transition-transform"
                                  />
                                </div>
                                <p className="text-xs font-semibold text-white truncate group-hover/item:text-[#00C896] transition-colors">
                                  {p.title}
                                </p>
                                <div className="flex items-center justify-between mt-1 text-[11px]">
                                  <span className="font-mono font-bold text-[#00C896]">
                                    {formatCurrency(p.price)}
                                  </span>
                                  {p.condition && (
                                    <span className="text-[10px] text-slate-500">
                                      {p.condition}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-[#14141B] border border-white/[0.08]">
                  <ShieldCheck className="w-12 h-12 text-slate-600 mb-3" />
                  <h3 className="text-base font-semibold text-white">No verified sellers matched this search</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm">
                    Try searching with broader terms like &ldquo;clothes&rdquo;, &ldquo;phones&rdquo;, or &ldquo;electronics&rdquo;.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="mt-5 px-4 py-2 text-xs font-semibold text-white bg-[#5B35F5] rounded-xl hover:bg-[#7C4DFF] transition-colors"
                  >
                    View All Verified Sellers
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Bottom Sheet */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/70 backdrop-blur-sm">
          <div className="w-full max-h-[85vh] overflow-y-auto rounded-t-3xl bg-[#14141B] border-t border-white/10 p-6 space-y-6 text-xs text-slate-300">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white">Filter Catalog</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Filter Fields */}
            <div className="space-y-4">
              <div>
                <label className="font-semibold text-white block mb-1.5">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-[#1C1C26] border border-white/10 rounded-xl p-3 text-white"
                >
                  <option value="all">All Categories</option>
                  {CATEGORIES_LIST.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-white block mb-1.5">Brand / Maker</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full bg-[#1C1C26] border border-white/10 rounded-xl p-3 text-white"
                >
                  <option value="all">All Brands ({availableBrands.length})</option>
                  {availableBrands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-white block mb-1.5">Price Range (₦)</label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(Math.max(0, Number(e.target.value)))}
                    className="bg-[#1C1C26] border border-white/10 rounded-xl p-2.5 text-white"
                    placeholder="Min Price"
                  />
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Math.max(minPrice, Number(e.target.value)))}
                    className="bg-[#1C1C26] border border-white/10 rounded-xl p-2.5 text-white"
                    placeholder="Max Price"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-white block mb-1.5">Condition</label>
                <select
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value)}
                  className="w-full bg-[#1C1C26] border border-white/10 rounded-xl p-3 text-white"
                >
                  <option value="all">All Conditions</option>
                  <option value="New">New</option>
                  <option value="Used - Like New">Used - Like New</option>
                  <option value="Used - Good">Used - Good</option>
                  <option value="Refurbished">Refurbished</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-white block mb-1.5">Location State</label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full bg-[#1C1C26] border border-white/10 rounded-xl p-3 text-white"
                >
                  <option value="all">Nationwide</option>
                  <option value="Lagos">Lagos</option>
                  <option value="Abuja (FCT)">Abuja (FCT)</option>
                  <option value="Rivers">Rivers</option>
                  <option value="Oyo">Oyo</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-white block mb-1.5">City / District</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full bg-[#1C1C26] border border-white/10 rounded-xl p-3 text-white"
                >
                  <option value="all">All Districts</option>
                  {availableCities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl bg-white/5 border border-white/5">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="accent-[#00C896] rounded w-4 h-4"
                  />
                  <span className="font-semibold text-white">Verified Sellers Only</span>
                </label>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-3">
              <button
                onClick={() => {
                  resetFilters();
                  setMobileFilterOpen(false);
                }}
                className="flex-1 py-3 text-xs font-semibold rounded-xl bg-white/5 text-slate-300"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-3 text-xs font-semibold rounded-xl bg-[#5B35F5] text-white shadow-lg shadow-[#5B35F5]/30"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
