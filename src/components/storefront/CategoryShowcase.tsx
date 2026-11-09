import React from 'react';
import { useStore } from '../../store/useStore';
import { ArrowRight } from 'lucide-react';

export const CategoryShowcase: React.FC = () => {
  const { categories, setSelectedCategory, setCurrentView } = useStore();

  const handleSelectCategory = (catId: string) => {
    setSelectedCategory(catId);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-16 sm:py-24 bg-[#faf9f6] dark:bg-[#0c0a09] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-stone-200 dark:border-stone-800">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-stone-400">
              Taxonomy of Goods
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-stone-900 dark:text-stone-100 mt-1">
              Curated Mediums
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategory(null);
              setCurrentView('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="mt-4 sm:mt-0 text-xs font-semibold uppercase tracking-widest text-stone-900 dark:text-stone-100 hover:opacity-70 transition-opacity flex items-center gap-1.5"
          >
            <span>View All Works</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-5">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleSelectCategory(category.id)}
              className="group relative flex flex-col text-left rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 focus:outline-none transition-all duration-300 hover:shadow-xl"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-200 dark:bg-stone-800">
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="font-serif text-lg font-normal tracking-wide text-white group-hover:text-amber-200 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-[11px] text-stone-300 mt-0.5 line-clamp-1">{category.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
