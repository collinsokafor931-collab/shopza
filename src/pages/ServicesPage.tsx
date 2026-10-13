import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { Briefcase, Clock, MapPin, Star, MessageSquare, CheckCircle2, X } from 'lucide-react';

interface ServicesPageProps {
  navigate: (path: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ navigate }) => {
  const { services, startOrGetConversation, formatCurrency, addToast } = useMarketplace();
  const [selectedService, setSelectedService] = useState<any>(null);
  const [inquiryText, setInquiryText] = useState('');

  const handleOpenInquiry = (service: any) => {
    setSelectedService(service);
    setInquiryText(`Hello! I am interested in booking "${service.title}". Could you provide availability and a quote?`);
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;
    const convId = startOrGetConversation(selectedService.storeUsername);
    addToast('Inquiry Sent', `Your message was delivered to @${selectedService.storeUsername}`, 'success');
    setSelectedService(null);
    navigate(`/account/messages?id=${convId}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="mb-8">
        <div className="text-xs font-semibold uppercase tracking-wider text-[#00C896] mb-1">Permitted Professional Services</div>
        <h1 className="font-display text-3xl font-extrabold text-white tracking-tight">
          Services Marketplace
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Book verified commercial photography, electronics micro-soldering, solar & inverter installation, bespoke tailoring, and creative technical services safely backed by SHOPZA.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((srv) => (
          <div
            key={srv.id}
            className="rounded-3xl bg-[#14141B] border border-white/8 overflow-hidden hover:border-white/20 transition flex flex-col shadow-sm hover:shadow-xl"
          >
            {/* Service Cover Image */}
            <div className="relative aspect-[16/9] w-full bg-[#1A1A24] overflow-hidden">
              <img
                src={srv.images[0]}
                alt={srv.title}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
              <div className="absolute top-3 left-3 rounded-lg bg-black/60 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-[#00C896]">
                {srv.category}
              </div>
            </div>

            <div className="p-6 flex flex-col flex-1">
              <h3 className="font-bold text-base text-white line-clamp-2 leading-snug">
                {srv.title}
              </h3>
              <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                {srv.description}
              </p>

              {/* Provider details */}
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                <button
                  onClick={() => navigate(`/store/${srv.storeUsername}`)}
                  className="flex items-center gap-2 hover:opacity-80 transition cursor-pointer"
                >
                  <img
                    src={srv.sellerAvatar}
                    alt={srv.sellerName}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <div className="text-left">
                    <span className="text-xs font-semibold text-slate-200">@{srv.storeUsername}</span>
                    <div className="flex items-center gap-1 text-[10px] text-amber-400">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span className="font-mono-nums">{srv.sellerRating}</span>
                    </div>
                  </div>
                </button>

                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{srv.deliveryTime}</span>
                </div>
              </div>

              {/* Price and CTA */}
              <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500">Starting from</span>
                  <p className="font-mono-nums text-base font-bold text-white">
                    {formatCurrency(srv.startingPrice)}
                  </p>
                </div>

                <button
                  onClick={() => handleOpenInquiry(srv)}
                  className="rounded-xl bg-[#5B35F5] px-4 py-2 text-xs font-semibold text-white hover:bg-[#4d2ad4] shadow-md transition active:scale-95 cursor-pointer"
                >
                  Inquire / Book
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Inquiry Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#14141B] border border-white/10 p-6 shadow-2xl text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div>
                <h3 className="font-bold text-sm text-white">{selectedService.title}</h3>
                <p className="text-xs text-slate-400">Direct message with @{selectedService.storeUsername}</p>
              </div>
              <button onClick={() => setSelectedService(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendInquiry} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Your Requirements / Dates</label>
                <textarea
                  rows={4}
                  value={inquiryText}
                  onChange={(e) => setInquiryText(e.target.value)}
                  className="w-full rounded-xl bg-[#1A1A24] border border-white/10 p-2.5 text-xs text-white focus:outline-none"
                  required
                />
              </div>

              <div className="rounded-xl bg-[#1A1A24] p-3 text-xs text-slate-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00C896] shrink-0" />
                <span>Custom quote and milestones will be sent directly via SHOPZA chat.</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  className="rounded-xl px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#5B35F5] px-5 py-2 text-xs font-semibold text-white hover:bg-[#4d2ad4] shadow-md"
                >
                  Send Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
