import { NextResponse } from "next/server";
import { getUser } from "@/utils/getUser";
import { runPythonScript } from "@/utils/pythonBridge";
import { logger } from "@/utils/logger";
import { revalidateTag } from "next/cache";

export async function POST() {
  const source = "admin-action-update-ytdlp";
  try {
    const user = await getUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await logger.info("Starting yt-dlp update process...", source);

    interface UpdateResponse {
      message: string;
      version: string;
    }

    const result = await runPythonScript<UpdateResponse>(
      "services/python/downloader.py",
      ["--update"]
    );

    if (!result.success || !result.data) {
      await logger.error(`yt-dlp update failed: ${result.error}`, source, { result });
      return NextResponse.json({ error: result.error || "Update failed" }, { status: 500 });
    }

    await logger.info(`yt-dlp updated successfully: ${result.data.message}`, source, { result });

    // Invalidate stats cache so the dashboard shows the new version
    revalidateTag("admin-stats", "default");

    return NextResponse.json({
      message: result.data.message,
      version: result.data.version,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    await logger.error(`Exception during yt-dlp update: ${message}`, source, { error });
    return NextResponse.json({ error: "Failed to update yt-dlp" }, { status: 500 });
  }
}
