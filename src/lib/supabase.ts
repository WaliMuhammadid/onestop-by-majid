import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uatllzgjkbhqggpqkqin.supabase.co';
// Standard publishable key - authorized for all browser clients
const supabasePublishableKey = 'sb_publishable_ySmpziCycnPKtOyUwQd1ng_RtmuyAUO';

export const supabase = createClient(supabaseUrl, supabasePublishableKey);
export const supabaseAdmin = createClient(supabaseUrl, supabasePublishableKey);

/**
 * Upload an image file directly to Supabase Storage bucket 'product-images'
 * and return its permanent public CDN URL.
 */
export async function uploadProductImage(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop()?.toLowerCase() || 'webp';
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const filePath = `products/${fileName}`;

  const { error } = await supabase.storage
    .from('product-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || 'image/jpeg',
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath);

  return data.publicUrl;
}
