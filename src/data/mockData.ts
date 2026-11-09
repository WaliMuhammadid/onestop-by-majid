import { Brand, Category, Coupon, Order, Product, ProductReview, UserProfile } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'e83b9405-7110-457e-b864-3569c033619d',
    name: 'Beauty & Healthcare',
    slug: 'beauty-healthcare',
    description: 'Botanical elixirs, active bakuchiol serums, and restorative personal care.',
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    productCount: 0,
  },
  {
    id: '43345c12-c942-4773-94eb-75cca034051e',
    name: 'Kids Accessories',
    slug: 'kids-accessories',
    description: 'Non-toxic wooden keepsakes, organic muslin wraps, and mindful play.',
    imageUrl: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
    productCount: 0,
  },
  {
    id: 'aafbec09-0a91-4489-b379-37017ff57b13',
    name: 'Fashion & Apparel',
    slug: 'fashion-apparel',
    description: 'Pure organic cotton, architectural tailoring, and un-dyed merino wool.',
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    productCount: 0,
  },
  {
    id: 'e7e5ed53-3309-4b85-9ea0-cd4c3b3f1066',
    name: 'Travel & Outdoor',
    slug: 'travel-outdoor',
    description: 'Weatherproof technical canvas, modular luggage, and expedition essentials.',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    productCount: 0,
  },
  {
    id: '3fc4730e-32d9-42e1-a306-e3fb5d74052c',
    name: 'Events & Gifting',
    slug: 'events-gifting',
    description: 'Curated ceremonial gift boxes, brass tokens, and heirloom celebration suites.',
    imageUrl: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=800&q=80',
    productCount: 0,
  },
  {
    id: 'bc52518e-fc14-43a0-aa23-5004540ce03c',
    name: 'Pets & Animals',
    slug: 'pets-animals',
    description: 'Ergonomic slow feeders, organic felted wool beds, and bridle leather leashes.',
    imageUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
    productCount: 0,
  },
  {
    id: '4d91edf8-4a6c-438f-9486-853faabbf2f0',
    name: 'Books & Stationery',
    slug: 'books-stationery',
    description: 'Archival Smyth-sewn journals, brass fountain pens, and design monographs.',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    productCount: 0,
  },
  {
    id: '49ddf122-71a5-4df7-9b6e-b1237df87658',
    name: 'Automotive',
    slug: 'automotive',
    description: 'Machined cockpit hardware, full-grain key shackles, and cedar diffusers.',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    productCount: 0,
  },
  {
    id: '2dfee7e1-caa9-4937-861f-b684ec430021',
    name: 'Tools & DIY',
    slug: 'tools-diy',
    description: 'Japanese hand-forged steel shears, brass rulers, and bench craft gear.',
    imageUrl: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=800&q=80',
    productCount: 0,
  },
  {
    id: '80db5ad0-2388-41a0-9f1d-38d016938471',
    name: 'Islamic Essentials',
    slug: 'islamic-essentials',
    description: 'Orthopaedic padded wool prayer mats, carved olivewood misbahas, and pure oud.',
    imageUrl: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=800&q=80',
    productCount: 0,
  },
  {
    id: 'dee42cde-7fda-4fb1-80d9-779e6c03fcbd',
    name: 'Home & Living',
    slug: 'home-living',
    description: 'Washed French flax linen, cast brass lighting, and ritual incense burners.',
    imageUrl: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80',
    productCount: 0,
  },
];

export const INITIAL_BRANDS: Brand[] = [
  { id: 'b5889802-f83d-4429-b5a3-4e9c5f4787b0', name: 'Onestop by Majid', slug: 'onestop-by-majid' },
];

export const INITIAL_PRODUCTS: Product[] = [];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'coup-welcome10',
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 50,
    isActive: true,
    usageLimit: 500,
    usageCount: 42,
  },
  {
    id: 'coup-atelier25',
    code: 'ATELIER25',
    discountType: 'fixed',
    discountValue: 25,
    minOrderValue: 200,
    isActive: true,
    usageLimit: 100,
    usageCount: 19,
  },
];

export const INITIAL_REVIEWS: ProductReview[] = [];
export const INITIAL_ORDERS: Order[] = [];

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'usr-customer-01',
  email: 'client@atelier-standard.com',
  fullName: 'Evelyn Vane',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  phone: '+1 (555) 019-2834',
  address: {
    street: '742 Evergreen Terrace',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94102',
    country: 'United States',
  },
};
