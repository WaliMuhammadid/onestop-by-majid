import React from 'react';
import { useStore } from '../../store/useStore';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export const WishlistDrawer: React.FC = () => {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    wishlist,
    toggleWishlist,
    products,
    addToCart,
    setSelectedProductId,
  } = useStore();

  if (!isWishlistOpen) return null;

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  const handleMoveAllToCart = () => {
    wishlistProducts.forEach((p) => {
      addToCart(p, p.variants[0], 1);
    });
    setIsWishlistOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-stone-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#faf9f6] dark:bg-[#12100e] h-full shadow-2xl border-l border-stone-200 dark:border-stone-800 flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <h2 className="font-serif text-lg text-stone-900 dark:text-stone-100 font-normal">
              Saved Works ({wishlist.length})
            </h2>
          </div>
          <button
            onClick={() => setIsWishlistOpen(false)}
            aria-label="Close wishlist"
            className="p-1.5 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-stone-100 dark:divide-stone-800/60">
          {wishlistProducts.length > 0 ? (
            wishlistProducts.map((product) => {
              const primaryImg = product.images.find((i) => i.isPrimary)?.url || product.images[0]?.url;
              return (
                <div key={product.id} className="pt-4 first:pt-0 flex gap-3.5 items-center">
                  <img
                    src={primaryImg}
                    alt={product.name}
                    className="w-16 h-20 object-cover rounded bg-stone-100 dark:bg-stone-800 shrink-0 cursor-pointer"
                    onClick={() => {
                      setSelectedProductId(product.id);
                      setIsWishlistOpen(false);
                    }}
                  />
                  <div className="flex-1 space-y-1">
                    <h4
                      onClick={() => {
                        setSelectedProductId(product.id);
                        setIsWishlistOpen(false);
                      }}
                      className="text-xs font-semibold text-stone-900 dark:text-stone-100 hover:underline cursor-pointer line-clamp-1"
                    >
                      {product.name}
                    </h4>
                    <p className="text-[11px] text-stone-400 font-mono">RS {product.price}</p>
                    <div className="flex items-center gap-3 pt-1">
                      <button
                        onClick={() => {
                          addToCart(product, product.variants[0], 1);
                        }}
                        className="text-[11px] font-semibold uppercase tracking-wider text-stone-900 dark:text-stone-100 hover:opacity-70 flex items-center gap-1"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Move to Bag</span>
                      </button>
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="text-[11px] text-stone-400 hover:text-rose-500 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-16">
              <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400">
                <Heart className="w-6 h-6 stroke-1" />
              </div>
              <p className="font-serif text-lg text-stone-800 dark:text-stone-200">No saved works yet.</p>
              <p className="text-xs text-stone-400 max-w-xs">
                Select the heart on any artifact to curate your personal wish list.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {wishlistProducts.length > 0 && (
          <div className="p-5 bg-stone-50 dark:bg-stone-900/40 border-t border-stone-200 dark:border-stone-800">
            <button
              onClick={handleMoveAllToCart}
              className="w-full py-3.5 px-4 rounded-full bg-stone-900 text-stone-100 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white text-xs font-semibold uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Transfer All to Bag</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
