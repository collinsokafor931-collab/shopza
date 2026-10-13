import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { Store, User, Building2, Truck, ShieldCheck, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';

interface SellerOnboardingPageProps {
  navigate: (path: string) => void;
}

export const SellerOnboardingPage: React.FC<SellerOnboardingPageProps> = ({ navigate }) => {
  const { currentUser, upgradeToSeller } = useMarketplace();

  const [step, setStep] = useState(1);

  // Form states based on authenticated real user
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '+234 ');
  const [sellerType, setSellerType] = useState<'individual' | 'business' | 'service_provider'>('individual');

  const defaultStoreName = currentUser?.name ? `${currentUser.name}'s Collections` : 'My Boutique';
  const [storeName, setStoreName] = useState(defaultStoreName);
  const [storeUsername, setStoreUsername] = useState(
    defaultStoreName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  );
  const [category, setCategory] = useState('Fashion');
  const [description, setDescription] = useState(
    'Contemporary fashion, streetwear apparel and curated luxury pieces with nationwide delivery.'
  );
  const [location, setLocation] = useState(currentUser?.location || 'Victoria Island, Lagos');
  const [operatingHours, setOperatingHours] = useState('Mon - Sat: 8:00 AM - 7:00 PM');

  const [businessReg, setBusinessReg] = useState('');
  const [deliveryType, setDeliveryType] = useState('courier');
  const [returnPolicy, setReturnPolicy] = useState('7-day standard inspection window for eligible items.');

  const [bankName, setBankName] = useState('Access Bank PLC');
  const [accountNumber, setAccountNumber] = useState('0123456789');
  const [accountName, setAccountName] = useState(currentUser?.name || 'Verified Merchant');
  const [submitting, setSubmitting] = useState(false);

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else handleComplete();
  };

  const handleComplete = async () => {
    if (submitting) return; // Prevent double submission
    if (!currentUser) {
      navigate('/sell');
      return;
    }

    const trimmedStoreName = storeName.trim();
    if (!trimmedStoreName) {
      setStep(2);
      return;
    }

    const finalCleanUsername =
      (storeUsername || trimmedStoreName)
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, '') || `store-${Date.now().toString().slice(-4)}`;

    setSubmitting(true);
    try {
      await upgradeToSeller({
        name: trimmedStoreName,
        username: finalCleanUsername,
        categories: [category],
        category,
        description: description.trim(),
        location: location.trim(),
        state: location.includes(',') ? location.split(',')[1].trim() : 'Lagos',
        operatingHours,
        policies: {
          shipping:
            deliveryType === 'courier'
              ? 'Standard Courier Partner Dispatch across Nigeria (24-48 hrs)'
              : 'Direct merchant dispatch & physical pickup',
          returns: returnPolicy,
          cancellation: 'Orders can be cancelled before merchant begins dispatch.',
        },
        bankDetails: {
          bankName,
          accountNumber: accountNumber.trim() || '0000000000',
          accountName: accountName.trim() || currentUser?.name || 'Verified Merchant',
        },
      });
      navigate('/seller/dashboard');
    } catch (err) {
      console.error('Failed to launch store:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      {/* Progress Header */}
      <div className="mb-8 text-center">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#00C896]">
          Step {step} of 4
        </span>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
          {step === 1 && 'Personal & Business Type'}
          {step === 2 && 'Store Profile & Identity'}
          {step === 3 && 'Delivery & Store Policies'}
          {step === 4 && 'Payout Bank Account'}
        </h1>
        <div className="mt-4 flex items-center justify-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s === step ? 'w-10 bg-[#5B35F5]' : s < step ? 'w-6 bg-[#00C896]' : 'w-6 bg-white/10'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="rounded-3xl bg-[#14141B] border border-white/8 p-6 sm:p-8 shadow-xl">
        {/* Step 1: Personal & Business Type */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">Select Seller Classification</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'individual', title: 'Individual Seller', desc: 'Independent creator or artisan' },
                  { id: 'business', title: 'Registered Business', desc: 'Retailer, brand or registered company' },
                  { id: 'service_provider', title: 'Service Provider', desc: 'Design, repair or freelance talent' },
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setSellerType(type.id as any)}
                    className={`rounded-2xl border p-4 text-left transition cursor-pointer ${
                      sellerType === type.id
                        ? 'border-[#5B35F5] bg-[#5B35F5]/10 text-white'
                        : 'border-white/10 bg-[#1A1A24] text-slate-400 hover:text-white'
                    }`}
                  >
                    <h4 className="text-xs font-bold text-white">{type.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{type.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl bg-[#1A1A24] border border-white/10 p-2.5 text-xs text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl bg-[#1A1A24] border border-white/10 p-2.5 text-xs text-white focus:outline-none"
                  required
                />
              </div>
            </div>

            {sellerType === 'business' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">CAC Registration / RC Number</label>
                <input
                  type="text"
                  value={businessReg}
                  onChange={(e) => setBusinessReg(e.target.value)}
                  className="w-full rounded-xl bg-[#1A1A24] border border-white/10 p-2.5 text-xs text-white focus:outline-none"
                />
              </div>
            )}
          </div>
        )}

        {/* Step 2: Store Profile */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Store Name</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => {
                    setStoreName(e.target.value);
                    setStoreUsername(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                  }}
                  className="w-full rounded-xl bg-[#1A1A24] border border-white/10 p-2.5 text-xs text-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Store URL Handle</label>
                <div className="flex items-center rounded-xl bg-[#1A1A24] border border-white/10 px-3 py-2 text-xs text-slate-400">
                  <span>shopza.ng/store/</span>
                  <input
                    type="text"
                    value={storeUsername}
                    onChange={(e) => setStoreUsername(e.target.value)}
                    className="bg-transparent text-white font-semibold focus:outline-none ml-0.5 flex-1"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Primary Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl bg-[#1A1A24] border border-white/10 p-2.5 text-xs text-white focus:outline-none"
              >
                <option value="Fashion">Fashion & Apparel</option>
                <option value="Phones & Gadgets">Phones & Gadgets</option>
                <option value="Electronics">Electronics</option>
                <option value="Home & Living">Home & Living</option>
                <option value="Beauty & Skincare">Beauty & Skincare</option>
                <option value="Automotive & Parts">Automotive & Parts</option>
                <option value="Services">Services & Consulting</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Store Description / Bio</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl bg-[#1A1A24] border border-white/10 p-2.5 text-xs text-white focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Location City / State</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-xl bg-[#1A1A24] border border-white/10 p-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Operating Hours</label>
                <input
                  type="text"
                  value={operatingHours}
                  onChange={(e) => setOperatingHours(e.target.value)}
                  className="w-full rounded-xl bg-[#1A1A24] border border-white/10 p-2.5 text-xs text-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Delivery & Policies */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Fulfillment Strategy</label>
              <select
                value={deliveryType}
                onChange={(e) => setDeliveryType(e.target.value)}
                className="w-full rounded-xl bg-[#1A1A24] border border-white/10 p-2.5 text-xs text-white focus:outline-none"
              >
                <option value="courier">Courier Partner Integration (GIG Logistics, Red Star, DHL)</option>
                <option value="seller_dispatch">Merchant's Own In-House Riders (Lagos Only)</option>
                <option value="buyer_pickup">Buyer Pickup at Physical Store</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Return & Refund Policy</label>
              <textarea
                rows={3}
                value={returnPolicy}
                onChange={(e) => setReturnPolicy(e.target.value)}
                className="w-full rounded-xl bg-[#1A1A24] border border-white/10 p-2.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="rounded-2xl bg-[#1A1A24] p-4 text-xs text-slate-400 space-y-1">
              <p className="font-semibold text-white">SHOPZA Standard Guarantee:</p>
              <p>All buyers are covered by 7-day buyer protection for verified damaged or counterfeit goods.</p>
            </div>
          </div>
        )}

        {/* Step 4: Bank Account for Automated Settlements */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Commercial Bank in Nigeria</label>
              <select
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full rounded-xl bg-[#1A1A24] border border-white/10 p-2.5 text-xs text-white focus:outline-none"
              >
                <option value="Access Bank PLC">Access Bank PLC</option>
                <option value="Guaranty Trust Bank (GTCO)">Guaranty Trust Bank (GTCO)</option>
                <option value="Zenith Bank PLC">Zenith Bank PLC</option>
                <option value="United Bank for Africa (UBA)">United Bank for Africa (UBA)</option>
                <option value="First Bank of Nigeria">First Bank of Nigeria</option>
                <option value="Kuda Bank">Kuda Microfinance Bank</option>
                <option value="Opay">Opay Digital Services</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">10-Digit NUBAN Account Number</label>
              <input
                type="text"
                maxLength={10}
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full rounded-xl bg-[#1A1A24] border border-white/10 p-2.5 text-xs text-white font-mono-nums focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Registered Account Name</label>
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="w-full rounded-xl bg-[#1A1A24] border border-white/10 p-2.5 text-xs text-white focus:outline-none"
                required
              />
            </div>

            <div className="rounded-2xl bg-[#00C896]/10 border border-[#00C896]/20 p-4 text-xs text-[#00C896]">
              <CheckCircle2 className="w-4 h-4 inline mr-1.5" />
              <span>Direct automated settlements are credited within 24 hours of buyer delivery confirmation.</span>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 pt-6 border-t border-white/8 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : <div />}

          <button
            type="button"
            onClick={handleNext}
            disabled={submitting}
            className={`flex items-center gap-2 rounded-xl bg-[#5B35F5] px-6 py-3 text-xs font-bold text-white shadow-lg shadow-[#5B35F5]/30 transition active:scale-95 cursor-pointer ${
              submitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#4d2ad4]'
            }`}
          >
            <span>{submitting ? 'Launching Store...' : step === 4 ? 'Launch My Store' : 'Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
