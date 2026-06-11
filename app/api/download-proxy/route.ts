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

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch video: ${response.statusText}`);
    }

    const blob = await response.blob();
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
