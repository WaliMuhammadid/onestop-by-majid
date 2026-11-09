import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { ProductCard } from './ProductCard';
import { LayoutGrid, Grid3X3, Grid2X2, SlidersHorizontal, X } from 'lucide-react';
import { Product } from '../../types';

export const ProductGrid: React.FC = () => {
  const {
    products,
    categories,
    brands,
    selectedCategory,
    setSelectedCategory,
    selectedBrand,
    setSelectedBrand,
    priceRange,
    selectedSizes,
    toggleSizeFilter,
    selectedColors,
    toggleColorFilter,
    minRating,
    inStockOnly,
    sortBy,
    setSortBy,
    resetFilters,
    setIsAdminLoginOpen,
  } = useStore();

  const [cols, setCols] = useState<3 | 4>(3);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter products
  const filtered = products.filter((p) => {
    if (!p.isPublished) return false;
    if (selectedCategory && p.categoryId !== selectedCategory) return false;
    if (selectedBrand && p.brandId !== selectedBrand) return false;
    if (p.price > priceRange[1]) return false;
    if (inStockOnly && p.stock <= 0) return false;
    if (minRating > 0 && p.rating < minRating) return false;

    // Size filter check against variants
    if (selectedSizes.length > 0) {
      const productSizes = p.variants.map((v) => v.size).filter(Boolean);
      const matchesSize = selectedSizes.some((s) => productSizes.includes(s));
      if (!matchesSize) return false;
    }

    // Color filter check against variants
    if (selectedColors.length > 0) {
      const productColors = p.variants.map((v) => v.color).filter(Boolean);
      const matchesColor = selectedColors.some((c) => productColors.includes(c));
      if (!matchesColor) return false;
    }

    return true;
  });

  // Sort products
  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'popularity':
        return b.reviewCount - a.reviewCount;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const activeCategoryObj = categories.find((c) => c.id === selectedCategory);
  const activeBrandObj = brands.find((b) => b.id === selectedBrand);

  const activeFilterCount =
    (selectedCategory ? 1 : 0) +
    (selectedBrand ? 1 : 0) +
    (priceRange[1] < 600 ? 1 : 0) +
    selectedSizes.length +
    selectedColors.length +
    (inStockOnly ? 1 : 0) +
    (minRating > 0 ? 1 : 0);

  return (
    <div className="flex-1 w-full space-y-6">
      {/* Mobile Horizontal Category Quick-Bar (< lg) */}
      <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors shrink-0 ${
            selectedCategory === null
              ? 'bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 shadow-sm'
              : 'bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800'
          }`}
        >
          All Works
        </button>
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors shrink-0 ${
                isSelected
                  ? 'bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 shadow-sm'
                  : 'bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Top Bar: Title, Filter Trigger (Mobile), Count, Sorting, Layout Grid Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div className="flex items-center justify-between sm:block">
          <div>
            <h2 className="text-sm font-semibold tracking-wider uppercase text-stone-900 dark:text-stone-100">
              {activeCategoryObj ? activeCategoryObj.name : 'All Works'}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">Showing {sorted.length} curated objects</p>
          </div>

          {/* Mobile Filter Trigger Button (< lg) */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 text-xs font-semibold uppercase tracking-wider shadow-sm"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-stone-900 text-[10px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3">
          {/* Sorting Dropdown */}
          <div className="flex items-center gap-2 text-xs w-full sm:w-auto">
            <span className="text-stone-400 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full sm:w-auto bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded px-2.5 py-1.5 focus:outline-none cursor-pointer"
            >
              <option value="newest">New Arrivals</option>
              <option value="popularity">Most Coveted</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {/* Grid Columns Switcher (Desktop) */}
          <div className="hidden sm:flex items-center gap-1 border border-stone-200 dark:border-stone-700 rounded p-0.5 shrink-0">
            <button
              onClick={() => setCols(3)}
              className={`p-1 rounded ${cols === 3 ? 'bg-stone-900 text-white dark:bg-white dark:text-black' : 'text-stone-400'}`}
              aria-label="3 columns grid"
            >
              <Grid3X3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setCols(4)}
              className={`p-1 rounded ${cols === 4 ? 'bg-stone-900 text-white dark:bg-white dark:text-black' : 'text-stone-400'}`}
              aria-label="4 columns grid"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Badges */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {activeCategoryObj && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-full bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200">
              {activeCategoryObj.name}
              <button onClick={() => setSelectedCategory(null)} aria-label="Remove category filter">
                <X className="w-3 h-3 hover:opacity-70" />
              </button>
            </span>
          )}
          {activeBrandObj && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-full bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200">
              {activeBrandObj.name}
              <button onClick={() => setSelectedBrand(null)} aria-label="Remove brand filter">
                <X className="w-3 h-3 hover:opacity-70" />
              </button>
            </span>
          )}
          {priceRange[1] < 600 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-full bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200">
              Max RS {priceRange[1]}
            </span>
          )}
          {selectedSizes.map((s) => (
            <span key={s} className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-full bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200">
              Size: {s}
              <button onClick={() => toggleSizeFilter(s)} aria-label={`Remove size ${s}`}>
                <X className="w-3 h-3 hover:opacity-70" />
              </button>
            </span>
          ))}
          {selectedColors.map((c) => (
            <span key={c} className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-full bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200">
              Color: {c}
              <button onClick={() => toggleColorFilter(c)} aria-label={`Remove color ${c}`}>
                <X className="w-3 h-3 hover:opacity-70" />
              </button>
            </span>
          ))}
          {inStockOnly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-full bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200">
              In Stock Only
            </span>
          )}
          {minRating > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-full bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200">
              4.8+ ★
            </span>
          )}
          <button
            onClick={resetFilters}
            className="text-xs text-amber-700 dark:text-amber-400 underline hover:opacity-80 ml-1"
          >
            Clear all ({activeFilterCount})
          </button>
        </div>
      )}

      {/* Grid of Product Cards */}
      {sorted.length > 0 ? (
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 ${
            cols === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
          } gap-x-4 sm:gap-x-6 gap-y-8 sm:gap-y-10`}
        >
          {sorted.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-16 sm:py-20 text-center space-y-4 bg-stone-50 dark:bg-stone-900/40 rounded-xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8">
          <p className="font-serif text-xl sm:text-2xl text-stone-800 dark:text-stone-200">
            {products.length === 0 ? 'Catalog Ready for Inventory' : 'No objects match your current selection.'}
          </p>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            {products.length === 0
              ? 'All hardcoded products have been cleared. Manage and publish your inventory directly from the Admin Panel.'
              : 'Try expanding your price range or clearing specific size and color parameters.'}
          </p>
          {products.length === 0 ? (
            <button
              onClick={() => setIsAdminLoginOpen(true)}
              className="px-6 py-2.5 rounded-full bg-stone-900 text-stone-100 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
            >
              Open Admin Console
            </button>
          ) : (
            <button
              onClick={resetFilters}
              className="px-6 py-2.5 rounded-full bg-stone-900 text-stone-100 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
            >
              Reset All Filters
            </button>
          )}
        </div>
      )}

      {/* Mobile Filter Drawer Modal (< lg) */}
      {mobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex justify-end bg-stone-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-xs sm:max-w-sm bg-[#faf9f6] dark:bg-[#12100e] h-full shadow-2xl border-l border-stone-200 dark:border-stone-800 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-stone-900 dark:text-stone-100" />
                <h3 className="font-serif text-lg text-stone-900 dark:text-stone-100">
                  Refine &amp; Filter
                </h3>
              </div>
              <button
                onClick={() => setMobileFilterOpen(false)}
                aria-label="Close filters"
                className="p-1 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Filter Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
              {/* Category */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Category</h4>
                <div className="flex flex-col gap-1 text-xs">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`text-left py-1.5 px-2.5 rounded transition-colors ${
                      selectedCategory === null
                        ? 'bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 font-medium'
                        : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    All Works
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
                      className={`text-left py-1.5 px-2.5 rounded transition-colors ${
                        selectedCategory === cat.id
                          ? 'bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 font-medium'
                          : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                  <span>Max Price</span>
                  <span className="text-stone-900 dark:text-stone-100 font-bold">RS {priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="600"
                  step="25"
                  value={priceRange[1]}
                  onChange={(e) => useStore.getState().setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full accent-stone-900 dark:accent-stone-100 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                  <span>RS 50</span>
                  <span>RS 600</span>
                </div>
              </div>

              {/* Sizes */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Size &amp; Dimension</h4>
                <div className="flex flex-wrap gap-1.5">
                  {['XS', 'S', 'M', 'L', 'Standard', 'Queen', 'King', 'One Size'].map((size) => {
                    const isSelected = selectedSizes.includes(size);
                    return (
                      <button
                        key={size}
                        onClick={() => toggleSizeFilter(size)}
                        className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                          isSelected
                            ? 'bg-stone-900 text-white border-stone-900 dark:bg-white dark:text-black dark:border-white font-semibold'
                            : 'bg-transparent text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-800 hover:border-stone-400'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Colors */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Color Palette</h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: 'Bone White', hex: '#e8e5de' },
                    { name: 'Oatmeal', hex: '#e3dcce' },
                    { name: 'Raw Sand', hex: '#cbbfa8' },
                    { name: 'Basalt Charcoal', hex: '#383838' },
                    { name: 'Satin Brass', hex: '#d4af37' },
                    { name: 'Matte Black', hex: '#18181b' },
                    { name: 'Saddle Tan', hex: '#9c6b3e' },
                  ].map((color) => {
                    const isSelected = selectedColors.includes(color.name);
                    return (
                      <button
                        key={color.name}
                        onClick={() => toggleColorFilter(color.name)}
                        title={color.name}
                        className={`w-6 h-6 rounded-full border transition-all ${
                          isSelected ? 'ring-2 ring-stone-900 dark:ring-white scale-110' : 'border-stone-300'
                        }`}
                        style={{ backgroundColor: color.hex }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Brands */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Ateliers</h4>
                <div className="flex flex-col gap-1 text-xs">
                  {brands.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setSelectedBrand(selectedBrand === b.id ? null : b.id)}
                      className={`text-left py-1.5 px-2.5 rounded transition-colors ${
                        selectedBrand === b.id
                          ? 'bg-stone-200/80 dark:bg-stone-800 text-stone-950 dark:text-white font-medium'
                          : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                      }`}
                    >
                      {b.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating & Availability */}
              <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-stone-800 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => useStore.getState().setInStockOnly(e.target.checked)}
                    className="rounded border-stone-300 accent-stone-900 dark:accent-stone-100"
                  />
                  <span>In-Stock Only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={minRating === 4.8}
                    onChange={(e) => useStore.getState().setMinRating(e.target.checked ? 4.8 : 0)}
                    className="rounded border-stone-300 accent-stone-900 dark:accent-stone-100"
                  />
                  <span>High Rating (4.8+ ★)</span>
                </label>
              </div>
            </div>

            {/* Sticky Drawer Footer */}
            <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60 flex items-center gap-3">
              <button
                onClick={resetFilters}
                className="py-2.5 px-4 rounded-full border border-stone-300 dark:border-stone-700 text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300"
              >
                Clear
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 px-4 rounded-full bg-stone-900 text-stone-100 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 text-xs font-semibold uppercase tracking-wider transition-colors text-center"
              >
                Show Results ({sorted.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
