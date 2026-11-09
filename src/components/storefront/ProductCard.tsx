import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Product } from '../../types';
import { Heart, ShoppingBag, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { setSelectedProductId, addToCart, toggleWishlist, isInWishlist } = useStore();
  const [isHovered, setIsHovered] = useState(false);

  const primaryImage = product.images.find((img) => img.isPrimary)?.url || product.images[0]?.url;
  const secondaryImage = product.images.find((img) => !img.isPrimary)?.url || primaryImage;
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  const inWishlist = isInWishlist(product.id);
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock <= 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    const defaultVariant = product.variants[0];
    addToCart(product, defaultVariant, 1);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onClick={() => setSelectedProductId(product.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group cursor-pointer flex flex-col text-left transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-stone-100 dark:bg-stone-900 border border-stone-200/70 dark:border-stone-800">
        <img
          src={isHovered ? secondaryImage : primaryImage}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isNewArrival && (
            <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 rounded">
              New
            </span>
          )}
          {hasDiscount && (
            <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-amber-700 text-amber-50 rounded">
              -{discountPercent}%
            </span>
          )}
          {isLowStock && (
            <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-rose-600 text-white rounded">
              Only {product.stock} left
            </span>
          )}
          {isOutOfStock && (
            <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-stone-500 text-white rounded">
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          aria-label={inWishlist ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm text-stone-700 dark:text-stone-200 hover:text-stone-950 dark:hover:text-white transition-all shadow-sm z-10"
        >
          <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Hover Quick Actions Overlay */}
        <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`flex-1 py-2 px-3 rounded-md text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md transition-colors ${
              isOutOfStock
                ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                : 'bg-stone-900 hover:bg-stone-800 text-stone-100 dark:bg-stone-100 dark:hover:bg-white dark:text-stone-900'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isOutOfStock ? 'Sold Out' : 'Quick Add'}</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProductId(product.id);
            }}
            aria-label={`Inspect ${product.name}`}
            className="p-2 rounded-md bg-white/90 dark:bg-stone-800/90 text-stone-700 dark:text-stone-200 hover:bg-white dark:hover:bg-stone-700 shadow-md transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Info Container */}
      <div className="mt-3.5 space-y-1">
        <div className="flex items-center justify-between text-[11px] text-stone-400 dark:text-stone-500 tracking-wide">
          <span>{product.brandName}</span>
          <div className="flex items-center gap-1">
            <span className="text-amber-500 text-[10px]">★</span>
            <span className="font-medium text-stone-600 dark:text-stone-400">{product.rating}</span>
          </div>
        </div>

        <h3 className="text-sm font-medium text-stone-900 dark:text-stone-100 line-clamp-1 group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors">
          {product.name}
        </h3>

        <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1 font-light">
          {product.tagline}
        </p>

        <div className="flex items-center justify-between pt-0.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-stone-900 dark:text-stone-100">
              RS {product.price}
            </span>
            {hasDiscount && (
              <span className="text-xs text-stone-400 dark:text-stone-500 line-through">
                RS {product.compareAtPrice}
              </span>
            )}
          </div>
          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className="sm:hidden p-1.5 rounded-full bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 hover:opacity-80 disabled:opacity-30 transition-opacity"
            aria-label={`Quick add ${product.name} to bag`}
          >
            <ShoppingBag className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
