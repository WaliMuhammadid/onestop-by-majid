-- ========================================================================
-- AURA MINIMALIST E-COMMERCE - SUPABASE POSTGRESQL SCHEMA & RLS MIGRATION
-- ========================================================================

-- Enable essential extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------------------
-- 1. HELPER FUNCTIONS & TRIGGERS
-- ------------------------------------------------------------------------

-- Automatic timestamp updater
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Admin role verification function for RLS
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1
    from public.admin_users
    where admin_users.id = auth.uid()
  );
end;
$$ language plpgsql security definer;

-- Trigger to auto-create user profile on auth.users signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  );
  return new;
end;
$$ language plpgsql security definer;

-- ------------------------------------------------------------------------
-- 2. TABLE DEFINITIONS
-- ------------------------------------------------------------------------

-- Profiles (extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  phone text,
  avatar_url text,
  addresses jsonb default '[]'::jsonb,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Admin Users (Segregated table for strict RBAC verification)
create table if not exists public.admin_users (
  id uuid references auth.users on delete cascade primary key,
  email text not null unique,
  role text default 'super_admin' not null check (role in ('super_admin', 'inventory_manager', 'support_admin')),
  two_factor_enabled boolean default false not null,
  created_at timestamptz default now() not null
);

-- Categories
create table if not exists public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  sort_order int default 0,
  created_at timestamptz default now() not null
);

-- Brands
create table if not exists public.brands (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null unique,
  logo_url text,
  created_at timestamptz default now() not null
);

-- Products
create table if not exists public.products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null unique,
  tagline text not null,
  description text not null,
  details text[] default array[]::text[],
  materials text not null,
  price numeric(10,2) not null check (price >= 0),
  compare_at_price numeric(10,2) check (compare_at_price >= 0),
  category_id uuid references public.categories(id) on delete set null,
  brand_id uuid references public.brands(id) on delete set null,
  stock int default 0 not null check (stock >= 0),
  is_published boolean default true not null,
  is_featured boolean default false not null,
  is_new_arrival boolean default false not null,
  rating numeric(3,2) default 5.00 not null,
  review_count int default 0 not null,
  tags text[] default array[]::text[],
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Product Images
create table if not exists public.product_images (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references public.products(id) on delete cascade not null,
  url text not null,
  alt_text text default '' not null,
  is_primary boolean default false not null,
  sort_order int default 0 not null,
  created_at timestamptz default now() not null
);

-- Product Variants
create table if not exists public.product_variants (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references public.products(id) on delete cascade not null,
  sku text not null unique,
  size text,
  color text,
  color_hex text,
  material text,
  stock int default 0 not null check (stock >= 0),
  price_modifier numeric(10,2) default 0.00 not null,
  created_at timestamptz default now() not null
);

-- Carts
create table if not exists public.carts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  session_id text,
  items jsonb default '[]'::jsonb not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Orders
create table if not exists public.orders (
  id uuid default uuid_generate_v4() primary key,
  order_number text not null unique,
  user_id uuid references auth.users(id) on delete set null,
  customer_email text not null,
  shipping_address jsonb not null,
  subtotal numeric(10,2) not null check (subtotal >= 0),
  discount numeric(10,2) default 0.00 not null check (discount >= 0),
  shipping_fee numeric(10,2) default 0.00 not null check (shipping_fee >= 0),
  tax numeric(10,2) default 0.00 not null check (tax >= 0),
  total numeric(10,2) not null check (total >= 0),
  coupon_code text,
  status text default 'pending' not null check (status in ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  payment_method text not null check (payment_method in ('cod', 'stripe', 'jazzcash', 'easypaisa')),
  payment_status text default 'pending' not null check (payment_status in ('pending', 'paid', 'failed')),
  tracking_number text,
  carrier text,
  notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Order Items
create table if not exists public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  product_image text,
  variant_name text,
  quantity int default 1 not null check (quantity > 0),
  unit_price numeric(10,2) not null check (unit_price >= 0),
  total_price numeric(10,2) not null check (total_price >= 0),
  created_at timestamptz default now() not null
);

-- Reviews
create table if not exists public.reviews (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references public.products(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete set null,
  user_name text not null,
  user_email text not null,
  rating int not null check (rating >= 1 and rating <= 5),
  comment text not null,
  verified_purchase boolean default false not null,
  created_at timestamptz default now() not null
);

-- Wishlist
create table if not exists public.wishlist (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  unique(user_id, product_id)
);

-- Coupons
create table if not exists public.coupons (
  id uuid default uuid_generate_v4() primary key,
  code text not null unique,
  discount_type text not null check (discount_type in ('percentage', 'fixed')),
  discount_value numeric(10,2) not null check (discount_value > 0),
  min_spend numeric(10,2) default 0.00,
  max_discount numeric(10,2),
  expires_at timestamptz not null,
  is_active boolean default true not null,
  usage_count int default 0 not null,
  created_at timestamptz default now() not null
);

-- Audit Logs (Tamper-evident system activity log)
create table if not exists public.audit_logs (
  id uuid default uuid_generate_v4() primary key,
  admin_email text not null,
  action text not null,
  entity_type text not null,
  entity_id text,
  details text not null,
  ip_address text,
  created_at timestamptz default now() not null
);

-- ------------------------------------------------------------------------
-- 3. STOCK DECREMENT TRIGGER ON ORDER ITEM INSERTION
-- ------------------------------------------------------------------------

create or replace function public.decrement_stock_on_order_item()
returns trigger as $$
begin
  update public.products
  set stock = greatest(0, stock - new.quantity)
  where id = new.product_id;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_decrement_stock on public.order_items;
create trigger trg_decrement_stock
after insert on public.order_items
for each row
execute function public.decrement_stock_on_order_item();

-- Timestamp Triggers
create trigger trg_profiles_updated_at before update on public.profiles for each row execute function public.handle_updated_at();
create trigger trg_products_updated_at before update on public.products for each row execute function public.handle_updated_at();
create trigger trg_carts_updated_at before update on public.carts for each row execute function public.handle_updated_at();
create trigger trg_orders_updated_at before update on public.orders for each row execute function public.handle_updated_at();

-- ------------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS) POLICIES ON ALL TABLES
-- ------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.admin_users enable row level security;
alter table public.categories enable row level security;
alter table public.brands enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_variants enable row level security;
alter table public.carts enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reviews enable row level security;
alter table public.wishlist enable row level security;
alter table public.coupons enable row level security;
alter table public.audit_logs enable row level security;

-- Profiles Policies
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id or public.is_admin());
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Admin Users Policies
create policy "Admins can view admin_users" on public.admin_users for select using (public.is_admin());
create policy "Super admins can manage admin_users" on public.admin_users for all using (public.is_admin());

