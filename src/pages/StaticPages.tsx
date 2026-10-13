import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { ShieldCheck, HelpCircle, Mail, FileText, Lock, AlertTriangle, CheckCircle2, ChevronDown, Send } from 'lucide-react';

interface StaticPageProps {
  page: 'about' | 'how-it-works' | 'safety' | 'help' | 'contact' | 'terms' | 'privacy' | 'report';
  navigate: (path: string) => void;
}

export const StaticPages: React.FC<StaticPageProps> = ({ page, navigate }) => {
  const { config, submitReport, addToast } = useMarketplace();

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  // Standalone Report form state
  const [repType, setRepType] = useState<any>('product');
  const [repId, setRepId] = useState('');
  const [repReason, setRepReason] = useState<any>('scam');
  const [repDetails, setRepDetails] = useState('');

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    addToast('Message Dispatched', 'Our support team will respond within 24 hours.', 'success');
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReport({
      reporterId: 'user-community',
      reporterName: 'Community Member',
      targetType: repType,
      targetId: repId || 'manual-report',
      targetTitle: `Flagged ${repType}: ${repId || 'Manual input'}`,
      reason: repReason,
      details: repDetails,
    });
    setRepDetails('');
    setRepId('');
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      {/* 1. ABOUT SHOPZA */}
      {page === 'about' && (
        <div className="space-y-6">
          <div className="mb-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#00C896]">About SHOPZA</span>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white mt-1">
              BUY. SELL. DISCOVER.
            </h1>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              SHOPZA is a next-generation decentralized commerce platform and installable Progressive Web App (PWA) built to power high-trust trade across Nigeria and Africa.
            </p>
          </div>

          <div className="rounded-3xl bg-[#14141B] border border-white/8 p-8 space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed shadow-xl">
            <h3 className="text-base font-bold text-white">Our Core Mission</h3>
            <p>
              We believe anyone with authentic products or skills should be able to launch a commercial-grade online store in 3 minutes without paying exorbitant recurring website hosting fees. Every merchant on SHOPZA gets their own dedicated dynamic storefront at <code>/store/:username</code>.
            </p>
            <p>
              Simultaneously, buyers deserve complete peace of mind. Every transaction on SHOPZA is secured with automated escrow protection. Funds are safely held in trust until tracked delivery is fulfilled and verified.
            </p>
          </div>
        </div>
      )}

      {/* 2. HOW IT WORKS */}
      {page === 'how-it-works' && (
        <div className="space-y-6">
          <div className="mb-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#7C4DFF]">Transparency & Architecture</span>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white mt-1">
              How SHOPZA Works
            </h1>
            <p className="text-sm text-slate-400 mt-2">
              A frictionless flow designed for buyers, sellers, and safe transaction escrow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-3xl bg-[#14141B] border border-white/8 p-6 space-y-3">
              <span className="w-8 h-8 rounded-lg bg-[#5B35F5]/20 text-[#5B35F5] font-bold flex items-center justify-center text-xs">For Buyers</span>
              <h3 className="font-bold text-base text-white">Verified Discovery</h3>
              <ul className="space-y-2 text-xs text-slate-400 list-disc pl-4 leading-relaxed">
                <li>Search products across verified local merchants with transparent condition ratings.</li>
                <li>Chat directly with sellers regarding sizing, fit, and logistics.</li>
                <li>Pay via Card, Bank Transfer, or USSD into licensed escrow.</li>
                <li>Receive courier tracking and release payout only after inspecting your delivery.</li>
              </ul>
            </div>

            <div className="rounded-3xl bg-[#14141B] border border-white/8 p-6 space-y-3">
              <span className="w-8 h-8 rounded-lg bg-[#00C896]/20 text-[#00C896] font-bold flex items-center justify-center text-xs">For Sellers</span>
              <h3 className="font-bold text-base text-white">Instant Branded Store</h3>
              <ul className="space-y-2 text-xs text-slate-400 list-disc pl-4 leading-relaxed">
                <li>Open your store at <code>/store/:username</code> with custom banners, policies, and products.</li>
                <li>Keep 97% of your revenue with our fair, configurable {config.commissionRatePercent}% platform fee.</li>
                <li>Zero monthly listing fees or forced subscriptions.</li>
                <li>Automated settlements to your commercial Nigerian bank account within 24 hours.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 3. SAFETY CENTER */}
      {page === 'safety' && (
        <div className="space-y-6">
          <div className="mb-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#00C896]">Trust & Safety</span>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white mt-1">
              Safety & Fraud Prevention Center
            </h1>
            <p className="text-sm text-slate-400 mt-2">
              Guidelines to ensure 100% safe purchasing and genuine merchandise.
            </p>
          </div>

          <div className="rounded-3xl bg-[#14141B] border border-white/8 p-8 space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed shadow-xl">
            <h3 className="font-bold text-base text-white">Never Transact Outside the Platform</h3>
            <p className="text-slate-400">
              Always complete payments through SHOPZA's encrypted checkout gateway. If a seller asks you to transfer funds directly to a personal WhatsApp number or non-escrow account, report them immediately. Transactions conducted off-platform forfeit SHOPZA Buyer Protection.
            </p>
            <h3 className="font-bold text-base text-white pt-2">Identity & Merchant Verification</h3>
            <p className="text-slate-400">
              Verified merchants undergo strict CAC business registry checks and verified phone & bank matching before carrying the green checkmark badge.
            </p>
          </div>
        </div>
      )}

      {/* 4. HELP CENTER */}
      {page === 'help' && (
        <div className="space-y-6">
          <div className="mb-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#7C4DFF]">Support Center</span>
            <h1 className="font-display text-3xl font-extrabold text-white mt-1">Frequently Asked Questions</h1>
          </div>

          <div className="space-y-3">
            {[
              { q: 'How does the SHOPZA Escrow system protect my money?', a: 'When you place an order, your payment is held securely in trust. The merchant is notified to dispatch your items. Funds are released to the seller only once courier delivery is confirmed and you have inspected your package.' },
              { q: 'What is the platform fee for selling on SHOPZA?', a: `SHOPZA charges a low, transparent platform fee (currently ${config.commissionRatePercent}%) only upon successful transactions. There are no upfront setup fees or monthly listing charges.` },
              { q: 'How do sellers receive their earnings?', a: 'Sellers can request automated bank payouts through their Earnings Hub. Payouts are settled via NIBSS / Paystack direct transfer into any registered commercial bank in Nigeria.' },
              { q: 'What items are strictly prohibited?', a: 'We strictly ban counterfeit goods, weapons, explosives, illegal substances, and stolen merchandise. Violations result in immediate account suspension.' },
            ].map((faq, i) => (
              <div key={i} className="rounded-2xl bg-[#14141B] border border-white/8 p-5 space-y-2">
                <h4 className="font-bold text-sm text-white">{faq.q}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. CONTACT */}
      {page === 'contact' && (
        <div className="space-y-6">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-extrabold text-white">Contact SHOPZA Support</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Have questions regarding orders, merchant onboarding, or partnership inquiries? Send us a message.
            </p>
          </div>

          {contactSent ? (
            <div className="rounded-3xl bg-[#00C896]/10 border border-[#00C896]/20 p-8 text-center text-xs text-[#00C896] space-y-2">
              <CheckCircle2 className="w-8 h-8 mx-auto" />
              <h3 className="font-bold text-sm text-white">Message Delivered</h3>
              <p>Thank you! Our operations support desk has logged your ticket.</p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="rounded-3xl bg-[#14141B] border border-white/8 p-6 sm:p-8 space-y-4 shadow-xl">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full rounded-xl bg-[#1A1A24] border border-white/10 p-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full rounded-xl bg-[#1A1A24] border border-white/10 p-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Message / Inquiry</label>
                <textarea
                  rows={4}
                  required
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="w-full rounded-xl bg-[#1A1A24] border border-white/10 p-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="rounded-xl bg-[#5B35F5] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#4d2ad4] shadow-md transition cursor-pointer"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      )}

      {/* 6. TERMS & PRIVACY */}
      {(page === 'terms' || page === 'privacy') && (
        <div className="space-y-6">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-extrabold text-white">
              {page === 'terms' ? 'Terms of Service' : 'Privacy & Data Policy'}
            </h1>
            <p className="text-xs text-slate-400 mt-1">Last updated: February 2025</p>
          </div>

          <div className="rounded-3xl bg-[#14141B] border border-white/8 p-8 space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed shadow-xl">
            <h3 className="font-bold text-white">1. Platform Scope & Obligations</h3>
            <p className="text-slate-400">
              SHOPZA provides an electronic marketplace interface facilitating commerce between independent buyers and sellers. Sellers are independent merchants responsible for listing accuracy and fulfillment.
            </p>
            <h3 className="font-bold text-white pt-2">2. Financial Settlements & Fees</h3>
            <p className="text-slate-400">
              All transactions are subject to the applicable platform commission fee ({config.commissionRatePercent}%). Sensitive payment credentials are encrypted and processed by licensed regulatory providers (Paystack/NIBSS).
            </p>
            <h3 className="font-bold text-white pt-2">3. Prohibited Conduct</h3>
            <p className="text-slate-400">
              Users may not upload fraudulent or illegal listings, circumvent the platform escrow system, or harass other users.
            </p>
          </div>
        </div>
      )}

      {/* 7. REPORT CENTER */}
      {page === 'report' && (
        <div className="space-y-6">
          <div className="mb-8">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-rose-500 mb-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Community Watch</span>
            </div>
            <h1 className="font-display text-3xl font-extrabold text-white">Report Center</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Help keep SHOPZA secure by flagging counterfeit items, fraudulent stores, or scam attempts.
            </p>
          </div>

          <form onSubmit={handleReportSubmit} className="rounded-3xl bg-[#14141B] border border-white/8 p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Target Entity Type</label>
                <select
                  value={repType}
                  onChange={(e) => setRepType(e.target.value as any)}
                  className="w-full rounded-xl bg-[#1A1A24] border border-white/10 p-2.5 text-xs text-white focus:outline-none"
                >
                  <option value="product">Product Listing</option>
                  <option value="seller">Seller / Storefront</option>
                  <option value="message">Direct Message</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Listing URL or Identifier</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. prod-1 or @urban-threads"
                  value={repId}
                  onChange={(e) => setRepId(e.target.value)}
                  className="w-full rounded-xl bg-[#1A1A24] border border-white/10 p-2.5 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Nature of Violation</label>
              <select
                value={repReason}
                onChange={(e) => setRepReason(e.target.value as any)}
                className="w-full rounded-xl bg-[#1A1A24] border border-white/10 p-2.5 text-xs text-white focus:outline-none"
              >
                <option value="scam">Scam / Payment outside platform request</option>
                <option value="counterfeit">Suspected counterfeit / Fake brand</option>
                <option value="prohibited_item">Prohibited item or weapon</option>
                <option value="harassment">Harassment or abusive messaging</option>
                <option value="misleading">Deceptive images / False specifications</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Specific Incident Details</label>
              <textarea
                rows={4}
                required
                value={repDetails}
                onChange={(e) => setRepDetails(e.target.value)}
                placeholder="Explain the issue with evidence or context..."
                className="w-full rounded-xl bg-[#1A1A24] border border-white/10 p-2.5 text-xs text-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="rounded-xl bg-rose-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-rose-700 shadow-md transition cursor-pointer"
            >
              Submit Moderation Report
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
