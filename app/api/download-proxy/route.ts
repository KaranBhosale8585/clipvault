import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/utils/getUser";
import { logger } from "@/utils/logger";

export async function GET(req: NextRequest) {
  try {
    await getUser();
    // Allow anonymous users to use the proxy (consistent with metadata API policy)
    // Limits are already enforced at the extraction layer (metadata API)

    const url = req.nextUrl.searchParams.get("url");
    const filename = req.nextUrl.searchParams.get("filename") || "instagram-reel.mp4";
    const download = req.nextUrl.searchParams.get("download") !== "false"; // Default to true for backward compatibility

    if (!url) {
      return new NextResponse("URL is required", { status: 400 });
    }

    await logger.info(`Proxying ${download ? "download" : "preview"} for URL: ${url}`, "download-proxy");

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
        "Referer": "https://www.instagram.com/",
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.9",
        "Origin": "https://www.instagram.com",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "cross-site",
      },
    });

    if (!response.ok) {
      await logger.error(`External fetch failed: ${response.status} ${response.statusText}`, "download-proxy");
      return new NextResponse(`Failed to fetch media from source: ${response.statusText}`, { status: response.status });
    }

    const blob = await response.blob();
    await logger.info(`Successfully fetched blob, size: ${blob.size} bytes`, "download-proxy");
    
    const headers = new Headers();
    const contentType = response.headers.get("Content-Type") || (url.includes(".mp4") ? "video/mp4" : "image/jpeg");
    headers.set("Content-Type", contentType);
    
    if (download) {
      headers.set("Content-Disposition", `attachment; filename="${filename}"`);
    } else {
      headers.set("Content-Disposition", "inline");
      // Add Cache-Control for previews to improve performance
      headers.set("Cache-Control", "public, max-age=3600");
    }
    
    return new NextResponse(blob, {
      status: 200,
      headers,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    await logger.error("Download proxy error", "download-proxy", error);
    return new NextResponse(message, { status: 500 });
  }
}
