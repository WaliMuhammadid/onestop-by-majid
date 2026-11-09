import React, { useState, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { Product, ProductVariant } from '../../types';
import { productFormSchema } from '../../lib/validation';
import { uploadProductImage } from '../../lib/supabase';
import { Plus, Search, Edit2, Trash2, Eye, EyeOff, Image as ImageIcon, X, Check, Upload, Loader2 } from 'lucide-react';

export const AdminProducts: React.FC = () => {
  const {
    products,
    categories,
    brands,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductPublish,
    restockProduct,
  } = useStore();

  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form State for Create / Edit
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(100);
  const [compareAtPrice, setCompareAtPrice] = useState<number | undefined>(undefined);
  const [categoryId, setCategoryId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [stock, setStock] = useState(10);
  const [materials, setMaterials] = useState('');
  const [images, setImages] = useState<{ id: string; url: string; altText: string; isPrimary: boolean }[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [newVarSize, setNewVarSize] = useState('');
  const [newVarColor, setNewVarColor] = useState('');
  const [newVarStock, setNewVarStock] = useState(5);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brandName.toLowerCase().includes(search.toLowerCase());
    const matchesCat = !filterCat || p.categoryId === filterCat;
    return matchesSearch && matchesCat;
  });

  const openCreateModal = () => {
    setName('');
    setTagline('');
    setDescription('');
    setPrice(120);
    setCompareAtPrice(undefined);
    setCategoryId(categories[0]?.id || '');
    setBrandId(brands[0]?.id || '');
    setStock(15);
    setMaterials('Handcrafted raw stoneware');
    setImages([
      {
        id: 'img-1',
        url: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80',
        altText: 'Primary Image',
        isPrimary: true,
      },
    ]);
    setVariants([
      { id: `var-${Date.now()}-1`, sku: 'OSM-NEW-01', size: 'Standard', color: 'Natural Bone', stock: 15 },
    ]);
    setEditingProduct(null);
    setErrors({});
    setIsCreateOpen(true);
  };

  const openEditModal = (prod: Product) => {
    setName(prod.name);
    setTagline(prod.tagline);
    setDescription(prod.description);
    setPrice(prod.price);
    setCompareAtPrice(prod.compareAtPrice);
    setCategoryId(prod.categoryId);
    setBrandId(prod.brandId);
    setStock(prod.stock);
    setMaterials(prod.materials);
    setImages(prod.images);
    setVariants(prod.variants);
    setEditingProduct(prod);
    setErrors({});
    setIsCreateOpen(true);
  };

  const handleAddImage = () => {
    if (!imageUrlInput.trim()) return;
    const newImg = {
      id: `img-${Date.now()}`,
      url: imageUrlInput.trim(),
      altText: `${name} view`,
      isPrimary: images.length === 0,
    };
    setImages([...images, newImg]);
    setImageUrlInput('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const uploadedImages: { id: string; url: string; altText: string; isPrimary: boolean }[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const publicUrl = await uploadProductImage(file);
        uploadedImages.push({
          id: `img-${Date.now()}-${i}`,
          url: publicUrl,
          altText: file.name.replace(/\.[^/.]+$/, '') || name || 'Product image',
          isPrimary: images.length === 0 && i === 0,
        });
      }
      setImages((prev) => [...prev, ...uploadedImages]);
    } catch (err: any) {
      alert(`Image upload error: ${err.message || 'Failed to upload image'}`);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (id: string) => {
    const updated = images.filter((img) => img.id !== id);
    if (updated.length > 0 && !updated.some((i) => i.isPrimary)) {
      updated[0].isPrimary = true;
    }
    setImages(updated);
  };

  const handleSetPrimaryImage = (id: string) => {
    setImages(images.map((img) => ({ ...img, isPrimary: img.id === id })));
  };

  const handleAddVariant = () => {
    if (!newVarSize && !newVarColor) return;
    const newVariant: ProductVariant = {
      id: `var-${Date.now()}`,
      sku: `OSM-${(newVarSize || 'STD').toUpperCase()}-${Date.now().toString().slice(-4)}`,
      size: newVarSize || undefined,
      color: newVarColor || undefined,
      stock: newVarStock,
    };
    setVariants([...variants, newVariant]);
    setNewVarSize('');
    setNewVarColor('');
  };

  const handleRemoveVariant = (id: string) => {
    setVariants(variants.filter((v) => v.id !== id));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = productFormSchema.safeParse({
      name,
      tagline,
      description,
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      categoryId,
      brandId,
      stock: Number(stock),
      materials,
      isPublished: true,
      isFeatured: false,
      isNewArrival: true,
    });

    if (!result.success) {
      const errMap: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        errMap[issue.path[0] as string] = issue.message;
      });
      setErrors(errMap);
      return;
    }

    const catObj = categories.find((c) => c.id === categoryId);
    const brandObj = brands.find((b) => b.id === brandId);

    const ensuredImages =
      images.length > 0
        ? images
        : [
            {
              id: 'fallback-img',
              url: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80',
              altText: name,
              isPrimary: true,
            },
          ];

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name,
        tagline,
        description,
        price: Number(price),
        compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
        categoryId,
        categoryName: catObj?.name || 'Curated',
        brandId,
        brandName: brandObj?.name || 'Onestop by Majid',
        stock: Number(stock),
        materials,
        images: ensuredImages,
        variants,
      });
    } else {
      await addProduct({
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        tagline,
        description,
        details: ['Handcrafted with material honesty', 'Inspect upon receipt'],
        materials,
        price: Number(price),
        compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
        categoryId,
        categoryName: catObj?.name || 'Curated',
        brandId,
        brandName: brandObj?.name || 'Onestop by Majid',
        stock: Number(stock),
        isPublished: true,
        isFeatured: false,
        isNewArrival: true,
        tags: ['minimal', 'crafted'],
        images: ensuredImages,
        variants,
      });
    }

    setIsCreateOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-stone-900 dark:text-stone-100">Catalog Inventory Management</h2>
          <p className="text-xs text-stone-500">
            Create, modify variants, regulate stock allocations, and manage product image collections.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-stone-900 text-stone-100 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 text-xs font-semibold uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Artifact</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, brand, or SKU..."
            className="w-full pl-9 pr-3 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg text-xs text-stone-900 dark:text-stone-100 focus:outline-none"
          />
        </div>

        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="px-3 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg text-xs text-stone-900 dark:text-stone-100 focus:outline-none"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm">
        <table className="w-full text-left text-xs min-w-[680px]">
          <thead className="bg-stone-50 dark:bg-stone-950/60 border-b border-stone-200 dark:border-stone-800 text-[11px] font-semibold uppercase tracking-wider text-stone-500">
            <tr>
              <th className="py-3.5 px-4">Work &amp; Atelier</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Price</th>
              <th className="py-3.5 px-4">Stock Level</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
            {filteredProducts.map((p) => {
              const primaryImg = p.images.find((i) => i.isPrimary)?.url || p.images[0]?.url;
              return (
                <tr key={p.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={primaryImg}
                        alt={p.name}
                        className="w-10 h-12 object-cover rounded bg-stone-100 shrink-0"
                      />
                      <div>
                        <p className="font-semibold text-stone-900 dark:text-stone-100">{p.name}</p>
                        <p className="text-[10px] text-stone-400">{p.brandName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-stone-600 dark:text-stone-300">{p.categoryName}</td>
                  <td className="py-3 px-4 font-mono font-medium text-stone-900 dark:text-stone-100">RS {p.price}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold ${
                        p.stock > 5
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : p.stock > 0
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {p.stock} units
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleProductPublish(p.id)}
                      className={`inline-flex items-center gap-1 text-[11px] font-medium transition-colors ${
                        p.isPublished ? 'text-emerald-600 hover:text-emerald-700' : 'text-stone-400 hover:text-stone-600'
                      }`}
                    >
                      {p.isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{p.isPublished ? 'Published' : 'Draft'}</span>
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => restockProduct(p.id, 10)}
                      className="px-2 py-1 text-[10px] font-semibold rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200"
                      title="Quick Restock +10 units"
                    >
                      +10 Stock
                    </button>
                    <button
                      onClick={() => openEditModal(p)}
                      className="p-1.5 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                      title="Edit Product"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you certain you wish to delete "${p.name}"?`)) {
                          deleteProduct(p.id);
                        }
                      }}
                      className="p-1.5 text-stone-500 hover:text-rose-600 transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Product Create / Edit Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
          <div
            className="w-full max-w-2xl bg-[#faf9f6] dark:bg-[#12100e] rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 p-4 sm:p-7 md:p-8 space-y-6 my-auto max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <h3 className="font-serif text-xl text-stone-900 dark:text-stone-100">
                {editingProduct ? `Edit Work: ${editingProduct.name}` : 'Catalog New Architectural Object'}
              </h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-stone-400 hover:text-stone-900">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium uppercase text-stone-500 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Botanical Restorative Elixir"
                    className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none"
                  />
                  {errors.name && <p className="text-[10px] text-rose-500 mt-0.5">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-medium uppercase text-stone-500 mb-1">Tagline *</label>
                  <input
                    type="text"
                    required
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g. Hand-thrown unglazed raw clay"
                    className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none"
                  />
                  {errors.tagline && <p className="text-[10px] text-rose-500 mt-0.5">{errors.tagline}</p>}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium uppercase text-stone-500 mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail the craft, origin, and sensory characteristics..."
                  className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none"
                />
                {errors.description && <p className="text-[10px] text-rose-500 mt-0.5">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-medium uppercase text-stone-500 mb-1">Price (RS) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium uppercase text-stone-500 mb-1">Compare Price</label>
                  <input
                    type="number"
                    min="1"
                    value={compareAtPrice || ''}
                    onChange={(e) => setCompareAtPrice(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="e.g. 150"
                    className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium uppercase text-stone-500 mb-1">Category *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-2.5 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium uppercase text-stone-500 mb-1">Brand / Atelier *</label>
                  <select
                    value={brandId}
                    onChange={(e) => setBrandId(e.target.value)}
                    className="w-full px-2.5 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none"
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium uppercase text-stone-500 mb-1">Total Stock *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium uppercase text-stone-500 mb-1">Material Integrity *</label>
                  <input
                    type="text"
                    required
                    value={materials}
                    onChange={(e) => setMaterials(e.target.value)}
                    placeholder="e.g. Solid C36000 Brass"
                    className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none"
                  />
                </div>
              </div>

              {/* Multiple Images Management */}
              <div className="space-y-3 pt-2 border-t border-stone-200 dark:border-stone-800">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-medium uppercase text-stone-500">
                    Product Images (Direct Supabase Storage Upload)
                  </label>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                    Upload 3+ pictures directly from your computer
                  </span>
                </div>

                {/* Direct File Upload Zone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-stone-300 dark:border-stone-700 hover:border-stone-900 dark:hover:border-stone-300 rounded-lg p-4 text-center cursor-pointer transition-colors bg-stone-50 dark:bg-stone-900/50 flex flex-col items-center justify-center gap-1.5"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                  />
                  {isUploading ? (
                    <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300 py-2">
                      <Loader2 className="w-5 h-5 animate-spin text-amber-600" />
                      <span className="text-xs font-medium">Uploading to Supabase Storage...</span>
                    </div>
                  ) : (
                    <>
                      <div className="w-9 h-9 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center text-stone-600 dark:text-stone-300">
                        <Upload className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                        Click here to select pictures (Select 1, 2, or 3 images together)
                      </p>
                      <p className="text-[10px] text-stone-400">
                        JPG, PNG, or WebP (Images will upload directly to Supabase)
                      </p>
                    </>
                  )}
                </div>

                {/* Optional Fallback: URL Input */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="url"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="Or paste an image URL here..."
                    className="flex-1 px-3 py-1.5 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded text-xs text-stone-900 dark:text-stone-100 focus:outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="px-3 py-1.5 rounded bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-300 dark:hover:bg-stone-700 text-xs font-semibold"
                  >
                    Add URL
                  </button>
                </div>

                <div className="flex gap-3 overflow-x-auto pt-2">
                  {images.map((img) => (
                    <div
                      key={img.id}
                      className="relative w-20 h-24 rounded border border-stone-300 dark:border-stone-700 overflow-hidden shrink-0 group"
                    >
                      <img src={img.url} alt="Uploaded" className="w-full h-full object-cover" />
                      {img.isPrimary && (
                        <span className="absolute top-1 left-1 bg-amber-600 text-[9px] text-white px-1 rounded font-bold">
                          Cover
                        </span>
                      )}
                      <div className="absolute inset-0 bg-stone-950/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity">
                        {!img.isPrimary && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryImage(img.id)}
                            className="text-[9px] bg-white text-stone-900 px-1 rounded font-semibold"
                          >
                            Set Cover
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(img.id)}
                          className="text-[9px] bg-rose-600 text-white px-1 rounded font-semibold"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Variants Section */}
              <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-stone-800">
                <label className="block text-[11px] font-medium uppercase text-stone-500">
                  Variants (Sizes &amp; Colors)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newVarSize}
                    onChange={(e) => setNewVarSize(e.target.value)}
                    placeholder="Size (e.g. M, Queen)"
                    className="w-1/3 px-3 py-1.5 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={newVarColor}
                    onChange={(e) => setNewVarColor(e.target.value)}
                    placeholder="Color (e.g. Raw Sand)"
                    className="w-1/3 px-3 py-1.5 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none"
                  />
                  <input
                    type="number"
                    min="1"
                    value={newVarStock}
                    onChange={(e) => setNewVarStock(Number(e.target.value))}
                    placeholder="Stock"
                    className="w-20 px-2 py-1.5 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 font-mono focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="px-3 py-1.5 rounded bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-semibold"
                  >
                    Add Variant
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {variants.map((v) => (
                    <span
                      key={v.id}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs border border-stone-200 dark:border-stone-700"
                    >
                      <span>
                        {v.size || ''} {v.color || ''} ({v.stock} pcs)
                      </span>
                      <button type="button" onClick={() => handleRemoveVariant(v.id)}>
                        <X className="w-3 h-3 hover:text-rose-500" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-stone-200 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-stone-900 text-stone-100 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 text-xs font-semibold uppercase tracking-wider shadow-md"
                >
                  {editingProduct ? 'Commit Changes' : 'Create Artifact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