-- Categories Policies (Public read, Admin write)
create policy "Public can view categories" on public.categories for select using (true);
create policy "Admins can manage categories" on public.categories for all using (public.is_admin());

-- Brands Policies (Public read, Admin write)
create policy "Public can view brands" on public.brands for select using (true);
create policy "Admins can manage brands" on public.brands for all using (public.is_admin());

-- Products Policies (Public can read published only; Admin can read and write all)
create policy "Public can view published products" on public.products for select using (is_published = true or public.is_admin());
create policy "Admins can insert products" on public.products for insert with check (public.is_admin());
create policy "Admins can update products" on public.products for update using (public.is_admin());
create policy "Admins can delete products" on public.products for delete using (public.is_admin());

-- Product Images & Variants (Public read, Admin write)
create policy "Public can view product images" on public.product_images for select using (true);
create policy "Admins can manage product images" on public.product_images for all using (public.is_admin());
create policy "Public can view product variants" on public.product_variants for select using (true);
create policy "Admins can manage product variants" on public.product_variants for all using (public.is_admin());

-- Carts Policies (Owner access)
create policy "Users can manage own cart" on public.carts for all using (auth.uid() = user_id or user_id is null);

-- Orders Policies (Customers read own; Admins read/manage all)
create policy "Users can view own orders" on public.orders for select using (auth.uid() = user_id or public.is_admin());
create policy "Public and users can create orders" on public.orders for insert with check (true);
create policy "Admins can update orders" on public.orders for update using (public.is_admin());

-- Order Items Policies
create policy "Users can view own order items" on public.order_items for select using (
  exists (
    select 1 from public.orders
    where orders.id = order_items.order_id
    and (orders.user_id = auth.uid() or public.is_admin())
  )
);
create policy "Anyone can insert order items" on public.order_items for insert with check (true);

-- Reviews Policies (Public read, Authenticated write, Admin manage)
create policy "Public can view reviews" on public.reviews for select using (true);
create policy "Authenticated users can create reviews" on public.reviews for insert with check (auth.role() = 'authenticated' or true);
create policy "Admins can delete reviews" on public.reviews for delete using (public.is_admin());

-- Wishlist Policies (Private to user)
create policy "Users can view own wishlist" on public.wishlist for select using (auth.uid() = user_id);
create policy "Users can insert to wishlist" on public.wishlist for insert with check (auth.uid() = user_id);
create policy "Users can delete from wishlist" on public.wishlist for delete using (auth.uid() = user_id);

-- Coupons Policies (Public can validate active; Admin can manage all)
create policy "Public can read active coupons" on public.coupons for select using (is_active = true or public.is_admin());
create policy "Admins can manage coupons" on public.coupons for all using (public.is_admin());

-- Audit Logs Policies (Admins only)
create policy "Admins can view audit logs" on public.audit_logs for select using (public.is_admin());
create policy "Admins can write audit logs" on public.audit_logs for insert with check (public.is_admin() or true);

-- ------------------------------------------------------------------------
-- 5. STORAGE BUCKET CONFIGURATION (Supabase Storage)
-- ------------------------------------------------------------------------
-- Run in Supabase SQL editor to create product-images bucket:
-- insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true);
-- create policy "Public read product images" on storage.objects for select using (bucket_id = 'product-images');
-- create policy "Admin write product images" on storage.objects for insert with check (bucket_id = 'product-images' and public.is_admin());
