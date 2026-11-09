import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { ArrowRight, Check } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, setSelectedCategory, addToast } = useStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    addToast('Thank you for subscribing to the Onestop Gazette.', 'success');
    setEmail('');
  };

  const handleCategoryClick = (catId: string) => {
    setSelectedCategory(catId);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#1c1917] text-stone-300 pt-16 pb-12 border-t border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-stone-800">
          {/* Brand & Manifesto */}
          <div className="md:col-span-4 space-y-4">
            <span className="font-serif text-2xl tracking-[0.2em] text-white">ONESTOP BY MAJID</span>
            <p className="text-xs text-stone-400 leading-relaxed font-normal max-w-sm">
              We curate thoughtful essentials for refined living. Uncompromising quality, honest craftsmanship, and timeless design in one place.
            </p>
            <div className="text-[11px] text-stone-500 tracking-wider uppercase">
              Onestop by Majid &bull; Curated Living
            </div>
          </div>

          {/* Catalog Categories */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-stone-100">Curation</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => handleCategoryClick('cat-beauty-healthcare')}
                  className="hover:text-white transition-colors text-amber-300 font-medium"
                >
                  Beauty &amp; Healthcare
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('cat-fashion-apparel')}
                  className="hover:text-white transition-colors"
                >
                  Fashion &amp; Apparel
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('cat-islamic-essentials')}
                  className="hover:text-white transition-colors"
                >
                  Islamic Essentials
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('cat-home-living')}
                  className="hover:text-white transition-colors"
                >
                  Home &amp; Living
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('cat-travel-outdoor')}
                  className="hover:text-white transition-colors"
                >
                  Travel &amp; Outdoor
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleCategoryClick('cat-kids-accessories')}
                  className="hover:text-white transition-colors"
                >
                  Kids Accessories
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-stone-100">Care</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">Shipping & Returns</span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">Product Provenance</span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">Sustainable Sourcing</span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">Artisan Directory</span>
              </li>
              <li>
                <span className="hover:text-white cursor-pointer transition-colors">Client Concierge</span>
              </li>
            </ul>
          </div>

          {/* Gazette / Newsletter */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-stone-100">The Gazette</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Receive limited release notices, private collection previews, and essays on tactile design. Never spam.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 p-3 bg-stone-900 border border-stone-800 text-xs text-emerald-400 rounded">
                <Check className="w-4 h-4" />
                <span>You are subscribed to the seasonal edition.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full px-3.5 py-2.5 bg-stone-900 border border-stone-800 text-xs text-stone-200 placeholder-stone-500 rounded-l focus:outline-none focus:border-stone-500"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  className="px-4 py-2.5 bg-stone-100 text-stone-900 text-xs font-semibold rounded-r hover:bg-white transition-colors flex items-center justify-center"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-4">
          <p>&copy; {new Date().getFullYear()} Onestop by Majid. Handcrafted with reverence for quality and simplicity.</p>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security Statement</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
