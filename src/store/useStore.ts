import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  AdminUser,
  AuditLog,
  Brand,
  CartItem,
  Category,
  Coupon,
  Order,
  OrderStatus,
  Product,
  ProductReview,
  ProductVariant,
  UserProfile,
} from '../types';
import {
  INITIAL_BRANDS,
  INITIAL_CATEGORIES,
  INITIAL_COUPONS,
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
  INITIAL_REVIEWS,
  INITIAL_USER_PROFILE,
} from '../data/mockData';
import { isCouponValid } from '../lib/cart-calculations';
import {
  fetchSupabaseProducts,
  fetchSupabaseCategories,
  fetchSupabaseBrands,
  createSupabaseProduct,
  deleteSupabaseProduct,
} from '../lib/supabaseService';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface StoreState {
  // Products & Taxonomy
  products: Product[];
  categories: Category[];
  brands: Brand[];
  coupons: Coupon[];
  reviews: ProductReview[];
  orders: Order[];
  auditLogs: AuditLog[];

  // Customer State
  cart: CartItem[];
  wishlist: string[]; // product IDs
  appliedCoupon: Coupon | null;
  currentUser: UserProfile | null;

  // Admin State
  isAdminAuthenticated: boolean;
  currentAdmin: AdminUser | null;
  adminActiveTab: 'dashboard' | 'products' | 'categories' | 'orders' | 'customers' | 'coupons' | 'audit';

  // Navigation & UI Modals
  currentView: 'home' | 'shop' | 'about';
  selectedProductId: string | null;
  isCartOpen: boolean;
  isWishlistOpen: boolean;
  isSearchOpen: boolean;
  isCheckoutOpen: boolean;
  isOrderSuccessOpen: boolean;
  isAdminLoginOpen: boolean;
  isAdminDashboardOpen: boolean;
  isSupabaseVaultOpen: boolean;
  currentOrderReceipt: Order | null;
  toasts: ToastMessage[];
  isDarkMode: boolean;

  // Filter State for Catalog
  searchQuery: string;
  selectedCategory: string | null;
  selectedBrand: string | null;
  priceRange: [number, number];
  selectedSizes: string[];
  selectedColors: string[];
  minRating: number;
  inStockOnly: boolean;
  sortBy: 'newest' | 'price-asc' | 'price-desc' | 'popularity' | 'rating';

  // Actions
  setDarkMode: (dark: boolean) => void;
  toggleDarkMode: () => void;
  setCurrentView: (view: 'home' | 'shop' | 'about') => void;
  setSelectedProductId: (id: string | null) => void;
  setIsCartOpen: (open: boolean) => void;
  setIsWishlistOpen: (open: boolean) => void;
  setIsSearchOpen: (open: boolean) => void;
  setIsCheckoutOpen: (open: boolean) => void;
  setIsOrderSuccessOpen: (open: boolean) => void;
  setIsAdminLoginOpen: (open: boolean) => void;
  setIsAdminDashboardOpen: (open: boolean) => void;
  setIsSupabaseVaultOpen: (open: boolean) => void;
  setAdminActiveTab: (tab: StoreState['adminActiveTab']) => void;
  setOrderReceipt: (order: Order | null) => void;

  // Filter Actions
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (catId: string | null) => void;
  setSelectedBrand: (brandId: string | null) => void;
  setPriceRange: (range: [number, number]) => void;
  toggleSizeFilter: (size: string) => void;
  toggleColorFilter: (color: string) => void;
  setMinRating: (rating: number) => void;
  setInStockOnly: (inStock: boolean) => void;
  setSortBy: (sort: StoreState['sortBy']) => void;
  resetFilters: () => void;

  // Cart Actions
  addToCart: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Wishlist Actions
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Order Actions
  createOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string) => void;

  // Review Actions
  addReview: (review: Omit<ProductReview, 'id' | 'createdAt'>) => void;

  // Admin Product Actions
  syncFromSupabase: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'reviewCount'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductPublish: (id: string) => void;
  restockProduct: (id: string, amount: number) => void;

  // Admin Taxonomy Actions
  addCategory: (category: Omit<Category, 'id'>) => void;
  deleteCategory: (id: string) => void;
  addBrand: (brand: Omit<Brand, 'id'>) => void;
  deleteBrand: (id: string) => void;

  // Admin Coupon Actions
  addCoupon: (coupon: Omit<Coupon, 'id' | 'usageCount'>) => void;
  toggleCouponActive: (id: string) => void;
  deleteCoupon: (id: string) => void;

  // Admin Auth Actions
  loginAdmin: (admin: AdminUser) => void;
  logoutAdmin: () => void;
  addAuditLog: (action: string, entityType: AuditLog['entityType'], details: string, entityId?: string) => void;

  // User Actions
  updateUserProfile: (profile: Partial<UserProfile>) => void;

  // Toast System
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

