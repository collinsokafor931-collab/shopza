import React, { useState, useMemo } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { Product } from '../types';
import {
  CreditCard,
  Banknote,
  Building2,
  Printer,
  Search,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  ShoppingBag,
  ArrowLeft,
  Barcode,
  UserCheck,
  Receipt,
  X,
} from 'lucide-react';

export const SellerPOSPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { products, currentUser, stores, completePOSSale, formatCurrency, addToast } = useMarketplace();

  const userStore =
    stores.find(
      (s) =>
        (currentUser?.id && s.ownerId === currentUser.id) ||
        (currentUser?.storeUsername && s.username === currentUser.storeUsername)
    );

  const storeProducts = products.filter(
    (p) =>
      (currentUser?.id && p.sellerId === currentUser.id) ||
      (userStore?.username && p.storeUsername === userStore.username)
  );

  const catalog = storeProducts.length > 0 ? storeProducts : products.slice(0, 12);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'transfer'>('cash');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(catalog.map((p) => p.category));
    return ['all', ...Array.from(cats)];
  }, [catalog]);

  const filteredProducts = useMemo(() => {
    return catalog.filter((p) => {
      if (!p) return false;
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          (p.title || '').toLowerCase().includes(q) ||
          (p.sku || '').toLowerCase().includes(q) ||
          (p.barcode || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [catalog, selectedCategory, searchQuery]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as { product: Product; quantity: number }[];
    });
  };

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const total = Math.max(0, subtotal - discountAmount);

  const handleCheckout = () => {
    if (cart.length === 0) {
      addToast('warning', 'Register Empty', 'Please select at least one product.');
      return;
    }

    const order = completePOSSale({
      storeId: userStore?.id || `store-${currentUser?.id || 'pos'}`,
      items: cart.map((c) => ({
        productId: c.product.id,
        title: c.product.title,
        price: c.product.price,
        quantity: c.quantity,
        image: c.product.images[0],
        sellerId: userStore?.ownerId || currentUser?.id || 'seller',
        storeUsername: userStore?.username || currentUser?.storeUsername || 'store',
        sellerName: userStore?.name || currentUser?.name || 'Retail Register',
      })),
      total,
      paymentMethod,
      customerName,
    });

    setCompletedOrder(order);
    setCart([]);
    addToast('success', 'Sale Complete!', `Recorded ₦${total.toLocaleString()} via ${paymentMethod.toUpperCase()}`);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-slate-100 flex flex-col">
      {/* Top POS Header */}
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
              <span className="font-display font-bold text-white text-sm">Shopify Point of Sale (POS)</span>
              <span className="rounded-md bg-[#00C896]/20 text-[#00C896] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
                Retail Register
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Terminal: {userStore?.name || 'Retail Register'} · Staff: {currentUser?.name || 'Store Owner'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 bg-white/5 rounded-xl px-3 py-1.5 border border-white/10 text-xs text-slate-300">
            <Barcode className="w-4 h-4 text-[#5B35F5]" />
            <span>Barcode Scanner Active</span>
          </div>
        </div>
      </div>

      {/* Main Register Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side: Product Grid */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {/* Search & Categories */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by title, SKU, or barcode..."
                className="w-full rounded-xl bg-[#14141B] border border-white/10 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#5B35F5]"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer capitalize ${
                    selectedCategory === cat
                      ? 'bg-[#5B35F5] text-white shadow-md shadow-[#5B35F5]/30'
                      : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredProducts.map((p) => (
              <button
                key={p.id}
                onClick={() => addToCart(p)}
                className="text-left rounded-2xl bg-[#14141B] border border-white/10 p-3 hover:border-[#5B35F5]/60 hover:scale-[1.02] active:scale-95 transition-all shadow-lg flex flex-col justify-between group cursor-pointer"
              >
                <div className="aspect-square w-full rounded-xl overflow-hidden bg-black/40 mb-2 relative">
                  <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                  <span className="absolute bottom-1.5 right-1.5 bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] text-slate-300 font-mono-nums">
                    Qty: {p.stock}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white line-clamp-2 leading-snug">{p.title}</h4>
                  {p.sku && <p className="text-[10px] font-mono text-slate-500 mt-0.5">SKU: {p.sku}</p>}
                  <p className="text-xs font-bold text-[#00C896] font-mono-nums mt-1">{formatCurrency(p.price)}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Register Cart & Tender */}
        <div className="w-full lg:w-96 shrink-0 bg-[#12121A] border-t lg:border-t-0 lg:border-l border-white/10 p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#5B35F5]" />
                <span>Register Sale</span>
              </h3>
              <span className="text-xs font-semibold text-slate-400 font-mono-nums">
                {cart.reduce((sum, item) => sum + item.quantity, 0)} Items
              </span>
            </div>

            {/* Customer Name */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Customer / Guest Account</label>
              <div className="relative">
                <UserCheck className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Customer Name or Phone"
                  className="w-full rounded-xl bg-white/5 border border-white/10 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#5B35F5]"
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
              {cart.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  Tap or scan products from the left catalog to add to this register.
                </div>
              ) : (
                cart.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={product.images[0]} alt={product.title} className="w-9 h-9 rounded-lg object-cover shrink-0" />
                      <div className="truncate">
                        <p className="font-medium text-white truncate">{product.title}</p>
                        <p className="text-[11px] text-slate-400 font-mono-nums">{formatCurrency(product.price)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center border border-white/10 rounded-lg overflow-hidden bg-white/5">
                        <button
                          onClick={() => updateQuantity(product.id, -1)}
                          className="p-1 text-slate-400 hover:text-white transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono-nums font-bold text-white">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, 1)}
                          className="p-1 text-slate-400 hover:text-white transition"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Discounts Selection */}
            {cart.length > 0 && (
              <div className="pt-2">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                  <span>Register Discount</span>
                  <span>{discountPercent}%</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[0, 5, 10, 15].map((pct) => (
                    <button
                      key={pct}
                      onClick={() => setDiscountPercent(pct)}
                      className={`py-1 rounded-lg text-xs font-semibold border transition ${
                        discountPercent === pct
                          ? 'bg-[#5B35F5] border-[#5B35F5] text-white'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {pct === 0 ? 'None' : `${pct}%`}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Payment Tender & Checkout */}
          <div className="pt-4 border-t border-white/10 space-y-4">
            <div className="space-y-1.5 text-xs text-slate-400 font-mono-nums">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white">{formatCurrency(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-amber-400">
                  <span>Discount ({discountPercent}%)</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/10">
                <span>Total Due</span>
                <span className="text-[#00C896]">{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'cash', label: 'Cash', icon: Banknote },
                { id: 'card', label: 'POS Card', icon: CreditCard },
                { id: 'transfer', label: 'Transfer', icon: Building2 },
              ].map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition text-xs font-semibold cursor-pointer ${
                      paymentMethod === m.id
                        ? 'border-[#00C896] bg-[#00C896]/10 text-white'
                        : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className="w-full py-3.5 rounded-xl bg-[#00C896] hover:bg-[#00b084] text-slate-950 font-extrabold text-xs shadow-lg shadow-[#00C896]/30 transition disabled:opacity-40 cursor-pointer active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Charge & Finalize Receipt ({formatCurrency(total)})</span>
            </button>
          </div>
        </div>
      </div>

      {/* POS Receipt Modal */}
      {completedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-sm rounded-3xl bg-white text-slate-900 p-6 shadow-2xl space-y-4">
            <button
              onClick={() => setCompletedOrder(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-500 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center pb-3 border-b border-dashed border-slate-300">
              <h2 className="font-display font-extrabold text-xl tracking-tight text-slate-950 uppercase">
                {userStore?.name || 'Retail Register'}
              </h2>
              <p className="text-[11px] text-slate-500">Official Retail Register Receipt</p>
              <p className="text-[10px] text-slate-400 font-mono mt-1">Receipt #: {completedOrder.orderNumber}</p>
              <p className="text-[10px] text-slate-400">{new Date().toLocaleString()}</p>
            </div>

            <div className="space-y-2 text-xs divide-y divide-slate-100 max-h-48 overflow-y-auto">
              {completedOrder.items.map((it: any, i: number) => (
                <div key={i} className="flex justify-between pt-1.5 first:pt-0">
                  <span>
                    {it.quantity}x {it.title}
                  </span>
                  <span className="font-mono font-semibold">₦{(it.price * it.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-dashed border-slate-300 pt-3 space-y-1 text-xs">
              <div className="flex justify-between font-bold text-sm text-slate-950">
                <span>Total Paid</span>
                <span className="font-mono">₦{completedOrder.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-600">
                <span>Tender Method</span>
                <span className="capitalize">{completedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-600">
                <span>Customer</span>
                <span>{completedOrder.buyerName}</span>
              </div>
            </div>

            <div className="text-center pt-2">
              <div className="inline-block p-1 bg-slate-100 rounded border border-slate-200">
                <Barcode className="w-32 h-6 text-slate-800 mx-auto" />
              </div>
              <p className="text-[9px] text-slate-400 mt-1">Thank you for shopping local!</p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow hover:bg-black transition cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Receipt</span>
              </button>
              <button
                onClick={() => setCompletedOrder(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
