import { NextRequest, NextResponse } from "next/server";
import { getFixturesByDate, getLiveFixtures } from "@/lib/api-football";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const league = searchParams.get("league");
    const live = searchParams.get("live");

    if (live === "true") {
      const data = await getLiveFixtures();
      return NextResponse.json({ data });
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
