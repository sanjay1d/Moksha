const base = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/$/, "")

export function resolveImageUrl(image_url: string | undefined | null, fallback: string) {
  if (!image_url) return fallback

  // External HTTPS images (e.g. placehold.co, Google images) stay unchanged
  if (image_url.startsWith("https://") && !image_url.startsWith(base)) {
    return image_url
  }

  // Any other absolute URL (HTTP or HTTPS matching base) gets its origin replaced with the current API base
  if (image_url.startsWith("http://") || image_url.startsWith("https://")) {
    try {
      const url = new URL(image_url)
      return `${base}${url.pathname}${url.search}`
    } catch {
      return image_url
    }
  }

  // Relative paths
  return `${base}/${image_url.replace(/^\//, "")}`
}
