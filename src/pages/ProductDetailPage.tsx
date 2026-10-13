import React, { useState } from 'react';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  MessageSquare,
  Heart,
  Share2,
  AlertTriangle,
  ShoppingBag,
  Check,
  ChevronRight,
  ExternalLink,
  Lock,
  MessageCircle,
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { StarRating } from '../components/marketplace/StarRating';
import { ProductCard } from '../components/marketplace/ProductCard';

export const ProductDetailPage: React.FC<{ productId: string }> = ({ productId }) => {
  const {
    getProductById,
    getProductBySlug,
    products,
    addToCart,
    toggleFavorite,
    isFavorite,
    startProductChat,
    reviews,
    addReview,
    currentUser,
    submitReport,
    addToast,
    navigate,
    formatCurrency,
  } = useMarketplace();

  // Find product either by id or slug
  const product = getProductById(productId) || getProductBySlug(productId);

  // Shopify Variants State
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    if (product?.options) {
      product.options.forEach((opt) => {
        if (opt.values.length > 0) {
          initial[opt.name] = opt.values[0];
        }
      });
    }
    return initial;
  });

  const activeVariant = product?.variants?.find((v) =>
    Object.entries(selectedOptions).every(([optName, optVal]) => v.optionValues[optName] === optVal)
  ) || product?.variants?.[0];

  const currentPrice = activeVariant ? activeVariant.price : (product ? product.price : 0);
  const currentComparePrice = activeVariant?.compareAtPrice || (product ? product.compareAtPrice || product.originalPrice : undefined);
  const currentStock = activeVariant ? activeVariant.stock : (product ? product.stock : 0);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState<
    'fraud' | 'counterfeit' | 'prohibited_item' | 'scam' | 'harassment' | 'misleading' | 'other'
  >('counterfeit');
  const [reportDetails, setReportDetails] = useState('');

  // Review form state
  const [newRating, setNewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Product Not Found</h2>
        <p className="text-sm text-slate-400 mb-6">The listing you are looking for may have been archived or sold out.</p>
        <button
          onClick={() => navigate('/marketplace')}
          className="px-6 py-2.5 rounded-xl bg-[#5B35F5] text-white text-xs font-semibold"
        >
          Return to Marketplace
        </button>
      </div>
    );
  }

  const favorited = isFavorite(product.id);
  const productReviews = reviews.filter((r) => r.targetType === 'product' && r.targetId === product.id);
  const relatedProducts = products.filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: `Check out ${product.title} on SHOPZA: ₦${product.price.toLocaleString()}`,
          url: window.location.href,
        });
      } catch {
        // Share dismissed
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast('success', 'Link Copied', 'Product link copied to clipboard!');
    }
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      addToast('warning', 'Sign In Required', 'Please sign in to file a report.');
      navigate('/login');
      return;
    }
    submitReport({
      reporterId: currentUser.id,
      reporterName: currentUser.name,
      targetType: 'product',
      targetId: product.id,
      targetTitle: product.title,
      reason: reportReason,
      details: reportDetails,
    });
    setReportModalOpen(false);
    setReportDetails('');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      addToast('warning', 'Sign In Required', 'Please sign in to write a review.');
      navigate('/login');
      return;
    }
    if (!newReviewComment.trim()) return;

    addReview({
      targetType: 'product',
      targetId: product.id,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      rating: newRating,
      title: newReviewTitle.trim() || undefined,
      comment: newReviewComment.trim(),
      verifiedPurchase: true,
    });

    setNewReviewTitle('');
    setNewReviewComment('');
    setShowReviewForm(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full min-h-screen">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-6 overflow-x-auto whitespace-nowrap">
        <button onClick={() => navigate('/')} className="hover:text-white">Home</button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <button onClick={() => navigate('/marketplace')} className="hover:text-white">Marketplace</button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <button onClick={() => navigate(`/category/${product.categorySlug}`)} className="hover:text-white">
          {product.category}
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-white font-medium truncate max-w-[200px]">{product.title}</span>
      </nav>

      {/* PDP Main Layout: Sticky Gallery (Left) + Contiguous Purchase Module (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Gallery Column */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Active Image Viewport */}
          <div className="relative aspect-4/3 w-full rounded-2xl bg-[#14141B] border border-white/[0.08] overflow-hidden group">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {/* Promoted / Condition tag */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-black/60 backdrop-blur-md text-white border border-white/10">
                {product.condition}
              </span>
              {product.isPromoted && (
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#00C896]/90 text-slate-950 shadow-md">
                  Promoted
                </span>
              )}
            </div>
          </div>

          {/* Thumbnail list */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden bg-[#14141B] border-2 transition-all shrink-0 ${
                    selectedImageIndex === idx ? 'border-[#5B35F5] ring-2 ring-[#5B35F5]/30' : 'border-white/10 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.title} thumb ${idx}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Description & Specifications (Below Gallery on Desktop) */}
          <div className="pt-8 border-t border-white/[0.08] space-y-6">
            <div>
              <h3 className="text-base font-semibold text-white mb-3">Product Description</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Specifications Key-Value */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div>
                <h3 className="text-base font-semibold text-white mb-3">Technical Specifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                      <span className="text-slate-400 font-medium">{key}</span>
                      <span className="text-white font-semibold text-right">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Contiguous Purchase Module */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
          <div className="p-6 rounded-2xl bg-[#14141B] border border-white/[0.08] shadow-xl space-y-5">
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>{product.category}</span>
                <span className="font-mono-nums">SKU: {product.sku || product.id}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                {product.title}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <StarRating rating={product.rating} count={product.reviewCount} size="sm" />
                <span className="text-slate-600">·</span>
                <span className="text-xs text-slate-400">{product.location}</span>
              </div>
            </div>

            {/* Price section */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-baseline justify-between">
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Current Price</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono-nums">
                    {formatCurrency(currentPrice)}
                  </span>
                  {currentComparePrice && currentComparePrice > currentPrice && (
                    <span className="text-sm text-slate-500 line-through font-mono-nums">
                      {formatCurrency(currentComparePrice)}
                    </span>
                  )}
                </div>
                {product.sku && (
                  <p className="text-[10px] font-mono text-slate-500 mt-1">
                    SKU: {activeVariant?.sku || product.sku}
                  </p>
                )}
              </div>

              {currentStock > 0 ? (
                <span className="text-xs font-semibold text-[#00C896] bg-[#00C896]/10 px-2.5 py-1 rounded-md">
                  In Stock ({currentStock})
                </span>
              ) : (
                <span className="text-xs font-semibold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-md">
                  Sold Out
                </span>
              )}
            </div>

            {/* Shopify Multi-Option Variant Selectors */}
            {product.options && product.options.length > 0 && (
              <div className="space-y-3 pt-1">
                {product.options.map((opt) => (
                  <div key={opt.name}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-semibold text-slate-300">{opt.name}:</span>
                      <span className="text-[#00C896] font-bold">{selectedOptions[opt.name] || opt.values[0]}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {opt.values.map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setSelectedOptions((prev) => ({ ...prev, [opt.name]: val }))}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                            selectedOptions[opt.name] === val
                              ? 'bg-[#5B35F5] border-[#5B35F5] text-white shadow-md shadow-[#5B35F5]/30 ring-2 ring-[#7C4DFF]/40'
                              : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-300">Quantity</span>
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white rounded-lg hover:bg-white/10 font-bold"
                >
                  -
                </button>
                <span className="font-semibold text-white font-mono-nums min-w-4 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                  disabled={quantity >= currentStock}
                  className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white rounded-lg hover:bg-white/10 font-bold disabled:opacity-40"
                >
                  +
                </button>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={currentStock === 0}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    justAdded
                      ? 'bg-[#00C896] text-slate-950 font-bold'
                      : 'bg-[#5B35F5] hover:bg-[#7C4DFF] text-white shadow-lg shadow-[#5B35F5]/30'
                  } disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  {justAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => toggleFavorite(product.id)}
                  aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
                  className={`p-3 rounded-xl border transition-colors ${
                    favorited
                      ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
                </button>

                <button
                  onClick={handleShare}
                  aria-label="Share listing"
                  className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleBuyNow}
                disabled={currentStock === 0}
                className="w-full py-3 px-4 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white transition-colors disabled:opacity-40 cursor-pointer"
              >
                Instant Checkout
              </button>

              {/* Shopify WhatsApp Direct Order Action */}
              <button
                type="button"
                onClick={() => {
                  const variantNote = activeVariant ? ` (${activeVariant.title})` : '';
                  const text = `Hello ${product.sellerName}, I would like to order "${product.title}"${variantNote} for ${formatCurrency(currentPrice)} on SHOPZA. Please confirm dispatch details!`;
                  window.open(`https://wa.me/2348012345678?text=${encodeURIComponent(text)}`, '_blank');
                }}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-[#00C896]/15 hover:bg-[#00C896]/25 border border-[#00C896]/30 text-[#00C896] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-[#00C896]" />
                <span>Order via WhatsApp Direct</span>
              </button>
            </div>

            {/* Escrow Guarantee Badge */}
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-slate-400 text-[11px]">
              <Lock className="w-4 h-4 text-[#00C896] shrink-0" />
              <span>SHOPZA Escrow Protected: Funds released only after delivery confirmation.</span>
            </div>

            {/* Seller Contact Card */}
            <div className="pt-4 border-t border-white/[0.06] space-y-3">
              <div className="flex items-center justify-between">
                <div
                  onClick={() => navigate(`/store/${product.storeUsername}`)}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <img
                    src={product.sellerAvatar}
                    alt={product.sellerName}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-white/10 group-hover:border-[#5B35F5] transition-colors"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-semibold text-white group-hover:text-[#7C4DFF] transition-colors">
                        {product.sellerName}
                      </p>
                      {product.sellerVerified && (
                        <span title="Verified Seller">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#00C896]" />
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">@{product.storeUsername}</p>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/store/${product.storeUsername}`)}
                  className="text-xs text-[#7C4DFF] hover:underline flex items-center gap-1 font-medium"
                >
                  <span>Visit Store</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              <button
                onClick={() => startProductChat(product)}
                className="w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold flex items-center justify-center gap-2 border border-white/10 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#7C4DFF]" />
                <span>Message Seller Directly</span>
              </button>
            </div>

            {/* Delivery & Policies Details */}
            <div className="pt-4 border-t border-white/[0.06] space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Delivery Options</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {Array.isArray(product.deliveryOptions) && product.deliveryOptions.length > 0
                      ? product.deliveryOptions.join(' · ')
                      : 'Express Courier & Nationwide Dispatch'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <RotateCcw className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Return & Warranty Policy</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {product.returnPolicy} {product.warranty && `(${product.warranty})`}
                  </p>
                </div>
              </div>
            </div>

            {/* Report Button */}
            <div className="pt-2 text-center">
              <button
                onClick={() => setReportModalOpen(true)}
                className="text-[11px] text-slate-500 hover:text-rose-400 flex items-center justify-center gap-1.5 mx-auto transition-colors"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Report suspicious listing</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Verified Reviews Section */}
      <section className="mt-16 pt-12 border-t border-white/[0.08]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Verified Buyer Reviews</h2>
            <p className="text-xs text-slate-400 mt-1 font-mono-nums">
              {productReviews.length} verified reviews for this listing
            </p>
          </div>

          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-colors"
          >
            {showReviewForm ? 'Cancel Review' : 'Write a Review'}
          </button>
        </div>

        {/* Add Review Form */}
        {showReviewForm && (
          <form onSubmit={handleReviewSubmit} className="mb-8 p-6 rounded-2xl bg-[#14141B] border border-white/10 space-y-4 max-w-xl">
            <h3 className="text-sm font-semibold text-white">Share Your Experience</h3>
            <div className="space-y-1">
              <label className="text-xs text-slate-400 block">Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setNewRating(s)}
                    className="text-amber-400 text-lg hover:scale-110 transition-transform"
                  >
                    {s <= newRating ? '★' : '☆'}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400 block">Headline (Optional)</label>
              <input
                type="text"
                value={newReviewTitle}
                onChange={(e) => setNewReviewTitle(e.target.value)}
                placeholder="e.g. Excellent build quality, fits perfectly!"
                className="w-full bg-[#1C1C26] border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#5B35F5]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400 block">Feedback Details</label>
              <textarea
                rows={3}
                required
                value={newReviewComment}
                onChange={(e) => setNewReviewComment(e.target.value)}
                placeholder="Describe product condition, delivery experience, packaging..."
                className="w-full bg-[#1C1C26] border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#5B35F5]"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#5B35F5] text-white text-xs font-semibold shadow-md"
            >
              Post Review
            </button>
          </form>
        )}

        {/* Reviews List */}
        <div className="space-y-4 max-w-3xl">
          {productReviews.length > 0 ? (
            productReviews.map((rev) => (
              <div key={rev.id} className="p-5 rounded-2xl bg-[#14141B] border border-white/[0.06] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={rev.userAvatar}
                      alt={rev.userName}
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="text-xs font-semibold text-white">{rev.userName}</span>
                    {rev.verifiedPurchase && (
                      <span className="text-[10px] text-[#00C896] bg-[#00C896]/10 px-2 py-0.5 rounded-md font-medium">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono-nums">
                    {new Date(rev.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>

                <StarRating rating={rev.rating} size="sm" showNumeric={false} />

                {rev.title && <h4 className="text-xs font-semibold text-white">{rev.title}</h4>}
                <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>

                {rev.sellerReply && (
                  <div className="mt-3 p-3 rounded-xl bg-white/[0.02] border-l-2 border-[#5B35F5] text-xs">
                    <p className="font-semibold text-white text-[11px] mb-1">Seller Response:</p>
                    <p className="text-slate-400 text-[11px]">{rev.sellerReply.comment}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-6 rounded-2xl bg-[#14141B] border border-white/[0.06] text-center text-xs text-slate-400">
              No reviews yet for this product. Be the first verified buyer to leave feedback!
            </div>
          )}
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 pt-12 border-t border-white/[0.08]">
          <h2 className="text-xl font-bold text-white tracking-tight mb-6">More from {product.category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#14141B] border border-white/10 p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-bold text-white">Report Listing</h3>
              <button onClick={() => setReportModalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div>
                <label className="font-semibold text-white block mb-1.5">Reason for report</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value as typeof reportReason)}
                  className="w-full bg-[#1C1C26] border border-white/10 rounded-xl p-2.5 text-white"
                >
                  <option value="counterfeit">Counterfeit / Fake product</option>
                  <option value="prohibited_item">Prohibited item under Nigerian law</option>
                  <option value="fraud">Advance fee fraud / scam</option>
                  <option value="misleading">Misleading information / inaccurate specs</option>
                  <option value="harassment">Abusive / Inappropriate listing</option>
                  <option value="other">Other policy violation</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-white block mb-1.5">Details (Optional)</label>
                <textarea
                  rows={3}
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Provide any additional context for the moderation team..."
                  className="w-full bg-[#1C1C26] border border-white/10 rounded-xl p-2.5 text-white placeholder-slate-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReportModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
