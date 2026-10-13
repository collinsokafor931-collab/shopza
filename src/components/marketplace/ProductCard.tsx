import React, { useState } from 'react';
import { Heart, ShoppingBag, Check, ShieldCheck } from 'lucide-react';
import { Product } from '../../types';
import { useMarketplace } from '../../context/MarketplaceContext';
import { StarRating } from './StarRating';

export const ProductCard: React.FC<{ product: Product; navigate?: (path: string) => void }> = ({ product }) => {
  const { navigate: contextNavigate, addToCart, toggleFavorite, isFavorite } = useMarketplace();
  const navigate = contextNavigate;
  const [imageError, setImageError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const favorited = isFavorite(product.id);

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking interactive buttons
    if ((e.target as HTMLElement).closest('button')) return;
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col rounded-2xl bg-[#14141B] border border-white/[0.08] hover:border-white/20 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 cursor-pointer overflow-hidden"
    >
      {/* Product Image Slot */}
      <div className="relative aspect-4/3 w-full bg-[#1A1A24] overflow-hidden">
        {!imageError ? (
          <img
            src={product.images[0]}
            alt={product.title}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#1C1C26] to-[#12121A] text-slate-400">
            <ShoppingBag className="w-8 h-8 text-[#5B35F5]/60 mb-2" />
            <span className="text-xs text-center font-medium line-clamp-1">{product.title}</span>
          </div>
        )}

        {/* Floating Quick Action Buttons */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
          <button
            onClick={handleToggleFavorite}
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
            className={`p-2 rounded-xl backdrop-blur-md transition-all duration-150 ${
              favorited
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-black/50 hover:bg-black/80 text-white hover:scale-110'
            }`}
          >
            <Heart className={`w-4 h-4 ${favorited ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Promoted / Condition Indicator - Clean Subtle Text, No Cluttered Pill */}
        <div className="absolute bottom-2 left-2.5 z-10 flex items-center gap-1.5 text-[11px] font-medium text-white/90 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md">
          {product.isPromoted && (
            <>
              <span className="text-[#00C896] font-semibold">Promoted</span>
              <span aria-hidden="true" className="text-white/40">·</span>
            </>
          )}
          <span>{product.condition}</span>
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="flex flex-col flex-1 p-4">
        {/* Unboxed Metadata Line with typographic separators */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
          <span className="font-medium text-slate-300">{product.category}</span>
          <span aria-hidden="true">·</span>
          <span className="truncate max-w-[130px]">{product.location}</span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-white group-hover:text-[#7C4DFF] transition-colors line-clamp-2 leading-snug mb-2">
          {product.title}
        </h3>

        {/* Seller Info */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/store/${product.storeUsername}`);
            }}
            className="flex items-center gap-1.5 truncate text-left hover:text-[#00C896] transition-colors cursor-pointer group/seller"
            title={`Visit store @${product.storeUsername}`}
          >
            <span className="truncate font-medium text-slate-300 group-hover/seller:text-[#00C896] transition-colors">
              {product.sellerName}
            </span>
            {product.sellerVerified && (
              <span title="Verified Seller">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00C896] shrink-0" />
              </span>
            )}
          </button>
        </div>

        {/* Star Rating */}
        <div className="mb-3">
          <StarRating rating={product.rating} count={product.reviewCount} size="sm" />
        </div>

        {/* Price & Quick Add Button */}
        <div className="mt-auto pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-white font-mono-nums">
                ₦{product.price.toLocaleString()}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-slate-500 line-through font-mono-nums">
                  ₦{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            {product.stock <= 3 && product.stock > 0 && (
              <span className="text-[10px] text-amber-400 font-medium">
                Only {product.stock} left in stock
              </span>
            )}
            {product.stock === 0 && (
              <span className="text-[10px] text-rose-400 font-medium">Sold Out</span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`flex items-center justify-center p-2 rounded-xl transition-all duration-150 ${
              justAdded
                ? 'bg-[#00C896] text-slate-950 scale-105'
                : 'bg-[#5B35F5] hover:bg-[#7C4DFF] text-white active:scale-95'
            } disabled:opacity-40 disabled:cursor-not-allowed`}
            title={justAdded ? 'Added to Cart' : 'Add to Cart'}
          >
            {justAdded ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