export const useStore = create<StoreState>()((set, get) => ({
      products: INITIAL_PRODUCTS,
      categories: INITIAL_CATEGORIES,
      brands: INITIAL_BRANDS,
      coupons: INITIAL_COUPONS,
      reviews: INITIAL_REVIEWS,
      orders: INITIAL_ORDERS,
      auditLogs: [
        {
          id: 'log-seed-1',
          adminEmail: 'admin@onestopbymajid.com',
          action: 'SYSTEM_BOOTSTRAP',
          entityType: 'auth',
          details: 'Initialized secure database instance for Onestop by Majid.',
          ipAddress: '127.0.0.1',
          createdAt: new Date().toISOString(),
        },
      ],

      cart: [],
      wishlist: [],
      appliedCoupon: null,
      currentUser: null,

      isAdminAuthenticated: false,
      currentAdmin: null,
      adminActiveTab: 'dashboard',

      currentView: 'home',
      selectedProductId: null,
      isCartOpen: false,
      isWishlistOpen: false,
      isSearchOpen: false,
      isCheckoutOpen: false,
      isOrderSuccessOpen: false,
      isAdminLoginOpen: false,
      isAdminDashboardOpen: false,
      isSupabaseVaultOpen: false,
      currentOrderReceipt: null,
      toasts: [],
      isDarkMode: false,

      searchQuery: '',
      selectedCategory: null,
      selectedBrand: null,
      priceRange: [0, 600],
      selectedSizes: [],
      selectedColors: [],
      minRating: 0,
      inStockOnly: false,
      sortBy: 'newest',

      // Actions
      setDarkMode: (dark) => {
        set({ isDarkMode: dark });
        if (dark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
      toggleDarkMode: () => {
        const next = !get().isDarkMode;
        get().setDarkMode(next);
      },

      setCurrentView: (view) => set({ currentView: view }),
      setSelectedProductId: (id) => set({ selectedProductId: id }),
      setIsCartOpen: (open) => set({ isCartOpen: open }),
      setIsWishlistOpen: (open) => set({ isWishlistOpen: open }),
      setIsSearchOpen: (open) => set({ isSearchOpen: open }),
      setIsCheckoutOpen: (open) => set({ isCheckoutOpen: open }),
      setIsOrderSuccessOpen: (open) => set({ isOrderSuccessOpen: open }),
      setIsAdminLoginOpen: (open) => set({ isAdminLoginOpen: open }),
      setIsAdminDashboardOpen: (open) => set({ isAdminDashboardOpen: open }),
      setIsSupabaseVaultOpen: (open) => set({ isSupabaseVaultOpen: open }),
      setAdminActiveTab: (tab) => set({ adminActiveTab: tab }),
      setOrderReceipt: (order) => set({ currentOrderReceipt: order }),

      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedCategory: (catId) => set({ selectedCategory: catId }),
      setSelectedBrand: (brandId) => set({ selectedBrand: brandId }),
      setPriceRange: (range) => set({ priceRange: range }),
      toggleSizeFilter: (size) => {
        const current = get().selectedSizes;
        const next = current.includes(size) ? current.filter((s) => s !== size) : [...current, size];
        set({ selectedSizes: next });
      },
      toggleColorFilter: (color) => {
        const current = get().selectedColors;
        const next = current.includes(color) ? current.filter((c) => c !== color) : [...current, color];
        set({ selectedColors: next });
      },
      setMinRating: (rating) => set({ minRating: rating }),
      setInStockOnly: (inStock) => set({ inStockOnly: inStock }),
      setSortBy: (sort) => set({ sortBy: sort }),
      resetFilters: () =>
        set({
          searchQuery: '',
          selectedCategory: null,
          selectedBrand: null,
          priceRange: [0, 600],
          selectedSizes: [],
          selectedColors: [],
          minRating: 0,
          inStockOnly: false,
          sortBy: 'newest',
        }),

      addToCart: (product, variant, quantity = 1) => {
        const cartItemId = `${product.id}-${variant ? variant.id : 'default'}`;
        const existingIndex = get().cart.findIndex((item) => item.id === cartItemId);
        const itemPrice = product.price + (variant?.priceModifier || 0);

        let updatedCart: CartItem[];
        if (existingIndex > -1) {
          updatedCart = get().cart.map((item, idx) =>
            idx === existingIndex ? { ...item, quantity: item.quantity + quantity } : item
          );
        } else {
          const newItem: CartItem = {
            id: cartItemId,
            productId: product.id,
            product,
            variantId: variant?.id,
            variant,
            quantity,
            price: itemPrice,
          };
          updatedCart = [...get().cart, newItem];
        }

        set({ cart: updatedCart, isCartOpen: true });
        get().addToast(`Added "${product.name}" to your cart.`, 'success');
      },

      updateCartQuantity: (cartItemId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(cartItemId);
          return;
        }
        const updated = get().cart.map((item) => (item.id === cartItemId ? { ...item, quantity } : item));
        set({ cart: updated });
      },

      removeFromCart: (cartItemId) => {
        const item = get().cart.find((i) => i.id === cartItemId);
        const updated = get().cart.filter((i) => i.id !== cartItemId);
        set({ cart: updated });
        if (item) {
          get().addToast(`Removed "${item.product.name}" from cart.`, 'info');
        }
      },

      clearCart: () => set({ cart: [], appliedCoupon: null }),

      applyCoupon: (code) => {
        const cleanCode = code.trim().toUpperCase();
        const found = get().coupons.find((c) => c.code.toUpperCase() === cleanCode);
        if (!found) {
          return { success: false, message: 'Invalid promo code.' };
        }
        const subtotal = get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const validity = isCouponValid(found, subtotal);
        if (!validity.valid) {
          return { success: false, message: validity.reason || 'Coupon is not applicable.' };
        }
        set({ appliedCoupon: found });
        get().addToast(`Promo code "${found.code}" applied!`, 'success');
        return { success: true, message: 'Coupon applied successfully.' };
      },

      removeCoupon: () => {
        set({ appliedCoupon: null });
        get().addToast('Coupon removed.', 'info');
      },

      toggleWishlist: (productId) => {
        const exists = get().wishlist.includes(productId);
        const next = exists ? get().wishlist.filter((id) => id !== productId) : [...get().wishlist, productId];
        set({ wishlist: next });
        const prod = get().products.find((p) => p.id === productId);
        if (exists) {
          get().addToast(`Removed "${prod?.name || 'Item'}" from wishlist.`, 'info');
        } else {
          get().addToast(`Saved "${prod?.name || 'Item'}" to your wishlist.`, 'success');
        }
      },

      isInWishlist: (productId) => get().wishlist.includes(productId),

      createOrder: (orderData) => {
        const orderNum = `OSM-${Math.floor(10000 + Math.random() * 90000)}`;
        const now = new Date().toISOString();
        const newOrder: Order = {
          ...orderData,
          id: `ord-${Date.now()}`,
          orderNumber: orderNum,
          createdAt: now,
          updatedAt: now,
        };

        // Decrement product stock in local store
        const updatedProducts = get().products.map((p) => {
          const orderedItem = orderData.items.find((item) => item.productId === p.id);
          if (orderedItem) {
            const nextStock = Math.max(0, p.stock - orderedItem.quantity);
            return { ...p, stock: nextStock };
          }
          return p;
        });

        // Increment coupon usage if used
        let updatedCoupons = get().coupons;
        if (orderData.couponCode) {
          updatedCoupons = get().coupons.map((c) =>
            c.code === orderData.couponCode ? { ...c, usageCount: c.usageCount + 1 } : c
          );
        }

        set({
          orders: [newOrder, ...get().orders],
          products: updatedProducts,
          coupons: updatedCoupons,
          cart: [],
          appliedCoupon: null,
          currentOrderReceipt: newOrder,
          isCheckoutOpen: false,
          isOrderSuccessOpen: true,
        });

        get().addToast(`Order ${orderNum} confirmed!`, 'success');
        return newOrder;
      },

      updateOrderStatus: (orderId, status, trackingNumber) => {
        const updated = get().orders.map((o) => {
          if (o.id === orderId) {
            return {
              ...o,
              status,
              ...(trackingNumber ? { trackingNumber } : {}),
              updatedAt: new Date().toISOString(),
            };
          }
          return o;
        });
        set({ orders: updated });
        get().addAuditLog('UPDATE_ORDER_STATUS', 'order', `Changed status to "${status}" for order ${orderId}`, orderId);
        get().addToast(`Order status updated to ${status}.`, 'success');
      },

      addReview: (reviewData) => {
        const newReview: ProductReview = {
          ...reviewData,
          id: `rev-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        const updatedReviews = [newReview, ...get().reviews];
        // recalculate product rating & reviewCount
        const prodReviews = updatedReviews.filter((r) => r.productId === reviewData.productId);
        const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
        const updatedProducts = get().products.map((p) => {
          if (p.id === reviewData.productId) {
            return {
              ...p,
              rating: Math.round(avg * 10) / 10,
              reviewCount: prodReviews.length,
            };
          }
          return p;
        });
        set({ reviews: updatedReviews, products: updatedProducts });
        get().addToast('Thank you! Your review has been published.', 'success');
      },

      syncFromSupabase: async () => {
        try {
          const [supaProducts, supaCategories, supaBrands] = await Promise.all([
            fetchSupabaseProducts(),
            fetchSupabaseCategories(),
            fetchSupabaseBrands(),
          ]);

          set({
            products: supaProducts,
            ...(supaCategories.length > 0 ? { categories: supaCategories } : {}),
            ...(supaBrands.length > 0 ? { brands: supaBrands } : {}),
          });
        } catch (err) {
          console.error('Error syncing data with Supabase:', err);
        }
      },

      addProduct: async (prod) => {
        try {
          // Save directly to Supabase PostgreSQL database
          const savedProduct = await createSupabaseProduct(prod);
          set({ products: [savedProduct, ...get().products] });
          get().addAuditLog('CREATE_PRODUCT', 'product', `Created product "${savedProduct.name}" (SKU count: ${savedProduct.variants.length})`, savedProduct.id);
          get().addToast(`Product "${savedProduct.name}" saved to Supabase!`, 'success');
        } catch (err: any) {
          console.error('Supabase product save error:', err);
          // Local fallback in case of network issue
          const id = `prod-${Date.now()}`;
          const now = new Date().toISOString();
          const newProduct: Product = {
            ...prod,
            id,
            rating: 5.0,
            reviewCount: 0,
            createdAt: now,
            updatedAt: now,
          };
          set({ products: [newProduct, ...get().products] });
          get().addToast(`Product saved locally (${err.message})`, 'info');
        }
      },

      updateProduct: (id, updates) => {
        const updated = get().products.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p));
        set({ products: updated });
        get().addAuditLog('UPDATE_PRODUCT', 'product', `Updated fields for product ${id}`, id);
        get().addToast('Product details updated successfully.', 'success');
      },

      deleteProduct: async (id) => {
        const prod = get().products.find((p) => p.id === id);
        const updated = get().products.filter((p) => p.id !== id);
        set({ products: updated });
        try {
          await deleteSupabaseProduct(id);
        } catch (e) {
          console.error('Supabase delete error:', e);
        }
        get().addAuditLog('DELETE_PRODUCT', 'product', `Deleted product "${prod?.name || id}"`, id);
        get().addToast(`Deleted product "${prod?.name || id}".`, 'info');
      },

      toggleProductPublish: (id) => {
        const updated = get().products.map((p) => (p.id === id ? { ...p, isPublished: !p.isPublished } : p));
        set({ products: updated });
        const prod = updated.find((p) => p.id === id);
        get().addAuditLog('TOGGLE_PUBLISH', 'product', `Changed status to ${prod?.isPublished ? 'Published' : 'Draft'}`, id);
      },

      restockProduct: (id, amount) => {
        const updated = get().products.map((p) => (p.id === id ? { ...p, stock: p.stock + amount } : p));
        set({ products: updated });
        get().addAuditLog('RESTOCK_PRODUCT', 'product', `Added ${amount} units to stock`, id);
        get().addToast(`Stock updated (+${amount} units).`, 'success');
      },

      addCategory: (cat) => {
        const newCat: Category = { ...cat, id: `cat-${Date.now()}` };
        set({ categories: [...get().categories, newCat] });
        get().addAuditLog('CREATE_CATEGORY', 'category', `Added category "${newCat.name}"`, newCat.id);
        get().addToast(`Category "${newCat.name}" added.`, 'success');
      },

      deleteCategory: (id) => {
        set({ categories: get().categories.filter((c) => c.id !== id) });
        get().addAuditLog('DELETE_CATEGORY', 'category', `Removed category ${id}`, id);
        get().addToast('Category removed.', 'info');
      },

      addBrand: (brand) => {
        const newBrand: Brand = { ...brand, id: `brand-${Date.now()}` };
        set({ brands: [...get().brands, newBrand] });
        get().addAuditLog('CREATE_BRAND', 'category', `Added brand "${newBrand.name}"`, newBrand.id);
        get().addToast(`Brand "${newBrand.name}" added.`, 'success');
      },

      deleteBrand: (id) => {
        set({ brands: get().brands.filter((b) => b.id !== id) });
        get().addAuditLog('DELETE_BRAND', 'category', `Removed brand ${id}`, id);
        get().addToast('Brand removed.', 'info');
      },

      addCoupon: (coupon) => {
        const newCoupon: Coupon = { ...coupon, id: `coup-${Date.now()}`, usageCount: 0 };
        set({ coupons: [newCoupon, ...get().coupons] });
        get().addAuditLog('CREATE_COUPON', 'coupon', `Created coupon "${newCoupon.code}" (${newCoupon.discountValue}${newCoupon.discountType === 'percentage' ? '%' : '$'})`, newCoupon.id);
        get().addToast(`Coupon "${newCoupon.code}" created.`, 'success');
      },

      toggleCouponActive: (id) => {
        const updated = get().coupons.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c));
        set({ coupons: updated });
      },

      deleteCoupon: (id) => {
        set({ coupons: get().coupons.filter((c) => c.id !== id) });
        get().addAuditLog('DELETE_COUPON', 'coupon', `Deleted coupon ${id}`, id);
        get().addToast('Coupon deleted.', 'info');
      },

      loginAdmin: (admin) => {
        set({
          isAdminAuthenticated: true,
          currentAdmin: admin,
          isAdminLoginOpen: false,
          isAdminDashboardOpen: true,
        });
        get().addAuditLog('ADMIN_LOGIN', 'auth', `Admin ${admin.email} logged in successfully via 2FA verification.`);
        get().addToast(`Welcome back, Administrator.`, 'success');
      },

      logoutAdmin: () => {
        const adminEmail = get().currentAdmin?.email || 'admin';
        set({
          isAdminAuthenticated: false,
          currentAdmin: null,
          isAdminDashboardOpen: false,
        });
        get().addAuditLog('ADMIN_LOGOUT', 'auth', `Admin ${adminEmail} logged out.`);
        get().addToast('Logged out of admin panel.', 'info');
      },

      addAuditLog: (action, entityType, details, entityId) => {
        const log: AuditLog = {
          id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          adminEmail: get().currentAdmin?.email || 'system@onestopbymajid.com',
          action,
          entityType,
          entityId,
          details,
          ipAddress: '192.168.1.42',
          createdAt: new Date().toISOString(),
        };
        set({ auditLogs: [log, ...get().auditLogs] });
      },

      updateUserProfile: (profile) => {
        if (!get().currentUser) return;
        set({ currentUser: { ...get().currentUser!, ...profile } });
        get().addToast('Profile updated.', 'success');
      },

      addToast: (message, type = 'info') => {
        const id = `toast-${Date.now()}-${Math.random()}`;
        set({ toasts: [...get().toasts, { id, message, type }] });
        setTimeout(() => {
          get().removeToast(id);
        }, 4000);
      },

      removeToast: (id) => {
        set({ toasts: get().toasts.filter((t) => t.id !== id) });
      },
    })
);

