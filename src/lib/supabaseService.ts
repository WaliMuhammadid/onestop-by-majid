import { supabase, supabaseAdmin } from './supabase';
import { Product, ProductImage, ProductVariant, Category, Brand } from '../types';

/**
 * Fetch all categories from Supabase
 */
export async function fetchSupabaseCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error || !data) {
    console.error('Failed to fetch categories:', error);
    return [];
  }

  return data.map((c: any) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description || '',
    imageUrl: c.image_url || '',
  }));
}

/**
 * Fetch all brands from Supabase
 */
export async function fetchSupabaseBrands(): Promise<Brand[]> {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .order('name');

  if (error || !data) {
    console.error('Failed to fetch brands:', error);
    return [];
  }

  return data.map((b: any) => ({
    id: b.id,
    name: b.name,
    slug: b.slug,
    logoUrl: b.logo_url || '',
  }));
}

/**
 * Fetch all products from Supabase with nested images and variants
 */
export async function fetchSupabaseProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(name),
      brand:brands(name),
      product_images(*),
      product_variants(*)
    `)
    .order('created_at', { ascending: false });

  if (error || !data) {
    console.error('Failed to fetch products from Supabase:', error);
    return [];
  }

  return data.map((p: any) => {
    const rawImages = p.product_images || [];
    const images: ProductImage[] = rawImages
      .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
      .map((img: any) => ({
        id: img.id,
        url: img.url,
        altText: img.alt_text || p.name,
        isPrimary: img.is_primary,
      }));

    const rawVariants = p.product_variants || [];
    const variants: ProductVariant[] = rawVariants.map((v: any) => ({
      id: v.id,
      sku: v.sku,
      size: v.size || undefined,
      color: v.color || undefined,
      colorHex: v.color_hex || undefined,
      material: v.material || undefined,
      stock: v.stock || 0,
      priceModifier: Number(v.price_modifier || 0),
    }));

    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      tagline: p.tagline,
      description: p.description,
      details: p.details || [],
      materials: p.materials,
      price: Number(p.price),
      compareAtPrice: p.compare_at_price ? Number(p.compare_at_price) : undefined,
      categoryId: p.category_id || '',
      categoryName: p.category?.name || 'Curated',
      brandId: p.brand_id || '',
      brandName: p.brand?.name || 'Onestop by Majid',
      images,
      variants,
      stock: p.stock || 0,
      isPublished: p.is_published ?? true,
      isFeatured: p.is_featured ?? false,
      isNewArrival: p.is_new_arrival ?? false,
      rating: Number(p.rating || 5.0),
      reviewCount: Number(p.review_count || 0),
      tags: p.tags || [],
      createdAt: p.created_at,
      updatedAt: p.updated_at,
    };
  });
}

/**
 * Save / Create a new product directly in Supabase
 */
export async function createSupabaseProduct(
  productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'reviewCount'>
): Promise<Product> {
  // 1. Insert product record using supabaseAdmin to guarantee write access
  const { data: prodData, error: prodError } = await supabaseAdmin
    .from('products')
    .insert({
      name: productData.name,
      slug: productData.slug,
      tagline: productData.tagline,
      description: productData.description,
      details: productData.details,
      materials: productData.materials,
      price: productData.price,
      compare_at_price: productData.compareAtPrice || null,
      category_id: productData.categoryId || null,
      brand_id: productData.brandId || null,
      stock: productData.stock,
      is_published: productData.isPublished,
      is_featured: productData.isFeatured,
      is_new_arrival: productData.isNewArrival,
      tags: productData.tags,
    })
    .select('*, category:categories(name), brand:brands(name)')
    .single();

  if (prodError || !prodData) {
    throw new Error(`Product creation failed: ${prodError?.message}`);
  }

  const productId = prodData.id;

  // 2. Insert images if any
  const imagesToInsert = productData.images.map((img, idx) => ({
    product_id: productId,
    url: img.url,
    alt_text: img.altText || productData.name,
    is_primary: img.isPrimary,
    sort_order: idx,
  }));

  let savedImages: ProductImage[] = [];
  if (imagesToInsert.length > 0) {
    const { data: imgData, error: imgError } = await supabaseAdmin
      .from('product_images')
      .insert(imagesToInsert)
      .select('*');

    if (!imgError && imgData) {
      savedImages = imgData.map((img: any) => ({
        id: img.id,
        url: img.url,
        altText: img.alt_text,
        isPrimary: img.is_primary,
      }));
    }
  }

  // 3. Insert variants if any
  const variantsToInsert = productData.variants.map((v) => ({
    product_id: productId,
    sku: v.sku || `OSM-${Date.now()}`,
    size: v.size || null,
    color: v.color || null,
    color_hex: v.colorHex || null,
    material: v.material || null,
    stock: v.stock || 0,
    price_modifier: v.priceModifier || 0,
  }));

  let savedVariants: ProductVariant[] = [];
  if (variantsToInsert.length > 0) {
    const { data: varData, error: varError } = await supabaseAdmin
      .from('product_variants')
      .insert(variantsToInsert)
      .select('*');

    if (!varError && varData) {
      savedVariants = varData.map((v: any) => ({
        id: v.id,
        sku: v.sku,
        size: v.size || undefined,
        color: v.color || undefined,
        colorHex: v.color_hex || undefined,
        material: v.material || undefined,
        stock: v.stock,
        priceModifier: Number(v.price_modifier || 0),
      }));
    }
  }

  return {
    id: prodData.id,
    name: prodData.name,
    slug: prodData.slug,
    tagline: prodData.tagline,
    description: prodData.description,
    details: prodData.details || [],
    materials: prodData.materials,
    price: Number(prodData.price),
    compareAtPrice: prodData.compare_at_price ? Number(prodData.compare_at_price) : undefined,
    categoryId: prodData.category_id || '',
    categoryName: prodData.category?.name || productData.categoryName,
    brandId: prodData.brand_id || '',
    brandName: prodData.brand?.name || productData.brandName,
    images: savedImages.length > 0 ? savedImages : productData.images,
    variants: savedVariants.length > 0 ? savedVariants : productData.variants,
    stock: prodData.stock,
    isPublished: prodData.is_published,
    isFeatured: prodData.is_featured,
    isNewArrival: prodData.is_new_arrival,
    rating: Number(prodData.rating || 5.0),
    reviewCount: Number(prodData.review_count || 0),
    tags: prodData.tags || [],
    createdAt: prodData.created_at,
    updatedAt: prodData.updated_at,
  };
}

/**
 * Delete a product directly from Supabase
 */
export async function deleteSupabaseProduct(productId: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('id', productId);

  if (error) {
    throw new Error(`Failed to delete product: ${error.message}`);
  }
}
