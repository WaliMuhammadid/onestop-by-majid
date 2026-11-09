import { CartItem, Coupon } from '../types';

export const FREE_SHIPPING_THRESHOLD = 150;
export const STANDARD_SHIPPING_FEE = 12;
export const EXPRESS_SHIPPING_FEE = 25;
export const DEFAULT_TAX_RATE = 0.08; // 8%

export function calculateSubtotal(items: CartItem[]): number {
  const sum = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  return Math.round(sum * 100) / 100;
}

export function isCouponValid(coupon: Coupon | null, subtotal: number): { valid: boolean; reason?: string } {
  if (!coupon) {
    return { valid: false, reason: 'No coupon provided' };
  }
  if (!coupon.isActive) {
    return { valid: false, reason: 'This coupon code is inactive' };
  }
  const now = new Date();
  const expiry = new Date(coupon.expiresAt);
  if (expiry.getTime() < now.getTime()) {
    return { valid: false, reason: 'This coupon has expired' };
  }
  if (coupon.minSpend && subtotal < coupon.minSpend) {
    return { valid: false, reason: `Minimum spend of RS ${coupon.minSpend} required for this coupon` };
  }
  return { valid: true };
}

export function calculateDiscount(subtotal: number, coupon: Coupon | null): number {
  if (!coupon || !isCouponValid(coupon, subtotal).valid) {
    return 0;
  }

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = (subtotal * coupon.discountValue) / 100;
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  } else if (coupon.discountType === 'fixed') {
    discount = Math.min(coupon.discountValue, subtotal);
  }

  return Math.round(discount * 100) / 100;
}

export function calculateShipping(subtotalAfterDiscount: number, method: 'standard' | 'express'): number {
  if (method === 'express') {
    return EXPRESS_SHIPPING_FEE;
  }
  if (subtotalAfterDiscount >= FREE_SHIPPING_THRESHOLD) {
    return 0;
  }
  return STANDARD_SHIPPING_FEE;
}

export function calculateTax(taxableAmount: number, taxRate: number = DEFAULT_TAX_RATE): number {
  return Math.round(taxableAmount * taxRate * 100) / 100;
}

export function calculateOrderTotals(
  items: CartItem[],
  coupon: Coupon | null,
  shippingMethod: 'standard' | 'express' = 'standard',
  taxRate: number = DEFAULT_TAX_RATE
): {
  subtotal: number;
  discount: number;
  subtotalAfterDiscount: number;
  shippingFee: number;
  tax: number;
  total: number;
  freeShippingProgress: number; // percentage 0 - 100
  amountNeededForFreeShipping: number;
} {
  const subtotal = calculateSubtotal(items);
  const discount = calculateDiscount(subtotal, coupon);
  const subtotalAfterDiscount = Math.max(0, Math.round((subtotal - discount) * 100) / 100);
  const shippingFee = calculateShipping(subtotalAfterDiscount, shippingMethod);
  const tax = calculateTax(subtotalAfterDiscount, taxRate);
  const total = Math.round((subtotalAfterDiscount + shippingFee + tax) * 100) / 100;

  const freeShippingProgress = Math.min(100, Math.round((subtotalAfterDiscount / FREE_SHIPPING_THRESHOLD) * 100));
  const amountNeededForFreeShipping = Math.max(0, Math.round((FREE_SHIPPING_THRESHOLD - subtotalAfterDiscount) * 100) / 100);

  return {
    subtotal,
    discount,
    subtotalAfterDiscount,
    shippingFee,
    tax,
    total,
    freeShippingProgress,
    amountNeededForFreeShipping,
  };
}
