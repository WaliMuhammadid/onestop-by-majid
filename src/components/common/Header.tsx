import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Search, Heart, ShoppingBag, Sun, Moon, Database, Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    cart,
    wishlist,
    isDarkMode,
    toggleDarkMode,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsSearchOpen,
    setIsSupabaseVaultOpen,
    resetFilters,
    setSelectedCategory,
    categories,
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleNavClick = (view: 'home' | 'shop' | 'about') => {
    if (view === 'shop') {
      resetFilters();
    }
    setCurrentView(view);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    setCurrentView('shop');
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#faf9f6]/95 dark:bg-[#0c0a09]/95 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-2 sm:gap-4">
        {/* Mobile Hamburger Button (< md) */}
        <div className="flex items-center md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 -ml-1 text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white transition-colors"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open navigation menu'}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Desktop Left Navigation (md:flex) */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8" aria-label="Main Navigation">
          <button
            onClick={() => handleNavClick('home')}
            className={`text-xs font-semibold uppercase tracking-widest transition-colors ${
              currentView === 'home'
                ? 'text-stone-900 dark:text-white border-b-2 border-stone-900 dark:border-white pb-0.5'
                : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('shop')}
            className={`text-xs font-semibold uppercase tracking-widest transition-colors ${
              currentView === 'shop'
                ? 'text-stone-900 dark:text-white border-b-2 border-stone-900 dark:border-white pb-0.5'
                : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white'
            }`}
          >
            Catalog
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className={`text-xs font-semibold uppercase tracking-widest transition-colors ${
              currentView === 'about'
                ? 'text-stone-900 dark:text-white border-b-2 border-stone-900 dark:border-white pb-0.5'
                : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white'
            }`}
          >
            Philosophy
          </button>
        </nav>

        {/* Center Logo */}
        <div className="text-center">
          <button
            onClick={() => handleNavClick('home')}
            className="group flex flex-col items-center justify-center focus:outline-none"
            aria-label="Onestop by Majid Home"
          >
            <span className="font-serif text-lg sm:text-2xl lg:text-3xl tracking-[0.2em] font-light text-stone-900 dark:text-stone-100 group-hover:opacity-80 transition-opacity">
              ONESTOP
            </span>
            <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-stone-500 dark:text-stone-400 font-medium -mt-0.5">
              By Majid &bull; Curated Living
            </span>
          </button>
        </div>

        {/* Right Utility Icons */}
        <div className="flex items-center gap-1.5 sm:gap-3">

          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 text-stone-600 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white transition-colors"
            aria-label="Search catalog"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Wishlist Trigger */}
          <button
            onClick={() => setIsWishlistOpen(true)}
            className="relative p-2 text-stone-600 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white transition-colors"
            aria-label={`Wishlist (${wishlist.length} saved)`}
          >
            <Heart className="w-4 h-4" />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-stone-900 text-white dark:bg-white dark:text-black text-[10px] font-bold flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 text-stone-600 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white transition-colors"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-stone-900 text-stone-100 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white text-xs font-semibold tracking-wider transition-colors ml-0.5 sm:ml-1"
            aria-label={`Cart (${totalCartCount} items)`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden xs:inline sm:inline">Bag</span>
            <span className="w-4 h-4 rounded-full bg-stone-700 text-stone-100 dark:bg-stone-300 dark:text-stone-900 text-[10px] font-bold flex items-center justify-center">
              {totalCartCount}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer Overlay (< md) */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[calc(4rem+1.5rem)] z-50 bg-stone-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-xs h-[calc(100vh-5.5rem)] bg-[#faf9f6] dark:bg-[#12100e] border-r border-stone-200 dark:border-stone-800 p-6 flex flex-col justify-between overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              {/* Primary Pages */}
              <div className="space-y-2">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">Navigation</span>
                <nav className="flex flex-col space-y-1">
                  <button
                    onClick={() => handleNavClick('home')}
                    className={`text-left py-2 px-3 rounded-lg text-sm font-semibold uppercase tracking-wider transition-colors ${
                      currentView === 'home'
                        ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900'
                        : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-900'
                    }`}
                  >
                    Home
                  </button>
                  <button
                    onClick={() => handleNavClick('shop')}
                    className={`text-left py-2 px-3 rounded-lg text-sm font-semibold uppercase tracking-wider transition-colors ${
                      currentView === 'shop'
                        ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900'
                        : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-900'
                    }`}
                  >
                    Catalog
                  </button>
                  <button
                    onClick={() => handleNavClick('about')}
                    className={`text-left py-2 px-3 rounded-lg text-sm font-semibold uppercase tracking-wider transition-colors ${
                      currentView === 'about'
                        ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900'
                        : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-900'
                    }`}
                  >
                    Philosophy
                  </button>
                </nav>
              </div>

              {/* Quick Categories */}
              <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-stone-800">
                <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-widest text-stone-400">
                  <span>Categories</span>
                  <button
                    onClick={() => handleNavClick('shop')}
                    className="text-amber-700 dark:text-amber-400 flex items-center gap-1"
                  >
                    <span>View all</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </button>
                </div>
                <div className="flex flex-col space-y-1 text-xs">
                  {categories.slice(0, 6).map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      className="text-left py-1.5 px-3 rounded hover:bg-stone-100 dark:hover:bg-stone-900 text-stone-700 dark:text-stone-300 flex items-center justify-between transition-colors"
                    >
                      <span className={cat.id === 'cat-beauty-healthcare' ? 'font-semibold text-amber-600 dark:text-amber-400' : ''}>
                        {cat.name}
                      </span>
                      <ArrowRight className="w-3 h-3 text-stone-400 opacity-60" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Wishlist & Vault Links */}
              <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-stone-800">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">Quick Access</span>
                <div className="flex flex-col space-y-1 text-xs">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsWishlistOpen(true);
                    }}
                    className="flex items-center justify-between py-2 px-3 rounded text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <Heart className="w-4 h-4 text-stone-500" />
                      <span>Saved Wishlist</span>
                    </div>
                    <span className="font-bold text-[10px] px-1.5 py-0.5 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200">
                      {wishlist.length}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Footer Info */}
            <div className="pt-6 border-t border-stone-200 dark:border-stone-800 space-y-3">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span>Theme</span>
                <button
                  onClick={toggleDarkMode}
                  className="px-2.5 py-1 rounded-full border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 flex items-center gap-1.5"
                >
                  {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
                  <span className="capitalize">{isDarkMode ? 'Dark' : 'Light'}</span>
                </button>
              </div>
              <p className="text-[10px] text-stone-400">
                Onestop by Majid &bull; Curated Living
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
