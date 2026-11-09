import { z } from 'zod';

export const shippingAddressSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters').max(80),
  email: z.string().trim().email('Please enter a valid email address'),
  phone: z.string().trim().min(7, 'Please provide a valid phone number (at least 7 digits)'),
  street: z.string().trim().min(3, 'Delivery address is required'),
  apartment: z.string().trim().optional().or(z.literal('')),
  city: z.string().trim().min(2, 'City name is required'),
  state: z.string().trim().optional().or(z.literal('')),
  postalCode: z.string().trim().optional().or(z.literal('')),
  country: z.string().trim().min(2, 'Country is required').default('Pakistan'),
});

export const checkoutFormSchema = z.object({
  shipping: shippingAddressSchema,
  shippingMethod: z.enum(['standard', 'express']),
  paymentMethod: z.enum(['cod', 'stripe', 'jazzcash', 'easypaisa']),
  notes: z.string().max(300).optional(),
});

export const productFormSchema = z.object({
  name: z.string().trim().min(2, 'Product name is required').max(120),
  tagline: z.string().trim().min(3, 'Tagline is required').max(180),
  description: z.string().trim().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be greater than RS 0'),
  compareAtPrice: z.number().positive().optional().nullable(),
  categoryId: z.string().min(1, 'Category is required'),
  brandId: z.string().min(1, 'Brand is required'),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  materials: z.string().trim().min(2, 'Materials description is required'),
  isPublished: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isNewArrival: z.boolean().default(true),
});

export const couponFormSchema = z.object({
  code: z
    .string()
    .trim()
    .min(3, 'Code must be at least 3 characters')
    .max(20)
    .regex(/^[A-Z0-9_-]+$/, 'Uppercase letters, numbers, hyphens only'),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.number().positive('Discount value must be greater than 0'),
  minSpend: z.number().min(0).optional(),
  maxDiscount: z.number().positive().optional(),
  expiresAt: z.string().min(10, 'Expiry date is required'),
  isActive: z.boolean().default(true),
});

export const reviewFormSchema = z.object({
  userName: z.string().trim().min(2, 'Your name is required').max(50),
  userEmail: z.string().trim().email('Valid email address is required'),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(5, 'Review comment must be at least 5 characters').max(600),
});
