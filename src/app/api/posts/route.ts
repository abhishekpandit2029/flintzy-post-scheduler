import { NextResponse } from "next/server";
import { CHARACTER_LIMITS, PLATFORMS } from "@/constants/post-scheduler";
import type { Platform } from "@/types/post";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const content = typeof body.content === "string" ? body.content.trim() : "";
    const selected = Array.isArray(body.platforms) ? body.platforms : [];
    const mediaUrl =
      typeof body.mediaUrl === "string" ? body.mediaUrl.trim() : "";
    const scheduledAt = new Date(body.scheduledAt);
    if (!content)
      return NextResponse.json(
        { error: "Write something before scheduling." },
        { status: 400 },
      );
    if (
      !selected.length ||
      selected.some(
        (p: unknown) =>
          typeof p !== "string" || !PLATFORMS.includes(p as Platform),
      )
    ) {
      return NextResponse.json(
        { error: "Choose at least one valid platform." },
        { status: 400 },
      );
    }
    if (selected.some((p: Platform) => content.length > CHARACTER_LIMITS[p])) {
      return NextResponse.json(
        {
          error: "Your post is over a character limit for a selected platform.",
        },
        { status: 400 },
      );
    }
    if (
      Number.isNaN(scheduledAt.getTime()) ||
      scheduledAt.getTime() <= Date.now()
    ) {
      return NextResponse.json(
        { error: "Choose a date and time in the future." },
        { status: 400 },
      );
    }
    if (mediaUrl && !/^https?:\/\//i.test(mediaUrl)) {
      return NextResponse.json(
        { error: "Image URL must start with http:// or https://." },
        { status: 400 },
      );
    }
    const post = {
      id: `post-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      content,
      platforms: selected as Platform[],
      mediaUrl: mediaUrl || undefined,
      scheduledAt: scheduledAt.toISOString(),
      status: "scheduled" as const,
    };
    return NextResponse.json({ post }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Could not read the post. Please try again." },
      { status: 400 },
    );
  }
}
