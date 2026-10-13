import React from 'react';
import { ShieldCheck, HeartHandshake, Zap, HelpCircle } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { PWAInstallButton } from './PWAInstallButton';

export const Footer: React.FC<{ navigate?: (path: string) => void }> = ({ navigate: propNavigate }) => {
  const context = useMarketplace();
  const navigate = propNavigate || context.navigate;
  const { config } = context;

  return (
    <footer className="w-full bg-[#0E0E14] border-t border-white/[0.08] text-slate-400 text-xs">
      {/* Trust & Safety Highlights */}
      <div className="border-b border-white/[0.06] py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-white/5 text-[#00C896] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Escrow & Secure Payments</h4>
              <p className="mt-1 text-slate-400 leading-relaxed text-[11px]">
                Funds are protected until verified delivery. Zero raw card storage.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-white/5 text-[#7C4DFF] shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Verified Local Sellers</h4>
              <p className="mt-1 text-slate-400 leading-relaxed text-[11px]">
                Rigorous identity & business verification across Nigerian commercial hubs.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-white/5 text-amber-400 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Transparent {config.commissionRatePercent.toFixed(1)}% Platform Fee</h4>
              <p className="mt-1 text-slate-400 leading-relaxed text-[11px]">
                No hidden deductions. Sellers keep over 97% of sales proceeds.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-white/5 text-blue-400 shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Buyer Protection Guarantee</h4>
              <p className="mt-1 text-slate-400 leading-relaxed text-[11px]">
                7-day inspection window and fast dispute resolution center.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Directory Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2 md:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#5B35F5] to-[#7C4DFF] flex items-center justify-center">
              <span className="font-display font-black text-white text-base">S</span>
            </div>
            <span className="font-display font-black text-lg tracking-tight text-white">SHOPZA</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
            BUY. SELL. DISCOVER. Nigeria's premier mobile-first marketplace and PWA connecting discerning buyers with verified independent merchants, creators, and service artisans.
          </p>
          <div className="pt-2">
            <PWAInstallButton variant="banner" />
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Marketplace</h4>
          <ul className="space-y-2">
            <li>
              <button onClick={() => navigate('/marketplace')} className="hover:text-white transition-colors">
                Browse All Products
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/categories')} className="hover:text-white transition-colors">
                Category Directory
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/stores')} className="hover:text-white transition-colors">
                Verified Stores
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/services')} className="hover:text-white transition-colors">
                Artisanal Services
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/deals')} className="hover:text-white transition-colors">
                Flash Deals & Promotions
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Sellers</h4>
          <ul className="space-y-2">
            <li>
              <button onClick={() => navigate('/sell')} className="hover:text-white transition-colors">
                Become a Seller
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/seller/onboarding')} className="hover:text-white transition-colors">
                Store Onboarding
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/seller/dashboard')} className="hover:text-white transition-colors">
                Merchant Hub
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/seller/earnings')} className="hover:text-white transition-colors">
                Earnings & Payouts
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/seller/promotions')} className="hover:text-white transition-colors">
                Boost Listings
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Trust & Legal</h4>
          <ul className="space-y-2">
            <li>
              <button onClick={() => navigate('/safety')} className="hover:text-white transition-colors">
                Safety Center
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/report')} className="hover:text-white transition-colors">
                Report Prohibited Item
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/terms')} className="hover:text-white transition-colors">
                Terms of Service
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/privacy')} className="hover:text-white transition-colors">
                Privacy Policy
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/contact')} className="hover:text-white transition-colors">
                Help & Contact
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Sub-bar */}
      <div className="border-t border-white/[0.06] py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} SHOPZA Technologies Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-[#00C896]"></span>
              <span>Currency: NGN (₦) Nigerian Naira</span>
            </span>
            <span>·</span>
            <span>Platform Commission: {config.commissionRatePercent.toFixed(1)}%</span>
            <span>·</span>
            <button onClick={() => navigate('/admin')} className="text-slate-400 hover:text-white underline">
              Admin Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
