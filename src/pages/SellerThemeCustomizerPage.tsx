import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { Store, StoreThemeSettings } from '../types';
import {
  Palette,
  Layout,
  Type,
  Smartphone,
  Monitor,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  MessageCircle,
  Megaphone,
  ArrowLeft,
  ExternalLink,
  Layers,
} from 'lucide-react';

const COLOR_PRESETS = [
  { name: 'Royal Indigo', value: '#5B35F5' },
  { name: 'Emerald Luxe', value: '#00C896' },
  { name: 'Electric Violet', value: '#7C4DFF' },
  { name: 'Warm Amber', value: '#F59E0B' },
  { name: 'Crimson Rose', value: '#E11D48' },
  { name: 'Ocean Cyan', value: '#0284C7' },
  { name: 'Pure Obsidian', value: '#27272A' },
];

const FONT_PRESETS: { name: string; value: StoreThemeSettings['fontFamily']; sample: string }[] = [
  { name: 'Plus Jakarta Sans', value: 'Plus Jakarta Sans', sample: 'Modern, crisp, high-converting geometric sans' },
  { name: 'Syne', value: 'Syne', sample: 'Bold avant-garde high-fashion editorial' },
  { name: 'JetBrains Mono', value: 'JetBrains Mono', sample: 'Technical, tabular, structured streetwear' },
];

