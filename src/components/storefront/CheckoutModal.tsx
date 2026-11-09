import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { shippingAddressSchema } from '../../lib/validation';
import { calculateOrderTotals } from '../../lib/cart-calculations';
import { PaymentMethod, ShippingAddress } from '../../types';
import { X, ShieldCheck, CreditCard, Banknote, Smartphone, Check, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    appliedCoupon,
    createOrder,
    addToast,
  } = useStore();

  const [step, setStep] = useState<1 | 2>(1); // 1: Shipping & Delivery, 2: Payment
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields - starts clean for customer to enter their own details directly
  const [formData, setFormData] = useState<ShippingAddress>({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Pakistan',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [orderNotes, setOrderNotes] = useState('');

  // Payment mock fields
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [mobileWalletNumber, setMobileWalletNumber] = useState('0300 1234567');

  if (!isCheckoutOpen || cart.length === 0) return null;

  const totals = calculateOrderTotals(cart, appliedCoupon, shippingMethod);

  const handleFieldChange = (field: keyof ShippingAddress, val: string) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep1 = () => {
    const result = shippingAddressSchema.safeParse(formData);
    if (!result.success) {
      const errMap: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as string;
        errMap[key] = issue.message;
      });
      setFormErrors(errMap);
      return false;
    }
    setFormErrors({});
    return true;
  };

  const handleNextToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleFinalOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate real-time API latency & server validation
      await new Promise((resolve) => setTimeout(resolve, 800));

      const orderItems = cart.map((item) => ({
        id: `oi-${Date.now()}-${item.id}`,
        productId: item.productId,
        productName: item.product.name,
        productImage: item.product.images[0]?.url || '',
        variantName: item.variant?.size || item.variant?.color || 'Standard',
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.price * item.quantity,
      }));

      const newOrder = createOrder({
        customerEmail: formData.email,
        shippingAddress: formData,
        items: orderItems,
        subtotal: totals.subtotal,
        discount: totals.discount,
        shippingFee: totals.shippingFee,
        tax: totals.tax,
        total: totals.total,
        couponCode: appliedCoupon?.code,
        status: 'confirmed',
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
        carrier: shippingMethod === 'express' ? 'DHL Express Priority' : 'Carbon-Neutral Ground',
        notes: orderNotes,
      });

      // Confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#c59b27', '#1c1917', '#e8e5de'],
        });
      } catch {
        // ignore
      }
    } catch {
      addToast('An error occurred while creating order.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-[#faf9f6] dark:bg-[#12100e] rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-5 sm:p-6 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-stone-900 dark:text-stone-100 font-serif text-xl">
              <span>Secure Dispatch Checkout</span>
            </div>
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-semibold uppercase tracking-wider">
              <Lock className="w-3 h-3" />
              <span>TLS 256-bit Encrypted</span>
            </div>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            aria-label="Close checkout"
            className="p-1.5 text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Multi-step indicator */}
        <div className="px-4 sm:px-6 py-2.5 sm:py-3 bg-stone-100 dark:bg-stone-900/60 border-b border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 sm:gap-4">
            <span
              className={`font-semibold uppercase tracking-wider text-[11px] sm:text-xs ${
                step === 1 ? 'text-stone-900 dark:text-stone-100 underline decoration-2' : 'text-stone-400'
              }`}
            >
              1. Contact &amp; Shipping Details
            </span>
            <span className="text-stone-300 dark:text-stone-700">&bull;</span>
            <span
              className={`font-semibold uppercase tracking-wider text-[11px] sm:text-xs ${
                step === 2 ? 'text-stone-900 dark:text-stone-100 underline decoration-2' : 'text-stone-400'
              }`}
            >
              2. Payment &amp; Confirmation
            </span>
          </div>
          <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
            Direct Checkout &bull; No Login Required
          </span>
        </div>

        {/* Main Body */}
        <div className="overflow-y-auto p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Form Column */}
            <div className="lg:col-span-7 space-y-6">
              {step === 1 ? (
                <form id="shipping-form" onSubmit={handleNextToPayment} className="space-y-4">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-900 dark:text-stone-100">
                      Contact Information
                    </h3>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      No account registration needed. Fill in your details below to receive your order.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-medium uppercase text-stone-500 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => handleFieldChange('fullName', e.target.value)}
                        placeholder="e.g. Majid Khan"
                        className="w-full px-3 py-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900 dark:focus:border-stone-100"
                      />
                      {formErrors.fullName && (
                        <p className="text-[10px] text-rose-500 mt-0.5">{formErrors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium uppercase text-stone-500 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleFieldChange('email', e.target.value)}
                        placeholder="e.g. yourname@gmail.com"
                        className="w-full px-3 py-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900 dark:focus:border-stone-100"
                      />
                      {formErrors.email && (
                        <p className="text-[10px] text-rose-500 mt-0.5">{formErrors.email}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium uppercase text-stone-500 mb-1">
                      Mobile Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => handleFieldChange('phone', e.target.value)}
                      placeholder="e.g. 0300 1234567 or +92 300 1234567"
                      className="w-full px-3 py-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900 dark:focus:border-stone-100"
                    />
                    <p className="text-[10px] text-stone-400 mt-1">
                      Our courier will call or SMS this number to coordinate doorstep delivery.
                    </p>
                    {formErrors.phone && <p className="text-[10px] text-rose-500 mt-0.5">{formErrors.phone}</p>}
                  </div>

                  <div className="pt-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-900 dark:text-stone-100">
                      Delivery Destination
                    </h3>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Where should we deliver your parcel?
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium uppercase text-stone-500 mb-1">
                      Complete Street Address / House / Flat *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.street}
                      onChange={(e) => handleFieldChange('street', e.target.value)}
                      placeholder="e.g. House # 14, Street 5, Sector F-8/2"
                      className="w-full px-3 py-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900 dark:focus:border-stone-100"
                    />
                    {formErrors.street && <p className="text-[10px] text-rose-500 mt-0.5">{formErrors.street}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium uppercase text-stone-500 mb-1">City *</label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => handleFieldChange('city', e.target.value)}
                        placeholder="e.g. Lahore"
                        className="w-full px-3 py-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900 dark:focus:border-stone-100"
                      />
                      {formErrors.city && <p className="text-[10px] text-rose-500 mt-0.5">{formErrors.city}</p>}
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium uppercase text-stone-500 mb-1">Province / State</label>
                      <input
                        type="text"
                        value={formData.state || ''}
                        onChange={(e) => handleFieldChange('state', e.target.value)}
                        placeholder="e.g. Punjab"
                        className="w-full px-3 py-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900 dark:focus:border-stone-100"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium uppercase text-stone-500 mb-1">
                        Country *
                      </label>
                      <select
                        value={formData.country}
                        onChange={(e) => handleFieldChange('country', e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-xs text-stone-900 dark:text-stone-100 focus:outline-none"
                      >
                        <option value="Pakistan">Pakistan</option>
                        <option value="United Arab Emirates">United Arab Emirates</option>
                        <option value="Saudi Arabia">Saudi Arabia</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                      </select>
                    </div>
                  </div>

                  {/* Shipping Method Options */}
                  <div className="space-y-2 pt-2">
                    <label className="block text-[11px] font-medium uppercase text-stone-500">
                      Select Courier Method
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div
                        onClick={() => setShippingMethod('standard')}
                        className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                          shippingMethod === 'standard'
                            ? 'border-stone-900 dark:border-white bg-stone-100/80 dark:bg-stone-800'
                            : 'border-stone-200 dark:border-stone-800'
                        }`}
                      >
                        <div className="flex justify-between items-center text-xs font-semibold">
                          <span>Standard Climate-Neutral</span>
                          <span>{totals.subtotalAfterDiscount >= 150 ? 'FREE' : 'RS 12'}</span>
                        </div>
                        <p className="text-[11px] text-stone-400 mt-0.5">3–5 business days</p>
                      </div>

                      <div
                        onClick={() => setShippingMethod('express')}
                        className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                          shippingMethod === 'express'
                            ? 'border-stone-900 dark:border-white bg-stone-100/80 dark:bg-stone-800'
                            : 'border-stone-200 dark:border-stone-800'
                        }`}
                      >
                        <div className="flex justify-between items-center text-xs font-semibold">
                          <span>DHL Express Priority</span>
                          <span>RS 25</span>
                        </div>
                        <p className="text-[11px] text-stone-400 mt-0.5">1–2 business days</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-full bg-stone-900 text-stone-100 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white text-xs font-semibold uppercase tracking-widest transition-colors shadow-md"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </form>
              ) : (
                /* Step 2: Payment Options */
                <form id="payment-form" onSubmit={handleFinalOrderSubmit} className="space-y-6">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
                    <div className="text-xs">
                      <span className="text-stone-400">Shipping to: </span>
                      <strong className="text-stone-900 dark:text-stone-100">
                        {formData.fullName}, {formData.city}
                      </strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs text-amber-700 dark:text-amber-400 underline"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                      Payment Gateway
                    </h3>

                    {/* Payment Radios */}
                    <div className="space-y-2.5">
                      {/* Cash on Delivery */}
                      <label
                        className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                          paymentMethod === 'cod'
                            ? 'border-stone-900 dark:border-white bg-stone-100/80 dark:bg-stone-800'
                            : 'border-stone-200 dark:border-stone-800'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                          className="mt-0.5 accent-stone-900"
                        />
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <Banknote className="w-4 h-4 text-stone-700 dark:text-stone-300" />
                            <span className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                              Cash on Delivery (COD)
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500">
                            Pay in cash or card directly to the courier upon doorstep inspection.
                          </p>
                        </div>
                      </label>

                      {/* Stripe Credit/Debit Card */}
                      <label
                        className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                          paymentMethod === 'stripe'
                            ? 'border-stone-900 dark:border-white bg-stone-100/80 dark:bg-stone-800'
                            : 'border-stone-200 dark:border-stone-800'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'stripe'}
                          onChange={() => setPaymentMethod('stripe')}
                          className="mt-0.5 accent-stone-900"
                        />
                        <div className="space-y-1 w-full">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CreditCard className="w-4 h-4 text-stone-700 dark:text-stone-300" />
                              <span className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                                Credit / Debit Card (Stripe Gateway)
                              </span>
                            </div>
                            <span className="text-[10px] text-stone-400 font-mono">Visa / Mastercard / Amex</span>
                          </div>

                          {paymentMethod === 'stripe' && (
                            <div className="pt-3 space-y-2">
                              <input
                                type="text"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                placeholder="Card number"
                                className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded text-xs font-mono text-stone-900 dark:text-stone-100 focus:outline-none"
                              />
                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  value={cardExpiry}
                                  onChange={(e) => setCardExpiry(e.target.value)}
                                  placeholder="MM/YY"
                                  className="px-3 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded text-xs font-mono text-stone-900 dark:text-stone-100 focus:outline-none"
                                />
                                <input
                                  type="text"
                                  value={cardCvc}
                                  onChange={(e) => setCardCvc(e.target.value)}
                                  placeholder="CVC"
                                  className="px-3 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded text-xs font-mono text-stone-900 dark:text-stone-100 focus:outline-none"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </label>

                      {/* JazzCash / Easypaisa Digital Wallets */}
                      <label
                        className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                          paymentMethod === 'jazzcash' || paymentMethod === 'easypaisa'
                            ? 'border-stone-900 dark:border-white bg-stone-100/80 dark:bg-stone-800'
                            : 'border-stone-200 dark:border-stone-800'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'jazzcash' || paymentMethod === 'easypaisa'}
                          onChange={() => setPaymentMethod('jazzcash')}
                          className="mt-0.5 accent-stone-900"
                        />
                        <div className="space-y-1 w-full">
                          <div className="flex items-center gap-2">
                            <Smartphone className="w-4 h-4 text-stone-700 dark:text-stone-300" />
                            <span className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                              Mobile Wallet (JazzCash / Easypaisa)
                            </span>
                          </div>

                          {(paymentMethod === 'jazzcash' || paymentMethod === 'easypaisa') && (
                            <div className="pt-2 space-y-2">
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => setPaymentMethod('jazzcash')}
                                  className={`px-3 py-1.5 rounded text-xs font-medium border ${
                                    paymentMethod === 'jazzcash'
                                      ? 'bg-stone-900 text-white dark:bg-white dark:text-black'
                                      : 'border-stone-300'
                                  }`}
                                >
                                  JazzCash
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setPaymentMethod('easypaisa')}
                                  className={`px-3 py-1.5 rounded text-xs font-medium border ${
                                    paymentMethod === 'easypaisa'
                                      ? 'bg-stone-900 text-white dark:bg-white dark:text-black'
                                      : 'border-stone-300'
                                  }`}
                                >
                                  Easypaisa
                                </button>
                              </div>
                              <input
                                type="text"
                                value={mobileWalletNumber}
                                onChange={(e) => setMobileWalletNumber(e.target.value)}
                                placeholder="Registered 11-digit mobile number"
                                className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded text-xs font-mono text-stone-900 dark:text-stone-100 focus:outline-none"
                              />
                            </div>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium uppercase text-stone-500 mb-1">
                      Delivery Instructions (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      placeholder="e.g. Leave with doorman or call on arrival"
                      className="w-full px-3 py-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-xs text-stone-900 dark:text-stone-100 focus:outline-none"
                    />
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-6 py-3.5 rounded-full border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold uppercase tracking-wider hover:bg-stone-100 dark:hover:bg-stone-800"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-3.5 rounded-full bg-stone-900 text-stone-100 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white text-xs font-semibold uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <span>Transmitting Order...</span>
                      ) : (
                        <span>Complete Order &bull; RS {totals.total}</span>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Right Summary Column */}
            <div className="lg:col-span-5 bg-stone-100 dark:bg-stone-900/60 p-5 rounded-xl border border-stone-200 dark:border-stone-800 space-y-4 h-fit">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-900 dark:text-stone-100 pb-2 border-b border-stone-200 dark:border-stone-800">
                Order Manifest ({cart.length} items)
              </h3>

              <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3 text-xs items-center">
                    <img
                      src={item.product.images[0]?.url}
                      alt={item.product.name}
                      className="w-12 h-14 object-cover rounded bg-stone-200 shrink-0"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-stone-900 dark:text-stone-100 line-clamp-1">{item.product.name}</p>
                      <p className="text-[10px] text-stone-500">
                        Qty: {item.quantity} &bull; {item.variant?.size || 'Standard'}
                      </p>
                    </div>
                    <span className="font-semibold text-stone-800 dark:text-stone-200">RS {item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-3 border-t border-stone-200 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-stone-900 dark:text-stone-100">RS {totals.subtotal}</span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>-RS {totals.discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping ({shippingMethod === 'express' ? 'Express' : 'Standard'})</span>
                  <span>{totals.shippingFee === 0 ? 'Complimentary' : `RS ${totals.shippingFee}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sales Tax</span>
                  <span>RS {totals.tax}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-900 dark:text-stone-100 pt-2 border-t border-stone-200 dark:border-stone-800">
                  <span>Total Due</span>
                  <span>RS {totals.total}</span>
                </div>
              </div>

              <div className="p-3 bg-white dark:bg-stone-800 rounded border border-stone-200 dark:border-stone-700 text-[11px] text-stone-500 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero-risk guarantee: inspect before acceptance or return within 30 days.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
