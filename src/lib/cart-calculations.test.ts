import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateSubtotal,
  calculateDiscount,
  calculateShipping,
  calculateTax,
  calculateOrderTotals,
  isCouponValid,
  FREE_SHIPPING_THRESHOLD,
} from './cart-calculations';
import { CartItem, Coupon, Product } from '../types';

const mockProduct: Product = {
  id: 'prod-1',
  name: 'Botanical Elixir',
  slug: 'botanical-elixir',
  tagline: 'Cold-pressed botanical extract',
  description: 'Pure aesthetic craft',
  details: ['Dermatologist tested', 'Recyclable amber glass'],
  materials: 'Organic plant squalane',
  price: 60,
  categoryId: 'cat-beauty-healthcare',
  categoryName: 'Beauty & Healthcare',
  brandId: 'brand-1',
  brandName: 'Botanica Sanctuary',
  images: [{ id: 'img-1', url: 'https://example.com/img.jpg', altText: 'Elixir', isPrimary: true }],
  variants: [],
  stock: 10,
  isPublished: true,
  isFeatured: true,
  isNewArrival: false,
  rating: 4.8,
  reviewCount: 12,
  tags: ['ceramic'],
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
};

const mockItems: CartItem[] = [
  {
    id: 'item-1',
    productId: 'prod-1',
    product: mockProduct,
    quantity: 2,
    price: 60,
  },
  {
    id: 'item-2',
    productId: 'prod-2',
    product: { ...mockProduct, id: 'prod-2', price: 40 },
    quantity: 1,
    price: 40,
  },
];

const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString();
const pastDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString();

const mockPercentCoupon: Coupon = {
  id: 'c-1',
  code: 'WELCOME10',
  discountType: 'percentage',
  discountValue: 10,
  minSpend: 50,
  expiresAt: futureDate,
  isActive: true,
  usageCount: 5,
};

const mockFixedCoupon: Coupon = {
  id: 'c-2',
  code: 'ONESTOP25',
  discountType: 'fixed',
  discountValue: 25,
  minSpend: 100,
  expiresAt: futureDate,
  isActive: true,
  usageCount: 1,
};

test('calculateSubtotal accurately sums item quantities and prices', () => {
  // 2 * 60 + 1 * 40 = 160
  const subtotal = calculateSubtotal(mockItems);
  assert.equal(subtotal, 160);
});

test('calculateDiscount applies percentage discount correctly with valid minimum spend', () => {
  // 10% of 160 = 16
  const discount = calculateDiscount(160, mockPercentCoupon);
  assert.equal(discount, 16);
});

test('calculateDiscount enforces minimum spend threshold', () => {
  // Subtotal 40 is below minSpend 50
  const discount = calculateDiscount(40, mockPercentCoupon);
  assert.equal(discount, 0);
});

test('isCouponValid rejects expired or inactive coupons', () => {
  const expiredCoupon: Coupon = { ...mockPercentCoupon, expiresAt: pastDate };
  assert.equal(isCouponValid(expiredCoupon, 100).valid, false);

  const inactiveCoupon: Coupon = { ...mockPercentCoupon, isActive: false };
  assert.equal(isCouponValid(inactiveCoupon, 100).valid, false);
});

test('calculateShipping gives free standard shipping above threshold and charges below', () => {
  // Free threshold is 150
  assert.equal(calculateShipping(160, 'standard'), 0);
  assert.equal(calculateShipping(149, 'standard'), 12);
  // Express shipping is flat fee
  assert.equal(calculateShipping(200, 'express'), 25);
});

test('calculateOrderTotals outputs balanced, mathematically exact figures', () => {
  // Subtotal = 160, Discount = 16 (10%), SubtotalAfterDiscount = 144
  // 144 < 150, so Standard shipping = 12
  // Tax on 144 at 8% = 11.52
  // Total = 144 + 12 + 11.52 = 167.52
  const totals = calculateOrderTotals(mockItems, mockPercentCoupon, 'standard', 0.08);
  assert.equal(totals.subtotal, 160);
  assert.equal(totals.discount, 16);
  assert.equal(totals.subtotalAfterDiscount, 144);
  assert.equal(totals.shippingFee, 12);
  assert.equal(totals.tax, 11.52);
  assert.equal(totals.total, 167.52);
  assert.equal(totals.amountNeededForFreeShipping, 6);
});
