import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { CATEGORIES_LIST } from '../constants/marketplace';
import { ProductCard } from '../components/marketplace/ProductCard';

export const CategoriesPage: React.FC = () => {
  const { navigate } = useMarketplace();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full min-h-screen">
      <div className="pb-6 border-b border-white/[0.08] mb-8">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">Category Directory</h1>
        <p className="text-xs text-slate-400 mt-1">Browse all curated marketplace collections and departments.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES_LIST.map((cat) => (
          <div
            key={cat.slug}
            onClick={() => navigate(`/category/${cat.slug}`)}
            className="group flex flex-col rounded-2xl bg-[#14141B] border border-white/[0.08] hover:border-white/20 overflow-hidden cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="h-40 w-full overflow-hidden bg-[#1A1A24]">
              <img
                src={cat.image}
                alt={cat.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-[#7C4DFF] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{cat.description}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
                <span className="font-mono-nums">{cat.count} listings</span>
                <span className="text-[#00C896] font-semibold">Explore →</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ServicesPage: React.FC = () => {
  const { services, navigate, currentUser, addToast } = useMarketplace();

  const handleInquire = (serviceTitle: string) => {
    if (!currentUser) {
      addToast('warning', 'Sign In Required', 'Please sign in to book or inquire about services.');
      navigate('/login');
      return;
    }
    navigate('/account/messages');
    addToast('info', 'Service Inquiry Initiated', `Direct message thread opened for "${serviceTitle}"`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full min-h-screen">
      <div className="pb-6 border-b border-white/[0.08] mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            Artisanal & Specialized Services
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Book certified commercial photographers, technicians, repair engineers, and solar auditors.
          </p>
        </div>

        <button
          onClick={() => {
            if (currentUser?.isSeller) navigate('/seller/dashboard');
            else navigate('/sell');
          }}
          className="px-4 py-2.5 rounded-xl bg-[#5B35F5] hover:bg-[#7C4DFF] text-white text-xs font-semibold"
        >
          Offer a Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((serv) => (
          <div
            key={serv.id}
            className="flex flex-col rounded-2xl bg-[#14141B] border border-white/[0.08] p-5 space-y-4 hover:border-white/20 transition-all shadow-xl"
          >
            <div className="aspect-16/9 rounded-xl overflow-hidden bg-[#1A1A24]">
              <img src={serv.images[0]} alt={serv.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <span className="font-semibold text-slate-300">{serv.category}</span>
                <span aria-hidden="true">·</span>
                <span>{serv.location}</span>
              </div>
              <h3 className="text-sm font-bold text-white line-clamp-2">{serv.title}</h3>
              <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mt-2">{serv.description}</p>
            </div>

            <div className="mt-auto pt-4 border-t border-white/[0.06] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 block">Starting from</span>
                <span className="text-base font-extrabold text-white font-mono-nums">
                  ₦{serv.startingPrice.toLocaleString()}
                </span>
              </div>

              <button
                onClick={() => handleInquire(serv.title)}
                className="px-4 py-2 rounded-xl bg-[#5B35F5] hover:bg-[#7C4DFF] text-white text-xs font-semibold shadow-md"
              >
                Inquire & Book
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
