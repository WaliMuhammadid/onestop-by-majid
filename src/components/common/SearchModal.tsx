import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { Product } from '../../types';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, products, setSelectedProductId } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search input by 250ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm.trim().toLowerCase());
    }, 250);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Auto focus input when opened
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchTerm('');
      setDebouncedTerm('');
    }
  }, [isSearchOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen]);

  if (!isSearchOpen) return null;

  // Filter matching products (simulating Postgres full-text search)
  const results: Product[] = debouncedTerm
    ? products.filter((p) => {
        if (!p.isPublished) return false;
        const target = `${p.name} ${p.tagline} ${p.description} ${p.categoryName} ${p.brandName} ${p.tags.join(' ')}`.toLowerCase();
        return target.includes(debouncedTerm);
      })
    : [];

  const handleSelectProduct = (productId: string) => {
    setSelectedProductId(productId);
    setIsSearchOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-stone-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-[#faf9f6] dark:bg-[#141210] rounded-xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-5 py-4 border-b border-stone-200 dark:border-stone-800">
          <Search className="w-5 h-5 text-stone-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search stoneware, merino knit, brass lamps, linen..."
            className="w-full bg-transparent text-stone-900 dark:text-stone-100 placeholder-stone-400 text-sm sm:text-base focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors mr-2"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="px-2 py-1 text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 bg-stone-100 dark:bg-stone-800 rounded transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Results / Suggestions Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {debouncedTerm ? (
            results.length > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-stone-400 uppercase tracking-widest px-2 py-1">
                  <span>Matches ({results.length})</span>
                  <span>Press item to view</span>
                </div>
                <div className="divide-y divide-stone-100 dark:divide-stone-800/60">
                  {results.map((product) => {
                    const primaryImg = product.images.find((i) => i.isPrimary)?.url || product.images[0]?.url;
                    return (
                      <button
                        key={product.id}
                        onClick={() => handleSelectProduct(product.id)}
                        className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800/60 text-left transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={primaryImg}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded bg-stone-100 dark:bg-stone-800 shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-medium text-stone-900 dark:text-stone-100 group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors">
                                {product.name}
                              </h4>
                              {product.isNewArrival && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-semibold uppercase">
                                  New
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-stone-500 line-clamp-1">{product.tagline}</p>
                            <span className="text-[11px] text-stone-400 font-serif italic">{product.categoryName}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                            RS {product.price}
                          </span>
                          <ArrowRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center space-y-2">
                <p className="text-sm text-stone-600 dark:text-stone-400 font-medium">
                  No matching artifacts found for "{debouncedTerm}"
                </p>
                <p className="text-xs text-stone-400">
                  Try searching for keywords like <span className="underline cursor-pointer" onClick={() => setSearchTerm('bakuchiol')}>bakuchiol</span>, <span className="underline cursor-pointer" onClick={() => setSearchTerm('prayer')}>prayer</span>, or <span className="underline cursor-pointer" onClick={() => setSearchTerm('merino')}>merino</span>.
                </p>
              </div>
            )
          ) : (
            <div className="py-6 px-2 space-y-4">
              <div className="flex items-center gap-1.5 text-xs text-stone-400 uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Curated Suggestions</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Bakuchiol Serum', 'Prayer Mat', 'Superfine Merino', 'Waxed Weekender', 'Cast Brass Lamp', 'Linen Duvet', 'Box Tee'].map(
                  (term) => (
                    <button
                      key={term}
                      onClick={() => setSearchTerm(term)}
                      className="px-3 py-1.5 text-xs rounded-full bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
