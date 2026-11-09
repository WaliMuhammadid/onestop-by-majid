import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { couponFormSchema } from '../../lib/validation';
import { Tag, Plus, Trash2, CheckCircle2, XCircle } from 'lucide-react';

export const AdminCoupons: React.FC = () => {
  const { coupons, addCoupon, toggleCouponActive, deleteCoupon } = useStore();

  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState(15);
  const [minSpend, setMinSpend] = useState<number | undefined>(50);
  const [expiresAt, setExpiresAt] = useState('2027-12-31');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const result = couponFormSchema.safeParse({
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      minSpend: minSpend ? Number(minSpend) : undefined,
      expiresAt: new Date(expiresAt).toISOString(),
      isActive: true,
    });

    if (!result.success) {
      const errMap: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        errMap[issue.path[0] as string] = issue.message;
      });
      setErrors(errMap);
      return;
    }

    addCoupon({
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      minSpend: minSpend ? Number(minSpend) : undefined,
      expiresAt: new Date(expiresAt).toISOString(),
      isActive: true,
    });

    setCode('');
    setDiscountValue(15);
    setErrors({});
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl text-stone-900 dark:text-stone-100">Discounts &amp; Promotional Codes</h2>
        <p className="text-xs text-stone-500">
          Provision promotional incentives, enforce minimum cart spends, and monitor coupon redemptions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Create Form */}
        <div className="lg:col-span-5">
          <form
            onSubmit={handleCreateCoupon}
            className="p-5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 space-y-4 text-xs"
          >
            <h3 className="font-serif text-base text-stone-900 dark:text-stone-100">Issue New Promo Code</h3>

            <div>
              <label className="block text-[11px] font-medium uppercase text-stone-500 mb-1">Code *</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. SUMMER25"
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 font-mono uppercase tracking-wider focus:outline-none"
              />
              {errors.code && <p className="text-[10px] text-rose-500 mt-0.5">{errors.code}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium uppercase text-stone-500 mb-1">Type</label>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as any)}
                  className="w-full px-2.5 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (RS)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium uppercase text-stone-500 mb-1">Value *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={discountValue}
                  onChange={(e) => setDiscountValue(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 font-mono focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium uppercase text-stone-500 mb-1">Min Spend (RS)</label>
                <input
                  type="number"
                  min="0"
                  value={minSpend || ''}
                  onChange={(e) => setMinSpend(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="50"
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium uppercase text-stone-500 mb-1">Expiry Date *</label>
                <input
                  type="date"
                  required
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-full bg-stone-900 text-stone-100 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Issue Promotion
            </button>
          </form>
        </div>

        {/* Existing Coupons Table */}
        <div className="lg:col-span-7">
          <div className="rounded-xl border border-stone-200 dark:border-stone-800 overflow-x-auto bg-white dark:bg-stone-900 shadow-sm">
            <table className="w-full text-left text-xs min-w-[500px]">
              <thead className="bg-stone-50 dark:bg-stone-950/60 border-b border-stone-200 dark:border-stone-800 text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                <tr>
                  <th className="py-3 px-4">Code &amp; Benefit</th>
                  <th className="py-3 px-4">Min Spend</th>
                  <th className="py-3 px-4">Usage</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                    <td className="py-3 px-4">
                      <p className="font-mono font-bold text-stone-900 dark:text-stone-100">{c.code}</p>
                      <p className="text-[10px] text-stone-400">
                        {c.discountValue}
                        {c.discountType === 'percentage' ? '% off' : ' RS off'}
                      </p>
                    </td>
                    <td className="py-3 px-4 font-mono">{c.minSpend ? `RS ${c.minSpend}` : 'None'}</td>
                    <td className="py-3 px-4 font-mono">{c.usageCount} times</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleCouponActive(c.id)}
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                          c.isActive ? 'text-emerald-600' : 'text-stone-400'
                        }`}
                      >
                        {c.isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        <span>{c.isActive ? 'Active' : 'Paused'}</span>
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => deleteCoupon(c.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-500 transition-colors"
                        aria-label={`Delete ${c.code}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
