/**
 * Get the full URL for an image from the API
 * Handles both absolute URLs and relative paths from the backend
 */
export function getImageUrl(path: string | undefined | null): string | null {
  if (!path) return null;
  
  // If it's already an absolute URL, return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // If it's a data URL, return as-is
  if (path.startsWith('data:')) {
    return path;
  }
  
  // Get the API base URL
  const apiBaseUrl = process.env.NEXT_PUBLIC_GEMRAILS_API_BASE_URL || 'http://localhost:4000';
  
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${apiBaseUrl}${normalizedPath}`;
}

/**
 * Create an image element with error handling
 * Returns a promise that resolves with the loaded image or null on error
 */
export function loadImageWithFallback(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => resolve(img);
    img.onerror = () => {
      console.warn(`Failed to load image: ${src}`);
      resolve(null);
    };
    
    img.src = src;
  });
}
