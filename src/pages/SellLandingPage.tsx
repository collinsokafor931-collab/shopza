import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { Store, ShieldCheck, Zap, TrendingUp, Users, ArrowRight, CheckCircle2 } from 'lucide-react';

interface SellLandingPageProps {
  navigate: (path: string) => void;
}

export const SellLandingPage: React.FC<SellLandingPageProps> = ({ navigate }) => {
  const { currentUser, config } = useMarketplace();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/8 bg-gradient-to-b from-[#14141B] via-[#0B0B0F] to-[#0B0B0F] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs text-[#00C896] backdrop-blur-md mb-6">
            <Store className="w-3.5 h-3.5" />
            <span>Open to Individual Sellers, Creators & Retailers</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight max-w-3xl mx-auto leading-tight">
            Launch Your Branded Storefront on SHOPZA
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Every seller automatically receives a personalized store page at <span className="text-white font-mono font-semibold">/store/:username</span>. Sell physical goods or permitted services with our transparent {config.commissionRatePercent}% platform fee.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            {currentUser?.isSeller ? (
              <button
                onClick={() => navigate('/seller/dashboard')}
                className="w-full sm:w-auto rounded-xl bg-[#00C896] px-8 py-4 text-sm font-bold text-black hover:bg-[#05e2aa] shadow-xl transition active:scale-95 cursor-pointer"
              >
                Go to My Seller Dashboard
              </button>
            ) : (
              <button
                onClick={() => navigate('/seller/onboarding')}
                className="w-full sm:w-auto rounded-xl bg-[#5B35F5] px-8 py-4 text-sm font-bold text-white hover:bg-[#4d2ad4] shadow-xl shadow-[#5B35F5]/30 transition active:scale-95 cursor-pointer"
              >
                Launch Your Store
              </button>
            )}
            <button
              onClick={() => navigate('/how-it-works')}
              className="w-full sm:w-auto rounded-xl border border-white/15 bg-white/5 px-6 py-4 text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              Learn Fee Structure
            </button>
          </div>
        </div>
      </section>

      {/* 4 Pillars of Selling on SHOPZA */}
      <section className="py-16 border-b border-white/8 bg-[#0F0F15]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-3xl bg-[#14141B] border border-white/8 p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#5B35F5]/20 flex items-center justify-center text-[#5B35F5]">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl text-white">Dynamic Store URL</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Receive an automatic branded page with custom banners, logo, policies, response ratings, and categories without coding.
              </p>
            </div>

            <div className="rounded-3xl bg-[#14141B] border border-white/8 p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#00C896]/20 flex items-center justify-center text-[#00C896]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl text-white">Escrow Fraud Shield</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Never worry about bounced transfers or buyer chargebacks. Funds are verified and held securely in escrow before you ship.
              </p>
            </div>

            <div className="rounded-3xl bg-[#14141B] border border-white/8 p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 flex items-center justify-center text-amber-400">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl text-white">Transparent {config.commissionRatePercent}% Commission</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Retain 97% of your gross earnings. Direct automated bank payouts to all licensed commercial banks in Nigeria.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
