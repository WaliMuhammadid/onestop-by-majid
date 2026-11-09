import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, ShieldCheck, Check } from 'lucide-react';
import { calculateOrderTotals } from '../../lib/cart-calculations';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    setIsCheckoutOpen,
    clearCart,
  } = useStore();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const totals = calculateOrderTotals(cart, appliedCoupon, 'standard');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponCodeInput.trim()) return;
    const res = applyCoupon(couponCodeInput.trim());
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponCodeInput('');
    }
  };

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-stone-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#faf9f6] dark:bg-[#12100e] h-full shadow-2xl border-l border-stone-200 dark:border-stone-800 flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-stone-900 dark:text-stone-100" />
            <h2 className="font-serif text-lg text-stone-900 dark:text-stone-100 font-normal">
              Your Bag ({cart.reduce((sum, item) => sum + item.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            aria-label="Close bag"
            className="p-1.5 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        <div className="px-5 py-3 bg-stone-100 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-medium text-stone-700 dark:text-stone-300">
              {totals.amountNeededForFreeShipping === 0
                ? 'Free standard shipping unlocked!'
                : `Add RS ${totals.amountNeededForFreeShipping} more for complimentary delivery`}
            </span>
            <span className="font-bold text-stone-900 dark:text-stone-100 font-mono text-[11px]">
              {totals.freeShippingProgress}%
            </span>
          </div>
          <div className="w-full bg-stone-200 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-stone-900 dark:bg-stone-100 h-full transition-all duration-500 rounded-full"
              style={{ width: `${totals.freeShippingProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-stone-100 dark:divide-stone-800/60">
          {cart.length > 0 ? (
            cart.map((item) => {
              const primaryImg =
                item.product.images.find((i) => i.isPrimary)?.url || item.product.images[0]?.url;
              return (
                <div key={item.id} className="pt-4 first:pt-0 flex gap-3.5 items-start">
                  <img
                    src={primaryImg}
                    alt={item.product.name}
                    className="w-18 h-22 object-cover rounded bg-stone-100 dark:bg-stone-800 shrink-0"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between">
                      <h4 className="text-xs font-semibold text-stone-900 dark:text-stone-100 line-clamp-1">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-stone-400 hover:text-rose-500 transition-colors p-1"
                        aria-label={`Remove ${item.product.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-[11px] text-stone-400">
                      {item.variant?.size || item.variant?.color || 'Standard Variant'}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-stone-200 dark:border-stone-700 rounded">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800"
                        >
                          -
                        </button>
                        <span className="px-2.5 text-xs font-medium text-stone-900 dark:text-stone-100">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                        RS {item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-16">
              <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400">
                <ShoppingBag className="w-6 h-6 stroke-1" />
              </div>
              <p className="font-serif text-lg text-stone-800 dark:text-stone-200">Your bag is currently empty.</p>
              <p className="text-xs text-stone-400 max-w-xs">
                Explore the gallery and select objects made to last generations.
              </p>
            </div>
          )}
        </div>

        {/* Footer & Checkout Panel */}
        {cart.length > 0 && (
          <div className="p-5 bg-stone-50 dark:bg-stone-900/40 border-t border-stone-200 dark:border-stone-800 space-y-4">
            {/* Promo Code Input */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded text-xs text-emerald-800 dark:text-emerald-300">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    <span className="font-semibold">{appliedCoupon.code}</span>
                    <span>
                      ({appliedCoupon.discountValue}
                      {appliedCoupon.discountType === 'percentage' ? '%' : ' RS'} off)
                    </span>
                  </div>
                  <button onClick={removeCoupon} className="hover:opacity-70 text-[11px] underline">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                    placeholder="Promo code (e.g. WELCOME10)"
                    className="flex-1 px-3 py-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-xs text-stone-900 dark:text-stone-100 uppercase tracking-wider focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 rounded text-xs font-semibold tracking-wider hover:opacity-90 transition-opacity"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && <p className="text-[11px] text-rose-500 mt-1">{couponError}</p>}
            </div>

            {/* Price Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-stone-600 dark:text-stone-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-stone-900 dark:text-stone-100">RS {totals.subtotal}</span>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Promo Savings</span>
                  <span>-RS {totals.discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{totals.shippingFee === 0 ? 'Complimentary' : `RS ${totals.shippingFee}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (8%)</span>
                <span>RS {totals.tax}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-stone-900 dark:text-stone-100 pt-2 border-t border-stone-200 dark:border-stone-800">
                <span>Estimated Total</span>
                <span>RS {totals.total}</span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              onClick={handleCheckoutClick}
              className="w-full py-3.5 px-4 rounded-full bg-stone-900 text-stone-100 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white text-xs font-semibold uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 group"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
