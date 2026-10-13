export type UserRole = 'buyer' | 'seller' | 'admin';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone?: string;
  avatar: string;
  role: UserRole;
  isSeller: boolean;
  storeUsername?: string;
  location: string;
  joinedDate: string;
  isVerified?: boolean;
}

export type ProductCondition = 'New' | 'Used - Like New' | 'Used - Good' | 'Refurbished';
export type ProductStatus = 'published' | 'draft' | 'pending_review' | 'paused' | 'sold_out';

export interface ProductVariantOption {
  name: string; // e.g. "Size", "Color", "Material"
  values: string[]; // e.g. ["S", "M", "L", "XL"]
}

export interface ProductVariant {
  id: string;
  title: string; // e.g. "Size: L / Color: Black"
  price: number;
  compareAtPrice?: number;
  sku: string;
  barcode?: string;
  stock: number;
  optionValues: Record<string, string>; // { "Size": "L", "Color": "Black" }
  image?: string;
}

export interface StoreThemeSettings {
  primaryColor: string;
  announcementBarText?: string;
  announcementBarEnabled?: boolean;
  bannerStyle?: 'full_bleed' | 'split' | 'minimal';
  fontFamily?: 'Syne' | 'Plus Jakarta Sans' | 'JetBrains Mono' | 'Playfair';
  gridDensity?: 'compact' | 'spacious' | 'editorial';
  showBadges?: boolean;
  whatsappChatEnabled?: boolean;
  whatsappNumber?: string;
  customNotice?: string;
}

export interface Discount {
  id: string;
  code: string;
  type: 'percentage' | 'fixed_amount' | 'free_shipping';
  value: number;
  minOrderValue?: number;
  usageLimit?: number;
  usedCount: number;
  active: boolean;
  storeId: string;
  createdAt: string;
  expiresAt?: string;
}

export interface Customer {
  id: string;
  storeId: string;
  name: string;
  email: string;
  phone?: string;
  totalOrders: number;
  totalSpend: number;
  tags: string[];
  notes?: string;
  createdAt: string;
  lastOrderDate?: string;
}

export type Currency = 'NGN' | 'USD' | 'GBP' | 'EUR';

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number; // in NGN (₦)
  originalPrice?: number;
  compareAtPrice?: number;
  category: string;
  categorySlug: string;
  subcategory?: string;
  condition: ProductCondition;
  images: string[];
  sellerId: string;
  sellerName: string;
  storeUsername: string;
  sellerAvatar: string;
  sellerRating: number;
  sellerReviewCount: number;
  sellerVerified: boolean;
  brand?: string;
  location: string; // e.g. "Ikeja, Lagos"
  state: string; // e.g. "Lagos"
  stock: number;
  sku?: string;
  barcode?: string;
  trackQuantity?: boolean;
  options?: ProductVariantOption[];
  variants?: ProductVariant[];
  tags?: string[];
  isPromoted?: boolean;
  isTrending?: boolean;
  isFeatured?: boolean;
  rating: number;
  reviewCount: number;
  deliveryOptions: string[]; // e.g. ["Express Delivery", "Standard Nationwide", "Store Pickup"]
  specifications?: Record<string, string>;
  returnPolicy: string;
  warranty?: string;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  startingPrice: number;
  pricingType: 'fixed' | 'hourly' | 'quote';
  images: string[];
  sellerId: string;
  sellerName: string;
  storeUsername: string;
  sellerAvatar: string;
  sellerRating: number;
  location: string;
  deliveryTime: string;
  portfolioSamples?: string[];
  status: 'published' | 'draft';
}

export interface Store {
  id: string;
  storeId?: string; // stable store identifier
  name: string;
  normalizedName?: string; // normalized for resilient case/punctuation searching
  username: string; // slug for /store/:username
  ownerId: string;
  ownerName: string;
  ownerEmail?: string;
  logo: string;
  logoUrl?: string;
  banner: string;
  bannerUrl?: string;
  description: string;
  categories: string[];
  category?: string;
  location: string;
  state: string;
  rating: number;
  reviewCount: number;
  followerCount: number;
  isVerified: boolean;
  verificationStatus?: 'unverified' | 'pending' | 'verified' | 'rejected';
  verificationBadgeType?: 'verified_seller' | 'official_brand' | 'top_rated';
  status?: 'pending' | 'open' | 'closed' | 'suspended';
  isPublic?: boolean;
  createdAt?: string;
  updatedAt?: string;
  joinedDate: string;
  responseTime: string; // e.g. "< 30 mins"
  operatingHours: string;
  policies: {
    shipping: string;
    returns: string;
    cancellation: string;
  };
  productCount: number;
  serviceCount: number;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  themeSettings?: StoreThemeSettings;
  badges?: string[];
  socialLinks?: Record<string, string>;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export type OrderStatus =
  | 'pending_payment'
  | 'payment_confirmed'
  | 'processing'
  | 'ready_for_pickup'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'refund_requested'
  | 'refunded';

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  sellerId: string;
  storeUsername: string;
  sellerName: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  sellerIds: string[];
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  platformFee: number;
  total: number;
  status: OrderStatus;
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    city: string;
    state: string;
    postalCode?: string;
  };
  deliveryMethod: string;
  paymentMethod: 'card' | 'bank_transfer' | 'ussd' | 'wallet';
  paymentReference: string;
  trackingNumber?: string;
  courier?: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note: string;
  }[];
}

export interface Review {
  id: string;
  targetType: 'product' | 'store';
  targetId: string;
  productId?: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  title?: string;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
  sellerReply?: {
    comment: string;
    createdAt: string;
  };
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  read: boolean;
  referencedProductId?: string;
  referencedOrderId?: string;
}

export interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    avatar: string;
    username: string;
    role: UserRole;
  }[];
  participantIds?: string[];
  participantNames?: Record<string, string>;
  participantAvatars?: Record<string, string>;
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCount: number;
  productId?: string;
  productTitle?: string;
  productImage?: string;
  productPrice?: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'message' | 'promo' | 'security' | 'seller_verification' | 'system' | 'price_drop';
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface PlatformConfig {
  commissionRatePercent: number; // default: 3.0 (%)
  minWithdrawalAmount: number; // default 5000 NGN
  currencySymbol: string;
  currencyCode: string;
  autoApproveProducts: boolean;
  prohibitedKeywords: string[];
}

export interface Transaction {
  id: string;
  reference: string;
  orderId?: string;
  userId: string;
  sellerId?: string;
  type: 'sale' | 'commission' | 'withdrawal' | 'refund' | 'promotion_fee';
  grossAmount: number;
  commissionAmount: number;
  netAmount: number;
  status: 'successful' | 'pending' | 'failed';
  paymentMethod: string;
  description: string;
  createdAt: string;
}

export interface WithdrawalRequest {
  id: string;
  sellerId: string;
  sellerName: string;
  storeName: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  requestedAt: string;
  processedAt?: string;
  notes?: string;
}

export interface Report {
  id: string;
  reporterId: string;
  reporterName: string;
  targetType: 'product' | 'seller' | 'review' | 'message';
  targetId: string;
  targetTitle: string;
  reason: 'fraud' | 'counterfeit' | 'prohibited_item' | 'scam' | 'harassment' | 'misleading' | 'other';
  details: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  createdAt: string;
  resolvedAt?: string;
  adminActionTaken?: string;
}
