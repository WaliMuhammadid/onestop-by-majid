import React from 'react';
import { useStore } from '../../store/useStore';
import { ArrowRight, ShieldCheck, Sparkles, Feather } from 'lucide-react';

export const Hero: React.FC = () => {
  const { setCurrentView, resetFilters } = useStore();

  const handleShopNow = () => {
    resetFilters();
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-[#faf9f6] dark:bg-[#0c0a09] border-b border-stone-200 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Editorial Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-600 dark:text-stone-300">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Onestop by Majid &bull; Curated Living</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal leading-[1.08] text-stone-900 dark:text-stone-50 tracking-tight">
              Curated Living. <br />
              <span className="italic font-light">All in One Place.</span>
            </h1>

            <p className="text-base sm:text-lg text-stone-600 dark:text-stone-400 font-normal leading-relaxed max-w-xl">
              A timeless destination for thoughtful everyday essentials. From restorative personal care and refined apparel to handcrafted homewares, tools, and lifestyle goods — thoughtfully sourced for quality that endures.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
              <button
                onClick={handleShopNow}
                className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-stone-900 text-stone-100 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white text-xs font-semibold uppercase tracking-widest transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
              >
                <span>Browse All Categories</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  setCurrentView('about');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-transparent hover:bg-stone-200/50 dark:hover:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold uppercase tracking-widest transition-colors text-center"
              >
                Our Philosophy
              </button>
            </div>

            {/* Ethos Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-6 sm:pt-8 border-t border-stone-200/80 dark:border-stone-800/80 max-w-lg">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-stone-500 shrink-0" />
                <span className="text-[11px] text-stone-500 leading-tight">Curated With Precision</span>
              </div>
              <div className="flex items-center gap-2">
                <Feather className="w-4 h-4 text-stone-500 shrink-0" />
                <span className="text-[11px] text-stone-500 leading-tight">100% Quality Guaranteed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                <span className="text-[11px] text-stone-500 leading-tight">Direct Fast Dispatch</span>
              </div>
            </div>
          </div>

          {/* Right Editorial Image Grid */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Primary Image - Timeless Architectural Living Aesthetic */}
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-stone-200/60 dark:border-stone-800/60 bg-stone-100 dark:bg-stone-900">
                <img
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85"
                  alt="Onestop by Majid - Timeless Living Collection"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-stone-950/20 to-transparent"></div>
                <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6 sm:right-6 text-white space-y-1">
                  <span className="text-[10px] uppercase tracking-widest font-semibold text-amber-300">
                    Onestop Standard &bull; Signature Living
                  </span>
                  <p className="font-serif text-lg sm:text-xl font-normal">The Art of Everyday Essentials</p>
                  <span className="text-xs text-stone-300">Quality &bull; Simplicity &bull; Permanence</span>
                </div>
              </div>

              {/* Floating Accent Card */}
              <div className="absolute bottom-3 left-3 sm:-bottom-8 sm:-left-8 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md p-3.5 sm:p-5 rounded-xl shadow-xl border border-stone-200/80 dark:border-stone-800 max-w-[190px] sm:max-w-[240px]">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                  <span className="text-sm font-bold tracking-tight">4.9 / 5.0</span>
                  <div className="flex text-amber-500 text-xs">★★★★★</div>
                </div>
                <p className="text-[10px] sm:text-[11px] text-stone-500 dark:text-stone-400 mt-1 leading-snug">
                  Curated for discerning patrons who value enduring quality and mindful living.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
