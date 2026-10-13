import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  User,
  Store,
  StoreThemeSettings,
  Product,
  ServiceItem,
  Order,
  OrderStatus,
  CartItem,
  Review,
  Conversation,
  Message,
  Notification,
  Transaction,
  PlatformConfig,
  WithdrawalRequest,
  Report,
  Discount,
  Customer,
  Currency,
} from '../types';
import {
  INITIAL_CONFIG,
  KNOWN_DEMO_STORE_IDS,
  KNOWN_DEMO_PRODUCT_IDS,
} from '../constants/marketplace';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  firebaseSignOut,
  onAuthStateChanged,
  db,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  onSnapshot,
} from '../lib/firebase';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
}

interface MarketplaceContextType {
  // Navigation & Routing
  currentPath: string;
  navigate: (path: string) => void;

  // Real Mass User Auth (Firebase & Gmail)
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  authLoading: boolean;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'signup';
  openAuthModal: (mode?: 'login' | 'signup') => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string, isSeller?: boolean, storeName?: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => void;
  switchDemoRole: (role: 'buyer' | 'seller_fashion' | 'seller_tech' | 'admin' | 'guest') => void;

  // Multi-Currency (Shopify Markets)
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatCurrency: (amount: number) => string;

  // Shopify Discounts Engine
  discounts: Discount[];
  createDiscount: (d: Omit<Discount, 'id' | 'createdAt' | 'usedCount'>) => Discount;
  toggleDiscountStatus: (id: string) => void;
  deleteDiscount: (id: string) => void;
  validateAndApplyDiscount: (code: string, currentTotal: number) => { success: boolean; discountAmount: number; message: string };

  // Shopify Store Themes
  updateStoreTheme: (storeId: string, settings: StoreThemeSettings) => void;

  // Shopify Point of Sale (POS)
  completePOSSale: (sale: { storeId: string; items: any[]; total: number; paymentMethod: 'cash' | 'card' | 'transfer'; customerName?: string }) => Order;

  // Shopify Customers CRM
  customers: Customer[];
  addCustomer: (c: Omit<Customer, 'id' | 'createdAt'>) => Customer;
  updateCustomer: (id: string, data: Partial<Customer>) => void;

  // Platform Config & Commission Engine
  config: PlatformConfig;
  updateCommissionRate: (ratePercent: number) => void;
  updatePlatformConfig: (data: Partial<PlatformConfig>) => void;

  // Stores
  stores: Store[];
  getStoreByUsername: (username: string) => Store | undefined;
  updateStore: (storeId: string, data: Partial<Store>) => void;
  createStore: (store: any) => Promise<Store>;
  followedStores: string[];
  toggleFollowStore: (storeUsername: string) => void;
  isStoreFollowed: (storeUsername: string) => boolean;