export const SellerThemeCustomizerPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { currentUser, stores, updateStoreTheme, formatCurrency, addToast } = useMarketplace();

  const fallbackStore: Store = {
    id: `store-${currentUser?.id || 'default'}`,
    name: `${currentUser?.name || 'My'} Store`,
    username: currentUser?.storeUsername || 'mystore',
    ownerId: currentUser?.id || 'owner',
    ownerName: currentUser?.name || 'Owner',
    logo: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=200&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80',
    description: 'Official digital storefront.',
    categories: ['Fashion & Apparel'],
    location: 'Lagos, Nigeria',
    state: 'Lagos',
    rating: 5.0,
    reviewCount: 0,
    followerCount: 0,
    isVerified: true,
    joinedDate: 'Recently',
    responseTime: '< 15 mins',
    operatingHours: 'Mon - Sat, 8:00 AM - 7:00 PM',
    policies: { shipping: 'Standard dispatch', returns: '7 days', cancellation: 'Allowed before dispatch' },
    productCount: 0,
    serviceCount: 0,
  };

  const userStore =
    stores.find(
      (s) =>
        (currentUser?.id && s.ownerId === currentUser.id) ||
        (currentUser?.storeUsername && s.username === currentUser.storeUsername)
    ) || fallbackStore;

  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  const [theme, setTheme] = useState<StoreThemeSettings>(() => {
    return (
      userStore?.themeSettings || {
        primaryColor: '#5B35F5',
        announcementBarEnabled: true,
        announcementBarText: '✨ FREE Express delivery nationwide on orders above ₦35,000!',
        bannerStyle: 'full_bleed',
        fontFamily: 'Plus Jakarta Sans',
        gridDensity: 'spacious',
        showBadges: true,
        whatsappChatEnabled: true,
        whatsappNumber: '+2348012345678',
        customNotice: 'Official Brand Store · Guaranteed Authentic',
      }
    );
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleUpdate = <K extends keyof StoreThemeSettings>(key: K, value: StoreThemeSettings[K]) => {
    setTheme((prev) => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const handleSaveTheme = () => {
    updateStoreTheme(userStore.id, theme);
    setHasUnsavedChanges(false);
    addToast('success', 'Theme Published!', `Storefront at /store/${userStore.username} updated live.`);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-slate-100 flex flex-col">
      {/* Top Editor Bar */}
      <div className="sticky top-0 z-30 bg-[#12121A] border-b border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/seller/dashboard')}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-white text-sm">Shopify Theme Customizer</span>
              <span className="rounded-md bg-[#5B35F5]/20 text-[#7C4DFF] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
                Live Store Editor
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Editing: {userStore.name} (/store/{userStore.username})</p>
          </div>
        </div>

        {/* Viewport switcher & save */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center bg-white/5 rounded-xl p-1 border border-white/10">
            <button
              onClick={() => setPreviewMode('desktop')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                previewMode === 'desktop' ? 'bg-[#5B35F5] text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span>Desktop</span>
            </button>
            <button
              onClick={() => setPreviewMode('mobile')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                previewMode === 'mobile' ? 'bg-[#5B35F5] text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Mobile</span>
            </button>
          </div>

          <button
            onClick={() => navigate(`/store/${userStore.username}`)}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 transition cursor-pointer"
          >
            <span>View Live</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleSaveTheme}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition shadow-lg cursor-pointer flex items-center gap-1.5 ${
              hasUnsavedChanges
                ? 'bg-[#00C896] hover:bg-[#00b084] text-slate-950 shadow-[#00C896]/30 animate-pulse'
                : 'bg-[#5B35F5] hover:bg-[#4d2ad4] text-white shadow-[#5B35F5]/30'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{hasUnsavedChanges ? 'Publish Changes' : 'Saved'}</span>
          </button>
        </div>
      </div>

      {/* Main split area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side: Controls Sidebar */}
        <div className="w-full lg:w-96 shrink-0 bg-[#12121A] border-r border-white/10 p-5 overflow-y-auto space-y-6">
          {/* Section: Brand Palette */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Palette className="w-4 h-4 text-[#5B35F5]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">Brand Accent Color</h3>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              Colors will adapt to your checkout buttons, promotional badges, and storefront highlights.
            </p>
            <div className="grid grid-cols-4 gap-2">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => handleUpdate('primaryColor', preset.value)}
                  className={`p-2 rounded-xl border text-center transition flex flex-col items-center gap-1.5 cursor-pointer ${
                    theme.primaryColor === preset.value
                      ? 'border-white bg-white/10 scale-105'
                      : 'border-white/10 hover:border-white/30 bg-white/5'
                  }`}
                >
                  <span
                    className="w-6 h-6 rounded-full shadow-inner border border-white/20"
                    style={{ backgroundColor: preset.value }}
                  />
                  <span className="text-[9px] font-medium text-slate-300 truncate w-full">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-white/10 pt-5">
            {/* Section: Announcement Bar */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-[#00C896]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Announcement Bar</h3>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={theme.announcementBarEnabled}
                  onChange={(e) => handleUpdate('announcementBarEnabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#00C896]" />
              </label>
            </div>
            {theme.announcementBarEnabled && (
              <div className="space-y-2 mt-3 animate-in fade-in duration-150">
                <label className="block text-[11px] text-slate-400">Header Banner Ticker Text</label>
                <input
                  type="text"
                  value={theme.announcementBarText || ''}
                  onChange={(e) => handleUpdate('announcementBarText', e.target.value)}
                  placeholder="e.g. Free shipping on orders over ₦25,000"
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#5B35F5]"
                />
              </div>
            )}
          </div>

          <div className="border-t border-white/10 pt-5">
            {/* Section: Banner Layout Style */}
            <div className="flex items-center gap-2 mb-3">
              <Layout className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">Banner Presentation</h3>
            </div>
            <div className="space-y-2">
              {[
                { id: 'full_bleed', label: 'Full Bleed Cinematic', desc: 'Edge-to-edge high resolution visual header' },
                { id: 'split', label: 'Split Editorial', desc: 'Side-by-side merchant bio with featured product hook' },
                { id: 'minimal', label: 'Minimalist Clean', desc: 'Compact header prioritizing catalog grid instantly' },
              ].map((layout) => (
                <button
                  key={layout.id}
                  onClick={() => handleUpdate('bannerStyle', layout.id as any)}
                  className={`w-full text-left p-3 rounded-xl border transition cursor-pointer ${
                    theme.bannerStyle === layout.id
                      ? 'border-[#5B35F5] bg-[#5B35F5]/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <p className="text-xs font-bold text-white">{layout.label}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{layout.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-white/10 pt-5">
            {/* Section: Typography Presets */}
            <div className="flex items-center gap-2 mb-3">
              <Type className="w-4 h-4 text-[#7C4DFF]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">Typography Hierarchy</h3>
            </div>
            <div className="space-y-2">
              {FONT_PRESETS.map((font) => (
                <button
                  key={font.value}
                  onClick={() => handleUpdate('fontFamily', font.value)}
                  className={`w-full text-left p-3 rounded-xl border transition cursor-pointer ${
                    theme.fontFamily === font.value
                      ? 'border-[#7C4DFF] bg-[#7C4DFF]/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{font.name}</span>
                    <span className="text-[10px] uppercase text-slate-400">Preset</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{font.sample}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-white/10 pt-5">
            {/* Section: Social & WhatsApp Direct Checkout */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#00C896]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">WhatsApp Order Button</h3>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={theme.whatsappChatEnabled}
                  onChange={(e) => handleUpdate('whatsappChatEnabled', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#00C896]" />
              </label>
            </div>
            {theme.whatsappChatEnabled && (
              <div className="space-y-2 mt-3 animate-in fade-in duration-150">
                <label className="block text-[11px] text-slate-400">Merchant WhatsApp Phone (with country code)</label>
                <input
                  type="text"
                  value={theme.whatsappNumber || ''}
                  onChange={(e) => handleUpdate('whatsappNumber', e.target.value)}
                  placeholder="+2348012345678"
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00C896]"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Live Interactive Storefront Preview */}
        <div className="flex-1 bg-[#09090D] p-4 sm:p-8 flex items-center justify-center overflow-y-auto">
          <div
            className={`transition-all duration-300 shadow-2xl rounded-3xl overflow-hidden border border-white/15 bg-[#14141B] ${
              previewMode === 'mobile' ? 'w-[375px] max-w-full min-h-[640px]' : 'w-full max-w-4xl min-h-[580px]'
            }`}
          >
            {/* Live Announcement Bar */}
            {theme.announcementBarEnabled && (
              <div
                className="py-2 px-4 text-center text-xs font-semibold text-white tracking-wide transition-colors"
                style={{ backgroundColor: theme.primaryColor }}
              >
                {theme.announcementBarText || 'Welcome to our verified storefront!'}
              </div>
            )}

            {/* Storefront Hero Preview */}
            <div className="relative">
              <div
                className="w-full h-40 sm:h-52 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${userStore.banner || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200'})`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#14141B] via-black/40 to-black/20" />
              </div>

              {/* Logo & Store Information */}
              <div className="px-6 pb-6 pt-0 relative -mt-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="flex items-end gap-3">
                  <img
                    src={userStore.logo}
                    alt={userStore.name}
                    className="w-20 h-20 rounded-2xl border-4 border-[#14141B] object-cover shadow-xl bg-black"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h2
                        className="text-lg sm:text-xl font-bold text-white tracking-tight"
                        style={{ fontFamily: theme.fontFamily }}
                      >
                        {userStore.name}
                      </h2>
                      <ShieldCheck className="w-4 h-4 text-[#00C896]" />
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{theme.customNotice || 'Independent Verified Merchant'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {theme.whatsappChatEnabled && (
                    <button
                      className="px-3 py-2 rounded-xl bg-[#00C896] text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-[#00C896]/20"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Order</span>
                    </button>
                  )}
                  <button
                    className="px-4 py-2 rounded-xl font-bold text-xs text-white shadow-md transition"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    Follow Store
                  </button>
                </div>
              </div>
            </div>

            {/* Preview Catalog Cards */}
            <div className="p-6 border-t border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Featured Products</h3>
                <span className="text-[11px] text-slate-400">Live Theme Application</span>
              </div>

              <div
                className={`grid gap-4 ${
                  theme.gridDensity === 'compact'
                    ? 'grid-cols-2 sm:grid-cols-4'
                    : theme.gridDensity === 'editorial'
                    ? 'grid-cols-1 sm:grid-cols-2'
                    : 'grid-cols-2 sm:grid-cols-3'
                }`}
              >
                {[
                  {
                    title: 'Bespoke Textured Jacket',
                    price: 45000,
                    img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500',
                  },
                  {
                    title: 'Minimalist Oxford Brogues',
                    price: 38000,
                    img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500',
                  },
                  {
                    title: 'Monochrome Signature Tote',
                    price: 28000,
                    img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl bg-white/[0.03] border border-white/10 p-3 hover:border-white/20 transition flex flex-col justify-between"
                  >
                    <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-black/40">
                      <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                      {theme.showBadges && (
                        <span
                          className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold text-white shadow"
                          style={{ backgroundColor: theme.primaryColor }}
                        >
                          Shopify Theme
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-white truncate" style={{ fontFamily: theme.fontFamily }}>
                        {item.title}
                      </p>
                      <p className="text-xs font-bold text-emerald-400 mt-1 font-mono-nums">
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
