/**
 * Robust Regex for Instagram Reel URLs.
 * Handles standard and malformed formats:
 * - https://www.instagram.com/reel/ID/
 * - https://www.instagram.com/reel/ID/?igsh=...
 * - https://www.instagram.com/reel/ID/utm_source=... (malformed but common)
 */
export const INSTAGRAM_REEL_REGEX = /https?:\/\/(?:www\.)?instagram\.com\/(?:reels?|p)\/([a-zA-Z0-9_-]+)(?:\/|\?|$)/;

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
 */
export async function fetchReelMetadata(url: string): Promise<ReelMetadata | null> {
  console.log("--- START METADATA EXTRACTION ---");
  console.log(`[Input URL]: ${url}`);

  if (!validateReelUrl(url)) {
    console.error("[Error]: Invalid Instagram Reel URL format.");
    throw new Error("Invalid Instagram Reel URL");
  }

  const shortcode = extractShortcode(url);
  console.log(`[Extracted Shortcode]: ${shortcode}`);

  if (!shortcode) {
    console.error("[Error]: Failed to extract shortcode from URL.");
    return null;
  }

  try {
    const requestHeaders = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
      "Upgrade-Insecure-Requests": "1",
    };

    console.log(`[Request URL]: ${url}`);
    console.log("[Request Headers]:", JSON.stringify(requestHeaders, null, 2));

    const response = await fetch(url, {
      headers: requestHeaders,
      cache: "no-store",
    });

    console.log(`[Response Status]: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`[Error Body Snippet]: ${errorBody.substring(0, 500)}`);
      throw new Error(`Instagram returned status ${response.status}`);
    }

    const html = await response.text();
    console.log(`[HTML Length]: ${html.length} bytes`);
    
    // Detailed Regex Search
    const videoUrlMatch = html.match(/<meta[^>]*property="og:video"[^>]*content="([^"]*)"/);
    const thumbnailUrlMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"/);
    const titleMatch = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]*)"/);

    console.log(`[Regex - Video URL Found]: ${!!videoUrlMatch}`);
    console.log(`[Regex - Thumbnail URL Found]: ${!!thumbnailUrlMatch}`);
    console.log(`[Regex - Title Found]: ${!!titleMatch}`);

    if (videoUrlMatch && videoUrlMatch[1] && thumbnailUrlMatch && thumbnailUrlMatch[1]) {
      const metadata = {
        id: shortcode,
        reelUrl: url,
        videoUrl: videoUrlMatch[1].replace(/&amp;/g, "&"),
        thumbnailUrl: thumbnailUrlMatch[1].replace(/&amp;/g, "&"),
        title: titleMatch?.[1] || `Instagram Reel ${shortcode}`,
      };
      
      console.log("[Final Metadata]:", JSON.stringify(metadata, null, 2));
      console.log("--- EXTRACTION SUCCESS ---");
      return metadata;
    }

    console.warn("[Warning]: Open Graph tags missing in response HTML.");
    // Log a bit of the head section to see what meta tags ARE present
    const headSnippet = html.match(/<head>([\s\S]*?)<\/head>/)?.[1] || "Head section not found";
    console.log(`[Head Metadata Snippet]: ${headSnippet.substring(0, 1000)}`);
    
    throw new Error("Could not find video metadata in the page. Instagram might be requiring a login or blocking the request.");
  } catch (error: any) {
    console.error(`[Extraction Exception]: ${error.message}`);
    console.log("--- EXTRACTION FAILED ---");
    throw error;
  }
}