  // Products
  products: Product[];
  getProductById: (id: string) => Product | undefined;
  getProductBySlug: (slug: string) => Product | undefined;
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewCount' | 'createdAt' | 'updatedAt'>) => Product;
  updateProduct: (productId: string, data: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  duplicateProduct: (productId: string) => Product | undefined;
  promoteProduct: (productId: string, days: number, cost: number) => void;

  // Services
  services: ServiceItem[];
  addService: (service: Omit<ServiceItem, 'id'>) => ServiceItem;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  appliedCoupon: string | null;
  couponDiscount: number;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;

  // Favorites
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  wishlistSyncStatus: 'synced' | 'syncing' | 'offline';

  // Orders
  orders: Order[];
  getOrderById: (orderId: string) => Order | undefined;
  placeOrder: (orderData: {
    shippingAddress: Order['shippingAddress'];
    deliveryMethod: string;
    deliveryFee: number;
    paymentMethod: Order['paymentMethod'];
    paymentReference: string;
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;

  // Messages & Conversations
  conversations: Conversation[];
  messages: Message[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  sendMessage: (conversationId: string, text: string, referencedProductId?: string) => void;
  startProductChat: (product: Product) => string;
  startStoreChat: (store: Store) => string;
  sendSellerManualReply: (conversationId: string, text: string) => void;
  unreadMessagesCount: number;

  // Notifications
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadNotificationsCount: number;

  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
  replyToReview: (reviewId: string, replyComment: string) => void;

  // Financials & Withdrawals
  transactions: Transaction[];
  withdrawals: WithdrawalRequest[];
  requestWithdrawal: (amount: number, bankDetails: { bankName: string; accountNumber: string; accountName: string }) => boolean;
  approveWithdrawal: (withdrawalId: string) => void;
  rejectWithdrawal: (withdrawalId: string, reason?: string) => void;
  getSellerBalance: (sellerId: string) => { gross: number; commission: number; net: number; withdrawn: number; available: number; pending: number };

  // Moderation & Reports
  reports: Report[];
  submitReport: (report: any) => void;
  resolveReport: (reportId: string, actionNote: string) => void;
  dismissReport: (reportId: string) => void;

  // Search & Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (typeOrTitle: any, titleOrMsg?: string, msgOrType?: any) => void;
  removeToast: (id: string) => void;

  // Compatibility Helpers
  switchDemoUser: (role: any) => void;
  createOrder: (orderData: any) => Order;
  createProduct: (productData: any) => Product;
  upgradeToSeller: (storeData: any) => Promise<Store>;
  startOrGetConversation: (productOrSeller: any, initialMessage?: string) => string;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation sync
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = (window.location.pathname || '/') + (window.location.search || '');
      return path === '' ? '/' : path;
    }
    return '/';
  });

  const navigate = (path: string) => {
    if (typeof window !== 'undefined') {
      const fullCurrent = (window.location.pathname || '/') + (window.location.search || '');
      if (fullCurrent !== path) {
        window.history.pushState({}, '', path);
      }
      setCurrentPath(path);
      try {
        window.dispatchEvent(new Event('popstate'));
      } catch (err) {
        // fallback
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const fullPath = (window.location.pathname || '/') + (window.location.search || '');
      setCurrentPath(fullPath);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (typeOrTitle: any, titleOrMsg?: string, msgOrType?: any) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    let toastType: ToastMessage['type'] = 'info';
    let title = '';
    let message: string | undefined = undefined;

    if (['success', 'info', 'warning', 'error'].includes(typeOrTitle)) {
      toastType = typeOrTitle;
      title = titleOrMsg || '';
      message = typeof msgOrType === 'string' ? msgOrType : undefined;
    } else {
      title = String(typeOrTitle);
      message = titleOrMsg;
      if (['success', 'info', 'warning', 'error'].includes(msgOrType)) {
        toastType = msgOrType;
      }
    }

    const newToast: ToastMessage = { id, type: toastType, title, message };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auth & Mass Users
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('shopza_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const userRef = doc(db, 'users', fbUser.uid);
          const snap = await getDoc(userRef);
          if (snap.exists()) {
            const data = snap.data() as User;
            setCurrentUser(data);
            localStorage.setItem('shopza_user', JSON.stringify(data));
          } else {
            const fallbackName = fbUser.displayName || fbUser.email?.split('@')[0] || 'User';
            const cleanUsername = (fallbackName).toLowerCase().replace(/[^a-z0-9]/g, '') || `user_${fbUser.uid.slice(0, 5)}`;
            const newUser: User = {
              id: fbUser.uid,
              name: fallbackName,
              username: cleanUsername,
              email: fbUser.email || '',
              avatar:
                fbUser.photoURL ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
              role: 'buyer',
              isSeller: false,
              location: 'Lagos, Nigeria',
              joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
              isVerified: true,
            };
            try {
              await setDoc(userRef, newUser);
            } catch (err) {
              console.warn('Could not write fallback user to Firestore:', err);
            }
            setCurrentUser(newUser);
            localStorage.setItem('shopza_user', JSON.stringify(newUser));
          }
        } catch (e) {
          console.error('Firestore user profile sync error:', e);
          const fallbackUser: User = {
            id: fbUser.uid,
            name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
            username: (fbUser.displayName || fbUser.email?.split('@')[0] || 'user').toLowerCase().replace(/[^a-z0-9]/g, '') || `user_${fbUser.uid.slice(0, 5)}`,
            email: fbUser.email || '',
            avatar: fbUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            role: 'buyer',
            isSeller: false,
            location: 'Lagos, Nigeria',
            joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            isVerified: true,
          };
          setCurrentUser(fallbackUser);
        }
      } else {
        setCurrentUser(null);
        localStorage.removeItem('shopza_user');
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const signInWithGoogle = async () => {
    const res = await signInWithPopup(auth, googleProvider);
    const fbUser = res.user;
    const userRef = doc(db, 'users', fbUser.uid);
    try {
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        const fallbackName = fbUser.displayName || fbUser.email?.split('@')[0] || 'User';
        const cleanUsername = fallbackName.toLowerCase().replace(/[^a-z0-9]/g, '') || `user_${fbUser.uid.slice(0, 5)}`;
        const newUser: User = {
          id: fbUser.uid,
          name: fallbackName,
          username: cleanUsername,
          email: fbUser.email || '',
          avatar:
            fbUser.photoURL ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          role: 'buyer',
          isSeller: false,
          location: 'Lagos, Nigeria',
          joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          isVerified: true,
        };
        try {
          await setDoc(userRef, newUser);
        } catch (setErr) {
          console.warn('Could not set Google user in Firestore:', setErr);
        }
        setCurrentUser(newUser);
        localStorage.setItem('shopza_user', JSON.stringify(newUser));
      } else {
        const existing = snap.data() as User;
        setCurrentUser(existing);
        localStorage.setItem('shopza_user', JSON.stringify(existing));
      }
    } catch (err) {
      console.warn('Google sign-in profile warning:', err);
      const fallbackUser: User = {
        id: fbUser.uid,
        name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
        username: (fbUser.displayName || fbUser.email?.split('@')[0] || 'user').toLowerCase().replace(/[^a-z0-9]/g, '') || `user_${fbUser.uid.slice(0, 5)}`,
        email: fbUser.email || '',
        avatar: fbUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: 'buyer',
        isSeller: false,
        location: 'Lagos, Nigeria',
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        isVerified: true,
      };
      setCurrentUser(fallbackUser);
      localStorage.setItem('shopza_user', JSON.stringify(fallbackUser));
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const res = await signInWithEmailAndPassword(auth, cleanEmail, pass);
    const fbUser = res.user;
    const userRef = doc(db, 'users', fbUser.uid);
    try {
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const existing = snap.data() as User;
        setCurrentUser(existing);
        localStorage.setItem('shopza_user', JSON.stringify(existing));
      } else {
        const fallbackName = fbUser.displayName || cleanEmail.split('@')[0] || 'User';
        const cleanUsername = fallbackName.toLowerCase().replace(/[^a-z0-9]/g, '') || `user_${fbUser.uid.slice(0, 5)}`;
        const newUser: User = {
          id: fbUser.uid,
          name: fallbackName,
          username: cleanUsername,
          email: cleanEmail,
          avatar: fbUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          role: 'buyer',
          isSeller: false,
          location: 'Lagos, Nigeria',
          joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          isVerified: true,
        };
        try {
          await setDoc(userRef, newUser);
        } catch (setErr) {
          console.warn('Could not set new user doc in Firestore:', setErr);
        }
        setCurrentUser(newUser);
        localStorage.setItem('shopza_user', JSON.stringify(newUser));
      }
    } catch (profileErr) {
      console.warn('User profile sync on login warning:', profileErr);
      const fallbackUser: User = {
        id: fbUser.uid,
        name: fbUser.displayName || cleanEmail.split('@')[0] || 'User',
        username: cleanEmail.split('@')[0]?.toLowerCase().replace(/[^a-z0-9]/g, '') || `user_${fbUser.uid.slice(0, 5)}`,
        email: cleanEmail,
        avatar: fbUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: 'buyer',
        isSeller: false,
        location: 'Lagos, Nigeria',
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        isVerified: true,
      };
      setCurrentUser(fallbackUser);
      localStorage.setItem('shopza_user', JSON.stringify(fallbackUser));
    }
  };

  const signUpWithEmail = async (
    email: string,
    pass: string,
    name: string,
    isSellerAccount = false,
    storeName = ''
  ) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim() || 'User';
    const res = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
    const fbUser = res.user;
    const cleanUsername = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '') || `user_${fbUser.uid.slice(0, 5)}`;

    const newUser: User = {
      id: fbUser.uid,
      name: cleanName,
      username: cleanUsername,
      email: cleanEmail,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: isSellerAccount ? 'seller' : 'buyer',
      isSeller: isSellerAccount,
      ...(isSellerAccount ? { storeUsername: cleanUsername } : {}),
      location: 'Lagos, Nigeria',
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      isVerified: true,
    };

    const userRef = doc(db, 'users', fbUser.uid);
    try {
      await setDoc(userRef, newUser);
    } catch (err) {
      console.warn('Error saving user profile on signup:', err);
    }
    setCurrentUser(newUser);
    localStorage.setItem('shopza_user', JSON.stringify(newUser));

    if (isSellerAccount) {
      const finalStoreName = storeName.trim() || `${cleanName}'s Store`;
      const normalizedName = finalStoreName.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
      const newStore: Store = {
        id: `store-${fbUser.uid}`,
        storeId: `store-${fbUser.uid}`,
        name: finalStoreName,
        normalizedName,
        username: cleanUsername,
        ownerId: fbUser.uid,
        ownerName: cleanName,
        logo: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=200&auto=format&fit=crop&q=80',
        banner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80',
        description: `Official digital storefront for ${finalStoreName}. Verified seller with nationwide dispatch.`,
        categories: ['Fashion & Apparel', 'Tech & Electronics'],
        location: 'Lagos, Nigeria',
        state: 'Lagos',
        rating: 5.0,
        reviewCount: 0,
        followerCount: 0,
        isVerified: true,
        verificationStatus: 'verified',
        status: 'open',
        isPublic: true,
        joinedDate: 'Just now',
        responseTime: '< 15 mins',
        operatingHours: 'Mon - Sat, 8:00 AM - 7:00 PM',
        policies: {
          shipping: 'Dispatches within 24 hours via licensed dispatch couriers.',
          returns: '7-day standard inspection window for eligible items.',
          cancellation: 'Orders can be cancelled before merchant begins dispatch.',
        },
        productCount: 0,
        serviceCount: 0,
        themeSettings: {
          primaryColor: '#5B35F5',
          announcementBarEnabled: true,
          announcementBarText: `Welcome to ${finalStoreName}! Nationwide Delivery Available ✨`,
          bannerStyle: 'full_bleed',
          fontFamily: 'Plus Jakarta Sans',
          gridDensity: 'spacious',
          showBadges: true,
          whatsappChatEnabled: true,
        },
        badges: ['verified_seller', 'fast_dispatch', 'buyer_protection'],
        socialLinks: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setStores((prev) => {
        const updated = [newStore, ...prev.filter(s => s.id !== newStore.id)];
        localStorage.setItem('shopza_stores', JSON.stringify(updated));
        return updated;
      });

      try {
        await setDoc(doc(db, 'stores', newStore.id), newStore);
      } catch (err) {
        console.error('Store Firestore error on signup:', err);
      }
    }
  };

  const sendPasswordReset = async (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    await sendPasswordResetEmail(auth, cleanEmail);
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.warn('Sign out:', e);
    }
    setCurrentUser(null);
    localStorage.removeItem('shopza_user');
    addToast('info', 'Signed Out', 'You have been signed out of your account.');
    navigate('/');
  };

  const updateUserProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    localStorage.setItem('shopza_user', JSON.stringify(updated));
    if (auth.currentUser) {
      updateDoc(doc(db, 'users', auth.currentUser.uid), data).catch(console.error);
    }
    addToast('success', 'Profile updated successfully');
  };

  const switchDemoRole = (_role: 'buyer' | 'seller_fashion' | 'seller_tech' | 'admin' | 'guest') => {
    // Production mass-market mode: Demo role switcher is disabled.
    // Users must sign in with their real Gmail account.
    console.info('Demo role switching is disabled in mass-use mode.');
  };

