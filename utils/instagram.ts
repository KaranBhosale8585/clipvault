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

import { logger } from "./logger";

/**
 * Fetches Reel metadata by parsing Open Graph tags from the public page.
 * NOTE: Instagram often blocks simple server-side fetches. 
 */
export async function fetchReelMetadata(url: string): Promise<ReelMetadata | null> {
  const source = "instagram-scraper";
  await logger.info(`Extraction started for URL: ${url}`, source);

  if (!validateReelUrl(url)) {
    await logger.error(`Invalid URL format provided: ${url}`, source);
    throw new Error("Invalid Instagram Reel URL");
  }

  const shortcode = extractShortcode(url);

  if (!shortcode) {
    await logger.error(`Failed to extract shortcode from URL: ${url}`, source);
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

    const response = await fetch(url, {
      headers: requestHeaders,
      cache: "no-store",
    });

    if (!response.ok) {
      const errorBody = await response.text();
      await logger.error(`Instagram returned ${response.status}`, source, {
        status: response.status,
        statusText: response.statusText,
        url,
        shortcode,
        bodySnippet: errorBody.substring(0, 500),
      });
      throw new Error(`Instagram returned status ${response.status}`);
    }

    const html = await response.text();
    
    // Detailed Regex Search
    const videoUrlMatch = html.match(/<meta[^>]*property="og:video"[^>]*content="([^"]*)"/);
    const thumbnailUrlMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"/);
    const titleMatch = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]*)"/);

    if (videoUrlMatch && videoUrlMatch[1] && thumbnailUrlMatch && thumbnailUrlMatch[1]) {
      const metadata = {
        id: shortcode,
        reelUrl: url,
        videoUrl: videoUrlMatch[1].replace(/&amp;/g, "&"),
        thumbnailUrl: thumbnailUrlMatch[1].replace(/&amp;/g, "&"),
        title: titleMatch?.[1] || `Instagram Reel ${shortcode}`,
      };
      
      await logger.info(`Extraction successful for shortcode: ${shortcode}`, source, { shortcode });
      return metadata;
    }

    const headSnippet = html.match(/<head>([\s\S]*?)<\/head>/)?.[1] || "Head section not found";
    await logger.warn("Open Graph tags missing in response HTML", source, {
      url,
      shortcode,
      htmlLength: html.length,
      headSnippet: headSnippet.substring(0, 1000),
    });
    
    throw new Error("Could not find video metadata in the page. Instagram might be requiring a login or blocking the request.");
  } catch (error: any) {
    await logger.error(`Extraction Exception: ${error.message}`, source, { 
      url, 
      shortcode,
      stack: error.stack 
    });
    throw error;
  }
}
