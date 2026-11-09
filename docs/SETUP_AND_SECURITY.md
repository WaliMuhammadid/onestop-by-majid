# AURA MINIMALIST E-COMMERCE - SETUP, DEPLOYMENT & SECURITY GUIDE

## 1. Full Folder Structure
```
/
├── .env.example                               # Environment variables template
├── docs/
│   └── SETUP_AND_SECURITY.md                 # This setup & audit reference
├── index.html                                 # Clean HTML entrypoint with luxury typography
├── metadata.json                              # Applet metadata & capabilities
├── package.json                               # Dependencies & scripts
├── public/                                    # Static assets, favicon, robots.txt
├── src/
│   ├── App.tsx                               # Main layout, view switching & modal mounts
│   ├── index.css                             # Tailwind styling, custom scrollbars, print styles
│   ├── main.tsx                              # React DOM root entry
│   ├── types/
│   │   └── index.ts                          # Comprehensive TypeScript domain types
│   ├── data/
│   │   └── mockData.ts                       # Seed data: products, categories, brands, orders
│   ├── lib/
│   │   ├── cart-calculations.ts              # Pure unit-tested cart & promo mathematics
│   │   ├── cart-calculations.test.ts         # node:test unit tests
│   │   ├── validation.ts                     # Zod form & entity schemas
│   │   └── security.ts                       # Rate-limiting, brute-force & secret route checks
│   ├── store/
│   │   └── useStore.ts                       # Zustand state store with persistent localStorage
│   └── components/
│       ├── common/
│       │   ├── Header.tsx                    # Minimalist header, search, wishlist & cart counters
│       │   ├── Footer.tsx                    # Minimalist luxury footer (zero admin links)
│       │   ├── SearchModal.tsx               # Debounced live search with keyword highlights
│       │   └── Toast.tsx                     # Non-intrusive notification banner
│       ├── storefront/
│       │   ├── Hero.tsx                      # Aesthetic editorial hero section
│       │   ├── CategoryShowcase.tsx          # Visual category cards
│       │   ├── ProductCard.tsx               # Minimalist card with hover image switch & quick-add
│       │   ├── ProductGrid.tsx               # Responsive catalog grid with column toggle
│       │   ├── FilterSidebar.tsx             # Collapsible filters: price, size, color, rating
│       │   ├── ProductDetailModal.tsx        # High-res gallery, zoom, variants, reviews
│       │   ├── CartDrawer.tsx                # Slide-out cart with free shipping meter & coupon
│       │   ├── WishlistDrawer.tsx            # Slide-out wishlist with 1-click cart migration
│       │   ├── CheckoutModal.tsx             # Multi-step checkout with Zod validation
│       │   ├── OrderSuccessModal.tsx         # Confetti, printable invoice receipt, timeline
│       │   └── UserAccountModal.tsx          # Profile, order history & live order tracking
│       ├── admin/
│       │   ├── AdminLoginModal.tsx           # Secret URL guard with 5-attempt brute force lockout
│       │   ├── AdminDashboard.tsx            # Revenue metrics, sales chart & low stock warnings
│       │   ├── AdminProducts.tsx             # Product CRUD, multi-image manager & variants
│       │   ├── AdminOrders.tsx               # Orders manager, status updater, packing slip
│       │   ├── AdminCategories.tsx           # Categories & brands management
│       │   ├── AdminCoupons.tsx              # Discount code creator & usage tracker
│       │   ├── AdminCustomers.tsx            # Customer spend profiles
│       │   └── AdminAuditLogs.tsx            # Tamper-evident activity logs
│       └── docs/
│           └── SupabaseVaultModal.tsx        # In-app SQL migration & developer secrets vault
└── supabase/
    └── migrations/
        └── 20240101000000_init_ecommerce.sql # Full SQL schema, RLS policies & triggers
```

---

## 2. Environment Variables (.env.example)
```env
# SUPABASE CONFIGURATION
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# APPLICATION & ADMIN SECURITY
NEXT_PUBLIC_SITE_URL=https://your-domain.com
ADMIN_SECRET_PATH=/control-x7k2
ADMIN_DEFAULT_EMAIL=admin@aura-studio.com

# PAYMENT GATEWAYS (Optional production credentials)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## 3. Step-by-Step Setup Guide (Supabase + Vercel)

### Step 1: Initialize Supabase Project
1. Log in to [database.new](https://database.new) and create a new project.
2. Under **Project Settings > API**, copy the `Project URL` and `anon / public` key.
3. Open the **SQL Editor** in the Supabase Dashboard.
4. Copy the entire contents of `supabase/migrations/20240101000000_init_ecommerce.sql` and run it.
5. Create a storage bucket named `product-images` and mark it as **Public Bucket**.

### Step 2: Create the First Admin User
1. In the Supabase Dashboard, navigate to **Authentication > Users** and click **Invite User** or **Add User** (e.g. `admin@aura-studio.com`).
2. Copy the newly created user's `UUID`.
3. In the SQL Editor, execute:
```sql
insert into public.admin_users (id, email, role, two_factor_enabled)
values (
  'PASTE_AUTH_USER_UUID_HERE',
  'admin@aura-studio.com',
  'super_admin',
  true
);
```
4. Verify by running:
```sql
select * from public.admin_users;
```

### Step 3: Deploy to Vercel
1. Push the repository to GitHub.
2. Import the repository in [vercel.com/new](https://vercel.com/new).
3. Set the environment variables from Section 2.
4. Click **Deploy**.

---

## 4. Security Checklist (15-Point Audit)
- [x] **Zero Admin Surface**: No admin links or buttons in navigation, footer, sitemap, or robots.txt.
- [x] **Configurable Secret Route**: Admin panel gated behind secret URL (`/control-x7k2`).
- [x] **Brute-Force Rate Limiting**: Max 5 failed attempts locks out the IP/session for 5 minutes with countdown timer.
- [x] **Generic Auth Errors**: Uses "Invalid email or security credentials" to prevent email enumeration.
- [x] **Segregated Admin Table**: `admin_users` table with strict `is_admin()` PostgreSQL security definer check.
- [x] **Row-Level Security (RLS)**: Enforced on all 14 tables (profiles, products, orders, coupons, etc.).
- [x] **Server-Side Price Validation**: Never trusting client item price in order calculation.
- [x] **Stock Decrement Automation**: Postgres trigger automatically decrements inventory upon order placement.
- [x] **Zod Input Validation**: Strict validation for all customer checkout fields and admin product fields.
- [x] **XSS & SQL Injection Protection**: Parameterized queries via Supabase client and sanitized React JSX.
- [x] **Security Headers**: HSTS, CSP, X-Frame-Options, X-Content-Type-Options configured.
- [x] **Tamper-Evident Audit Logs**: All administrative actions (publish, restock, status change) logged with timestamp & admin ID.
- [x] **2FA TOTP Simulation**: Two-factor authenticator token prompt for high-privilege access.
- [x] **Storage Bucket RLS**: Public read for catalog images, write access restricted exclusively to admin users.
- [x] **Secret Key Protection**: `service_role` key never bundled in client build.
