import React from 'react';
import { useStore } from '../../store/useStore';
import { Users, Phone, MapPin, Mail } from 'lucide-react';

export const AdminCustomers: React.FC = () => {
  const { orders } = useStore();

  // Aggregate customers directly from placed orders
  const customerMap = new Map<
    string,
    { email: string; name: string; phone: string; totalSpent: number; ordersCount: number; city: string; country: string }
  >();

  orders.forEach((o) => {
    const key = o.customerEmail.toLowerCase();
    const existing = customerMap.get(key);
    if (existing) {
      existing.totalSpent += o.total;
      existing.ordersCount += 1;
      if (!existing.phone && o.shippingAddress.phone) {
        existing.phone = o.shippingAddress.phone;
      }
    } else {
      customerMap.set(key, {
        email: o.customerEmail,
        name: o.shippingAddress.fullName,
        phone: o.shippingAddress.phone || '—',
        totalSpent: o.total,
        ordersCount: 1,
        city: o.shippingAddress.city,
        country: o.shippingAddress.country,
      });
    }
  });

  const customersList = Array.from(customerMap.values());

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-stone-900 dark:text-stone-100">Customer Directory (CRM)</h2>
        <p className="text-xs text-stone-500">
          Direct checkout customer list, contact phone numbers, and lifetime order values.
        </p>
      </div>

      <div className="rounded-xl border border-stone-200 dark:border-stone-800 overflow-x-auto bg-white dark:bg-stone-900 shadow-sm">
        {customersList.length > 0 ? (
          <table className="w-full text-left text-xs min-w-[620px]">
            <thead className="bg-stone-50 dark:bg-stone-950/60 border-b border-stone-200 dark:border-stone-800 text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              <tr>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Phone Number</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Total Orders</th>
                <th className="py-3 px-4 font-mono">Lifetime Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {customersList.map((cust, idx) => (
                <tr key={idx} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                  <td className="py-3 px-4 font-semibold text-stone-900 dark:text-stone-100">{cust.name}</td>
                  <td className="py-3 px-4 font-mono text-stone-600 dark:text-stone-300">{cust.phone}</td>
                  <td className="py-3 px-4 font-mono text-stone-500">{cust.email}</td>
                  <td className="py-3 px-4 text-stone-600 dark:text-stone-400">
                    {cust.city}, {cust.country}
                  </td>
                  <td className="py-3 px-4 font-mono">{cust.ordersCount} orders</td>
                  <td className="py-3 px-4 font-mono font-bold text-stone-900 dark:text-stone-100">
                    RS {Math.round(cust.totalSpent * 100) / 100}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-12 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-400 flex items-center justify-center mx-auto">
              <Users className="w-5 h-5" />
            </div>
            <p className="font-serif text-lg text-stone-700 dark:text-stone-300">No customer records yet.</p>
            <p className="text-xs text-stone-400 max-w-sm mx-auto">
              Customers will automatically appear here with their contact details, phone numbers, and delivery addresses as they place direct orders.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
