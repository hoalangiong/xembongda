import { NextRequest, NextResponse } from "next/server";
import { getFixturesByDate, getLiveFixtures } from "@/lib/api-football";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const league = searchParams.get("league");
    const live = searchParams.get("live");
    const next = searchParams.get("next"); // số ngày tới

    if (live === "true") {
      const data = await getLiveFixtures();
      return NextResponse.json({ data });
    }

    // Lấy trận trong N ngày tới
    if (next) {
      const days = Math.min(Number(next), 7);
      const allFixtures: any[] = [];
      for (let i = 0; i <= days; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        const dateStr = d.toISOString().split("T")[0];
        const data = await getFixturesByDate(dateStr, league ? Number(league) : undefined);
        if (Array.isArray(data)) allFixtures.push(...data);
      }
      return NextResponse.json({ data: allFixtures });
    }

    if (!date) {
      const today = new Date().toISOString().split("T")[0];
      const data = await getFixturesByDate(today, league ? Number(league) : undefined);
      return NextResponse.json({ data });
    }

    const data = await getFixturesByDate(date, league ? Number(league) : undefined);
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Đang cập nhật dữ liệu" }, { status: 500 });
  }
}