  // Multi-Currency (Shopify Markets)
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem('shopza_currency');
    return (saved as Currency) || 'NGN';
  });

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem('shopza_currency', c);
    addToast('info', 'Currency Updated', `Display currency switched to ${c}`);
  };

  const formatCurrency = (amountInNgn: number) => {
    if (currency === 'USD') {
      const usd = amountInNgn / 1500;
      return `$${usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    if (currency === 'GBP') {
      const gbp = amountInNgn / 1900;
      return `£${gbp.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    if (currency === 'EUR') {
      const eur = amountInNgn / 1630;
      return `€${eur.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `₦${amountInNgn.toLocaleString()}`;
  };

  // Shopify Discounts Engine
  const [discounts, setDiscounts] = useState<Discount[]>(() => {
    const saved = localStorage.getItem('shopza_discounts');
    return saved ? JSON.parse(saved) : [];
  });

  const createDiscount = (d: Omit<Discount, 'id' | 'createdAt' | 'usedCount'>) => {
    const newDiscount: Discount = {
      ...d,
      id: `disc-${Date.now()}`,
      usedCount: 0,
      createdAt: new Date().toISOString(),
    };
    const updated = [newDiscount, ...discounts];
    setDiscounts(updated);
    localStorage.setItem('shopza_discounts', JSON.stringify(updated));
    addToast('success', 'Promo Code Created', `Discount code "${newDiscount.code}" is now active.`);
    return newDiscount;
  };

  const toggleDiscountStatus = (id: string) => {
    setDiscounts((prev) => {
      const updated = prev.map((d) => (d.id === id ? { ...d, active: !d.active } : d));
      localStorage.setItem('shopza_discounts', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteDiscount = (id: string) => {
    setDiscounts((prev) => {
      const updated = prev.filter((d) => d.id !== id);
      localStorage.setItem('shopza_discounts', JSON.stringify(updated));
      return updated;
    });
    addToast('info', 'Discount Deleted');
  };

  const validateAndApplyDiscount = (code: string, currentTotal: number) => {
    const match = discounts.find(
      (d) => d.code.toUpperCase() === code.trim().toUpperCase() && d.active
    );

    if (!match) {
      return { success: false, discountAmount: 0, message: 'Invalid or expired promotional code.' };
    }

    if (match.minOrderValue && currentTotal < match.minOrderValue) {
      return {
        success: false,
        discountAmount: 0,
        message: `Requires minimum order of ₦${match.minOrderValue.toLocaleString()}.`,
      };
    }

    let discountAmount = 0;
    if (match.type === 'percentage') {
      discountAmount = Math.round((currentTotal * match.value) / 100);
    } else if (match.type === 'fixed_amount') {
      discountAmount = Math.min(match.value, currentTotal);
    } else if (match.type === 'free_shipping') {
      discountAmount = 3500; // Standard shipping rate offset
    }

    setAppliedCoupon(match.code);
    setCouponDiscount(discountAmount);
    return { success: true, discountAmount, message: `Promo code applied successfully!` };
  };

  // Shopify Store Themes
  const updateStoreTheme = (storeId: string, settings: StoreThemeSettings) => {
    setStores((prev) => {
      const updated = prev.map((s) => (s.id === storeId ? { ...s, themeSettings: settings } : s));
      localStorage.setItem('shopza_stores', JSON.stringify(updated));
      return updated;
    });
    if (auth.currentUser) {
      updateDoc(doc(db, 'stores', storeId), { themeSettings: settings }).catch(console.error);
    }
  };

  // Shopify Customers CRM
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('shopza_customers');
    return saved ? JSON.parse(saved) : [];
  });

  const addCustomer = (c: Omit<Customer, 'id' | 'createdAt'>) => {
    const newCustomer: Customer = {
      ...c,
      id: `cust-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newCustomer, ...customers];
    setCustomers(updated);
    localStorage.setItem('shopza_customers', JSON.stringify(updated));
    return newCustomer;
  };

  const updateCustomer = (id: string, data: Partial<Customer>) => {
    setCustomers((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, ...data } : c));
      localStorage.setItem('shopza_customers', JSON.stringify(updated));
      return updated;
    });
  };

  // Shopify POS Register
  const completePOSSale = (sale: {
    storeId: string;
    items: any[];
    total: number;
    paymentMethod: 'cash' | 'card' | 'transfer';
    customerName?: string;
  }) => {
    const orderNumber = `POS-${Date.now().toString().slice(-6)}`;
    const newOrder: Order = {
      id: `pos-order-${Date.now()}`,
      orderNumber,
      buyerId: currentUser?.id || 'pos-walkin',
      buyerName: sale.customerName || 'Walk-in Customer',
      buyerEmail: 'pos.receipt@shopza.local',
      buyerPhone: '+234 800 000 0000',
      sellerIds: [currentUser?.id || sale.storeId],
      items: sale.items,
      subtotal: sale.total,
      deliveryFee: 0,
      discount: 0,
      platformFee: 0,
      total: sale.total,
      status: 'completed',
      shippingAddress: {
        fullName: sale.customerName || 'Walk-in Customer',
        phone: 'Walk-in Terminal',
        addressLine1: 'In-Store Physical Register',
        city: 'Local Store',
        state: 'Storefront',
      },
      deliveryMethod: 'In-Store Pickup / Walk-in POS',
      paymentMethod: sale.paymentMethod === 'cash' ? 'bank_transfer' : 'card',
      paymentReference: `POS-${Date.now().toString().slice(-8)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      statusHistory: [
        {
          status: 'completed',
          timestamp: new Date().toISOString(),
          note: `Completed at physical POS terminal via ${sale.paymentMethod.toUpperCase()}`,
        },
      ],
    };

    setOrders((prev) => {
      const updated = [newOrder, ...prev];
      localStorage.setItem('shopza_orders', JSON.stringify(updated));
      return updated;
    });

    // Update stock
    sale.items.forEach((it) => {
      setProducts((prev) =>
        prev.map((p) => (p.id === it.productId ? { ...p, stock: Math.max(0, p.stock - it.quantity) } : p))
      );
    });

    return newOrder;
  };

  // Platform Config
  const [config, setConfig] = useState<PlatformConfig>(() => {
    const saved = localStorage.getItem('shopza_config');
    return saved ? JSON.parse(saved) : INITIAL_CONFIG;
  });

  const updateCommissionRate = (ratePercent: number) => {
    const updated = { ...config, commissionRatePercent: ratePercent };
    setConfig(updated);
    localStorage.setItem('shopza_config', JSON.stringify(updated));
    addToast('success', 'Commission Rate Updated', `Marketplace fee is now set to ${ratePercent.toFixed(1)}%`);
  };

  const updatePlatformConfig = (data: Partial<PlatformConfig>) => {
    const updated = { ...config, ...data };
    setConfig(updated);
    localStorage.setItem('shopza_config', JSON.stringify(updated));
    addToast('success', 'Platform settings saved');
  };

  // Helper to normalize strings for robust search across accents, spaces, and punctuation
  const normalizeText = (text: string | undefined | null) => {
    if (!text || typeof text !== 'string') return '';
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, ' ');
  };

  // Shared Central Store Registry
  const [stores, setStores] = useState<Store[]>(() => {
    const saved = localStorage.getItem('shopza_stores');
    if (!saved) return [];
    try {
      const parsed: any[] = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
          .filter((s) => !KNOWN_DEMO_STORE_IDS.includes(s.id))
          .map((s) => ({
            ...s,
            storeId: s.storeId || s.id,
            normalizedName: s.normalizedName || normalizeText(s.name),
            status: s.status || 'open',
            isPublic: s.isPublic !== undefined ? s.isPublic : true,
            verificationStatus: s.verificationStatus || (s.isVerified ? 'verified' : 'unverified'),
            categories: Array.isArray(s.categories)
              ? s.categories
              : s.category
              ? [s.category]
              : ['Fashion & Apparel'],
          }));
      }
      return [];
    } catch {
      return [];
    }
  });

  // Real-time Firestore sync for all accounts and sessions: stores/{storeId}
  useEffect(() => {
    const storesCollectionRef = collection(db, 'stores');
    const unsubscribe = onSnapshot(
      storesCollectionRef,
      (snapshot) => {
        const firestoreStores: Store[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as any;
          if (data && data.name && !KNOWN_DEMO_STORE_IDS.includes(docSnap.id)) {
            firestoreStores.push({
              ...data,
              id: docSnap.id || data.id,
              storeId: data.storeId || docSnap.id || data.id,
              name: data.name,
              normalizedName: data.normalizedName || normalizeText(data.name),
              username: data.username,
              ownerId: data.ownerId,
              ownerName: data.ownerName || 'Verified Merchant',
              ownerEmail: data.ownerEmail || '',
              logo: data.logo || data.logoUrl || 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=200&auto=format&fit=crop&q=80',
              logoUrl: data.logoUrl || data.logo,
              banner: data.banner || data.bannerUrl || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80',
              bannerUrl: data.bannerUrl || data.banner,
              description: data.description || '',
              categories: Array.isArray(data.categories)
                ? data.categories
                : data.category
                ? [data.category]
                : ['Fashion & Apparel'],
              category: data.category || (Array.isArray(data.categories) ? data.categories[0] : 'Fashion & Apparel'),
              location: data.location || 'Lagos, Nigeria',
              state: data.state || 'Lagos',
              rating: typeof data.rating === 'number' ? data.rating : 5.0,
              reviewCount: typeof data.reviewCount === 'number' ? data.reviewCount : 0,
              followerCount: typeof data.followerCount === 'number' ? data.followerCount : 0,
              isVerified: Boolean(data.isVerified),
              verificationStatus: data.verificationStatus || (data.isVerified ? 'verified' : 'unverified'),
              verificationBadgeType: data.verificationBadgeType,
              status: data.status || 'open',
              isPublic: data.isPublic !== undefined ? data.isPublic : true,
              createdAt: data.createdAt || new Date().toISOString(),
              updatedAt: data.updatedAt || new Date().toISOString(),
              joinedDate: data.joinedDate || 'Recently Joined',
              responseTime: data.responseTime || '< 15 mins',
              operatingHours: data.operatingHours || 'Mon - Sat: 8:00 AM - 7:00 PM',
              policies: data.policies || {
                shipping: 'Dispatches within 24 hours via licensed dispatch couriers.',
                returns: '7-day standard inspection window for eligible items.',
                cancellation: 'Orders can be cancelled before merchant begins dispatch.',
              },
              productCount: typeof data.productCount === 'number' ? data.productCount : 0,
              serviceCount: typeof data.serviceCount === 'number' ? data.serviceCount : 0,
              bankDetails: data.bankDetails,
              themeSettings: data.themeSettings,
            });
          }
        });

        setStores(firestoreStores);
        localStorage.setItem('shopza_stores', JSON.stringify(firestoreStores));
      },
      (error) => {
        console.warn('Real-time Firestore stores listener notice:', error);
      }
    );

    return () => unsubscribe();
  }, []);

  const [followedStores, setFollowedStores] = useState<string[]>(() => {
    const saved = localStorage.getItem('shopza_followed_stores');
    return saved ? JSON.parse(saved) : [];
  });

  const getStoreByUsername = (username: string) => {
    if (!username) return undefined;
    const clean = decodeURIComponent(username).trim().toLowerCase().replace(/\/+$/, '').replace(/^@/, '');
    const cleanNorm = normalizeText(clean);
    return stores.find(
      (s) =>
        s.username.toLowerCase() === clean ||
        s.id.toLowerCase() === clean ||
        (s.storeId && s.storeId.toLowerCase() === clean) ||
        normalizeText(s.username) === cleanNorm ||
        normalizeText(s.name) === cleanNorm
    );
  };

  const updateStore = async (storeId: string, data: Partial<Store>) => {
    const targetStore = stores.find((s) => s.id === storeId || s.storeId === storeId);
    if (!targetStore) {
      addToast('error', 'Store not found');
      return;
    }

    if (!currentUser || (currentUser.id !== targetStore.ownerId && currentUser.role !== 'admin')) {
      addToast('error', 'Unauthorized', 'You can only edit your own store.');
      return;
    }

    const payload: Partial<Store> = {
      ...data,
      updatedAt: new Date().toISOString(),
    };
    if (data.name) {
      payload.normalizedName = normalizeText(data.name);
    }

    // Direct write to shared Firestore
    try {
      await updateDoc(doc(db, 'stores', targetStore.id), payload);
      setStores((prev) => {
        const updated = prev.map((s) => (s.id === targetStore.id ? { ...s, ...payload } : s));
        localStorage.setItem('shopza_stores', JSON.stringify(updated));
        return updated;
      });
      addToast('success', 'Storefront Details Updated');
    } catch (err) {
      console.error('Update store error:', err);
      addToast('error', 'Update Failed', 'Could not save store changes to the cloud database.');
    }
  };

  const createStore = async (storeData: any): Promise<Store> => {
    if (!currentUser) {
      addToast('error', 'Sign In Required', 'You must be signed in with an email account to launch a store.');
      throw new Error('User not authenticated');
    }

    const finalName = (
      storeData.name ||
      storeData.storeName ||
      `${currentUser.name}'s Store`
    ).trim();

    if (!finalName) {
      addToast('warning', 'Store Name Required', 'Please provide a valid name for your store.');
      throw new Error('Store name is required');
    }

    const rawUsername =
      storeData.username ||
      storeData.storeUsername ||
      finalName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const baseUsername =
      rawUsername.toLowerCase().replace(/[^a-z0-9-]+/g, '') ||
      `store-${Date.now().toString().slice(-4)}`;

    // Ensure username is unique against existing stores
    const existingIndex = stores.findIndex(
      (s) =>
        s.username.toLowerCase() === baseUsername.toLowerCase() &&
        s.ownerId !== currentUser.id
    );
    const finalUsername =
      existingIndex >= 0 ? `${baseUsername}-${Date.now().toString().slice(-4)}` : baseUsername;

    // Stable deterministic store ID tied to the owner or existing store record
    const stableStoreId = `store-${currentUser.id}`;
    const timestamp = new Date().toISOString();

    const newStore: Store = {
      id: stableStoreId,
      storeId: stableStoreId,
      name: finalName,
      normalizedName: normalizeText(finalName),
      username: finalUsername,
      ownerId: currentUser.id,
      ownerName: currentUser.name || 'Merchant',
      ownerEmail: currentUser.email || '',
      logo:
        storeData.logo ||
        storeData.logoUrl ||
        'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=200&auto=format&fit=crop&q=80',
      logoUrl:
        storeData.logoUrl ||
        storeData.logo ||
        'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=200&auto=format&fit=crop&q=80',
      banner:
        storeData.banner ||
        storeData.bannerUrl ||
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80',
      bannerUrl:
        storeData.bannerUrl ||
        storeData.banner ||
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80',
      description:
        storeData.description ||
        `Official digital storefront for ${finalName}. Nationwide dispatch available.`,
      categories:
        storeData.categories ||
        (storeData.category ? [storeData.category] : ['Fashion & Apparel', 'Tech & Electronics']),
      category:
        storeData.category ||
        (Array.isArray(storeData.categories) ? storeData.categories[0] : 'Fashion & Apparel'),
      location: storeData.location || currentUser.location || 'Lagos, Nigeria',
      state:
        storeData.state ||
        (storeData.location && storeData.location.includes(',')
          ? storeData.location.split(',')[1].trim()
          : 'Lagos'),
      rating: 5.0,
      reviewCount: 0,
      followerCount: 0,
      isVerified: false, // Genuine verification: newly launched stores start unverified until audited
      verificationStatus: 'unverified',
      status: 'open',
      isPublic: true,
      createdAt: timestamp,
      updatedAt: timestamp,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      responseTime: storeData.responseTime || '< 15 mins',
      operatingHours: storeData.operatingHours || 'Mon - Sat: 8:00 AM - 7:00 PM',
      policies: storeData.policies || {
        shipping: 'Dispatches within 24 hours via licensed dispatch couriers.',
        returns: storeData.returnPolicy || '7-day standard inspection window for eligible items.',
        cancellation: 'Orders can be cancelled before merchant begins dispatch.',
      },
      productCount: 0,
      serviceCount: 0,
      bankDetails: storeData.bankDetails || {
        bankName: 'Access Bank PLC',
        accountNumber: '0000000000',
        accountName: currentUser.name || 'Merchant',
      },
      themeSettings: storeData.themeSettings || {
        primaryColor: '#5B35F5',
        announcementBarEnabled: true,
        announcementBarText: `Welcome to ${finalName}! Nationwide Delivery Available ✨`,
        bannerStyle: 'full_bleed',
        fontFamily: 'Plus Jakarta Sans',
        gridDensity: 'spacious',
        showBadges: true,
        whatsappChatEnabled: true,
      },
    };

    // CRITICAL: Write to central shared Firestore FIRST. Do not report success if it fails.
    try {
      await setDoc(doc(db, 'stores', newStore.id), newStore);
    } catch (writeErr: any) {
      console.error('Failed to create store in Firestore:', writeErr);
      addToast(
        'error',
        'Store Creation Failed',
        writeErr?.message || 'Unable to save store to the shared database. Please check connection and retry.'
      );
      throw writeErr;
    }

    // Update current user to seller in Firestore
    const userUpdate: Partial<User> = {
      isSeller: true,
      role: 'seller',
      storeUsername: newStore.username,
    };
    const updatedUser = { ...currentUser, ...userUpdate };
    setCurrentUser(updatedUser);
    localStorage.setItem('shopza_user', JSON.stringify(updatedUser));

    try {
      await updateDoc(doc(db, 'users', currentUser.id), userUpdate);
    } catch (uErr) {
      console.warn('Failed to update user profile in Firestore:', uErr);
    }

    // Update local state
    setStores((prev) => {
      const filtered = prev.filter((s) => s.ownerId !== currentUser.id && s.id !== newStore.id);
      const next = [newStore, ...filtered];
      localStorage.setItem('shopza_stores', JSON.stringify(next));
      return next;
    });

    addToast('success', 'Storefront Launched!', `Your store is live at /store/${newStore.username}`);
    return newStore;
  };

  const toggleFollowStore = (storeUsername: string) => {
    if (!currentUser) {
      addToast('warning', 'Account Required', 'Please sign in with Google or Email to follow stores.');
      setAuthModalOpen(true);
      return;
    }
    setFollowedStores((prev) => {
      let updated: string[];
      if (prev.includes(storeUsername)) {
        updated = prev.filter((u) => u !== storeUsername);
        addToast('info', 'Unfollowed Store');
        setStores((st) =>
          st.map((s) => (s.username === storeUsername ? { ...s, followerCount: Math.max(0, s.followerCount - 1) } : s))
        );
      } else {
        updated = [...prev, storeUsername];
        addToast('success', 'Store Followed!', `You will now receive drop updates from this store.`);
        setStores((st) =>
          st.map((s) => (s.username === storeUsername ? { ...s, followerCount: s.followerCount + 1 } : s))
        );
      }
      localStorage.setItem('shopza_followed_stores', JSON.stringify(updated));
      return updated;
    });
  };

  const isStoreFollowed = (storeUsername: string) => followedStores.includes(storeUsername);

  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('shopza_products');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed)
        ? parsed.filter((p) => !KNOWN_DEMO_PRODUCT_IDS.includes(p.id))
        : [];
    } catch {
      return [];
    }
  });

  // Real-time Firestore sync for all accounts and sessions: products/{productId}
  useEffect(() => {
    const productsColRef = collection(db, 'products');
    const unsubscribe = onSnapshot(
      productsColRef,
      (snapshot) => {
        const cloudProducts: Product[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as any;
          if (data && data.title && !KNOWN_DEMO_PRODUCT_IDS.includes(docSnap.id)) {
            cloudProducts.push({
              ...data,
              id: docSnap.id || data.id,
            });
          }
        });
        setProducts(cloudProducts);
        localStorage.setItem('shopza_products', JSON.stringify(cloudProducts));
      },
      (error) => {
        console.warn('Real-time Firestore products listener notice:', error);
      }
    );
    return () => unsubscribe();
  }, []);

  const getProductById = (id: string) => products.find((p) => p.id === id);
  const getProductBySlug = (slug: string) => products.find((p) => p.slug === slug || p.id === slug);

  const addProduct = (productData: Omit<Product, 'id' | 'rating' | 'reviewCount' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      rating: 5.0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newProduct, ...products.filter((p) => p.id !== newProduct.id)];
    setProducts(updated);
    localStorage.setItem('shopza_products', JSON.stringify(updated));

    // Save to Firestore
    try {
      const cleanProduct = Object.fromEntries(
        Object.entries(newProduct).filter(([_, v]) => v !== undefined)
      );
      setDoc(doc(db, 'products', newProduct.id), cleanProduct).catch((err) =>
        console.error('Failed to write product to Firestore:', err)
      );
    } catch (e) {
      console.warn('Error saving product to Firestore:', e);
    }

    // Update store count
    setStores((prev) =>
      prev.map((s) => (s.username === newProduct.storeUsername ? { ...s, productCount: s.productCount + 1 } : s))
    );

    addToast('success', 'Product Listed Successfully', `"${newProduct.title}" is now available on SHOPZA.`);
    return newProduct;
  };

  const updateProduct = (productId: string, data: Partial<Product>) => {
    let triggeredPriceDrop = false;
    let oldPrice = 0;
    let newPrice = 0;
    let dropProd: Product | null = null;

    setProducts((prev) => {
      const existing = prev.find((p) => p.id === productId);
      if (existing && data.price !== undefined && data.price < existing.price) {
        triggeredPriceDrop = true;
        oldPrice = existing.price;
        newPrice = data.price;
        dropProd = existing;
      }
      const updated = prev.map((p) => (p.id === productId ? { ...p, ...data, updatedAt: new Date().toISOString() } : p));
      localStorage.setItem('shopza_products', JSON.stringify(updated));
      return updated;
    });

    // Update in Firestore
    try {
      const cleanUpdate = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== undefined)
      );
      updateDoc(doc(db, 'products', productId), {
        ...cleanUpdate,
        updatedAt: new Date().toISOString(),
      }).catch((err) => console.error('Failed to update product in Firestore:', err));
    } catch (e) {
      console.warn('Error updating product in Firestore:', e);
    }

    if (triggeredPriceDrop && dropProd) {
      const p = dropProd as Product;
      const isFav = favorites.includes(productId);
      const notifId = `notif-pd-${Date.now()}`;
      const newNotif: Notification = {
        id: notifId,
        userId: currentUser?.id || 'all',
        title: `🔥 Price Drop Alert: ${p.title}`,
        message: `${isFav ? 'An item in your Wishlist just dropped in price! ' : ''}"${p.title}" is now discounted from ${formatCurrency(oldPrice)} down to ${formatCurrency(newPrice)}. Save ${formatCurrency(oldPrice - newPrice)}!`,
        type: 'price_drop',
        link: `/product/${p.id}`,
        read: false,
        createdAt: new Date().toISOString(),
      };

      setNotifications((prevNotifs) => {
        const next = [newNotif, ...prevNotifs];
        localStorage.setItem('shopza_notifications', JSON.stringify(next));
        return next;
      });

      addToast('info', '🔥 Price Drop Alert!', `"${p.title}" dropped to ${formatCurrency(newPrice)}!`);
    } else {
      addToast('success', 'Product Updated');
    }
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => {
      const target = prev.find((p) => p.id === productId);
      const updated = prev.filter((p) => p.id !== productId);
      localStorage.setItem('shopza_products', JSON.stringify(updated));
      if (target) {
        setStores((st) =>
          st.map((s) => (s.username === target.storeUsername ? { ...s, productCount: Math.max(0, s.productCount - 1) } : s))
        );
      }
      return updated;
    });

    // Delete in Firestore
    try {
      deleteDoc(doc(db, 'products', productId)).catch((err: any) =>
        console.error('Failed to delete product from Firestore:', err)
      );
    } catch (e) {
      console.warn('Error deleting product from Firestore:', e);
    }

    addToast('info', 'Product listing removed');
  };

  const duplicateProduct = (productId: string) => {
    const p = products.find((it) => it.id === productId);
    if (!p) return undefined;
    const duplicated: Product = {
      ...p,
      id: `prod-${Date.now()}`,
      title: `${p.title} (Copy)`,
      slug: `${p.slug}-copy-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [duplicated, ...products];
    setProducts(updated);
    localStorage.setItem('shopza_products', JSON.stringify(updated));

    // Save duplicated to Firestore
    try {
      const cleanProduct = Object.fromEntries(
        Object.entries(duplicated).filter(([_, v]) => v !== undefined)
      );
      setDoc(doc(db, 'products', duplicated.id), cleanProduct).catch((err) =>
        console.error('Failed to write cloned product to Firestore:', err)
      );
    } catch (e) {
      console.warn('Error saving duplicate product to Firestore:', e);
    }

    addToast('success', 'Product Cloned', `Duplicate created: "${duplicated.title}"`);
    return duplicated;
  };

  const promoteProduct = (productId: string, days: number, cost: number) => {
    updateProduct(productId, { isPromoted: true });
    addToast('success', 'Campaign Launched!', `Listing promoted for ${days} days (Charged ₦${cost.toLocaleString()}).`);
  };

  // Services
  const [services, setServices] = useState<ServiceItem[]>(() => {
    const saved = localStorage.getItem('shopza_services');
    return saved ? JSON.parse(saved) : [];
  });

  const addService = (serviceData: Omit<ServiceItem, 'id'>) => {
    const newService: ServiceItem = {
      ...serviceData,
      id: `serv-${Date.now()}`,
    };
    const updated = [newService, ...services];
    setServices(updated);
    localStorage.setItem('shopza_services', JSON.stringify(updated));
    setStores((prev) =>
      prev.map((s) => (s.username === newService.storeUsername ? { ...s, serviceCount: s.serviceCount + 1 } : s))
    );
    addToast('success', 'Service Offering Published');
    return newService;
  };

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('shopza_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      let updated: CartItem[];
      if (existing) {
        updated = prev.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        updated = [...prev, { productId: product.id, product, quantity }];
      }
      localStorage.setItem('shopza_cart', JSON.stringify(updated));
      return updated;
    });
    addToast('success', 'Added to Shopping Bag', `"${product.title}" is in your bag.`);
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    setCart((prev) => {
      let updated: CartItem[];
      if (quantity <= 0) {
        updated = prev.filter((item) => item.productId !== productId);
      } else {
        updated = prev.map((item) => (item.productId === productId ? { ...item, quantity } : item));
      }
      localStorage.setItem('shopza_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const updated = prev.filter((item) => item.productId !== productId);
      localStorage.setItem('shopza_cart', JSON.stringify(updated));
      return updated;
    });
    addToast('info', 'Item Removed from Bag');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setCouponDiscount(0);
    localStorage.removeItem('shopza_cart');
  };

  const cartCount = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart]);
  const cartSubtotal = useMemo(() => cart.reduce((total, item) => total + item.product.price * item.quantity, 0), [cart]);

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    const result = validateAndApplyDiscount(clean, cartSubtotal);
    if (result.success) {
      addToast('success', 'Promo Code Applied', result.message);
      return true;
    }
    addToast('error', 'Coupon Error', result.message);
    return false;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    addToast('info', 'Coupon Removed');
  };

  // Favorites & Cloud Sync
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('shopza_favorites');
    return saved ? JSON.parse(saved) : ['prod-1', 'prod-3'];
  });
  const [wishlistSyncStatus, setWishlistSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('synced');

  // 1. Cloud-Sync Wishlist with Firebase Firestore across devices
  useEffect(() => {
    if (!currentUser?.id) {
      setWishlistSyncStatus('offline');
      return;
    }

    setWishlistSyncStatus('syncing');
    const wishlistDocRef = doc(db, 'wishlists', currentUser.id);

    // Real-time listener for live cross-device sync
    const unsubscribe = onSnapshot(
      wishlistDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const cloudData = docSnap.data();
          if (Array.isArray(cloudData.productIds)) {
            setFavorites((localPrev) => {
              // Merge cloud and local so items from any device persist seamlessly
              const merged = Array.from(new Set([...cloudData.productIds, ...localPrev]));
              localStorage.setItem('shopza_favorites', JSON.stringify(merged));
              return merged;
            });
          }
        } else {
          // Initialize user's wishlist in Firestore
          setDoc(
            wishlistDocRef,
            {
              productIds: favorites,
              userId: currentUser.id,
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          ).catch((err) => console.warn('Wishlist initial sync error:', err));
        }
        setWishlistSyncStatus('synced');
      },
      (error) => {
        console.warn('Wishlist sync offline fallback:', error);
        setWishlistSyncStatus('offline');
      }
    );

    return () => unsubscribe();
  }, [currentUser?.id]);

  // 2. Toggle Favorite with Instant Firestore Persistence
  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => {
      let updated: string[];
      if (prev.includes(productId)) {
        updated = prev.filter((id) => id !== productId);
        addToast('info', 'Removed from Wishlist');
      } else {
        updated = [...prev, productId];
        addToast('success', 'Saved to Wishlist');
      }
      localStorage.setItem('shopza_favorites', JSON.stringify(updated));

      // Persist to Firestore if user is authenticated
      if (currentUser?.id) {
        setWishlistSyncStatus('syncing');
        setDoc(
          doc(db, 'wishlists', currentUser.id),
          {
            productIds: updated,
            userId: currentUser.id,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        )
          .then(() => setWishlistSyncStatus('synced'))
          .catch((err) => {
            console.warn('Wishlist save error:', err);
            setWishlistSyncStatus('offline');
          });
      }

      return updated;
    });
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  // 3. Automated Price Drop Monitor for Wishlisted / Favorited items
  useEffect(() => {
    if (!products.length || !favorites.length) return;

    try {
      const baselinesRaw = localStorage.getItem('shopza_favorite_price_baselines');
      const baselines: Record<string, number> = baselinesRaw ? JSON.parse(baselinesRaw) : {};
      const notifiedRaw = localStorage.getItem('shopza_notified_price_drops');
      const notifiedDrops: string[] = notifiedRaw ? JSON.parse(notifiedRaw) : [];

      let hasNewNotification = false;
      const newNotifications: Notification[] = [];

      favorites.forEach((favId) => {
        const prod = products.find((p) => p.id === favId);
        if (!prod) return;

        // Check if item has a recorded discount or dropped below baseline
        const comparePrice = prod.originalPrice || baselines[favId];
        const uniqueKey = `${favId}-${prod.price}`;

        if (comparePrice && prod.price < comparePrice && !notifiedDrops.includes(uniqueKey)) {
          notifiedDrops.push(uniqueKey);
          hasNewNotification = true;

          newNotifications.push({
            id: `notif-pd-${favId}-${Date.now()}`,
            userId: currentUser?.id || 'all',
            title: `🔥 Price Drop Alert: ${prod.title}`,
            message: `Great news! "${prod.title}" in your Wishlist dropped from ${formatCurrency(comparePrice)} to ${formatCurrency(prod.price)}! (Save ${formatCurrency(comparePrice - prod.price)})`,
            type: 'price_drop',
            link: `/product/${prod.id}`,
            read: false,
            createdAt: new Date().toISOString(),
          });
        }
        baselines[favId] = prod.price;
      });

      if (hasNewNotification) {
        setNotifications((prev) => {
          const updated = [...newNotifications, ...prev];
          localStorage.setItem('shopza_notifications', JSON.stringify(updated));
          return updated;
        });
        localStorage.setItem('shopza_notified_price_drops', JSON.stringify(notifiedDrops));
      }
      localStorage.setItem('shopza_favorite_price_baselines', JSON.stringify(baselines));
    } catch (e) {
      console.warn('Favorite price baseline check notice:', e);
    }
  }, [favorites, products, currentUser?.id]);

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('shopza_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const getOrderById = (orderId: string) => orders.find((o) => o.id === orderId || o.orderNumber === orderId);

  const placeOrder = (orderData: {
    shippingAddress: Order['shippingAddress'];
    deliveryMethod: string;
    deliveryFee: number;
    paymentMethod: Order['paymentMethod'];
    paymentReference: string;
  }) => {
    const orderNumber = `SHP-${Date.now().toString().slice(-6)}`;
    const sellerIds = Array.from(new Set(cart.map((item) => item.product.sellerId)));

    const orderItems = cart.map((item) => ({
      productId: item.productId,
      title: item.product.title,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.images[0],
      sellerId: item.product.sellerId,
      storeUsername: item.product.storeUsername,
      sellerName: item.product.sellerName,
    }));

    const platformFee = Math.round((cartSubtotal * config.commissionRatePercent) / 100);
    const total = cartSubtotal + orderData.deliveryFee - couponDiscount;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      buyerId: currentUser?.id || 'guest-buyer',
      buyerName: orderData.shippingAddress.fullName || currentUser?.name || 'Customer',
      buyerEmail: currentUser?.email || 'customer@gmail.com',
      buyerPhone: orderData.shippingAddress.phone,
      sellerIds,
      items: orderItems,
      subtotal: cartSubtotal,
      deliveryFee: orderData.deliveryFee,
      discount: couponDiscount,
      platformFee,
      total,
      status: 'payment_confirmed',
      shippingAddress: orderData.shippingAddress,
      deliveryMethod: orderData.deliveryMethod,
      paymentMethod: orderData.paymentMethod,
      paymentReference: orderData.paymentReference,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      statusHistory: [
        {
          status: 'payment_confirmed',
          timestamp: new Date().toISOString(),
          note: 'Funds secured in 256-bit encrypted SHOPZA Escrow. Merchants notified for dispatch.',
        },
      ],
    };

    const updated = [newOrder, ...orders];
    setOrders(updated);
    localStorage.setItem('shopza_orders', JSON.stringify(updated));

    // Deduct stock
    cart.forEach((item) => {
      updateProduct(item.productId, {
        stock: Math.max(0, item.product.stock - item.quantity),
      });
    });

    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    setOrders((prev) => {
      const updated = prev.map((o) => {
        if (o.id === orderId || o.orderNumber === orderId) {
          const historyEntry = {
            status,
            timestamp: new Date().toISOString(),
            note: note || `Order transitioned to ${status.replace(/_/g, ' ')}`,
          };
          return {
            ...o,
            status,
            updatedAt: new Date().toISOString(),
            statusHistory: [...(o.statusHistory || []), historyEntry],
          };
        }
        return o;
      });
      localStorage.setItem('shopza_orders', JSON.stringify(updated));
      return updated;
    });
    addToast('success', 'Order Status Updated', `Order marked as ${status.replace(/_/g, ' ')}`);
  };

  // Messages & Conversations
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('shopza_conversations');
    return saved ? JSON.parse(saved) : [];
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('shopza_messages');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  const sendMessage = (conversationId: string, text: string, referencedProductId?: string) => {
    if (!text.trim()) return;
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: currentUser?.id || 'user-buyer-1',
      senderName: currentUser?.name || 'Customer',
      senderAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      text: text.trim(),
      timestamp: new Date().toISOString(),
      read: true,
      referencedProductId,
    };

    const updatedMsgs = [...messages, newMessage];
    setMessages(updatedMsgs);
    localStorage.setItem('shopza_messages', JSON.stringify(updatedMsgs));

    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId ? { ...c, lastMessage: text.trim(), lastMessageTimestamp: new Date().toISOString() } : c
      )
    );
  };

  const startProductChat = (product: Product) => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return '';
    }
    const existing = conversations.find(
      (c) =>
        c.productId === product.id &&
        (c.participantIds?.includes(currentUser.id) ||
          c.participants?.some((p) => p.id === currentUser.id))
    );

    if (existing) {
      setActiveConversationId(existing.id);
      return existing.id;
    }

    const newId = `conv-${Date.now()}`;
    const newConv: Conversation = {
      id: newId,
      participants: [
        {
          id: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
          username: currentUser.username,
          role: currentUser.role,
        },
        {
          id: product.sellerId,
          name: product.sellerName,
          avatar: product.sellerAvatar,
          username: product.storeUsername,
          role: 'seller',
        },
      ],
      participantIds: [currentUser.id, product.sellerId],
      participantNames: {
        [currentUser.id]: currentUser.name,
        [product.sellerId]: product.sellerName,
      },
      participantAvatars: {
        [currentUser.id]: currentUser.avatar,
        [product.sellerId]: product.sellerAvatar,
      },
      productId: product.id,
      productTitle: product.title,
      productImage: product.images[0],
      productPrice: product.price,
      lastMessage: `Hi, I am interested in purchasing "${product.title}". Is this available?`,
      lastMessageTimestamp: new Date().toISOString(),
      unreadCount: 0,
    };

    setConversations([newConv, ...conversations]);
    sendMessage(newId, newConv.lastMessage, product.id);
    setActiveConversationId(newId);
    return newId;
  };

  const startStoreChat = (store: Store) => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return '';
    }
    const current = currentUser;

    const existing = conversations.find(
      (c) =>
        (c.participantIds?.includes(store.ownerId) ||
          c.participants?.some((p) => p.id === store.ownerId || p.username === store.username)) &&
        (c.participantIds?.includes(current.id) ||
          c.participants?.some((p) => p.id === current.id))
    );

    if (existing) {
      setActiveConversationId(existing.id);
      return existing.id;
    }

    const newId = `conv-${Date.now()}`;
    const newConv: Conversation = {
      id: newId,
      participants: [
        {
          id: current.id,
          name: current.name,
          avatar: current.avatar,
          username: current.username,
          role: current.role || 'buyer',
        },
        {
          id: store.ownerId,
          name: store.name,
          avatar: store.logo,
          username: store.username,
          role: 'seller',
        },
      ],
      participantIds: [current.id, store.ownerId],
      participantNames: {
        [current.id]: current.name,
        [store.ownerId]: store.name,
      },
      participantAvatars: {
        [current.id]: current.avatar,
        [store.ownerId]: store.logo,
      },
      lastMessage: `Hello ${store.name}! I am browsing your verified storefront and have a few questions.`,
      lastMessageTimestamp: new Date().toISOString(),
      unreadCount: 0,
    };

    const updatedConvs = [newConv, ...conversations];
    setConversations(updatedConvs);
    localStorage.setItem('shopza_conversations', JSON.stringify(updatedConvs));
    sendMessage(newId, newConv.lastMessage);
    setActiveConversationId(newId);
    return newId;
  };

  const sendSellerManualReply = (conversationId: string, text: string) => {
    if (!text.trim()) return;
    const conv = conversations.find((c) => c.id === conversationId);
    const sellerParticipant = conv?.participants.find((p) => p.role === 'seller') || conv?.participants[1];

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: sellerParticipant?.id || 'seller',
      senderName: sellerParticipant?.name || 'Store Merchant',
      senderAvatar: sellerParticipant?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      text: text.trim(),
      timestamp: new Date().toISOString(),
      read: true,
    };

    const updatedMsgs = [...messages, newMessage];
    setMessages(updatedMsgs);
    localStorage.setItem('shopza_messages', JSON.stringify(updatedMsgs));

    const updatedConvs = conversations.map((c) =>
      c.id === conversationId
        ? { ...c, lastMessage: text.trim(), lastMessageTimestamp: new Date().toISOString() }
        : c
    );
    setConversations(updatedConvs);
    localStorage.setItem('shopza_conversations', JSON.stringify(updatedConvs));
  };

  const unreadMessagesCount = useMemo(() => {
    return messages.filter((m) => m.senderId !== currentUser?.id && !m.read).length;
  }, [messages, currentUser]);

  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('shopza_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast('info', 'Notifications Marked as Read');
  };

  const unreadNotificationsCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  // Reviews
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('shopza_reviews');
    return saved ? JSON.parse(saved) : [];
  });

  const addReview = (reviewData: Omit<Review, 'id' | 'createdAt'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStorage.setItem('shopza_reviews', JSON.stringify(updated));

    // Update product rating if product review
    const targetProductId = reviewData.productId || (reviewData.targetType === 'product' ? reviewData.targetId : undefined);
    if (targetProductId) {
      const prodReviews = updated.filter((r) => r.productId === targetProductId || (r.targetType === 'product' && r.targetId === targetProductId));
      const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / (prodReviews.length || 1);
      updateProduct(targetProductId, {
        rating: parseFloat(avg.toFixed(1)),
        reviewCount: prodReviews.length,
      });
    }

    // Update store rating if store review
    const targetStoreId = reviewData.targetType === 'store' ? reviewData.targetId : undefined;
    if (targetStoreId) {
      const storeReviewsList = updated.filter(
        (r) => r.targetType === 'store' && (r.targetId === targetStoreId || (r as any).storeUsername === targetStoreId)
      );
      if (storeReviewsList.length > 0) {
        const avg = storeReviewsList.reduce((sum, r) => sum + r.rating, 0) / storeReviewsList.length;
        setStores((prev) =>
          prev.map((s) =>
            s.username.toLowerCase() === targetStoreId.toLowerCase() || s.id === targetStoreId
              ? { ...s, rating: parseFloat(avg.toFixed(2)), reviewCount: storeReviewsList.length }
              : s
          )
        );
      }
    }

    addToast('success', 'Verified Review Submitted', 'Thank you for rating your experience!');
  };

  const replyToReview = (reviewId: string, replyComment: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              sellerReply: {
                comment: replyComment,
                createdAt: new Date().toISOString(),
              },
            }
          : r
      )
    );
    addToast('success', 'Merchant Reply Posted');
  };

  // Financials & Withdrawals
  const [transactions] = useState<Transaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(() => {
    const saved = localStorage.getItem('shopza_withdrawals');
    return saved ? JSON.parse(saved) : [];
  });

  const getSellerBalance = (sellerId: string) => {
    const sellerOrders = orders.filter((o) => o.sellerIds.includes(sellerId));
    const gross = sellerOrders.reduce((sum, o) => {
      const itemsSub = o.items.filter((it) => it.sellerId === sellerId).reduce((s, it) => s + it.price * it.quantity, 0);
      return sum + itemsSub;
    }, 0);

    const commission = Math.round((gross * config.commissionRatePercent) / 100);
    const net = gross - commission;

    const withdrawn = withdrawals
      .filter((w) => w.sellerId === sellerId && w.status === 'processed')
      .reduce((sum, w) => sum + w.amount, 0);

    const pendingWithdrawal = withdrawals
      .filter((w) => w.sellerId === sellerId && w.status === 'pending')
      .reduce((sum, w) => sum + w.amount, 0);

    const available = Math.max(0, net - withdrawn - pendingWithdrawal);

    return { gross, commission, net, withdrawn, available, pending: pendingWithdrawal };
  };

  const requestWithdrawal = (
    amount: number,
    bankDetails: { bankName: string; accountNumber: string; accountName: string }
  ) => {
    if (!currentUser) return false;
    const balance = getSellerBalance(currentUser.id);
    if (amount > balance.available || amount < config.minWithdrawalAmount) {
      addToast(
        'error',
        'Withdrawal Request Failed',
        `Minimum withdrawal is ₦${config.minWithdrawalAmount.toLocaleString()} and cannot exceed available balance.`
      );
      return false;
    }

    const newRequest: WithdrawalRequest = {
      id: `wd-${Date.now()}`,
      sellerId: currentUser.id,
      sellerName: currentUser.name,
      storeName: currentUser.storeUsername || currentUser.name,
      amount,
      bankName: bankDetails.bankName,
      accountNumber: bankDetails.accountNumber,
      accountName: bankDetails.accountName,
      status: 'pending',
      requestedAt: new Date().toISOString(),
    };

    const updated = [newRequest, ...withdrawals];
    setWithdrawals(updated);
    localStorage.setItem('shopza_withdrawals', JSON.stringify(updated));
    addToast('success', 'Payout Queued', `₦${amount.toLocaleString()} scheduled for automated settlement.`);
    return true;
  };

  const approveWithdrawal = (withdrawalId: string) => {
    setWithdrawals((prev) =>
      prev.map((w) => (w.id === withdrawalId ? { ...w, status: 'processed', processedAt: new Date().toISOString() } : w))
    );
    addToast('success', 'Withdrawal Approved & Settled');
  };

  const rejectWithdrawal = (withdrawalId: string, reason?: string) => {
    setWithdrawals((prev) =>
      prev.map((w) => (w.id === withdrawalId ? { ...w, status: 'rejected', notes: reason || 'Declined by Admin' } : w))
    );
    addToast('warning', 'Withdrawal Rejected', 'Funds returned to merchant available balance.');
  };

  // Moderation & Reports
  const [reports, setReports] = useState<Report[]>(() => {
    const saved = localStorage.getItem('shopza_reports');
    return saved ? JSON.parse(saved) : [];
  });

  const submitReport = (reportData: any) => {
    const newReport: Report = {
      ...reportData,
      id: `rep-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    const updated = [newReport, ...reports];
    setReports(updated);
    localStorage.setItem('shopza_reports', JSON.stringify(updated));
    addToast('info', 'Report Submitted', 'Our trust & safety compliance desk is reviewing this item.');
  };

  const resolveReport = (reportId: string, actionNote: string) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? {
              ...r,
              status: 'resolved',
              resolvedAt: new Date().toISOString(),
              adminActionTaken: actionNote,
            }
          : r
      )
    );
    addToast('success', 'Report Resolved');
  };

  const dismissReport = (reportId: string) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? { ...r, status: 'dismissed', resolvedAt: new Date().toISOString(), adminActionTaken: 'Dismissed upon review' }
          : r
      )
    );
    addToast('info', 'Report Dismissed');
  };

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  // Compatibility helpers
  const switchDemoUser = switchDemoRole;
  const createOrder = (orderData: any) => {
    return placeOrder({
      shippingAddress: orderData.shippingAddress || {
        fullName: 'Customer',
        phone: '0800000000',
        addressLine1: 'Lagos',
        city: 'Lagos',
        state: 'Lagos',
      },
      deliveryMethod: orderData.deliveryMethod || 'Express Lagos Dispatch',
      deliveryFee: orderData.deliveryFee || 2500,
      paymentMethod: orderData.paymentMethod || 'Card',
      paymentReference: `TXN-${Date.now()}`,
    });
  };

  const createProduct = (productData: any) => addProduct(productData);

  const upgradeToSeller = (storeData: any) => createStore(storeData);

  const startOrGetConversation = (productOrSeller: any, initialMsg?: string) => {
    if (productOrSeller?.images) {
      return startProductChat(productOrSeller);
    }
    return '';
  };

  const markNotificationAsRead = markNotificationRead;
  const markAllNotificationsAsRead = markAllNotificationsRead;

  return (
    <MarketplaceContext.Provider
      value={{
        currentPath,
        navigate,
        currentUser,
        setCurrentUser,
        authLoading,
        authModalOpen,
        setAuthModalOpen,
        authModalMode,
        openAuthModal,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        sendPasswordReset,
        signOut,
        updateUserProfile,
        switchDemoRole,
        currency,
        setCurrency,
        formatCurrency,
        discounts,
        createDiscount,
        toggleDiscountStatus,
        deleteDiscount,
        validateAndApplyDiscount,
        updateStoreTheme,
        completePOSSale,
        customers,
        addCustomer,
        updateCustomer,
        config,
        updateCommissionRate,
        updatePlatformConfig,
        stores,
        getStoreByUsername,
        updateStore,
        createStore,
        followedStores,
        toggleFollowStore,
        isStoreFollowed,
        products,
        getProductById,
        getProductBySlug,
        addProduct,
        updateProduct,
        deleteProduct,
        duplicateProduct,
        promoteProduct,
        services,
        addService,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        appliedCoupon,
        couponDiscount,
        applyCoupon,
        removeCoupon,
        favorites,
        toggleFavorite,
        isFavorite,
        wishlistSyncStatus,
        orders,
        getOrderById,
        placeOrder,
        updateOrderStatus,
        conversations,
        messages,
        activeConversationId,
        setActiveConversationId,
        sendMessage,
        startProductChat,
        startStoreChat,
        sendSellerManualReply,
        unreadMessagesCount,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        unreadNotificationsCount,
        reviews,
        addReview,
        replyToReview,
        transactions,
        withdrawals,
        requestWithdrawal,
        approveWithdrawal,
        rejectWithdrawal,
        getSellerBalance,
        reports,
        submitReport,
        resolveReport,
        dismissReport,
        searchQuery,
        setSearchQuery,
        toasts,
        addToast,
        removeToast,
        switchDemoUser,
        createOrder,
        createProduct,
        upgradeToSeller,
        startOrGetConversation,
        markNotificationAsRead,
        markAllNotificationsAsRead,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};
