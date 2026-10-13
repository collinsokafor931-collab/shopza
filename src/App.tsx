import React, { useState, useEffect } from 'react';
import { MarketplaceProvider, useMarketplace } from './context/MarketplaceContext';
import { Navbar } from './components/common/Navbar';
import { BottomNav } from './components/common/BottomNav';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { OfflineIndicator } from './components/common/OfflineIndicator';

// Pages
import { HomePage } from './pages/HomePage';
import { MarketplacePage } from './pages/MarketplacePage';
import { CategoriesPage } from './pages/CategoriesPage';
import { CategoryDetailPage } from './pages/CategoryDetailPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { StoreDetailPage } from './pages/StoreDetailPage';
import { StoresPage } from './pages/StoresPage';
import { ServicesPage } from './pages/ServicesPage';
import { DealsPage } from './pages/DealsPage';
import { TrendingPage } from './pages/TrendingPage';
import { NewArrivalsPage } from './pages/NewArrivalsPage';
import { ExplorePage } from './pages/ExplorePage';

import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { PaymentPage } from './pages/PaymentPage';
import { PaymentSuccessPage } from './pages/PaymentSuccessPage';
import { PaymentFailedPage } from './pages/PaymentFailedPage';

import { AccountPage } from './pages/AccountPage';
import { OrdersPage } from './pages/OrdersPage';
import { OrderDetailPage } from './pages/OrderDetailPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { FollowingPage } from './pages/FollowingPage';
import { MessagesPage } from './pages/MessagesPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SettingsPage } from './pages/SettingsPage';

import { SellLandingPage } from './pages/SellLandingPage';
import { SellerOnboardingPage } from './pages/SellerOnboardingPage';
import { SellerDashboardPage } from './pages/SellerDashboardPage';
import { SellerProductsPage } from './pages/SellerProductsPage';
import { SellerProductEditPage } from './pages/SellerProductEditPage';
import { SellerOrdersPage } from './pages/SellerOrdersPage';
import { SellerEarningsPage } from './pages/SellerEarningsPage';
import { SellerPromotionsPage } from './pages/SellerPromotionsPage';
import { SellerThemeCustomizerPage } from './pages/SellerThemeCustomizerPage';
import { SellerPOSPage } from './pages/SellerPOSPage';
import { SellerCustomersPage } from './pages/SellerCustomersPage';

import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminSettingsPage } from './pages/AdminSettingsPage';
import { AdminModerationPage } from './pages/AdminModerationPage';

import { AuthPages } from './pages/AuthPages';
import { AuthModal } from './components/common/AuthModal';
import { StaticPages } from './pages/StaticPages';
import { GmailAuthGate } from './components/auth/GmailAuthGate';

