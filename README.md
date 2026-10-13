# SHOPZA — BUY. SELL. DISCOVER.

The premier modern mobile-first marketplace application and Progressive Web App (PWA).

## Overview

SHOPZA is a complete marketplace application designed for independent merchants, artisanal creators, and discerning buyers across Nigeria and beyond.

### Key Capabilities

- **Buyer Experience:**
  - Discover products across 10+ categories and multiple states (Lagos, Abuja, Rivers, Oyo).
  - Search with real-time autocompletion, category filters, price limits, condition, and verification badges.
  - Interactive Contiguous Purchase Module on Product Details (`/product/:productId`) with image galleries, customer reviews, and specifications.
  - Multi-seller shopping cart with transparent delivery calculations and promo codes.
  - Multi-step checkout with delivery methods (Express Lagos 24h, Standard Nationwide, Pickup Hub).
  - Escrow payment gateway simulation supporting Cards, Bank Transfers, and USSD with server-verified settlement.
  - Real-time order tracking timeline and official downloadable receipts.
  - In-app buyer-to-seller messaging attached to specific products.

- **Seller Experience:**
  - 3-step merchant onboarding with custom storefront URL generation (`/store/:username`).
  - Dynamic store pages with custom branding, followers, reviews, and policies.
  - Seller Hub dashboard with gross sales, net payout tracking, and orders fulfillment queue.
  - Product catalog management (Add, Edit, Duplicate, Pause, Delete).
  - Transparent commission engine with earnings breakdown and withdrawal requests to Nigerian banks.
  - Listing promotions and boost packages (24 Hours, 3 Days, 7 Days).

- **Platform Governance & Admin:**
  - Centralized configurable platform commission system (default 3.0%, adjustable from 0.5% to 20%).
  - Payout approval/rejection queue.
  - Trust & Safety moderation queue for counterfeit or prohibited items.
  - Live marketplace volume (GMV) and revenue tracking.

- **Progressive Web App (PWA):**
  - Installable on desktop, Android, and iOS Safari (`PWAInstallButton` with custom iOS guided sheet).
  - Service worker caching and offline connectivity banner (`OfflineIndicator`).
  - Mobile bottom navigation bar matching native app conventions.

## Quick Test Personas

You can switch roles instantly in the top bar dropdown:
1. **Buyer:** Tunde Balogun (Orders, saved wishlist, reviews, chat)
2. **Seller (Fashion):** Collins Okafor — *Urban Threads* (Catalog, fulfillment, payouts)
3. **Seller (Tech):** Amaka David — *TechZone NG* (Smartphones & laptops)
4. **Platform Admin:** SHOPZA Ops (Global commission config, moderation, GMV)
5. **Guest:** Unauthenticated visitor browsing mode
