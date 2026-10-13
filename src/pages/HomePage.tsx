import React, { useState } from 'react';
import {
  Search,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  ShoppingBag,
  Store as StoreIcon,
  Sparkles,
  ChevronRight,
  Percent,
  CheckCircle2,
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import {
  CATEGORIES_LIST,
  heroMarketplaceImg,
  catUrbanFashionImg,
  catElectronicsImg,
  catHomeLivingImg,
} from '../constants/marketplace';
import { ProductCard } from '../components/marketplace/ProductCard';
import { StoreCard } from '../components/marketplace/StoreCard';

export const HomePage: React.FC = () => {
  const { navigate, products, stores, services, config } = useMarketplace();
  const [heroSearch, setHeroSearch] = useState('');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/search?q=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate('/marketplace');
    }
  };

  const trendingProducts = products.filter((p) => p.isTrending || p.isFeatured).slice(0, 8);
  const featuredStores = stores.slice(0, 4);
  const featuredServices = services.slice(0, 3);
  const dealProducts = products.filter((p) => p.originalPrice && p.originalPrice > p.price).slice(0, 4);

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0E0E14] via-[#0B0B0F] to-[#0B0B0F] border-b border-white/[0.08] pt-12 pb-16 md:pt-20 md:pb-24">
        {/* Subtle radial ambient background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-[#5B35F5]/15 via-[#7C4DFF]/10 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & Actions */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300">
                <span className="w-2 h-2 rounded-full bg-[#00C896] animate-pulse" />
                <span className="font-medium">Nigeria's Modern Commerce Marketplace</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-white tracking-tight leading-[1.08] max-w-2xl text-balance">
                BUY. SELL. <br />
                <span className="bg-gradient-to-r from-[#7C4DFF] via-[#5B35F5] to-[#00C896] bg-clip-text text-transparent">
                  DISCOVER.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed">
                Connect directly with verified independent merchants, streetwear designers, artisanal creators, and technical service providers. Safe escrow, verified identities, transparent {config.commissionRatePercent.toFixed(1)}% fee.
              </p>

              {/* Live Interactive Search */}
              <form onSubmit={handleHeroSearch} className="max-w-xl flex items-center gap-2 p-1.5 rounded-2xl bg-[#14141B] border border-white/15 shadow-2xl focus-within:border-[#5B35F5] transition-colors">
                <div className="flex items-center flex-1 pl-3 gap-2">
                  <Search className="w-5 h-5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={heroSearch}
                    onChange={(e) => setHeroSearch(e.target.value)}
                    placeholder="Search electronics, luxury denim, smartphones, decor..."
                    className="w-full py-2.5 text-sm bg-transparent text-white placeholder-slate-400 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-[#5B35F5] hover:bg-[#7C4DFF] text-white text-xs font-semibold shadow-lg shadow-[#5B35F5]/30 transition-all shrink-0 flex items-center gap-1.5"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Quick Category Jump Links */}
              <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-slate-400">
                <span className="text-slate-500 font-medium">Popular:</span>
                {['Smartphones', 'Streetwear', 'ANC Audio', 'Home Decor', 'Laptops'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => navigate(`/search?q=${encodeURIComponent(tag)}`)}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Stats proof row */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/[0.08] max-w-lg">
                <div>
                  <p className="text-2xl font-bold font-mono-nums text-white">100%</p>
                  <p className="text-xs text-slate-400 mt-0.5">Verified Merchants</p>
                </div>
                <div>
                  <p className="text-2xl font-bold font-mono-nums text-white">{config.commissionRatePercent.toFixed(1)}%</p>
                  <p className="text-xs text-slate-400 mt-0.5">Transparent Fee</p>
                </div>
                <div>
                  <p className="text-2xl font-bold font-mono-nums text-[#00C896]">24h</p>
                  <p className="text-xs text-slate-400 mt-0.5">Express Lagos Dispatch</p>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Asset Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl shadow-[#5B35F5]/10 bg-[#14141B] group">
                <img
                  src={heroMarketplaceImg}
                  alt="SHOPZA Curated Marketplace Lifestyle"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto aspect-4/3 object-cover group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Floating Showcase Tag */}
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between p-3.5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/15">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#5B35F5] to-[#00C896] flex items-center justify-center font-bold text-white text-sm">
                      ⚡
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">Daily Curated Drops</p>
                      <p className="text-[11px] text-slate-300">Over 350+ certified new arrivals this week</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/marketplace')}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
                  >
                    View Drops
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Popular Categories Section */}
      <section className="py-14 bg-[#0B0B0F] border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#7C4DFF] mb-1">Taxonomy</p>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                Curated Marketplace Categories
              </h2>
            </div>
            <button
              onClick={() => navigate('/categories')}
              className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1 group"
            >
              <span>Explore All</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {CATEGORIES_LIST.slice(0, 8).map((cat) => (
              <div
                key={cat.slug}
                onClick={() => navigate(`/category/${cat.slug}`)}
                className="group relative flex flex-col rounded-2xl overflow-hidden bg-[#14141B] border border-white/[0.08] hover:border-white/20 transition-all duration-200 cursor-pointer hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-32 w-full bg-[#1A1A24] overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>
                <div className="p-3.5">
                  <h3 className="font-semibold text-white text-sm group-hover:text-[#7C4DFF] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5 font-mono-nums">
                    {cat.count} listings
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Trending Products */}
      <section className="py-16 bg-[#0E0E14] border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#00C896] mb-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Trending Drops</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                Hot On SHOPZA Today
              </h2>
            </div>
            <button
              onClick={() => navigate('/trending')}
              className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1 group"
            >
              <span>View More</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {trendingProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center">
              <ShoppingBag className="w-10 h-10 text-slate-500 mx-auto mb-3" />
              <h3 className="font-display text-base font-bold text-white">No products yet</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Be the first to list a product on SHOPZA. Connect with buyers nationwide.
              </p>
              <button
                onClick={() => navigate('/seller/dashboard')}
                className="mt-4 rounded-xl bg-[#5B35F5] px-4 py-2 text-xs font-bold text-white hover:bg-[#4d2ad4] transition cursor-pointer"
              >
                List a Product
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 4. Verified Stores Spotlight */}
      <section className="py-16 bg-[#0B0B0F] border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#7C4DFF] mb-1">
                <StoreIcon className="w-3.5 h-3.5" />
                <span>Storefront Directory</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                Featured Verified Merchants
              </h2>
            </div>
            <button
              onClick={() => navigate('/stores')}
              className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1 group"
            >
              <span>All Stores</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {featuredStores.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredStores.map((store) => (
                <StoreCard key={store.id} store={store} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center">
              <StoreIcon className="w-10 h-10 text-slate-500 mx-auto mb-3" />
              <h3 className="font-display text-base font-bold text-white">No stores yet</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Be the first to open a verified digital storefront and reach thousands of shoppers.
              </p>
              <button
                onClick={() => navigate('/seller/dashboard')}
                className="mt-4 rounded-xl bg-[#00C896] px-4 py-2 text-xs font-bold text-slate-900 hover:brightness-110 transition cursor-pointer"
              >
                Create Storefront
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 5. Flash Deals Section */}
      {dealProducts.length > 0 && (
        <section className="py-16 bg-[#0E0E14] border-b border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-end justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
                  <Percent className="w-3.5 h-3.5" />
                  <span>Exclusive Markdown</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                  Deals & Promotional Pricing
                </h2>
              </div>
              <button
                onClick={() => navigate('/deals')}
                className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1 group"
              >
                <span>All Deals</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {dealProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. Artisanal & Technical Services */}
      <section className="py-16 bg-[#0B0B0F] border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#00C896] mb-1">Specialized Skills</p>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                Verified Services Marketplace
              </h2>
            </div>
            <button
              onClick={() => navigate('/services')}
              className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1 group"
            >
              <span>Explore Services</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredServices.map((service) => (
              <div
                key={service.id}
                onClick={() => navigate(`/services`)}
                className="group flex flex-col rounded-2xl bg-[#14141B] border border-white/[0.08] hover:border-white/20 p-5 transition-all duration-200 hover:-translate-y-1 cursor-pointer"
              >
                <div className="aspect-16/9 w-full rounded-xl overflow-hidden bg-[#1A1A24] mb-4">
                  <img
                    src={service.images[0]}
                    alt={service.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                  <span className="font-medium text-slate-300">{service.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{service.location}</span>
                </div>
                <h3 className="font-semibold text-white text-sm group-hover:text-[#7C4DFF] transition-colors line-clamp-2 mb-2">
                  {service.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                  {service.description}
                </p>
                <div className="mt-auto pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-xs text-slate-400">Starting from</span>
                  <span className="text-sm font-bold text-white font-mono-nums">
                    ₦{service.startingPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. How SHOPZA Works & Escrow Guarantee */}
      <section className="py-20 bg-[#0E0E14] border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
              Engineered For Modern Marketplace Trust
            </h2>
            <p className="mt-3 text-slate-400 text-sm leading-relaxed">
              Every checkout is protected by our transparent escrow protocol and local dispatch verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col p-6 rounded-2xl bg-[#14141B] border border-white/[0.08]">
              <div className="w-12 h-12 rounded-xl bg-[#5B35F5]/20 text-[#7C4DFF] flex items-center justify-center font-bold text-lg mb-4">
                01
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Discover Verified Listings</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Browse authentic items from approved merchants. Chat directly with sellers to confirm dimensions, conditions, or bespoke requests before purchasing.
              </p>
            </div>

            <div className="flex flex-col p-6 rounded-2xl bg-[#14141B] border border-white/[0.08]">
              <div className="w-12 h-12 rounded-xl bg-[#00C896]/20 text-[#00C896] flex items-center justify-center font-bold text-lg mb-4">
                02
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Escrow Protected Checkout</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pay securely via Card, Bank Transfer, or USSD. Your funds are held safely until your item is delivered and inspected.
              </p>
            </div>

            <div className="flex flex-col p-6 rounded-2xl bg-[#14141B] border border-white/[0.08]">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg mb-4">
                03
              </div>
              <h3 className="text-base font-semibold text-white mb-2">Instant Seller Payout</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Once delivery is confirmed, the seller receives over 97% of the sale value directly to their Nigerian bank account. Clear {config.commissionRatePercent.toFixed(1)}% fee.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Call to Action: Start Selling */}
      <section className="py-20 bg-gradient-to-r from-[#5B35F5]/20 via-[#7C4DFF]/20 to-transparent border-b border-white/[0.08] relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight">
            Launch Your Dynamic Digital Store on SHOPZA
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Get an instant custom storefront URL, automated order dispatch management, transparent {config.commissionRatePercent.toFixed(1)}% platform commission, and direct payouts to your bank.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigate('/sell')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#5B35F5] hover:bg-[#7C4DFF] text-white font-semibold text-sm shadow-xl shadow-[#5B35F5]/30 transition-colors"
            >
              Start Selling Today
            </button>
            <button
              onClick={() => navigate('/how-it-works')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm transition-colors"
            >
              Learn How It Works
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
