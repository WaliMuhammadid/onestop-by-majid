import React from 'react';
import { useStore } from '../../store/useStore';
import { ArrowRight, Feather, ShieldCheck, RefreshCw } from 'lucide-react';

export const Philosophy: React.FC = () => {
  const { setCurrentView, resetFilters } = useStore();

  const handleGoToCatalog = () => {
    resetFilters();
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-20 sm:py-28 bg-[#faf9f6] dark:bg-[#0c0a09] transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-stone-400">
            Design Ethos
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-stone-900 dark:text-stone-100 leading-tight">
            Restraint, Integrity, <br />
            <span className="italic font-light">&amp; Material Honesty.</span>
          </h1>
          <p className="text-base sm:text-lg text-stone-600 dark:text-stone-400 font-light max-w-xl mx-auto leading-relaxed">
            In an era of disposable mass production, Onestop by Majid exists to curate objects that age with grace.
          </p>
        </div>

        {/* Narrative Paragraphs */}
        <div className="space-y-8 text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed font-normal">
          <p>
            Every artifact in our collection begins in small independent ateliers in Kyoto, the French Jura mountains, and rural Denmark. We collaborate exclusively with master craftspeople who honor unhurried methods: cold-pressing wild organic botanicals, hand-forging precision steel tools, sand-casting molten yellow brass left intentionally unlacquered to develop a deep patina, and 12-gauge whole-garment knitting using pure, un-dyed Australian superfine merino fleece.
          </p>

          <p>
            We do not manufacture for seasonal trends or obsolescence. We curate forms reduced to their elemental utility, where the sensory nourishment of botanical extracts, the tactile texture of organic linen, or the quiet weight of solid metal becomes the ornament itself.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
          <div className="p-6 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
            <Feather className="w-5 h-5 text-stone-700 dark:text-stone-300" />
            <h3 className="font-serif text-lg font-normal text-stone-900 dark:text-stone-100">Zero-Plastic Cradles</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Every parcel is protected with biodegradable molded sugarcane pulp and unbleached paper tape.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
            <ShieldCheck className="w-5 h-5 text-stone-700 dark:text-stone-300" />
            <h3 className="font-serif text-lg font-normal text-stone-900 dark:text-stone-100">Artisan Royalties</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              We pay fair living wages and royalties directly to master craftspeople, ensuring heritage techniques survive.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
            <RefreshCw className="w-5 h-5 text-stone-700 dark:text-stone-300" />
            <h3 className="font-serif text-lg font-normal text-stone-900 dark:text-stone-100">Lifetime Repair</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Any structural defect in our luminaires, organic textiles, or heirloom objects is repaired or conditioned for life.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8">
          <button
            onClick={handleGoToCatalog}
            className="px-8 py-4 rounded-full bg-stone-900 text-stone-100 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white text-xs font-semibold uppercase tracking-widest transition-all shadow-md inline-flex items-center gap-2 group"
          >
            <span>Explore The Collection</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
