/**
 * Robust Regex for Instagram Reel URLs.
 * Matches formats like:
 * - https://www.instagram.com/reels/C428_X-S7S_/
 * - https://www.instagram.com/reel/C428_X-S7S_/?igsh=...
 * - https://www.instagram.com/p/C428_X-S7S_/ (if it's a video)
 */
export const INSTAGRAM_REEL_REGEX = /https?:\/\/(?:www\.)?instagram\.com\/(?:reels?|p)\/([a-zA-Z0-9_-]+)\/?(?:\?[^#]*)?(?:#.*)?$/;

export interface ReelMetadata {
  id: string;
  reelUrl: string;
  videoUrl: string;
  thumbnailUrl: string;
  title: string;
}

/**
 * Validates if a given URL is a valid Instagram Reel/Video URL.
 */
export function validateReelUrl(url: string): boolean {
  return INSTAGRAM_REEL_REGEX.test(url);
}

/**
 * Extracts the Shortcode from an Instagram URL.
 */
export function extractShortcode(url: string): string | null {
  const match = url.match(INSTAGRAM_REEL_REGEX);
  return match ? match[1] : null;
}

/**
 * Fetches Reel metadata.
 * In a real-world scenario, this would call a third-party API (like RapidAPI)
 * or use a proxy-based scraper because Instagram's public API is restricted.
 */
export async function fetchReelMetadata(url: string): Promise<ReelMetadata | null> {
  if (!validateReelUrl(url)) {
    throw new Error("Invalid Instagram Reel URL");
  }

  const shortcode = extractShortcode(url);
  if (!shortcode) return null;

  // TODO: Implement actual metadata extraction logic.
  // Example using an external service or scraper:
  try {
    // This is a placeholder for the actual extraction logic.
    // In production, you might use services like:
    // - RapidAPI (Instagram Downloaders)
    // - Custom Puppeteer/Playwright scraper with rotating proxies
    // - specialized instagram scrapers
    
    console.log(`Fetching metadata for shortcode: ${shortcode}`);
    
    // Mocking a successful response for now to allow UI development
    return {
      id: shortcode,
      reelUrl: url,
      videoUrl: "https://example.com/mock-video.mp4", // This would be the actual CDN link
      thumbnailUrl: "https://example.com/mock-thumb.jpg",
      title: `Instagram Reel ${shortcode}`,
    };
  } catch (error) {
    console.error("Failed to fetch reel metadata:", error);
    return null;
  }
}
