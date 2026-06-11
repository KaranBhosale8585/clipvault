import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/utils/getUser";
import { fetchReelMetadata, validateReelUrl } from "@/utils/instagram";
import { db } from "@/db";
import { downloadsTable } from "@/db/schema";

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized", message: "You must be logged in to extract Reel metadata." },
        { status: 401 }
      );
    }

    const { url } = await req.json();

    if (!url) {
      return NextResponse.json(
        { error: "Bad Request", message: "Reel URL is required." },
        { status: 400 }
      );
    }

    if (!validateReelUrl(url)) {
      return NextResponse.json(
        { error: "Invalid URL", message: "Please provide a valid Instagram Reel URL." },
        { status: 400 }
      );
    }

    const metadata = await fetchReelMetadata(url);

    if (!metadata) {
      return NextResponse.json(
        { error: "Extraction Failed", message: "Could not extract metadata from the provided URL." },
        { status: 500 }
      );
    }

    // Optional: Log the extraction attempt in the downloads table as "pending"
    // This allows us to track history even if the actual download doesn't finish.
    await db.insert(downloadsTable).values({
      userId: user.id,
      reelUrl: url,
      videoUrl: metadata.videoUrl,
      thumbnailUrl: metadata.thumbnailUrl,
      title: metadata.title,
      status: "pending",
    });

    return NextResponse.json({
      data: metadata,
      message: "Metadata extracted successfully.",
    });
  } catch (error: any) {
    console.error("Reel extraction error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
