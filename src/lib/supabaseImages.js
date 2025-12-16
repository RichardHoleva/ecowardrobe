/**
 * Convert a Supabase Storage public URL (object/public) into the Image Transformations
 * render endpoint, so you can request the exact size you need.
 */
export function toSupabaseRenderUrl(publicUrl, opts = {}) {
  if (!publicUrl || typeof publicUrl !== 'string') return null;

  const {
    width,
    height,
    quality = 75,
    resize = 'cover',
    format, // optional: 'webp'|'avif' etc if enabled
  } = opts;

  const marker = '/storage/v1/object/public/';
  if (!publicUrl.includes(marker)) {
    return publicUrl;
  }

  const renderUrl = publicUrl.replace(marker, '/storage/v1/render/image/public/');
  const url = new URL(renderUrl);

  if (width) url.searchParams.set('width', String(width));
  if (height) url.searchParams.set('height', String(height));
  if (quality) url.searchParams.set('quality', String(quality));
  if (resize) url.searchParams.set('resize', resize);
  if (format) url.searchParams.set('format', format);

  return url.toString();
}

export function getSupabaseSrcSet(publicUrl, { width, height, quality = 75, resize = 'cover' } = {}) {
  if (!publicUrl) return undefined;
  const w1 = width;
  const w2 = width ? Math.min(width * 2, 2000) : undefined;

  const src1 = toSupabaseRenderUrl(publicUrl, { width: w1, height, quality, resize });
  const src2 = toSupabaseRenderUrl(publicUrl, {
    width: w2,
    height: height ? Math.min(height * 2, 2000) : undefined,
    quality,
    resize
  });

  if (!w1 || !w2) return undefined;
  return `${src1} ${w1}w, ${src2} ${w2}w`;
}
