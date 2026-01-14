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
  
  // Get the API base URL
  const apiBaseUrl = process.env.NEXT_PUBLIC_GEMRAILS_API_BASE_URL || 'http://localhost:4000';
  
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${apiBaseUrl}${normalizedPath}`;
}
