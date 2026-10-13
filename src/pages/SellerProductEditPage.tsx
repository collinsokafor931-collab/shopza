import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { CATEGORIES_LIST } from '../constants/marketplace';
import { Product, ProductVariantOption, ProductVariant } from '../types';
import {
  Plus,
  X,
  Upload,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Layers,
  Barcode,
  Tag,
  DollarSign,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';

interface SellerProductEditPageProps {
  productId?: string;
  navigate: (path: string) => void;
}

export const SellerProductEditPage: React.FC<SellerProductEditPageProps> = ({ productId, navigate }) => {
  const { products, currentUser, stores, createProduct, updateProduct, formatCurrency, addToast } = useMarketplace();

  const userStore =
    stores.find(
      (s) =>
        (currentUser?.id && s.ownerId === currentUser.id) ||
        (currentUser?.storeUsername && s.username === currentUser.storeUsername)
    ) || {
      id: `store-${currentUser?.id || 'default'}`,
      name: currentUser?.name ? `${currentUser.name}'s Store` : 'My Store',
      username: currentUser?.storeUsername || `store-${currentUser?.id?.slice(-4) || 'merchant'}`,
      ownerId: currentUser?.id || 'default',
      ownerName: currentUser?.name || 'Merchant',
      logo: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=200&auto=format&fit=crop&q=80',
      banner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80',
      description: 'Official digital storefront',
      categories: ['Fashion & Apparel'],
      location: currentUser?.location || 'Lagos, Nigeria',
      state: 'Lagos',
      rating: 5.0,
      reviewCount: 0,
      followerCount: 0,
      isVerified: false,
      joinedDate: 'Just now',
      responseTime: '< 15 mins',
      operatingHours: 'Mon - Sat: 8:00 AM - 7:00 PM',
      policies: {
        shipping: 'Dispatches within 24 hours',
        returns: '7-day inspection window',
        cancellation: 'Cancel anytime prior to dispatch',
      },
      productCount: 0,
      serviceCount: 0,
    };

  const existingProduct = productId ? products.find((p) => p.id === productId) : null;

  const [step, setStep] = useState(1);

  // Form fields
  const [title, setTitle] = useState(existingProduct?.title || '');
  const [category, setCategory] = useState(existingProduct?.category || 'Fashion & Apparel');
  const [condition, setCondition] = useState<any>(existingProduct?.condition || 'New');
  const [description, setDescription] = useState(existingProduct?.description || '');

  // Pricing & Inventory
  const [price, setPrice] = useState<number | ''>(existingProduct?.price || 25000);
  const [compareAtPrice, setCompareAtPrice] = useState<number | ''>(existingProduct?.compareAtPrice || existingProduct?.originalPrice || '');
  const [stock, setStock] = useState<number>(existingProduct?.stock || 10);
  const [sku, setSku] = useState(existingProduct?.sku || '');
  const [barcode, setBarcode] = useState(existingProduct?.barcode || '');

  // Shopify Variants Matrix
  const [hasVariants, setHasVariants] = useState<boolean>(
    Boolean(existingProduct?.variants && existingProduct.variants.length > 0)
  );

  const [options, setOptions] = useState<ProductVariantOption[]>(
    existingProduct?.options || [
      { name: 'Size', values: ['S', 'M', 'L'] },
      { name: 'Color', values: ['Black', 'Navy'] },
    ]
  );

  const [newOptionName, setNewOptionName] = useState('');
  const [newOptionValue, setNewOptionValue] = useState('');
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>(0);

  // Generate or read variants
  const [variants, setVariants] = useState<ProductVariant[]>(() => {
    if (existingProduct?.variants && existingProduct.variants.length > 0) {
      return existingProduct.variants;
    }
    return [];
  });

  // Helper to re-generate variant matrix from options
  const generateVariantMatrix = (opts: ProductVariantOption[]) => {
    if (opts.length === 0 || opts.every((o) => o.values.length === 0)) {
      setVariants([]);
      return;
    }

    const cartesian = (...a: string[][]) =>
      a.reduce((acc, curr) => acc.flatMap((d) => curr.map((e) => [...d, e])), [[]] as string[][]);

    const validOpts = opts.filter((o) => o.values.length > 0);
    const combinations = cartesian(...validOpts.map((o) => o.values));

    const generated: ProductVariant[] = combinations.map((combo, idx) => {
      const optionValues: Record<string, string> = {};
      validOpts.forEach((opt, oIdx) => {
        optionValues[opt.name] = combo[oIdx];
      });

      const titleStr = validOpts.map((opt, oIdx) => `${opt.name}: ${combo[oIdx]}`).join(' / ');
      const cleanSku = `${sku || 'SKU'}-${combo.join('-').toUpperCase()}-${idx + 1}`;

      return {
        id: `var-${Date.now()}-${idx}`,
        title: titleStr,
        price: Number(price) || 25000,
        compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
        sku: cleanSku,
        stock: Math.max(1, Math.floor(Number(stock) / Math.max(1, combinations.length))),
        optionValues,
      };
    });

    setVariants(generated);
  };

  const handleAddOption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOptionName.trim()) return;
    const updated = [...options, { name: newOptionName.trim(), values: [] }];
    setOptions(updated);
    setSelectedOptionIndex(updated.length - 1);
    setNewOptionName('');
  };

  const handleAddValueToOption = (optIdx: number, val: string) => {
    if (!val.trim()) return;
    const clean = val.trim();
    const updated = options.map((opt, idx) => {
      if (idx === optIdx && !opt.values.includes(clean)) {
        return { ...opt, values: [...opt.values, clean] };
      }
      return opt;
    });
    setOptions(updated);
    generateVariantMatrix(updated);
    setNewOptionValue('');
  };

  const handleRemoveOptionValue = (optIdx: number, valIdx: number) => {
    const updated = options.map((opt, idx) => {
      if (idx === optIdx) {
        return { ...opt, values: opt.values.filter((_, i) => i !== valIdx) };
      }
      return opt;
    });
    setOptions(updated);
    generateVariantMatrix(updated);
  };

  const handleRemoveOption = (optIdx: number) => {
    const updated = options.filter((_, idx) => idx !== optIdx);
    setOptions(updated);
    generateVariantMatrix(updated);
    if (selectedOptionIndex >= updated.length) {
      setSelectedOptionIndex(Math.max(0, updated.length - 1));
    }
  };

  // Images
  const [images, setImages] = useState<string[]>(
    existingProduct?.images || [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    ]
  );
  const [newImageUrl, setNewImageUrl] = useState('');

  const [returnPolicy, setReturnPolicy] = useState(
    existingProduct?.returnPolicy || '7-day standard return window for undamaged items.'
  );

  const handleAddImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const categoryObj = CATEGORIES_LIST.find((c) => c.name === category);
    const categorySlug = categoryObj ? categoryObj.slug : 'all';

    const productPayload = {
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description,
      price: Number(price) || 0,
      originalPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      category,
      categorySlug,
      condition,
      images,
      sellerId: currentUser?.id || userStore.ownerId,
      sellerName: userStore.name,
      storeUsername: userStore.username,
      sellerAvatar: userStore.logo,
      sellerRating: 5.0,
      sellerReviewCount: 0,
      sellerVerified: true,
      location: userStore.location || 'Lagos, Nigeria',
      state: 'Lagos',
      stock: Number(stock) || 0,
      sku: sku || `SKU-${Date.now().toString().slice(-6)}`,
      barcode,
      options: hasVariants ? options : undefined,
      variants: hasVariants ? variants : undefined,
      returnPolicy,
      deliveryOptions: ['Express Delivery', 'Standard Nationwide', 'Store Pickup'],
      status: 'published' as const,
    };

    if (existingProduct) {
      updateProduct(existingProduct.id, productPayload);
    } else {
      createProduct(productPayload);
    }

    addToast('success', 'Product Published', `"${title}" has been saved to your Shopify catalog.`);
    navigate('/seller/products');
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-8">
        <div>
          <button
            onClick={() => navigate('/seller/products')}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Products</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#00C896]">
              Shopify Variant Matrix
            </span>
            <span className="text-xs text-slate-500">· Step {step} of 3</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            {existingProduct ? `Edit "${existingProduct.title}"` : 'Add New Product'}
          </h1>
        </div>

        {/* Step indicator pills */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <button
              key={s}
              onClick={() => setStep(s)}
              className={`w-8 h-8 rounded-full text-xs font-bold transition flex items-center justify-center cursor-pointer ${
                step === s
                  ? 'bg-[#5B35F5] text-white shadow-md shadow-[#5B35F5]/30 ring-2 ring-[#7C4DFF]/40'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-3xl bg-[#14141B] border border-white/10 p-6 sm:p-8 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* STEP 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                1. Product Information & Category
              </h2>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Product Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Bespoke Vintage Cotton Oversized Jacket"
                  required
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#5B35F5]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl bg-[#1a1a24] border border-white/10 px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#5B35F5]"
                  >
                    {CATEGORIES_LIST.map((c) => (
                      <option key={c.slug} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Condition *</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full rounded-xl bg-[#1a1a24] border border-white/10 px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#5B35F5]"
                  >
                    <option value="New">Brand New (Sealed/Tags)</option>
                    <option value="Used - Like New">Used - Like New</option>
                    <option value="Used - Good">Used - Good</option>
                    <option value="Refurbished">Refurbished & Tested</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Product Description *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Detailed description, key features, material composition, sizing instructions..."
                  required
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#5B35F5]"
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 rounded-xl bg-[#5B35F5] hover:bg-[#4d2ad4] text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#5B35F5]/30 cursor-pointer"
                >
                  <span>Continue to Pricing & Media</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Pricing, Barcode & Media */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                2. Pricing, SKU & Product Photography
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Selling Price (₦) *</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="25000"
                    required
                    min={0}
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#5B35F5] font-mono-nums"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Compare-at Price (₦) <span className="text-slate-500 font-normal">(Crossed-out sale price)</span>
                  </label>
                  <input
                    type="number"
                    value={compareAtPrice}
                    onChange={(e) => setCompareAtPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="35000"
                    min={0}
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#5B35F5] font-mono-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Base Stock Quantity *</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    min={0}
                    required
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#5B35F5] font-mono-nums"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">SKU (Stock Keeping Unit)</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="e.g. UT-JKT-001"
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#5B35F5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Barcode (UPC / EAN / POS)</label>
                  <input
                    type="text"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    placeholder="e.g. 798214500912"
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#5B35F5]"
                  />
                </div>
              </div>

              {/* Product Media Gallery */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Product Images ({images.length})</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-black/40 group">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 text-rose-400 hover:text-white transition opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Paste image URL (https://...)"
                    className="flex-1 rounded-xl bg-white/5 border border-white/10 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#5B35F5]"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition"
                  >
                    Add Image
                  </button>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-slate-300 hover:text-white text-xs font-semibold"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 rounded-xl bg-[#5B35F5] hover:bg-[#4d2ad4] text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#5B35F5]/30 cursor-pointer"
                >
                  <span>Continue to Variants Matrix</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Shopify Variant Matrix */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#00C896]" />
                    <span>Shopify Multi-Option Variant Matrix</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Configure multi-attribute options (e.g. Size, Color, Storage) to generate SKU combinations.
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasVariants}
                    onChange={(e) => {
                      setHasVariants(e.target.checked);
                      if (e.target.checked && variants.length === 0) {
                        generateVariantMatrix(options);
                      }
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#00C896]" />
                </label>
              </div>

              {hasVariants ? (
                <div className="space-y-6">
                  {/* Option Categories Builder */}
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                        Configured Options ({options.length})
                      </span>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newOptionName}
                          onChange={(e) => setNewOptionName(e.target.value)}
                          placeholder="Option Name (e.g. Size)"
                          className="rounded-lg bg-white/5 border border-white/10 px-2.5 py-1 text-xs text-white placeholder-slate-500"
                        />
                        <button
                          type="button"
                          onClick={handleAddOption}
                          className="px-3 py-1 rounded-lg bg-[#5B35F5] hover:bg-[#4d2ad4] text-white font-bold text-xs"
                        >
                          Add Option
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {options.map((opt, optIdx) => (
                        <div key={optIdx} className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white">{opt.name}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveOption(optIdx)}
                              className="text-[11px] text-rose-400 hover:underline"
                            >
                              Remove Option
                            </button>
                          </div>

                          <div className="flex flex-wrap items-center gap-1.5">
                            {opt.values.map((val, vIdx) => (
                              <span
                                key={vIdx}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#5B35F5]/20 text-[#7C4DFF] border border-[#5B35F5]/30 text-xs font-semibold"
                              >
                                <span>{val}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveOptionValue(optIdx, vIdx)}
                                  className="text-slate-400 hover:text-white"
                                >
                                  ×
                                </button>
                              </span>
                            ))}

                            <div className="inline-flex items-center gap-1">
                              <input
                                type="text"
                                placeholder={`Add ${opt.name} value...`}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddValueToOption(optIdx, (e.target as HTMLInputElement).value);
                                    (e.target as HTMLInputElement).value = '';
                                  }
                                }}
                                className="rounded-lg bg-black/40 border border-white/10 px-2 py-0.5 text-xs text-white placeholder-slate-500 w-32"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Generated Variant Matrix Table */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                        Generated Combinations ({variants.length} Variants)
                      </span>
                      <button
                        type="button"
                        onClick={() => generateVariantMatrix(options)}
                        className="text-[11px] text-[#00C896] hover:underline"
                      >
                        Re-sync Matrix
                      </button>
                    </div>

                    <div className="rounded-2xl border border-white/10 overflow-x-auto bg-[#101017]">
                      <table className="w-full text-left text-xs">
                        <thead className="border-b border-white/10 bg-white/5 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                          <tr>
                            <th className="py-2.5 px-3">Variant</th>
                            <th className="py-2.5 px-3">Price (₦)</th>
                            <th className="py-2.5 px-3">SKU</th>
                            <th className="py-2.5 px-3">Inventory</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-slate-200">
                          {variants.map((v, idx) => (
                            <tr key={v.id} className="hover:bg-white/[0.02]">
                              <td className="py-2.5 px-3 font-semibold text-white">{v.title}</td>
                              <td className="py-2.5 px-3 font-mono">
                                <input
                                  type="number"
                                  value={v.price}
                                  onChange={(e) => {
                                    const val = Number(e.target.value);
                                    setVariants((prev) =>
                                      prev.map((item, i) => (i === idx ? { ...item, price: val } : item))
                                    );
                                  }}
                                  className="w-24 rounded bg-white/5 border border-white/10 px-2 py-1 text-xs text-white font-mono"
                                />
                              </td>
                              <td className="py-2.5 px-3 font-mono text-slate-400">
                                <input
                                  type="text"
                                  value={v.sku}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setVariants((prev) =>
                                      prev.map((item, i) => (i === idx ? { ...item, sku: val } : item))
                                    );
                                  }}
                                  className="w-32 rounded bg-white/5 border border-white/10 px-2 py-1 text-xs text-white font-mono"
                                />
                              </td>
                              <td className="py-2.5 px-3">
                                <input
                                  type="number"
                                  value={v.stock}
                                  onChange={(e) => {
                                    const val = Number(e.target.value);
                                    setVariants((prev) =>
                                      prev.map((item, i) => (i === idx ? { ...item, stock: val } : item))
                                    );
                                  }}
                                  className="w-16 rounded bg-white/5 border border-white/10 px-2 py-1 text-xs text-white font-mono"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-slate-500 text-xs border border-dashed border-white/10 rounded-2xl">
                  This product has a single SKU and standard inventory tracking. Toggle variants above if you offer multiple sizes, colors, or specifications.
                </div>
              )}

              <div className="flex justify-between pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-slate-300 hover:text-white text-xs font-semibold"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 rounded-xl bg-[#00C896] hover:bg-[#00b084] text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-[#00C896]/30 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Publish to Shopify Storefront</span>
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
