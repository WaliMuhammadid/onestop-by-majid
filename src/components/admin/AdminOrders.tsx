import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Order, OrderStatus } from '../../types';
import { Search, Eye, Printer, Truck, CheckCircle2, XCircle, Clock } from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus, setOrderReceipt, setIsOrderSuccessOpen } = useStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>('confirmed');
  const [trackingNumberInput, setTrackingNumberInput] = useState('');

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      o.shippingAddress.fullName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    updateOrderStatus(selectedOrder.id, newStatus, trackingNumberInput.trim() || undefined);
    setSelectedOrder({
      ...selectedOrder,
      status: newStatus,
      ...(trackingNumberInput.trim() ? { trackingNumber: trackingNumberInput.trim() } : {}),
    });
  };

  const handlePrintPackingSlip = (order: Order) => {
    setOrderReceipt(order);
    setIsOrderSuccessOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-serif text-2xl text-stone-900 dark:text-stone-100">Fulfillment &amp; Client Orders</h2>
        <p className="text-xs text-stone-500">
          Track lifecycle progress, issue tracking identifiers, and print compliance packing invoices.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order #, patron email, or recipient name..."
            className="w-full pl-9 pr-3 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg text-xs text-stone-900 dark:text-stone-100 focus:outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg text-xs text-stone-900 dark:text-stone-100 focus:outline-none"
        >
          <option value="all">All Statuses ({orders.length})</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm">
        <table className="w-full text-left text-xs min-w-[700px]">
          <thead className="bg-stone-50 dark:bg-stone-950/60 border-b border-stone-200 dark:border-stone-800 text-[11px] font-semibold uppercase tracking-wider text-stone-500">
            <tr>
              <th className="py-3.5 px-4">Order Ref</th>
              <th className="py-3.5 px-4">Patron &amp; Location</th>
              <th className="py-3.5 px-4">Date Queued</th>
              <th className="py-3.5 px-4">Payment</th>
              <th className="py-3.5 px-4">Amount</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-stone-900 dark:text-stone-100">
                  #{order.orderNumber}
                </td>
                <td className="py-3 px-4">
                  <p className="font-semibold text-stone-900 dark:text-stone-100">
                    {order.shippingAddress.fullName}
                  </p>
                  <p className="text-[10px] text-stone-400">
                    {order.shippingAddress.city}, {order.shippingAddress.country}
                  </p>
                </td>
                <td className="py-3 px-4 text-stone-500 text-[11px]">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 uppercase text-[10px] font-mono font-medium">
                  <span
                    className={`px-1.5 py-0.5 rounded ${
                      order.paymentStatus === 'paid'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {order.paymentMethod} &bull; {order.paymentStatus}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono font-bold text-stone-900 dark:text-stone-100">RS {order.total}</td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                      order.status === 'delivered'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : order.status === 'shipped'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        : order.status === 'cancelled'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setNewStatus(order.status);
                      setTrackingNumberInput(order.trackingNumber || '');
                    }}
                    className="p-1.5 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                    title="View & Edit Order"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
          <div
            className="w-full max-w-2xl bg-[#faf9f6] dark:bg-[#12100e] rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 p-4 sm:p-7 md:p-8 space-y-6 my-auto max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <div>
                <h3 className="font-serif text-xl text-stone-900 dark:text-stone-100">
                  Manifest #{selectedOrder.orderNumber}
                </h3>
                <span className="text-[11px] text-stone-400 font-mono">
                  Placed {new Date(selectedOrder.createdAt).toLocaleString()}
                </span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-stone-400 hover:text-stone-900">
                &times;
              </button>
            </div>

            {/* Customer & Address Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-stone-100 dark:bg-stone-900/60 rounded-lg space-y-1">
                <span className="font-semibold uppercase tracking-wider text-[10px] text-stone-400">Recipient</span>
                <p className="font-bold text-stone-900 dark:text-stone-100">{selectedOrder.shippingAddress.fullName}</p>
                <p className="text-stone-500 font-mono">{selectedOrder.customerEmail}</p>
                <p className="text-stone-500 font-mono">{selectedOrder.shippingAddress.phone}</p>
              </div>

              <div className="p-3.5 bg-stone-100 dark:bg-stone-900/60 rounded-lg space-y-1">
                <span className="font-semibold uppercase tracking-wider text-[10px] text-stone-400">
                  Delivery Destination
                </span>
                <p className="text-stone-800 dark:text-stone-200">{selectedOrder.shippingAddress.street}</p>
                <p className="text-stone-800 dark:text-stone-200">
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}{' '}
                  {selectedOrder.shippingAddress.postalCode}
                </p>
                <p className="text-stone-500">{selectedOrder.shippingAddress.country}</p>
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400">Item Manifest</h4>
              <div className="divide-y divide-stone-100 dark:divide-stone-800 border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden bg-white dark:bg-stone-900">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="p-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img src={item.productImage} alt="" className="w-10 h-12 object-cover rounded bg-stone-100" />
                      <div>
                        <p className="font-semibold text-stone-900 dark:text-stone-100">{item.productName}</p>
                        <p className="text-[10px] text-stone-400">
                          {item.variantName} &times; {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-stone-900 dark:text-stone-100">RS {item.totalPrice}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Updater Form */}
            <form
              onSubmit={handleUpdateStatus}
              className="p-4 bg-stone-100 dark:bg-stone-900/60 rounded-xl space-y-3 text-xs"
            >
              <h4 className="font-semibold uppercase tracking-wider text-[11px] text-stone-700 dark:text-stone-300">
                Update Fulfillment Status
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-medium uppercase text-stone-500 mb-1">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                    className="w-full px-3 py-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-medium uppercase text-stone-500 mb-1">
                    Courier Tracking Code
                  </label>
                  <input
                    type="text"
                    value={trackingNumberInput}
                    onChange={(e) => setTrackingNumberInput(e.target.value)}
                    placeholder="e.g. TRK-9402847291"
                    className="w-full px-3 py-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => handlePrintPackingSlip(selectedOrder)}
                  className="px-4 py-2 rounded-full border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold uppercase tracking-wider hover:bg-stone-200 dark:hover:bg-stone-800 flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip</span>
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-stone-900 text-stone-100 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Save Order Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
