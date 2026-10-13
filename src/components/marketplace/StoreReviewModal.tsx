import React, { useState } from 'react';
import {
  X,
  Star,
  ShieldCheck,
  CheckCircle,
  ThumbsUp,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { Store } from '../../types';
import { useMarketplace } from '../../context/MarketplaceContext';

interface StoreReviewModalProps {
  store: Store;
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted?: () => void;
}

export const StoreReviewModal: React.FC<StoreReviewModalProps> = ({
  store,
  isOpen,
  onClose,
  onReviewSubmitted,
}) => {
  const { currentUser, addReview, addToast } = useMarketplace();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'Authentic Quality',
    'Fast Dispatch',
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const availableTags = [
    'Authentic Quality',
    'Fast Dispatch',
    'Responsive Seller',
    'Accurate Description',
    'Pristine Packaging',
    'Great Communication',
    'Highly Recommended',
  ];

  const ratingDescriptions: { [key: number]: string } = {
    5: 'Exceptional — 5/5 Stars: High quality & trustworthy service',
    4: 'Very Good — 4/5 Stars: Satisfied with purchase & delivery',
    3: 'Average — 3/5 Stars: Acceptable but room for improvement',
    2: 'Below Average — 2/5 Stars: Disappointed with aspects of order',
    1: 'Poor — 1/5 Stars: Unsatisfactory experience',
  };

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      addToast('warning', 'Review Required', 'Please share details of your experience.');
      return;
    }

    setIsSubmitting(true);

    const userName = currentUser?.name || 'Verified Customer';
    const userAvatar =
      currentUser?.avatar ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';

    addReview({
      userId: currentUser?.id || 'user-buyer-1',
      userName,
      userAvatar,
      targetType: 'store',
      targetId: store.username,
      rating,
      title: title.trim() || undefined,
      comment: comment.trim(),
      verifiedPurchase: true,
    });

    setIsSubmitting(false);
    onReviewSubmitted?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-lg bg-[#14141B] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-[#181824] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={store.logo}
              alt={store.name}
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-[#5B35F5]/30"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-white">Review {store.name}</h3>
                {store.isVerified && (
                  <ShieldCheck className="w-4 h-4 text-[#00C896] shrink-0" />
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                Share your honest feedback with the SHOPZA community
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Star Selection */}
          <div className="text-center py-2 bg-[#101017] rounded-2xl border border-white/5 p-4">
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Overall Store Rating
            </label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = (hoverRating || rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 text-slate-600 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        active
                          ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                          : 'fill-transparent text-slate-600'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-amber-300/90 font-medium mt-2">
              {ratingDescriptions[hoverRating || rating]}
            </p>
          </div>

          {/* Review Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Review Title (Optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Prompt delivery & premium authentic items"
              className="w-full px-3.5 py-2.5 bg-[#191924] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#5B35F5]"
            />
          </div>

          {/* Feedback details */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Your Review & Comments <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe product quality, communication speed, dispatch reliability, packaging, and truthfulness..."
              className="w-full px-3.5 py-2.5 bg-[#191924] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#5B35F5] leading-relaxed resize-none"
              required
            />
          </div>

          {/* Experience Highlights / Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Key Highlights (Click to select)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {availableTags.map((tag) => {
                const selected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleToggleTag(tag)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                      selected
                        ? 'bg-[#5B35F5] text-white shadow-md shadow-[#5B35F5]/25 border border-[#5B35F5]'
                        : 'bg-[#181822] text-slate-400 hover:text-white border border-white/5 hover:border-white/15'
                    }`}
                  >
                    {selected ? '✓ ' : '+ '}
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Truthful guarantee notice */}
          <div className="p-3 bg-[#00C896]/10 border border-[#00C896]/20 rounded-xl flex items-start gap-2.5 text-xs text-[#00C896]">
            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Your review is verified and published directly to @{store.username}&apos;s storefront to maintain authentic, honest commerce.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !comment.trim()}
              className="px-6 py-2.5 rounded-xl bg-[#5B35F5] hover:bg-[#7C4DFF] text-white text-xs font-bold transition shadow-lg shadow-[#5B35F5]/30 disabled:opacity-40 cursor-pointer"
            >
              Publish Store Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
