import { NextResponse } from "next/server";
import { getOddsEvents } from "@/lib/odds-api";

export async function GET() {
  try {
    const events = await getOddsEvents("international-fifa-world-cup");

    // Format giống API-Football để MatchCard render được
    const fixtures = events
      .filter((e: any) => e.status === "pending")
      .map((e: any) => ({
        fixture: {
          id: e.id,
          status: { short: "NS", elapsed: null },
          date: e.date,
        },
        league: { id: 1, name: "World Cup 2026", logo: "" },
        teams: {
          home: { name: e.home, logo: "" },
          away: { name: e.away, logo: "" },
        },
        goals: { home: null, away: null },
      }));

    return NextResponse.json({ data: fixtures });
  } catch {
    return NextResponse.json({ error: "Đang cập nhật" }, { status: 500 });
  }
}
