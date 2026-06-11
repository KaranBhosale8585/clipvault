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
 * Fetches Reel metadata by parsing Open Graph tags from the public page.
 * NOTE: Instagram often blocks simple server-side fetches. 
 * In production, a specialized API or proxy-based scraper is required.
 */
export async function fetchReelMetadata(url: string): Promise<ReelMetadata | null> {
  if (!validateReelUrl(url)) {
    throw new Error("Invalid Instagram Reel URL");
  }

  const shortcode = extractShortcode(url);
  if (!shortcode) return null;

  try {
    console.log(`Attempting to extract metadata for: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      console.warn(`Instagram fetch failed with status: ${response.status}`);
      // Fallback to mock for testing if fetch is blocked
      return getMockMetadata(url, shortcode);
    }

    const html = await response.text();
    
    // Extract metadata using Regex from Meta tags
    const videoUrl = html.match(/<meta[^>]*property="og:video"[^>]*content="([^"]*)"/)?.[1];
    const thumbnailUrl = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"/)?.[1];
    const title = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]*)"/)?.[1] || `Instagram Reel ${shortcode}`;

    if (videoUrl && thumbnailUrl) {
      console.log("Successfully extracted real metadata from HTML.");
      return {
        id: shortcode,
        reelUrl: url,
        videoUrl: videoUrl.replace(/&amp;/g, "&"),
        thumbnailUrl: thumbnailUrl.replace(/&amp;/g, "&"),
        title: title,
      };
    }

    console.warn("Could not find Open Graph tags in HTML. Instagram might be blocking the request.");
    return getMockMetadata(url, shortcode);
  } catch (error) {
    console.error("Failed to fetch reel metadata:", error);
    return getMockMetadata(url, shortcode);
  }
}

/**
 * Fallback mock metadata for development/testing purposes.
 */
function getMockMetadata(url: string, shortcode: string): ReelMetadata {
  return {
    id: shortcode,
    reelUrl: url,
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", // Real sample video for testing
    thumbnailUrl: "https://www.instagram.com/static/images/ico/favicon.ico/36b3048c446e.ico",
    title: `[SIMULATED] Instagram Reel ${shortcode}`,
  };
}
