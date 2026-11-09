export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  productCount?: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  size?: string;
  color?: string;
  colorHex?: string;
  material?: string;
  stock: number;
  priceModifier?: number; // e.g. +10 RS for large
}

export interface ProductImage {
  id: string;
  url: string;
  altText: string;
  isPrimary: boolean;
}

export interface ProductReview {
  id: string;
  productId: string;
  userName: string;
  userEmail: string;
  rating: number; // 1 to 5
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  details: string[];
  materials: string;
  price: number;
  compareAtPrice?: number;
  categoryId: string;
  categoryName: string;
  brandId: string;
  brandName: string;
  images: ProductImage[];
  variants: ProductVariant[];
  stock: number;
  isPublished: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string; // unique cart line item id: `${productId}-${variantId || 'default'}`
  productId: string;
  product: Product;
  variantId?: string;
  variant?: ProductVariant;
  quantity: number;
  price: number;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSpend?: number;
  maxDiscount?: number;
  expiresAt: string;
  isActive: boolean;
  usageCount: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export type PaymentMethod = 'cod' | 'stripe' | 'jazzcash' | 'easypaisa';

export interface Order {
  id: string;
  orderNumber: string;
  customerEmail: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  couponCode?: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'pending' | 'failed';
  trackingNumber?: string;
  carrier?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'super_admin' | 'inventory_manager' | 'support_admin';
  lastLogin?: string;
  twoFactorEnabled: boolean;
}

export interface AuditLog {
  id: string;
  adminEmail: string;
  action: string;
  entityType: 'product' | 'order' | 'category' | 'coupon' | 'auth';
  entityId?: string;
  details: string;
  ipAddress: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  addresses: ShippingAddress[];
  defaultAddressIndex: number;
  createdAt: string;
}
