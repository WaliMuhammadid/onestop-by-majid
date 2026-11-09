import React from 'react';
import { useStore } from '../../store/useStore';
import { RotateCcw, Check } from 'lucide-react';

interface FilterSidebarProps {
  onClose?: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({ onClose }) => {
  const {
    categories,
    brands,
    selectedCategory,
    setSelectedCategory,
    selectedBrand,
    setSelectedBrand,
    priceRange,
    setPriceRange,
    selectedSizes,
    toggleSizeFilter,
    selectedColors,
    toggleColorFilter,
    minRating,
    setMinRating,
    inStockOnly,
    setInStockOnly,
    resetFilters,
  } = useStore();

  const SIZES = ['XS', 'S', 'M', 'L', 'Standard', 'Queen', 'King', 'One Size'];

  const COLOR_SWATCHES = [
    { name: 'Bone White', hex: '#e8e5de' },
    { name: 'Oatmeal', hex: '#e3dcce' },
    { name: 'Raw Sand', hex: '#cbbfa8' },
    { name: 'Basalt Charcoal', hex: '#383838' },
    { name: 'Satin Brass', hex: '#d4af37' },
    { name: 'Matte Black', hex: '#18181b' },
    { name: 'Saddle Tan', hex: '#9c6b3e' },
  ];

  const hasActiveFilters =
    selectedCategory !== null ||
    selectedBrand !== null ||
    priceRange[1] < 600 ||
    selectedSizes.length > 0 ||
    selectedColors.length > 0 ||
    minRating > 0 ||
    inStockOnly;

  return (
    <aside className="w-full space-y-6 text-stone-900 dark:text-stone-100">
      {/* Header & Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-900 dark:text-stone-100">
          Refine Catalog
        </h3>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-[11px] text-amber-700 dark:text-amber-400 hover:underline"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Categories Filter */}
      <div className="space-y-2.5">
        <h4 className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Category</h4>
        <div className="flex flex-col gap-1.5 text-xs">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`text-left py-1 px-2 rounded transition-colors ${
              selectedCategory === null
                ? 'bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 font-medium'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white'
            }`}
          >
            All Works
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
              className={`text-left py-1 px-2 rounded transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 font-medium'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Slider Filter */}
      <div className="space-y-2.5">
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
          onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
          className="w-full accent-stone-900 dark:accent-stone-100 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-stone-400 font-mono">
          <span>RS 50</span>
          <span>RS 600</span>
        </div>
      </div>

      {/* Sizes Filter */}
      <div className="space-y-2.5">
        <h4 className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Size & Dimension</h4>
        <div className="flex flex-wrap gap-1.5">
          {SIZES.map((size) => {
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

      {/* Color Swatches */}
      <div className="space-y-2.5">
        <h4 className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Color Palette</h4>
        <div className="flex flex-wrap gap-2">
          {COLOR_SWATCHES.map((color) => {
            const isSelected = selectedColors.includes(color.name);
            return (
              <button
                key={color.name}
                onClick={() => toggleColorFilter(color.name)}
                title={color.name}
                className={`relative w-6 h-6 rounded-full border transition-all ${
                  isSelected
                    ? 'ring-2 ring-stone-900 dark:ring-white scale-110'
                    : 'border-stone-300 dark:border-stone-700 hover:scale-105'
                }`}
                style={{ backgroundColor: color.hex }}
              >
                {isSelected && (
                  <Check
                    className={`w-3 h-3 absolute inset-0 m-auto ${
                      ['Bone White', 'Oatmeal', 'Raw Sand', 'Satin Brass'].includes(color.name)
                        ? 'text-stone-900'
                        : 'text-white'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Brands Filter */}
      <div className="space-y-2.5">
        <h4 className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">Ateliers & Brands</h4>
        <div className="flex flex-col gap-1 text-xs">
          {brands.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedBrand(selectedBrand === b.id ? null : b.id)}
              className={`text-left py-1 px-2 rounded transition-colors ${
                selectedBrand === b.id
                  ? 'bg-stone-200/80 dark:bg-stone-800 text-stone-950 dark:text-white font-medium'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white'
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>

      {/* Rating & Availability Filters */}
      <div className="space-y-3 pt-2 border-t border-stone-200 dark:border-stone-800">
        <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-700 dark:text-stone-300">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="rounded border-stone-300 accent-stone-900 dark:accent-stone-100"
          />
          <span>In-Stock Only</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-700 dark:text-stone-300">
          <input
            type="checkbox"
            checked={minRating === 4.8}
            onChange={(e) => setMinRating(e.target.checked ? 4.8 : 0)}
            className="rounded border-stone-300 accent-stone-900 dark:accent-stone-100"
          />
          <div className="flex items-center gap-1">
            <span>High Rating (4.8+ ★)</span>
          </div>
        </label>
      </div>
    </aside>
  );
};
