import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/utils/getUser";

export async function GET(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const url = req.nextUrl.searchParams.get("url");
    const filename = req.nextUrl.searchParams.get("filename") || "instagram-reel.mp4";

    if (!url) {
      return new NextResponse("URL is required", { status: 400 });
    }

    console.log(`Proxying download for URL: ${url}`);

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://www.instagram.com/",
      },
    });

    if (!response.ok) {
      console.error(`External fetch failed: ${response.status} ${response.statusText}`);
      return new NextResponse(`Failed to fetch video from source: ${response.statusText}`, { status: response.status });
    }

    const blob = await response.blob();
    console.log(`Successfully fetched blob, size: ${blob.size} bytes`);
    
    const headers = new Headers();
    headers.set("Content-Type", response.headers.get("Content-Type") || "video/mp4");
    headers.set("Content-Disposition", `attachment; filename="${filename}"`);
    
    return new NextResponse(blob, {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.error("Download proxy error:", error);
    return new NextResponse(error.message || "Internal Server Error", { status: 500 });
  }
}