const MarketplaceApp: React.FC = () => {
  const {
    currentUser,
    authLoading,
    authModalOpen,
    setAuthModalOpen,
    authModalMode,
    currentPath,
    navigate,
  } = useMarketplace();

  const [pendingCheckout, setPendingCheckout] = useState<any>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);
  const [editingProductId, setEditingProductId] = useState<string | undefined>(undefined);

  // Parsing current path & search params
  const [pathname, searchStr] = currentPath.split('?');
  const searchParams = new URLSearchParams(searchStr || '');

  // Render current view
  const renderContent = () => {
    // 1. Discovery & Public
    if (pathname === '/') {
      return <HomePage />;
    }

    if (pathname === '/marketplace') {
      return (
        <MarketplacePage
          initialCategory={searchParams.get('category') || undefined}
          initialQuery={searchParams.get('q') || undefined}
        />
      );
    }

    if (pathname === '/search') {
      return (
        <MarketplacePage
          initialCategory={searchParams.get('category') || undefined}
          initialQuery={searchParams.get('q') || undefined}
        />
      );
    }

    if (pathname === '/categories') {
      return <CategoriesPage />;
    }

    if (pathname.startsWith('/category/')) {
      const slug = pathname.replace('/category/', '');
      return <CategoryDetailPage categorySlug={slug} navigate={navigate} />;
    }

    if (pathname.startsWith('/product/')) {
      const pId = pathname.replace('/product/', '');
      return <ProductDetailPage productId={pId} />;
    }

    if (pathname.startsWith('/store/')) {
      const raw = pathname.replace('/store/', '').split('?')[0].replace(/\/+$/, '');
      const username = decodeURIComponent(raw);
      return <StoreDetailPage username={username} />;
    }

    if (pathname === '/stores') {
      return <StoresPage />;
    }

    if (pathname === '/services') {
      return <ServicesPage navigate={navigate} />;
    }

    if (pathname === '/deals') {
      return <DealsPage navigate={navigate} />;
    }

    if (pathname === '/trending') {
      return <TrendingPage navigate={navigate} />;
    }

    if (pathname === '/new-arrivals') {
      return <NewArrivalsPage navigate={navigate} />;
    }

    if (pathname === '/explore') {
      return <ExplorePage navigate={navigate} />;
    }

    // 2. Cart & Payment
    if (pathname === '/cart') {
      return <CartPage navigate={navigate} />;
    }

    if (pathname === '/checkout') {
      return <CheckoutPage navigate={navigate} setPendingCheckout={setPendingCheckout} />;
    }

    if (pathname === '/payment') {
      return (
        <PaymentPage
          pendingCheckout={pendingCheckout}
          navigate={navigate}
          setConfirmedOrder={setConfirmedOrder}
        />
      );
    }

    if (pathname === '/payment/success') {
      return <PaymentSuccessPage confirmedOrder={confirmedOrder} navigate={navigate} />;
    }

    if (pathname === '/payment/failed') {
      return <PaymentFailedPage navigate={navigate} />;
    }

    // 3. Buyer Account
    if (pathname === '/account') {
      return <AccountPage navigate={navigate} />;
    }

    if (pathname === '/account/orders') {
      return <OrdersPage navigate={navigate} />;
    }

    if (pathname.startsWith('/account/orders/')) {
      const ordId = pathname.replace('/account/orders/', '');
      return <OrderDetailPage orderId={ordId} navigate={navigate} />;
    }

    if (pathname === '/account/favorites') {
      return <FavoritesPage navigate={navigate} />;
    }

    if (pathname === '/account/following') {
      return <FollowingPage navigate={navigate} />;
    }

    if (pathname === '/account/messages' || pathname === '/seller/messages') {
      const convId = searchParams.get('id') || undefined;
      return <MessagesPage navigate={navigate} selectedConversationId={convId} />;
    }

    if (pathname === '/account/notifications') {
      return <NotificationsPage navigate={navigate} />;
    }

    if (pathname === '/settings' || pathname === '/seller/settings') {
      return <SettingsPage navigate={navigate} />;
    }

    // 4. Seller Application
    if (pathname === '/sell') {
      return <SellLandingPage navigate={navigate} />;
    }

    if (pathname === '/seller/onboarding') {
      return <SellerOnboardingPage navigate={navigate} />;
    }

    if (pathname === '/seller/dashboard') {
      return <SellerDashboardPage navigate={navigate} />;
    }

    if (pathname === '/seller/products') {
      return (
        <SellerProductsPage
          navigate={navigate}
          onEditProduct={(id) => {
            setEditingProductId(id);
            navigate(`/seller/products/${id}/edit`);
          }}
        />
      );
    }

    if (pathname === '/seller/products/new') {
      return <SellerProductEditPage navigate={navigate} />;
    }

    if (pathname.includes('/seller/products/') && pathname.endsWith('/edit')) {
      const id = pathname.replace('/seller/products/', '').replace('/edit', '');
      return <SellerProductEditPage productId={id || editingProductId} navigate={navigate} />;
    }

    if (pathname === '/seller/orders') {
      return <SellerOrdersPage navigate={navigate} />;
    }

    if (pathname === '/seller/earnings' || pathname === '/seller/payouts') {
      return <SellerEarningsPage navigate={navigate} />;
    }

    if (pathname === '/seller/promotions') {
      return <SellerPromotionsPage navigate={navigate} />;
    }

    if (pathname === '/seller/theme-customizer' || pathname === '/seller/theme') {
      return <SellerThemeCustomizerPage navigate={navigate} />;
    }

    if (pathname === '/seller/pos') {
      return <SellerPOSPage navigate={navigate} />;
    }

    if (pathname === '/seller/customers') {
      return <SellerCustomersPage navigate={navigate} />;
    }

    // 5. Admin Portal
    if (pathname === '/admin' || pathname === '/admin/users') {
      return <AdminDashboardPage navigate={navigate} />;
    }

    if (pathname === '/admin/settings') {
      return <AdminSettingsPage navigate={navigate} />;
    }

    if (
      pathname === '/admin/moderation' ||
      pathname === '/admin/reports' ||
      pathname === '/admin/withdrawals' ||
      pathname === '/admin/sellers' ||
      pathname === '/admin/products'
    ) {
      return <AdminModerationPage navigate={navigate} />;
    }

    // 6. Auth
    if (pathname === '/login' || pathname === '/verify') {
      return <AuthPages mode="login" navigate={navigate} />;
    }

    if (pathname === '/signup') {
      return <AuthPages mode="signup" navigate={navigate} />;
    }

    if (pathname === '/forgot-password' || pathname === '/reset-password') {
      return <AuthPages mode="forgot" navigate={navigate} />;
    }

    // 7. Static Information
    if (
      pathname === '/about' ||
      pathname === '/how-it-works' ||
      pathname === '/safety' ||
      pathname === '/help' ||
      pathname === '/contact' ||
      pathname === '/terms' ||
      pathname === '/privacy' ||
      pathname === '/report'
    ) {
      return <StaticPages page={pathname.replace('/', '') as any} navigate={navigate} />;
    }

    // Fallback: 404
    return (
      <div className="mx-auto max-w-lg px-4 py-28 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <span className="font-mono-nums text-4xl font-extrabold text-[#5B35F5] mb-2">404</span>
        <h2 className="font-display text-2xl font-bold text-white">Listing or Route Not Found</h2>
        <p className="text-xs text-slate-400 mt-2">
          Looks like this page or product does not exist or may have been moved.
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 rounded-xl bg-[#5B35F5] px-6 py-3 text-xs font-bold text-white hover:bg-[#4d2ad4] transition cursor-pointer"
        >
          Return to Marketplace Home
        </button>
      </div>
    );
  };

  // 1. Session verification loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#5B35F5] to-[#7C4DFF] flex items-center justify-center shadow-xl shadow-[#5B35F5]/30 animate-pulse mb-4">
          <span className="font-display font-extrabold text-white text-2xl">S</span>
        </div>
        <p className="text-sm font-semibold text-slate-300">SHOPZA</p>
        <p className="text-xs text-slate-500 mt-1">Verifying secure Gmail authentication session...</p>
      </div>
    );
  }

  // 2. Mandatory Authentication Gate: Visiting the app requires logging in with Gmail and password
  if (!currentUser) {
    return (
      <>
        <GmailAuthGate />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0B0F] text-slate-100 selection:bg-[#5B35F5]/30 selection:text-[#7C4DFF]">
      {/* Top Navbar */}
      <Navbar currentPath={pathname} navigate={navigate} />

      {/* Main Content Area */}
      <main className="flex-1 pb-16 md:pb-0">{renderContent()}</main>

      {/* Footer */}
      <Footer navigate={navigate} />

      {/* Mobile Bottom Navigation (Sticky PWA App Bar) */}
      <BottomNav currentPath={pathname} navigate={navigate} />

      {/* Toast Notifications */}
      <ToastContainer />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />

      {/* Non-intrusive Offline Indicator */}
      <OfflineIndicator />
    </div>
  );
};

export default function App() {
  return (
    <MarketplaceProvider>
      <MarketplaceApp />
    </MarketplaceProvider>
  );
}
