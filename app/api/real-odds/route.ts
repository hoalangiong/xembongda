import { NextRequest, NextResponse } from "next/server";
import { getFootballEvents, findMatchingEvent } from "@/lib/odds-api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const home = searchParams.get("home");
    const away = searchParams.get("away");

    if (!home || !away) {
      return NextResponse.json({ error: "Cần tham số home và away" }, { status: 400 });
    }

    const events = await getFootballEvents();
    if (!events || events.length === 0) {
      return NextResponse.json({ data: null });
    }

    const match = findMatchingEvent(events, home, away);
    return NextResponse.json({ data: match });
  } catch {
    return NextResponse.json({ error: "Đang cập nhật" }, { status: 500 });
  }
}
