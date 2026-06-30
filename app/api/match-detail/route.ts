import { NextRequest, NextResponse } from "next/server";
import { findFifaMatch, getFifaTimeline, formatEvents } from "@/lib/fifa-api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const home = searchParams.get("home");
    const away = searchParams.get("away");

    if (!home || !away) {
      return NextResponse.json({ error: "Cần tham số home và away" }, { status: 400 });
    }

    // Tìm match trên FIFA API
    const match = await findFifaMatch(home, away);
    if (!match) {
      return NextResponse.json({ data: null });
    }

    // Lấy timeline events
    const events = await getFifaTimeline(match.stageId, match.matchId);
    const formatted = formatEvents(events);

    return NextResponse.json({
      data: {
        matchId: match.matchId,
        stageId: match.stageId,
        events: formatted,
      },
    });
  } catch {
    return NextResponse.json({ error: "Đang cập nhật" }, { status: 500 });
  }
}
