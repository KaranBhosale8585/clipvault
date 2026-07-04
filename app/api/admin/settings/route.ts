import { NextResponse } from "next/server";
import { getUser } from "@/utils/getUser";
import { db } from "@/db";
import { systemSettingsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";

export async function GET() {
  try {
    const user = await getUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Proactively purge any remaining Instagram cookie keys from the database for privacy/security compliance
    await db.delete(systemSettingsTable).where(eq(systemSettingsTable.key, "instagram_cookies"));
    await db.delete(systemSettingsTable).where(eq(systemSettingsTable.key, "instagram_cookies_browser"));

    const settings = await db.select().from(systemSettingsTable);
    const instagramProxy = settings.find(s => s.key === "instagram_proxy")?.value || "";

    return NextResponse.json({
      data: {
        instagramProxy,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { instagramCookies, instagramCookiesBrowser, instagramProxy } = body;

    // Validation: Reject cookie submissions if attempted
    if (instagramCookies || instagramCookiesBrowser) {
      return NextResponse.json(
        { error: "Instagram account cookies are neither required nor accepted for privacy and security reasons." },
        { status: 400 }
      );
    }

    // Helper to upsert a system setting
    const upsertSetting = async (key: string, value: string) => {
      const existing = await db
        .select()
        .from(systemSettingsTable)
        .where(eq(systemSettingsTable.key, key))
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(systemSettingsTable)
          .set({ value, updatedAt: new Date() })
          .where(eq(systemSettingsTable.key, key));
      } else {
        await db.insert(systemSettingsTable).values({ key, value });
      }
    };

    // Clean database of cookie settings
    await db.delete(systemSettingsTable).where(eq(systemSettingsTable.key, "instagram_cookies"));
    await db.delete(systemSettingsTable).where(eq(systemSettingsTable.key, "instagram_cookies_browser"));

    await upsertSetting("instagram_proxy", instagramProxy || "");

    // Clear stats cache so any dependent UI updates
    revalidateTag("admin-stats", "default");

    return NextResponse.json({
      message: "Settings saved successfully",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
