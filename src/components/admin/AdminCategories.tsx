import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Plus, Trash2, Tag, Layers } from 'lucide-react';

export const AdminCategories: React.FC = () => {
  const { categories, brands, addCategory, deleteCategory, addBrand, deleteBrand } = useStore();

  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catImage, setCatImage] = useState('');

  const [brandName, setBrandName] = useState('');

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;
    addCategory({
      name: catName.trim(),
      slug: catName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: catDesc.trim(),
      imageUrl: catImage.trim() || 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=600&q=80',
    });
    setCatName('');
    setCatDesc('');
    setCatImage('');
  };

  const handleAddBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim()) return;
    addBrand({
      name: brandName.trim(),
      slug: brandName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    });
    setBrandName('');
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl text-stone-900 dark:text-stone-100">Taxonomy: Categories &amp; Ateliers</h2>
        <p className="text-xs text-stone-500">Configure catalog divisions and artisan brand profiles.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Categories Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-stone-500" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-900 dark:text-stone-100">
              Categories ({categories.length})
            </h3>
          </div>

          <form onSubmit={handleAddCategory} className="p-4 bg-stone-100 dark:bg-stone-900 rounded-xl space-y-3 text-xs">
            <h4 className="font-medium text-stone-800 dark:text-stone-200 uppercase text-[10px] tracking-wider">
              Add New Category
            </h4>
            <input
              type="text"
              required
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              placeholder="Category Name (e.g. Glassware)"
              className="w-full px-3 py-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none"
            />
            <input
              type="text"
              value={catDesc}
              onChange={(e) => setCatDesc(e.target.value)}
              placeholder="Short Description"
              className="w-full px-3 py-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none"
            />
            <input
              type="url"
              value={catImage}
              onChange={(e) => setCatImage(e.target.value)}
              placeholder="Cover Image URL"
              className="w-full px-3 py-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none font-mono"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-full bg-stone-900 text-stone-100 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Add Category
            </button>
          </form>

          <div className="divide-y divide-stone-200 dark:divide-stone-800 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden bg-white dark:bg-stone-900">
            {categories.map((c) => (
              <div key={c.id} className="p-3.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  {c.imageUrl && (
                    <img src={c.imageUrl} alt="" className="w-10 h-10 object-cover rounded bg-stone-100" />
                  )}
                  <div>
                    <p className="font-semibold text-stone-900 dark:text-stone-100">{c.name}</p>
                    <p className="text-[10px] text-stone-400 font-mono">slug: {c.slug}</p>
                  </div>
                </div>
                <button
                  onClick={() => deleteCategory(c.id)}
                  className="p-1.5 text-stone-400 hover:text-rose-500 transition-colors"
                  aria-label={`Delete ${c.name}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Brands Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-stone-500" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-900 dark:text-stone-100">
              Ateliers &amp; Brands ({brands.length})
            </h3>
          </div>

          <form onSubmit={handleAddBrand} className="p-4 bg-stone-100 dark:bg-stone-900 rounded-xl space-y-3 text-xs">
            <h4 className="font-medium text-stone-800 dark:text-stone-200 uppercase text-[10px] tracking-wider">
              Register New Atelier
            </h4>
            <input
              type="text"
              required
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="Brand Name (e.g. Sylvan Archive)"
              className="w-full px-3 py-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-full bg-stone-900 text-stone-100 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Add Atelier
            </button>
          </form>

          <div className="divide-y divide-stone-200 dark:divide-stone-800 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden bg-white dark:bg-stone-900">
            {brands.map((b) => (
              <div key={b.id} className="p-3.5 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-stone-900 dark:text-stone-100">{b.name}</p>
                  <p className="text-[10px] text-stone-400 font-mono">slug: {b.slug}</p>
                </div>
                <button
                  onClick={() => deleteBrand(b.id)}
                  className="p-1.5 text-stone-400 hover:text-rose-500 transition-colors"
                  aria-label={`Delete ${b.name}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
