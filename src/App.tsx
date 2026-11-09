import React, { useEffect } from 'react';
import { useStore } from './store/useStore';
import { SECRET_ADMIN_PATH } from './lib/security';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/Toast';
import { SearchModal } from './components/common/SearchModal';
import { Hero } from './components/storefront/Hero';
import { CategoryShowcase } from './components/storefront/CategoryShowcase';
import { ProductGrid } from './components/storefront/ProductGrid';
import { FilterSidebar } from './components/storefront/FilterSidebar';
import { ProductCard } from './components/storefront/ProductCard';
import { ProductDetailModal } from './components/storefront/ProductDetailModal';
import { CartDrawer } from './components/storefront/CartDrawer';
import { WishlistDrawer } from './components/storefront/WishlistDrawer';
import { CheckoutModal } from './components/storefront/CheckoutModal';
import { OrderSuccessModal } from './components/storefront/OrderSuccessModal';
import { Philosophy } from './components/storefront/Philosophy';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function App() {
  const {
    currentView,
    setCurrentView,
    products,
    isAdminAuthenticated,
    setIsAdminLoginOpen,
    setIsAdminDashboardOpen,
    isDarkMode,
    setDarkMode,
    syncFromSupabase,
  } = useStore();

  // Load live products & data from Supabase on startup
  useEffect(() => {
    syncFromSupabase();
  }, [syncFromSupabase]);

  // Sync initial dark mode class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Check URL pathname or hash for the secret admin route (/control-x7k2)
  useEffect(() => {
    const checkSecretRoute = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      const search = window.location.search;

      if (path === SECRET_ADMIN_PATH || hash === '#control-x7k2' || search.includes('secret=x7k2')) {
        if (isAdminAuthenticated) {
          setIsAdminDashboardOpen(true);
        } else {
          setIsAdminLoginOpen(true);
        }
      }
    };

    checkSecretRoute();
    window.addEventListener('hashchange', checkSecretRoute);
    window.addEventListener('popstate', checkSecretRoute);
    return () => {
      window.removeEventListener('hashchange', checkSecretRoute);
      window.removeEventListener('popstate', checkSecretRoute);
    };
  }, [isAdminAuthenticated, setIsAdminDashboardOpen, setIsAdminLoginOpen]);

  // Secret shortcut: Ctrl + Shift + A (or Cmd + Shift + A) to open secret admin console
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        if (isAdminAuthenticated) {
          setIsAdminDashboardOpen(true);
        } else {
          setIsAdminLoginOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminAuthenticated, setIsAdminDashboardOpen, setIsAdminLoginOpen]);

  const featuredProducts = products.filter((p) => p.isPublished && p.isFeatured).slice(0, 4);
  const newArrivals = products.filter((p) => p.isPublished && p.isNewArrival).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f6] text-stone-900 dark:bg-[#0c0a09] dark:text-[#f5f5f4] transition-colors">
      {/* Global Navigation Header */}
      <Header />

      {/* Main Content Body */}
      <main className="flex-1">
        {currentView === 'home' && (
          <div>
            {/* Hero Section */}
            <Hero />

            {/* Category Showcase Section */}
            <CategoryShowcase />

            {/* Featured Curated Artifacts Section (shown when products exist) */}
            {featuredProducts.length > 0 && (
              <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-stone-200 dark:border-stone-800">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-stone-200 dark:border-stone-800">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-stone-400">
                      Curated Signature Pieces
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl font-normal text-stone-900 dark:text-stone-100 mt-1">
                      Permanent Works
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentView('shop');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="mt-4 sm:mt-0 text-xs font-semibold uppercase tracking-widest text-stone-900 dark:text-stone-100 hover:opacity-70 transition-opacity flex items-center gap-1.5"
                  >
                    <span>Explore Full Catalog</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                  {featuredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            )}

            {/* Editorial Mid-Banner */}
            <section className="py-20 bg-stone-900 text-stone-100 dark:bg-stone-950 border-y border-stone-800">
              <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
                <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-400">
                  Onestop by Majid &bull; Pure Purpose &bull; Thoughtful Design
                </span>
                <h3 className="font-serif text-3xl sm:text-5xl font-light leading-snug">
                  "Simplicity is not the lack of clutter; it is the presence of purpose."
                </h3>
                <p className="text-xs sm:text-sm text-stone-400 font-light max-w-xl mx-auto leading-relaxed">
                  From everyday personal care and apparel to timeless home living, outdoor travel gear, and artisanal gifts—every essential is curated without compromise, offering enduring quality in one singular place.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setCurrentView('about');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-6 py-3 rounded-full border border-stone-700 hover:border-white text-xs font-semibold uppercase tracking-widest transition-colors"
                  >
                    Read Our Design Philosophy
                  </button>
                </div>
              </div>
            </section>

            {/* New Arrivals Section (shown when products exist) */}
            {newArrivals.length > 0 && (
              <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-stone-200 dark:border-stone-800">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-stone-400">
                      Fresh Atelier Dispatches
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl font-normal text-stone-900 dark:text-stone-100 mt-1">
                      New Arrivals
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentView('shop');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="mt-4 sm:mt-0 text-xs font-semibold uppercase tracking-widest text-stone-900 dark:text-stone-100 hover:opacity-70 transition-opacity flex items-center gap-1.5"
                  >
                    <span>All Releases</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                  {newArrivals.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            )}

            {/* When catalog is completely fresh/empty */}
            {products.length === 0 && (
              <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="p-8 sm:p-12 rounded-2xl bg-white dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 text-center max-w-2xl mx-auto space-y-4 shadow-sm">
                  <div className="w-12 h-12 mx-auto rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-700 dark:text-stone-300">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-2xl text-stone-900 dark:text-stone-100">
                    Catalog Ready for Inventory
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-light leading-relaxed">
                    All sample products have been cleared. Onestop by Majid is configured with your 11 curated departments. Use the secure Admin Console to add new products with pricing, imagery, and stock.
                  </p>
                  <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={() => {
                        if (isAdminAuthenticated) {
                          setIsAdminDashboardOpen(true);
                        } else {
                          setIsAdminLoginOpen(true);
                        }
                      }}
                      className="px-5 py-2.5 rounded-full bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity"
                    >
                      Open Admin Console
                    </button>
                    <button
                      onClick={() => {
                        setCurrentView('shop');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-5 py-2.5 rounded-full border border-stone-200 dark:border-stone-700 text-xs font-semibold uppercase tracking-wider hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                    >
                      View Shop View
                    </button>
                  </div>
                </div>
              </section>
            )}
          </div>
        )}

        {currentView === 'shop' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
              {/* Desktop Filter Sidebar (hidden on mobile/tablet) */}
              <div className="hidden lg:block w-64 shrink-0 sticky top-24">
                <FilterSidebar />
              </div>
              {/* Product Grid (with mobile drawer and horizontal category bar) */}
              <ProductGrid />
            </div>
          </div>
        )}

        {currentView === 'about' && <Philosophy />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Modals & Drawers */}
      <SearchModal />
      <ProductDetailModal />
      <CartDrawer />
      <WishlistDrawer />
      <CheckoutModal />
      <OrderSuccessModal />
      <AdminLoginModal />
      <AdminDashboard />
      <ToastContainer />
    </div>
  );
}
