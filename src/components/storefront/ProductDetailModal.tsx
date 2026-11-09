import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { X, Heart, ShoppingBag, ShieldCheck, Truck, RotateCcw, Star, ChevronDown, Check } from 'lucide-react';
import { ProductVariant } from '../../types';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProductId,
    setSelectedProductId,
    products,
    reviews,
    addReview,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setIsCheckoutOpen,
  } = useStore();

  const product = products.find((p) => p.id === selectedProductId);

  // States
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product?.variants[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'materials' | 'shipping'>('details');
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  // Review Form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewEmail, setReviewEmail] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  if (!product) return null;

  const currentImage = product.images[selectedImageIndex]?.url || product.images[0]?.url;
  const inWishlist = isInWishlist(product.id);
  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;
  const isOutOfStock = currentStock <= 0;
  const productReviews = reviews.filter((r) => r.productId === product.id);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedVariant, quantity);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedVariant, quantity);
    setSelectedProductId(null);
    setIsCheckoutOpen(true);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewEmail || !reviewComment) return;
    addReview({
      productId: product.id,
      userName: reviewName,
      userEmail: reviewEmail,
      rating: reviewRating,
      comment: reviewComment,
      verifiedPurchase: true,
    });
    setReviewComment('');
    setShowReviewForm(false);
  };

  const relatedProducts = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-5xl bg-[#faf9f6] dark:bg-[#12100e] rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedProductId(null)}
          aria-label="Close product view"
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/80 dark:bg-stone-900/80 backdrop-blur text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white shadow-md transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-10 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Gallery Column */}
            <div className="lg:col-span-7 space-y-4">
              {/* Main Image with Zoom on Hover */}
              <div
                className="relative aspect-[4/5] rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 cursor-crosshair"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleMouseMove}
              >
                <img
                  src={currentImage}
                  alt={product.name}
                  className={`w-full h-full object-cover object-center transition-transform duration-200 ${
                    isZoomed ? 'scale-150' : 'scale-100'
                  }`}
                  style={isZoomed ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : undefined}
                />
                {isOutOfStock && (
                  <div className="absolute inset-0 bg-stone-950/50 flex items-center justify-center backdrop-blur-xs">
                    <span className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold uppercase tracking-widest rounded">
                      Temporarily Sold Out
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-20 h-24 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                        selectedImageIndex === idx
                          ? 'border-stone-900 dark:border-stone-100 scale-95'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img.url} alt={img.altText} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Meta & Purchase Actions Column */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-stone-400 uppercase tracking-widest">
                  <span>{product.brandName}</span>
                  <span className="font-mono text-[11px]">{selectedVariant?.sku || 'STD-01'}</span>
                </div>

                <h1 className="font-serif text-3xl sm:text-4xl font-normal text-stone-900 dark:text-stone-100 leading-tight">
                  {product.name}
                </h1>

                <p className="text-xs text-stone-500 italic font-serif text-base">{product.tagline}</p>

                {/* Rating summary */}
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex text-amber-500">
                    {'★'.repeat(Math.round(product.rating))}
                    {'☆'.repeat(5 - Math.round(product.rating))}
                  </div>
                  <span className="font-medium text-stone-700 dark:text-stone-300">{product.rating}</span>
                  <span className="text-stone-400">({product.reviewCount} customer reviews)</span>
                </div>

                {/* Pricing & Stock status */}
                <div className="flex items-baseline gap-3 pt-2">
                  <span className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                    RS {product.price}
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-sm text-stone-400 line-through">
                      RS {product.compareAtPrice}
                    </span>
                  )}
                  <span className="ml-auto text-xs font-medium">
                    {currentStock > 5 ? (
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> In Stock ({currentStock})
                      </span>
                    ) : currentStock > 0 ? (
                      <span className="text-rose-600 dark:text-rose-400 font-bold">
                        Only {currentStock} left
                      </span>
                    ) : (
                      <span className="text-stone-400">Out of Stock</span>
                    )}
                  </span>
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-normal pt-2">
                  {product.description}
                </p>

                {/* Variant Options (Size / Color) */}
                {product.variants.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                      Selection: {selectedVariant?.size || selectedVariant?.color || 'Standard'}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.map((v) => {
                        const isSelected = selectedVariant?.id === v.id;
                        return (
                          <button
                            key={v.id}
                            onClick={() => setSelectedVariant(v)}
                            className={`px-3 py-2 text-xs rounded-md border text-left transition-all ${
                              isSelected
                                ? 'border-stone-900 bg-stone-900 text-white dark:border-white dark:bg-white dark:text-black font-semibold'
                                : 'border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-400'
                            }`}
                          >
                            <div className="flex items-center gap-1.5">
                              {v.colorHex && (
                                <span
                                  className="w-2.5 h-2.5 rounded-full border border-stone-300"
                                  style={{ backgroundColor: v.colorHex }}
                                ></span>
                              )}
                              <span>{v.size || v.color}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Quantity & Actions */}
                <div className="pt-4 space-y-3">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="flex items-center gap-3">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-stone-300 dark:border-stone-700 rounded-md shrink-0">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          disabled={quantity <= 1 || isOutOfStock}
                          className="px-3 py-2 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30"
                        >
                          -
                        </button>
                        <span className="px-4 text-xs font-bold text-stone-900 dark:text-stone-100">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                          disabled={quantity >= currentStock || isOutOfStock}
                          className="px-3 py-2 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-30"
                        >
                          +
                        </button>
                      </div>

                      {/* Wishlist Button on mobile alongside stepper */}
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        aria-label="Save to Wishlist"
                        className="sm:hidden p-2.5 rounded-md border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                      >
                        <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
                      </button>
                    </div>

                    {/* Add To Cart Button */}
                    <button
                      onClick={handleAddToCart}
                      disabled={isOutOfStock}
                      className={`flex-1 py-3 px-6 rounded-md text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md ${
                        isOutOfStock
                          ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                          : 'bg-stone-900 hover:bg-stone-800 text-stone-100 dark:bg-stone-100 dark:hover:bg-white dark:text-stone-900'
                      }`}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>{isOutOfStock ? 'Sold Out' : 'Add to Bag'}</span>
                    </button>

                    {/* Wishlist Button (desktop) */}
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      aria-label="Save to Wishlist"
                      className="hidden sm:inline-flex p-3 rounded-md border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                    >
                      <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                  </div>

                  {/* Instant Buy Now */}
                  <button
                    onClick={handleBuyNow}
                    disabled={isOutOfStock}
                    className="w-full py-3 rounded-md border border-stone-900 dark:border-stone-100 text-stone-900 dark:text-stone-100 hover:bg-stone-900 hover:text-white dark:hover:bg-white dark:hover:text-black text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-40"
                  >
                    Direct Checkout
                  </button>
                </div>
              </div>

              {/* Guarantees */}
              <div className="pt-4 border-t border-stone-200 dark:border-stone-800 grid grid-cols-2 gap-3 text-[11px] text-stone-500">
                <div className="flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 shrink-0 text-stone-400" />
                  <span>Free shipping &gt; RS 150</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-3.5 h-3.5 shrink-0 text-stone-400" />
                  <span>30-day gentle returns</span>
                </div>
              </div>
            </div>
          </div>

          {/* Accordion / Tabbed Specifications */}
          <div className="border-t border-stone-200 dark:border-stone-800 pt-8">
            <div className="flex border-b border-stone-200 dark:border-stone-800 gap-4 sm:gap-8 overflow-x-auto whitespace-nowrap scrollbar-none pb-0.5">
              {(['details'/*, 'materials', 'shipping'*/] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-xs font-semibold uppercase tracking-widest capitalize transition-colors shrink-0 ${
                    activeTab === tab
                      ? 'border-b-2 border-stone-900 dark:border-white text-stone-900 dark:text-white'
                      : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-300'
                  }`}
                >
                  {tab === 'details' ? 'Specifications' : tab === 'materials' ? 'Materials & Care' : 'Shipping & Sourcing'}
                </button>
              ))}
            </div>

            <div className="py-6 text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              {activeTab === 'details' && (
                <ul className="list-disc pl-5 space-y-2">
                  {product.details.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                  <li>Primary Material: {product.materials}</li>
                  <li>Artisan Atelier: {product.brandName}</li>
                </ul>
              )}
              {/* Material & Care and Shipping & Sourcing commented out per request
              {activeTab === 'materials' && (
                <div className="space-y-3">
                  <p>
                    <strong>Material Integrity:</strong> {product.materials}
                  </p>
                  <p>
                    Each object is composed with raw, non-toxic finishes. Stoneware pieces should be washed with pH-neutral detergent. Metals will naturally develop an authentic patina reflecting touch and atmosphere.
                  </p>
                </div>
              )}
              {activeTab === 'shipping' && (
                <div className="space-y-3">
                  <p>
                    Shipped directly from our climate-neutral fulfillment ateliers in Kyoto and Copenhagen using molded pulp, plastic-free protective cradles.
                  </p>
                  <p>
                    Complimentary express dispatch on all orders exceeding RS 150. Global deliveries take 3-5 business days via DHL Express carbon-neutral air freight.
                  </p>
                </div>
              )}
              */}
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="border-t border-stone-200 dark:border-stone-800 pt-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl text-stone-900 dark:text-stone-100">Patron Impressions</h3>
                <p className="text-xs text-stone-500">Verified owners reflect on form and daily utility</p>
              </div>
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-4 py-2 rounded-full border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold tracking-wider uppercase transition-colors"
              >
                {showReviewForm ? 'Cancel Review' : 'Write an Impression'}
              </button>
            </div>

            {/* Review Submission Form */}
            {showReviewForm && (
              <form
                onSubmit={handleReviewSubmit}
                className="p-5 bg-stone-100 dark:bg-stone-900/60 rounded-xl space-y-4 border border-stone-200 dark:border-stone-800"
              >
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-800 dark:text-stone-200">
                  Share Your Experience
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium uppercase text-stone-500 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      placeholder="e.g. Maya Lin"
                      className="w-full px-3 py-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-xs text-stone-900 dark:text-stone-100 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium uppercase text-stone-500 mb-1">Your Email</label>
                    <input
                      type="email"
                      required
                      value={reviewEmail}
                      onChange={(e) => setReviewEmail(e.target.value)}
                      placeholder="e.g. maya@example.com"
                      className="w-full px-3 py-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-xs text-stone-900 dark:text-stone-100 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium uppercase text-stone-500 mb-1">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className={`text-lg transition-transform ${star <= reviewRating ? 'text-amber-500 scale-110' : 'text-stone-300 dark:text-stone-700'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium uppercase text-stone-500 mb-1">Your Review</label>
                  <textarea
                    rows={3}
                    required
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Describe how the object feels in your home..."
                    className="w-full px-3 py-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-xs text-stone-900 dark:text-stone-100 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-stone-900 text-stone-100 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Publish Impression
                </button>
              </form>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
              {productReviews.length > 0 ? (
                productReviews.map((r) => (
                  <div
                    key={r.id}
                    className="p-4 bg-stone-50 dark:bg-stone-900/30 rounded-lg border border-stone-200/60 dark:border-stone-800/60 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-stone-900 dark:text-stone-100">{r.userName}</span>
                      <span className="text-[10px] text-stone-400">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex text-amber-500 text-xs">
                      {'★'.repeat(r.rating)}
                      {'☆'.repeat(5 - r.rating)}
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">{r.comment}</p>
                    {r.verifiedPurchase && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                        <Check className="w-3 h-3" /> Verified Patron
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-stone-400 italic">No reviews yet for this work. Be the first to share an impression.</p>
              )}
            </div>
          </div>

          {/* Related Works */}
          {relatedProducts.length > 0 && (
            <div className="border-t border-stone-200 dark:border-stone-800 pt-8 space-y-4">
              <h3 className="font-serif text-xl text-stone-900 dark:text-stone-100">Companion Works</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedProducts.map((rel) => {
                  const relImg = rel.images.find((i) => i.isPrimary)?.url || rel.images[0]?.url;
                  return (
                    <button
                      key={rel.id}
                      onClick={() => setSelectedProductId(rel.id)}
                      className="group flex items-center gap-3 p-3 rounded-lg bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-left hover:border-stone-400 transition-colors"
                    >
                      <img src={relImg} alt={rel.name} className="w-14 h-16 object-cover rounded bg-stone-200 shrink-0" />
                      <div>
                        <h4 className="text-xs font-medium text-stone-900 dark:text-stone-100 group-hover:underline line-clamp-1">
                          {rel.name}
                        </h4>
                        <p className="text-xs font-semibold text-stone-800 dark:text-stone-200 mt-1">RS {rel.price}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
