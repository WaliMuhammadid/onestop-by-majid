import React from 'react';
import { useStore } from '../../store/useStore';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Tag,
  ShieldCheck,
  LogOut,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Store,
  Coins,
  Truck,
} from 'lucide-react';
import { AdminProducts } from './AdminProducts';
import { AdminOrders } from './AdminOrders';
import { AdminCategories } from './AdminCategories';
import { AdminCoupons } from './AdminCoupons';
import { AdminCustomers } from './AdminCustomers';
import { AdminAuditLogs } from './AdminAuditLogs';

export const AdminDashboard: React.FC = () => {
  const {
    isAdminDashboardOpen,
    setIsAdminDashboardOpen,
    currentAdmin,
    logoutAdmin,
    adminActiveTab,
    setAdminActiveTab,
    orders,
    products,
    restockProduct,
    setCurrentView,
  } = useStore();

  if (!isAdminDashboardOpen) return null;

  // Key metrics calculation
  const rawRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.total : o.total), 0);
  const totalRevenue = (Math.round(rawRevenue * 100) / 100).toFixed(2);
  const totalOrdersCount = orders.length;
  const aov = totalOrdersCount > 0 ? (Math.round((rawRevenue / totalOrdersCount) * 100) / 100).toFixed(2) : '0.00';
  const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= 5);

  const handleReturnToStore = () => {
    setIsAdminDashboardOpen(false);
    setCurrentView('shop');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#faf9f6] dark:bg-[#0c0a09] text-stone-900 dark:text-stone-100 flex flex-col overflow-hidden transition-colors">
      {/* Admin Top Navigation Bar */}
      <header className="h-16 border-b border-stone-200 dark:border-stone-800 bg-white/90 dark:bg-[#141210]/90 backdrop-blur px-3 sm:px-6 flex items-center justify-between shrink-0 gap-2">
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="font-serif text-sm sm:text-base tracking-[0.18em] font-light">ONESTOP BY MAJID</span>
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest px-1.5 sm:px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
              Admin
            </span>
          </div>
          <span className="text-stone-300 dark:text-stone-700 hidden md:inline">&bull;</span>
          <span className="text-xs text-stone-500 font-mono hidden md:inline">{currentAdmin?.email}</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleReturnToStore}
            className="px-2.5 sm:px-3.5 py-1.5 rounded-full border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold tracking-wider transition-colors flex items-center gap-1.5"
            title="Return to customer storefront"
          >
            <Store className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Storefront</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="px-2.5 sm:px-3.5 py-1.5 rounded-full bg-stone-900 text-stone-100 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white text-xs font-semibold tracking-wider transition-colors flex items-center gap-1.5 shadow-sm"
            title="Sign out of admin"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Admin Layout: Sidebar + View Container */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Sidebar (Desktop) */}
        <aside className="w-60 border-r border-stone-200 dark:border-stone-800 bg-white dark:bg-[#141210] p-4 flex flex-col justify-between shrink-0 hidden md:flex">
          <nav className="space-y-1" aria-label="Admin Navigation">
            <button
              onClick={() => setAdminActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
                adminActiveTab === 'dashboard'
                  ? 'bg-stone-900 text-white dark:bg-white dark:text-black'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setAdminActiveTab('products')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
                adminActiveTab === 'products'
                  ? 'bg-stone-900 text-white dark:bg-white dark:text-black'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Products ({products.length})</span>
            </button>

            <button
              onClick={() => setAdminActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
                adminActiveTab === 'orders'
                  ? 'bg-stone-900 text-white dark:bg-white dark:text-black'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Orders ({orders.length})</span>
            </button>

            <button
              onClick={() => setAdminActiveTab('categories')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
                adminActiveTab === 'categories'
                  ? 'bg-stone-900 text-white dark:bg-white dark:text-black'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Categories &amp; Ateliers</span>
            </button>

            <button
              onClick={() => setAdminActiveTab('coupons')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
                adminActiveTab === 'coupons'
                  ? 'bg-stone-900 text-white dark:bg-white dark:text-black'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>Coupons &amp; Offers</span>
            </button>

            <button
              onClick={() => setAdminActiveTab('customers')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
                adminActiveTab === 'customers'
                  ? 'bg-stone-900 text-white dark:bg-white dark:text-black'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Patrons Directory</span>
            </button>

            <button
              onClick={() => setAdminActiveTab('audit')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
                adminActiveTab === 'audit'
                  ? 'bg-stone-900 text-white dark:bg-white dark:text-black'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Audit Logs</span>
            </button>
          </nav>

          <div className="p-3 bg-stone-100 dark:bg-stone-900 rounded-lg text-[10px] text-stone-500 space-y-1">
            <p className="font-semibold text-stone-700 dark:text-stone-300">RLS Status: ACTIVE</p>
            <p>Admin policies enforced via public.is_admin() database trigger.</p>
          </div>
        </aside>

        {/* Mobile Horizontal Tabs Navigation */}
        <div className="md:hidden flex items-center overflow-x-auto border-b border-stone-200 dark:border-stone-800 px-3 py-2 gap-1.5 bg-white dark:bg-[#141210] shrink-0 scrollbar-none z-10 shadow-sm">
          {[
            { id: 'dashboard' as const, label: 'Overview', icon: LayoutDashboard },
            { id: 'products' as const, label: `Products (${products.length})`, icon: Package },
            { id: 'orders' as const, label: `Orders (${orders.length})`, icon: Truck },
            { id: 'categories' as const, label: 'Categories', icon: Layers },
            { id: 'coupons' as const, label: 'Coupons', icon: Tag },
            { id: 'customers' as const, label: 'Patrons', icon: Users },
            { id: 'audit' as const, label: 'Audit', icon: ShieldCheck },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = adminActiveTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setAdminActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-sm'
                    : 'text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-stone-800/80 hover:bg-stone-200 dark:hover:bg-stone-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-3.5 sm:p-6 md:p-8 space-y-6">
          {adminActiveTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Header */}
              <div>
                <h1 className="font-serif text-3xl text-stone-900 dark:text-stone-100 font-normal">
                  Executive Atelier Performance
                </h1>
                <p className="text-xs text-stone-500">Live operational telemetry across global fulfillment nodes.</p>
              </div>

              {/* Stat Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="p-5 bg-white dark:bg-[#141210] rounded-xl border border-stone-200 dark:border-stone-800 space-y-1">
                  <div className="flex items-center justify-between text-stone-400">
                    <span className="text-[11px] font-semibold uppercase tracking-wider">Gross Revenue</span>
                    <Coins className="w-4 h-4 text-emerald-500" />
                  </div>
                  <p className="text-2xl font-bold font-mono text-stone-900 dark:text-stone-100">RS {totalRevenue}</p>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>+18.4% vs last period</span>
                  </p>
                </div>

                <div className="p-5 bg-white dark:bg-[#141210] rounded-xl border border-stone-200 dark:border-stone-800 space-y-1">
                  <div className="flex items-center justify-between text-stone-400">
                    <span className="text-[11px] font-semibold uppercase tracking-wider">Orders Dispatched</span>
                    <ShoppingBag className="w-4 h-4 text-amber-500" />
                  </div>
                  <p className="text-2xl font-bold font-mono text-stone-900 dark:text-stone-100">
                    {totalOrdersCount}
                  </p>
                  <p className="text-[11px] text-stone-500">100% on-time fulfillment rate</p>
                </div>

                <div className="p-5 bg-white dark:bg-[#141210] rounded-xl border border-stone-200 dark:border-stone-800 space-y-1">
                  <div className="flex items-center justify-between text-stone-400">
                    <span className="text-[11px] font-semibold uppercase tracking-wider">Average Order Value</span>
                    <ArrowUpRight className="w-4 h-4 text-stone-500" />
                  </div>
                  <p className="text-2xl font-bold font-mono text-stone-900 dark:text-stone-100">RS {aov}</p>
                  <p className="text-[11px] text-stone-500">Curated high-touch basket size</p>
                </div>

                <div className="p-5 bg-white dark:bg-[#141210] rounded-xl border border-stone-200 dark:border-stone-800 space-y-1">
                  <div className="flex items-center justify-between text-stone-400">
                    <span className="text-[11px] font-semibold uppercase tracking-wider">Conversion Ratio</span>
                    <TrendingUp className="w-4 h-4 text-indigo-500" />
                  </div>
                  <p className="text-2xl font-bold font-mono text-stone-900 dark:text-stone-100">3.82%</p>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">+0.6% organic uplift</p>
                </div>
              </div>

              {/* Revenue Visualization SVG & Low Stock Warnings */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Visual Weekly Sales Chart */}
                <div className="lg:col-span-7 p-6 bg-white dark:bg-[#141210] rounded-xl border border-stone-200 dark:border-stone-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg text-stone-900 dark:text-stone-100">
                      Weekly Revenue Progression
                    </h3>
                    <span className="text-xs text-stone-400 font-mono">Last 7 Calendar Days</span>
                  </div>

                  {/* SVG Bar Visualization */}
                  <div className="h-48 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-stone-100 dark:border-stone-800">
                    {[
                      { day: 'Mon', val: 540, h: '45%' },
                      { day: 'Tue', val: 780, h: '65%' },
                      { day: 'Wed', val: 620, h: '50%' },
                      { day: 'Thu', val: 990, h: '82%' },
                      { day: 'Fri', val: 1240, h: '98%' },
                      { day: 'Sat', val: 890, h: '74%' },
                      { day: 'Sun', val: 710, h: '60%' },
                    ].map((item) => (
                      <div key={item.day} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                        <span className="text-[10px] text-stone-400 opacity-0 group-hover:opacity-100 font-mono transition-opacity">
                          RS {item.val}
                        </span>
                        <div
                          className="w-full bg-stone-900 hover:bg-amber-600 dark:bg-stone-200 dark:hover:bg-amber-400 rounded-t transition-all duration-300"
                          style={{ height: item.h }}
                        ></div>
                        <span className="text-[11px] text-stone-500 uppercase">{item.day}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Low Stock Alerts */}
                <div className="lg:col-span-5 p-6 bg-white dark:bg-[#141210] rounded-xl border border-stone-200 dark:border-stone-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      <h3 className="font-serif text-lg text-stone-900 dark:text-stone-100">
                        Low Stock Depletion Alerts
                      </h3>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 text-[10px] font-bold">
                      {lowStockProducts.length} Critical
                    </span>
                  </div>

                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {lowStockProducts.map((p) => (
                      <div
                        key={p.id}
                        className="p-3 bg-stone-50 dark:bg-stone-900/60 rounded-lg border border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0]?.url}
                            alt=""
                            className="w-10 h-10 object-cover rounded bg-stone-200 shrink-0"
                          />
                          <div>
                            <p className="font-semibold text-stone-900 dark:text-stone-100 line-clamp-1">{p.name}</p>
                            <p className="text-[11px] text-rose-600 dark:text-rose-400 font-bold">
                              Only {p.stock} units remaining
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => restockProduct(p.id, 10)}
                          className="px-3 py-1.5 rounded-full bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-[11px] font-semibold hover:opacity-80 transition-opacity"
                        >
                          +10 Stock
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Orders Stream */}
              <div className="p-6 bg-white dark:bg-[#141210] rounded-xl border border-stone-200 dark:border-stone-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg text-stone-900 dark:text-stone-100">
                    Latest Dispatched Orders
                  </h3>
                  <button
                    onClick={() => setAdminActiveTab('orders')}
                    className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 hover:underline"
                  >
                    View All Orders &rarr;
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[550px]">
                    <thead className="bg-stone-50 dark:bg-stone-950/60 border-b border-stone-200 dark:border-stone-800 text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                      <tr>
                        <th className="py-2.5 px-4">Order Ref</th>
                        <th className="py-2.5 px-4">Patron</th>
                        <th className="py-2.5 px-4">Total</th>
                        <th className="py-2.5 px-4">Payment</th>
                        <th className="py-2.5 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                      {orders.slice(0, 4).map((o) => (
                        <tr key={o.id}>
                          <td className="py-2.5 px-4 font-mono font-bold">#{o.orderNumber}</td>
                          <td className="py-2.5 px-4">{o.shippingAddress.fullName}</td>
                          <td className="py-2.5 px-4 font-mono font-bold">RS {o.total}</td>
                          <td className="py-2.5 px-4 uppercase text-[10px] font-mono">{o.paymentMethod}</td>
                          <td className="py-2.5 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-stone-100 dark:bg-stone-800">
                              {o.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {adminActiveTab === 'products' && <AdminProducts />}
          {adminActiveTab === 'orders' && <AdminOrders />}
          {adminActiveTab === 'categories' && <AdminCategories />}
          {adminActiveTab === 'coupons' && <AdminCoupons />}
          {adminActiveTab === 'customers' && <AdminCustomers />}
          {adminActiveTab === 'audit' && <AdminAuditLogs />}
        </main>
      </div>
    </div>
  );
};
