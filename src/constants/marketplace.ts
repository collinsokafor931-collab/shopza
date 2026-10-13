import { PlatformConfig } from '../types';

// Verified photography assets for category cards and banners
export const heroMarketplaceImg =
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80';
export const catUrbanFashionImg =
  'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&auto=format&fit=crop&q=80';
export const catElectronicsImg =
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80';
export const catHomeLivingImg =
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80';

export const INITIAL_CONFIG: PlatformConfig = {
  commissionRatePercent: 3.0,
  minWithdrawalAmount: 5000,
  currencySymbol: '₦',
  currencyCode: 'NGN',
  autoApproveProducts: true,
  prohibitedKeywords: [
    'weapon',
    'explosive',
    'narcotic',
    'counterfeit pass',
    'stolen card',
    'ammunition',
    'unregulated chemical',
  ],
};

export const CATEGORIES_LIST = [
  {
    name: 'Fashion',
    slug: 'fashion',
    count: 0,
    icon: 'Shirt',
    image: catUrbanFashionImg,
    description: 'Contemporary clothing, footwear, bespoke tailoring, and modern streetwear.',
  },
  {
    name: 'Phones & Gadgets',
    slug: 'phones',
    count: 0,
    icon: 'Smartphone',
    image: catElectronicsImg,
    description: 'Flagship smartphones, smartwatches, earbuds, tablets, and mobile accessories.',
  },
  {
    name: 'Electronics',
    slug: 'electronics',
    count: 0,
    icon: 'Tv',
    image: heroMarketplaceImg,
    description: 'Audio systems, smart TVs, home theaters, solar inverters, and power equipment.',
  },
  {
    name: 'Computers',
    slug: 'computers',
    count: 0,
    icon: 'Laptop',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
    description: 'MacBooks, gaming laptops, workstations, monitors, and peripherals.',
  },
  {
    name: 'Home & Living',
    slug: 'home-living',
    count: 0,
    icon: 'Home',
    image: catHomeLivingImg,
    description: 'Sculptural furniture, artisanal tableware, bedding, and handcrafted decor.',
  },
  {
    name: 'Beauty & Skincare',
    slug: 'beauty',
    count: 0,
    icon: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80',
    description: 'Clean cosmetics, luxury fragrances, melanin skin care, and organic haircare.',
  },
  {
    name: 'Food & Groceries',
    slug: 'food',
    count: 0,
    icon: 'Utensils',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
    description: 'Fresh farm produce, artisanal spices, stone-free rice, and organic snacks.',
  },
  {
    name: 'Art & Collectibles',
    slug: 'art',
    count: 0,
    icon: 'Palette',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
    description: 'Original paintings, sculpted pottery, African contemporary photography, and craft.',
  },
  {
    name: 'Automotive & Parts',
    slug: 'automotive',
    count: 0,
    icon: 'Car',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80',
    description: 'Genuine replacement parts, smart accessories, dash cams, and detailing supplies.',
  },
  {
    name: 'Services',
    slug: 'services',
    count: 0,
    icon: 'Briefcase',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80',
    description: 'Web design, photography, tailoring, equipment repair, and logistics consulting.',
  },
];

// Identifiers of known seed/demo documents for auditable cleanup
export const KNOWN_DEMO_STORE_IDS = [
  'store-1',
  'store-2',
  'store-3',
  'store-4',
  'store-5',
  'store-6',
  'store-7',
  'store-8',
  'store-9',
  'store-10',
  'store-emirate',
];

export const KNOWN_DEMO_PRODUCT_IDS = [
  'prod-1',
  'prod-2',
  'prod-3',
  'prod-4',
  'prod-5',
  'prod-6',
  'prod-7',
  'prod-8',
  'prod-9',
  'prod-10',
  'prod-11',
  'prod-12',
  'prod-13',
  'prod-14',
  'prod-15',
];

export const KNOWN_DEMO_USER_IDS = [
  'user-buyer-1',
  'user-seller-1',
  'user-seller-2',
  'user-admin-1',
];
