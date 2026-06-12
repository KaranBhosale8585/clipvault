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
import { runPythonScript } from "./pythonBridge";

interface PythonDownloaderData {
  id: string;
  title: string;
  uploader: string;
  thumbnail: string;
  thumbnails: unknown[]; // yt-dlp thumbnails can be complex
  duration: number;
  videoUrl: string;
  formats: unknown[];
}

/**
 * Fetches Reel metadata using the Python yt-dlp service.
 */
export async function fetchReelMetadata(url: string): Promise<ReelMetadata | null> {
  const source = "instagram-downloader";
  await logger.info(`Extraction started using yt-dlp for URL: ${url}`, source);

  if (!validateReelUrl(url)) {
    await logger.error(`Invalid URL format provided: ${url}`, source);
    throw new Error("Invalid Instagram Reel URL");
  }

  try {
    const result = await runPythonScript<PythonDownloaderData>("services/python/downloader.py", [url]);

    if (!result.success || !result.data) {
      await logger.error(`yt-dlp extraction failed: ${result.error}`, source, {
        url,
        traceback: result.traceback,
      });
      throw new Error(result.error || "Failed to extract metadata from Instagram");
    }

    const { data, debug } = result;

    await logger.info(`yt-dlp raw output received for ${url}`, source, { data, debug });

    const metadata: ReelMetadata = {
      id: data.id || extractShortcode(url) || "unknown",
      reelUrl: url,
      videoUrl: data.videoUrl,
      thumbnailUrl: data.thumbnail,
      title: data.title || `Instagram Reel by ${data.uploader || "unknown"}`,
    };

    await logger.info(`Extraction successful for Reel: ${metadata.id}`, source, { id: metadata.id });
    return metadata;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const stack = error instanceof Error ? error.stack : undefined;
    
    await logger.error(`Extraction Exception: ${message}`, source, { 
      url, 
      stack 
    });
    throw error;
  }
}
