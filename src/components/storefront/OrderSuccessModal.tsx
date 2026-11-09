import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { CheckCircle2, Printer, Mail, ArrowRight, Package, Truck, Clock } from 'lucide-react';

export const OrderSuccessModal: React.FC = () => {
  const { isOrderSuccessOpen, setIsOrderSuccessOpen, currentOrderReceipt, setCurrentView } = useStore();
  const [showEmailPreview, setShowEmailPreview] = useState(false);

  if (!isOrderSuccessOpen || !currentOrderReceipt) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleContinueShopping = () => {
    setIsOrderSuccessOpen(false);
    setCurrentView('shop');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-[#faf9f6] dark:bg-[#12100e] rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden my-auto max-h-[92vh] flex flex-col p-6 sm:p-10 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Celebration Icon & Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-400">
            Order Confirmed &amp; Queued
          </span>
          <h2 className="font-serif text-3xl text-stone-900 dark:text-stone-100">
            Thank you, {currentOrderReceipt.shippingAddress.fullName.split(' ')[0]}.
          </h2>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Order Reference <span className="font-mono font-bold text-stone-900 dark:text-stone-100">#{currentOrderReceipt.orderNumber}</span> has been dispatched to our Kyoto and Copenhagen packing ateliers.
          </p>
        </div>

        {/* Live Timeline Tracker */}
        <div className="p-4 bg-stone-100 dark:bg-stone-900/60 rounded-xl border border-stone-200 dark:border-stone-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-700 dark:text-stone-300">
            <span>Fulfillment Pipeline</span>
            <span className="text-[11px] text-amber-700 dark:text-amber-400 font-mono">
              Status: {currentOrderReceipt.status.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center text-[10px] text-stone-500">
            <div className="space-y-1">
              <div className="h-1.5 rounded-full bg-emerald-600"></div>
              <span className="font-semibold text-stone-900 dark:text-stone-100">Confirmed</span>
            </div>
            <div className="space-y-1">
              <div className="h-1.5 rounded-full bg-emerald-600"></div>
              <span className="font-semibold text-stone-900 dark:text-stone-100">Atelier Curation</span>
            </div>
            <div className="space-y-1">
              <div className="h-1.5 rounded-full bg-stone-300 dark:bg-stone-700"></div>
              <span>Transit</span>
            </div>
            <div className="space-y-1">
              <div className="h-1.5 rounded-full bg-stone-300 dark:bg-stone-700"></div>
              <span>Delivered</span>
            </div>
          </div>
        </div>

        {/* Order Details Receipt Box */}
        <div className="p-5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 space-y-4 text-xs">
          <div className="flex justify-between items-center pb-3 border-b border-stone-200 dark:border-stone-800">
            <div>
              <span className="text-stone-400 uppercase text-[10px] tracking-wider">Destination</span>
              <p className="font-medium text-stone-800 dark:text-stone-200">
                {currentOrderReceipt.shippingAddress.street}, {currentOrderReceipt.shippingAddress.city},{' '}
                {currentOrderReceipt.shippingAddress.country}
              </p>
            </div>
            <div className="text-right">
              <span className="text-stone-400 uppercase text-[10px] tracking-wider">Payment Mode</span>
              <p className="font-medium text-stone-800 dark:text-stone-200 uppercase">
                {currentOrderReceipt.paymentMethod} &bull; {currentOrderReceipt.paymentStatus}
              </p>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {currentOrderReceipt.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-xs">
                <span className="text-stone-700 dark:text-stone-300">
                  {item.productName} <span className="text-stone-400">({item.variantName} &times; {item.quantity})</span>
                </span>
                <span className="font-mono font-medium text-stone-900 dark:text-stone-100">RS {item.totalPrice}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-stone-200 dark:border-stone-800 space-y-1 text-stone-500">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>RS {currentOrderReceipt.subtotal}</span>
            </div>
            {currentOrderReceipt.discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount</span>
                <span>-RS {currentOrderReceipt.discount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span>{currentOrderReceipt.shippingFee === 0 ? 'Complimentary' : `RS ${currentOrderReceipt.shippingFee}`}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (8%)</span>
              <span>RS {currentOrderReceipt.tax}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-stone-900 dark:text-stone-100 pt-2 border-t border-stone-200 dark:border-stone-800">
              <span>Grand Total</span>
              <span>RS {currentOrderReceipt.total}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons: Print Invoice, View Dispatch Email, Continue Shopping */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-5 py-3 rounded-full border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Invoice</span>
          </button>

          <button
            onClick={() => setShowEmailPreview(!showEmailPreview)}
            className="w-full sm:w-auto px-5 py-3 rounded-full border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>{showEmailPreview ? 'Hide Confirmation Email' : 'Preview Sent Email'}</span>
          </button>

          <button
            onClick={handleContinueShopping}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-full bg-stone-900 text-stone-100 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white text-xs font-semibold uppercase tracking-widest transition-colors shadow-md flex items-center justify-center gap-2"
          >
            <span>Continue Curating</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Simulated Email Notification Viewer */}
        {showEmailPreview && (
          <div className="p-4 bg-stone-900 text-stone-200 rounded-xl text-xs font-mono space-y-2 border border-stone-700 animate-in fade-in duration-200">
            <div className="flex justify-between text-stone-400 border-b border-stone-800 pb-2">
              <span>To: {currentOrderReceipt.customerEmail}</span>
              <span>From: concierge@onestopbymajid.com</span>
            </div>
            <p className="font-bold text-white">Subject: Your Onestop by Majid Order #{currentOrderReceipt.orderNumber} is Confirmed</p>
            <p className="text-stone-400 text-[11px] leading-relaxed">
              Dear {currentOrderReceipt.shippingAddress.fullName}, thank you for shopping with Onestop by Majid. Your parcel has been assigned reference #{currentOrderReceipt.orderNumber} and will dispatch via {currentOrderReceipt.carrier || 'Carbon-Neutral Carrier'}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
