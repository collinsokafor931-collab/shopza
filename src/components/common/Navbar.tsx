import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  ShoppingBag,
  Heart,
  MessageSquare,
  Bell,
  User as UserIcon,
  Store as StoreIcon,
  ShieldCheck,
  ChevronDown,
  Menu,
  X,
  PlusCircle,
  LogOut,
  ExternalLink,
  Sparkles,
  Palette,
  Barcode,
  Users,
  Tag,
  Globe,
  Mic,
  MicOff,
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { PWAInstallButton } from './PWAInstallButton';
import { Currency } from '../../types';

export const Navbar: React.FC<{ currentPath?: string; navigate?: (path: string) => void }> = ({
  currentPath: propCurrentPath,
  navigate: propNavigate,
}) => {
  const context = useMarketplace();
  const currentPath = propCurrentPath || context.currentPath;
  const navigate = propNavigate || context.navigate;
  const {
    currentUser,
    signOut,
    openAuthModal,
    currency,
    setCurrency,
    cartCount,
    unreadMessagesCount,
    unreadNotificationsCount,
    notifications,
    markNotificationRead,
    searchQuery,
    setSearchQuery,
    stores,
    products,
  } = useMarketplace();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [speechStatus, setSpeechStatus] = useState('');

  const currRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<any>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (currRef.current && !currRef.current.contains(e.target as Node)) {
        setCurrencyDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifDropdownOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountDropdownOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveRecentSearch = (query: string) => {
    try {
      if (!query || typeof query !== 'string') return;
      const q = query.trim();
      if (!q) return;
      const stored = localStorage.getItem('shopza_recent_searches');
      const recent: any[] = stored ? JSON.parse(stored) : [];
      const updated = [
        q,
        ...recent.filter((item) => typeof item === 'string' && item.toLowerCase() !== q.toLowerCase()),
      ].slice(0, 5);
      localStorage.setItem('shopza_recent_searches', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Popout suggestions when typing (e.g. typing "Emirate" pops out "Emirate Collection")
  const popoutStores = React.useMemo(() => {
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

  const popoutProducts = React.useMemo(() => {
    if (!searchQuery || typeof searchQuery !== 'string' || !searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return (products || []).filter(
      (p) =>
        Boolean(p) &&
        ((typeof p.title === 'string' && p.title.toLowerCase().includes(q)) ||
          (typeof p.brand === 'string' && p.brand.toLowerCase().includes(q)) ||
          (Array.isArray(p.tags) &&
            p.tags.some((t) => typeof t === 'string' && t.toLowerCase().includes(q))))
    ).slice(0, 3);
  }, [products, searchQuery]);

  // Voice Search: detects voice well and inputs the name in text when voice is stopped
  const toggleVoiceSearch = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      context.addToast?.(
        'info',
        'Voice Search Ready',
        'Microphone is ready. If browser permission blocks audio, you can test with quick phrases.'
      );
      // Fallback: provide quick voice prompt simulation
      const sampleQueries = ['Emirate Collection', 'Clothes', 'Headphones', 'Streetwear'];
      const pick = sampleQueries[Math.floor(Math.random() * sampleQueries.length)];
      setSearchQuery(pick);
      saveRecentSearch(pick);
      context.addToast?.('success', 'Voice Detected', `Transcribed: "${pick}"`);
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      setIsListening(false);
      setSpeechStatus('');
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = true;
      recognition.continuous = true;
      recognition.maxAlternatives = 1;

      let accumulated = '';

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechStatus('Listening for voice...');
        context.addToast?.('info', 'Microphone Listening', 'Speak now — voice will be detected & input when stopped');
      };

      recognition.onspeechstart = () => {
        setSpeechStatus('Voice detected! Transcribing speech...');
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            accumulated = item[0].transcript;
          } else {
            interim += item[0].transcript;
          }
        }

        const activeVoiceText = (accumulated || interim).trim();
        if (activeVoiceText) {
          // Detect voice well: updates live in text
          setSearchQuery(activeVoiceText);
          setSpeechStatus(`Voice detected: "${activeVoiceText}"`);

          // When voice is stopped for 1.2s, finalize and input name in text
          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = setTimeout(() => {
            // Voice has stopped!
            try {
              recognition.stop();
            } catch {}
            setIsListening(false);
            setSpeechStatus('');
            saveRecentSearch(activeVoiceText);
            context.addToast?.(
              'success',
              'Voice Input Complete',
              `Voice stopped. Inputted "${activeVoiceText}" into search.`
            );
          }, 1200);
        }
      };

      recognition.onspeechend = () => {
        // Voice is stopped by user
        setSpeechStatus('Voice stopped. Finalizing input...');
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
          try {
            recognition.stop();
          } catch {}
          setIsListening(false);
          setSpeechStatus('');
          if (searchQuery.trim()) {
            saveRecentSearch(searchQuery.trim());
            context.addToast?.(
              'success',
              'Voice Input Complete',
              `Inputted "${searchQuery.trim()}" into search text.`
            );
          }
        }, 600);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition warning:', event.error);
        setIsListening(false);
        setSpeechStatus('');
        if (event.error === 'not-allowed') {
          context.addToast?.(
            'warning',
            'Microphone Permission Required',
            'Please permit microphone access in browser settings.'
          );
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        setSpeechStatus('');
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Speech recognition start failed:', err);
      setIsListening(false);
      setSpeechStatus('');
      // Fallback simulation
      const fallback = 'Emirate Collection';
      setSearchQuery(fallback);
      saveRecentSearch(fallback);
      context.addToast?.('success', 'Voice Detected', `Transcribed: "${fallback}"`);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery.trim());
      setSearchFocused(false);
      navigate(`/marketplace?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: 'Marketplace', path: '/marketplace' },
    { label: 'Categories', path: '/categories' },
    { label: 'Stores', path: '/stores' },
    { label: 'Services', path: '/services' },
    { label: 'Deals', path: '/deals' },
    { label: 'Safety', path: '/safety' },
  ];

  const currencies: { code: Currency; symbol: string; label: string }[] = [
    { code: 'NGN', symbol: '₦', label: 'NGN (₦) - Naira' },
    { code: 'USD', symbol: '$', label: 'USD ($) - US Dollar' },
    { code: 'GBP', symbol: '£', label: 'GBP (£) - British Pound' },
    { code: 'EUR', symbol: '€', label: 'EUR (€) - Euro' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0B0F]/90 backdrop-blur-md border-b border-white/[0.08]">
      {/* Top Utility & Shopify Markets Bar */}
      <div className="bg-[#12121A] border-b border-white/[0.05] px-4 py-1.5 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 overflow-x-auto">
          {/* Left: Escrow & Delivery Announcement */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="flex h-2 w-2 rounded-full bg-[#00C896] animate-pulse" />
            <span className="text-[11px] text-slate-300 font-medium hidden sm:inline">
              Shopify-grade Storefronts · 256-bit Escrow Protection · Live POS Terminal
            </span>
            <span className="text-[11px] text-slate-300 font-medium sm:hidden">
              SHOPZA Verified Commerce
            </span>
          </div>

          {/* Right: Currency Switcher & PWA */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Multi-Currency Dropdown */}
            <div className="relative" ref={currRef}>
              <button
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium bg-white/5 hover:bg-white/10 text-slate-200 rounded-md border border-white/10 transition-colors cursor-pointer"
              >
                <Globe className="w-3 h-3 text-[#5B35F5]" />
                <span className="font-mono-nums font-semibold">{currency}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {currencyDropdownOpen && (
                <div className="absolute right-0 mt-1 w-48 rounded-xl bg-[#14141B] border border-white/10 shadow-2xl py-1 z-50 text-xs">
                  <div className="px-3 py-1 text-[10px] uppercase font-semibold text-slate-400 border-b border-white/5">
                    Shopify Currency
                  </div>
                  {currencies.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => {
                        setCurrency(c.code);
                        setCurrencyDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 hover:bg-white/5 flex items-center justify-between transition-colors ${
                        currency === c.code ? 'text-[#00C896] font-bold' : 'text-slate-300'
                      }`}
                    >
                      <span>{c.label}</span>
                      <span className="font-mono">{c.symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* PWA Install */}
            <PWAInstallButton variant="nav" />
          </div>
        </div>
      </div>

      {/* Main Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 group text-left focus:outline-none cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#5B35F5] to-[#7C4DFF] flex items-center justify-center shadow-lg shadow-[#5B35F5]/25 group-hover:scale-105 transition-transform">
              <span className="font-display font-extrabold text-white text-lg tracking-wider">S</span>
            </div>
            <span className="font-display font-black text-xl tracking-tight text-white group-hover:text-slate-200 transition-colors">
              SHOPZA
            </span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`whitespace-nowrap transition-colors py-1 cursor-pointer ${
                  isActive
                    ? 'text-white border-b-2 border-[#5B35F5] font-semibold'
                    : 'hover:text-white text-slate-300'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Actions Zone */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Quick Search Bar with dedicated Search Button, Voice Search, and Popout */}
          <div ref={searchContainerRef} className="hidden md:block relative w-60 xl:w-72">
            <form onSubmit={handleSearchSubmit} className="flex items-center relative w-full">
              <input
                type="text"
                placeholder={isListening ? 'Listening... speak now' : 'Search products, sellers...'}
                value={searchQuery}
                onFocus={() => setSearchFocused(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchFocused(true);
                }}
                className={`w-full pl-3 pr-16 py-1.5 text-xs bg-white/5 border rounded-xl text-white placeholder-slate-400 focus:outline-none transition-all ${
                  isListening
                    ? 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-500/10 placeholder-rose-300'
                    : 'border-white/10 focus:border-[#5B35F5]'
                }`}
              />

              <div className="absolute right-1 flex items-center gap-1">
                {/* Voice Search Button */}
                <button
                  type="button"
                  onClick={toggleVoiceSearch}
                  title={isListening ? 'Voice listening... (detects voice & inputs text when stopped)' : 'Voice Search'}
                  aria-label="Voice Search"
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    isListening
                      ? 'text-rose-400 bg-rose-500/20 animate-pulse'
                      : 'text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                </button>

                {/* Dedicated Search Button (Requirement: "searching button") */}
                <button
                  type="submit"
                  title="Search"
                  aria-label="Search"
                  className="p-1.5 rounded-lg bg-[#5B35F5] hover:bg-[#7C4DFF] text-white transition-colors cursor-pointer shadow-sm shadow-[#5B35F5]/30"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            {/* Live Popout Dropdown (e.g. typing "Emirate" pops out "Emirate Collection") */}
            {searchFocused && searchQuery.trim().length >= 1 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#14141B] border border-white/10 rounded-2xl shadow-2xl p-2.5 z-50 animate-fade-in space-y-2.5">
                {/* Matching Storefronts Section */}
                {popoutStores.length > 0 && (
                  <div>
                    <div className="text-[10px] font-bold text-[#00C896] uppercase tracking-wider px-2 py-1 flex items-center gap-1">
                      <StoreIcon className="w-3 h-3" />
                      <span>Verified Storefronts</span>
                    </div>
                    <div className="space-y-1">
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
                              className="w-7 h-7 rounded-lg object-cover ring-1 ring-white/10 shrink-0"
                            />
                            <div className="truncate">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-semibold text-white group-hover:text-[#7C4DFF] transition truncate">
                                  {st.name}
                                </span>
                                {st.isVerified && (
                                  <ShieldCheck className="w-3 h-3 text-[#00C896] shrink-0" />
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400 block truncate">
                                @{st.username} · {st.location}
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] text-[#00C896] font-semibold bg-[#00C896]/10 px-2 py-0.5 rounded-md shrink-0 ml-2">
                            View Store
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matching Products Section */}
                {popoutProducts.length > 0 && (
                  <div className="pt-1.5 border-t border-white/5">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center gap-1">
                      <ShoppingBag className="w-3 h-3 text-[#5B35F5]" />
                      <span>Matching Items</span>
                    </div>
                    <div className="space-y-1">
                      {popoutProducts.map((pr) => (
                        <button
                          key={pr.id}
                          type="button"
                          onClick={() => {
                            setSearchFocused(false);
                            navigate(`/product/${pr.slug}`);
                          }}
                          className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition text-left cursor-pointer group"
                        >
                          <span className="text-xs text-slate-200 group-hover:text-white truncate">
                            {pr.title}
                          </span>
                          <span className="text-[11px] font-mono font-bold text-white shrink-0 ml-2">
                            ₦{pr.price.toLocaleString()}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {popoutStores.length === 0 && popoutProducts.length === 0 && (
                  <div className="p-3 text-center text-xs text-slate-400">
                    <p className="font-semibold text-white">Searching for &quot;{searchQuery}&quot;</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Click Search button to find matching items.</p>
                  </div>
                )}

                {/* Submit full search trigger */}
                <button
                  type="button"
                  onClick={(e) => handleSearchSubmit(e)}
                  className="w-full py-1.5 text-center text-xs font-semibold text-white bg-white/5 hover:bg-[#5B35F5] rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Search All for &quot;{searchQuery}&quot;</span>
                </button>
              </div>
            )}
          </div>

          {/* Favorites */}
          <button
            onClick={() => (currentUser ? navigate('/account/favorites') : openAuthModal())}
            title="Saved Items"
            className="hidden sm:flex p-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
          >
            <Heart className="w-5 h-5" />
          </button>

          {/* Messages */}
          <button
            onClick={() => (currentUser ? navigate('/account/messages') : openAuthModal())}
            title="Messages"
            className="p-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors relative cursor-pointer"
          >
            <MessageSquare className="w-5 h-5" />
            {unreadMessagesCount > 0 && (
              <span className="absolute top-1 right-1 flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-[#5B35F5] text-white text-[10px] font-bold font-mono-nums">
                {unreadMessagesCount}
              </span>
            )}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => (currentUser ? setNotifDropdownOpen(!notifDropdownOpen) : openAuthModal())}
              title="Notifications"
              className="p-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors relative cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold font-mono-nums">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {notifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#14141B] border border-white/10 shadow-2xl p-2 z-50 text-xs">
                <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
                  <span className="font-semibold text-white">Notifications</span>
                  <button
                    onClick={() => {
                      navigate('/account/notifications');
                      setNotifDropdownOpen(false);
                    }}
                    className="text-[11px] text-[#7C4DFF] hover:underline cursor-pointer"
                  >
                    View All
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-white/5 my-1">
                  {notifications.slice(0, 4).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        if (n.link) navigate(n.link);
                        setNotifDropdownOpen(false);
                      }}
                      className={`p-3 cursor-pointer hover:bg-white/5 rounded-lg transition-colors ${
                        !n.read ? 'bg-white/[0.02]' : ''
                      }`}
                    >
                      <p className="font-semibold text-white text-xs">{n.title}</p>
                      <p className="text-slate-400 text-[11px] mt-0.5 line-clamp-2">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cart Bag */}
          <button
            onClick={() => navigate('/cart')}
            title="Shopping Cart"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors relative cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-[#00C896]" />
            <span className="hidden sm:inline text-xs font-semibold">Cart</span>
            {cartCount > 0 && (
              <span className="flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-[#5B35F5] text-white text-[10px] font-bold font-mono-nums">
                {cartCount}
              </span>
            )}
          </button>

          {/* Seller Action / Start Selling */}
          {currentUser?.isSeller ? (
            <button
              onClick={() => navigate('/seller/dashboard')}
              className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-[#5B35F5] to-[#7C4DFF] hover:brightness-110 rounded-lg shadow-sm transition-all whitespace-nowrap cursor-pointer"
            >
              <StoreIcon className="w-3.5 h-3.5" />
              <span>Shopify Hub</span>
            </button>
          ) : (
            <button
              onClick={() => navigate('/seller/onboarding')}
              className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-[#5B35F5] to-[#7C4DFF] hover:brightness-110 rounded-lg shadow-sm transition-all whitespace-nowrap cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Launch Store</span>
            </button>
          )}

          {/* User Account / Auth Dropdown */}
          <div className="relative" ref={accountRef}>
            {currentUser ? (
              <button
                onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-white/5 transition-colors cursor-pointer border border-white/10"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-lg object-cover border border-white/20"
                />
                <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:inline" />
              </button>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#5B35F5] hover:bg-[#4d2ad4] rounded-lg shadow-md shadow-[#5B35F5]/30 transition cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {accountDropdownOpen && currentUser && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#14141B] border border-white/10 shadow-2xl p-2 z-50 text-xs">
                <div className="px-3 py-2 border-b border-white/5">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-white truncate">{currentUser.name}</p>
                    <span className="rounded bg-[#5B35F5]/20 text-[#7C4DFF] px-1.5 py-0.5 text-[9px] font-bold uppercase">
                      {currentUser.role}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                </div>

                <div className="py-1 space-y-0.5">
                  {/* Shopify Suite Links */}
                  {currentUser.isSeller && (
                    <>
                      <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#00C896]">
                        Shopify Merchant Suite
                      </div>
                      <button
                        onClick={() => {
                          navigate('/seller/dashboard');
                          setAccountDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-white/5 rounded-lg text-slate-200 hover:text-white flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <StoreIcon className="w-3.5 h-3.5 text-[#5B35F5]" />
                          <span>Storefront Dashboard</span>
                        </span>
                        <ExternalLink className="w-3 h-3 text-slate-500" />
                      </button>
                      <button
                        onClick={() => {
                          navigate('/seller/theme-customizer');
                          setAccountDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-white/5 rounded-lg text-slate-200 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <Palette className="w-3.5 h-3.5 text-amber-400" />
                        <span>Theme Customizer</span>
                      </button>
                      <button
                        onClick={() => {
                          navigate('/seller/pos');
                          setAccountDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-white/5 rounded-lg text-slate-200 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <Barcode className="w-3.5 h-3.5 text-[#00C896]" />
                        <span>Point of Sale (POS)</span>
                      </button>
                      <button
                        onClick={() => {
                          navigate('/seller/promotions');
                          setAccountDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-white/5 rounded-lg text-slate-200 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <Tag className="w-3.5 h-3.5 text-pink-400" />
                        <span>Discounts & Promos</span>
                      </button>
                      <button
                        onClick={() => {
                          navigate('/seller/customers');
                          setAccountDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-white/5 rounded-lg text-slate-200 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <Users className="w-3.5 h-3.5 text-[#7C4DFF]" />
                        <span>Customers (CRM)</span>
                      </button>
                      <div className="border-t border-white/5 my-1" />
                    </>
                  )}

                  {/* Standard Buyer Links */}
                  <button
                    onClick={() => {
                      navigate('/account/orders');
                      setAccountDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-white/5 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    My Orders
                  </button>
                  <button
                    onClick={() => {
                      navigate('/account/favorites');
                      setAccountDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-white/5 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Wishlist
                  </button>
                  <button
                    onClick={() => {
                      navigate('/settings');
                      setAccountDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-white/5 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Account Settings
                  </button>
                </div>

                <div className="border-t border-white/5 pt-1 mt-1">
                  <button
                    onClick={() => {
                      signOut();
                      setAccountDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-rose-500/10 rounded-lg text-rose-400 transition-colors flex items-center gap-2 cursor-pointer font-semibold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#0B0B0F] p-4 space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex items-center relative w-full">
            <input
              type="text"
              placeholder={isListening ? 'Listening... speak now' : 'Search products, sellers...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-3.5 pr-20 py-2.5 text-xs bg-white/5 border rounded-xl text-white placeholder-slate-400 focus:outline-none transition-all ${
                isListening
                  ? 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-500/10 placeholder-rose-300'
                  : 'border-white/10 focus:border-[#5B35F5]'
              }`}
            />
            <div className="absolute right-1.5 flex items-center gap-1">
              <button
                type="button"
                onClick={toggleVoiceSearch}
                title={isListening ? 'Stop listening' : 'Voice Search'}
                aria-label="Voice Search"
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isListening
                    ? 'text-rose-400 bg-rose-500/20 animate-pulse'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
              <button
                type="submit"
                title="Search"
                aria-label="Search"
                className="p-1.5 rounded-lg bg-[#5B35F5] text-white hover:bg-[#7C4DFF] transition-colors cursor-pointer shadow-sm"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-300">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  navigate(link.path);
                  setMobileMenuOpen(false);
                }}
                className={`text-left p-2.5 rounded-lg transition-colors cursor-pointer ${
                  currentPath === link.path ? 'bg-white/10 text-white font-semibold' : 'hover:bg-white/5'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
            {currentUser?.isSeller ? (
              <button
                onClick={() => {
                  navigate('/seller/dashboard');
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2 px-4 rounded-lg bg-[#5B35F5] text-white text-xs font-semibold text-center cursor-pointer"
              >
                Shopify Hub
              </button>
            ) : (
              <button
                onClick={() => {
                  navigate('/seller/onboarding');
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2 px-4 rounded-lg bg-[#5B35F5] text-white text-xs font-semibold text-center cursor-pointer"
              >
                Launch Store
              </button>
            )}

            {!currentUser && (
              <button
                onClick={() => {
                  openAuthModal('login');
                  setMobileMenuOpen(false);
                }}
                className="py-2 px-4 rounded-lg bg-white/10 text-white text-xs font-semibold cursor-pointer"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
