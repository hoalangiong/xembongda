import { NextRequest, NextResponse } from "next/server";
import { getFixtureById } from "@/lib/api-football";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ids = searchParams.get("ids");

    if (!ids) {
      return NextResponse.json({ data: [] });
    }

    const fixtureIds = ids.split(",").map(Number).filter(Boolean);

    // Fetch tất cả fixtures cùng lúc
    const results = await Promise.all(
      fixtureIds.map(async (id) => {
        try {
          const data = await getFixtureById(id);
          const match = data?.[0];
          if (!match) return null;
          return {
            fixtureId: match.fixture.id,
            status: match.fixture.status.short,
            elapsed: match.fixture.status.elapsed,
            goalsHome: match.goals.home,
            goalsAway: match.goals.away,
            homeTeam: match.teams.home.name,
            awayTeam: match.teams.away.name,
          };
        } catch {
          return null;
        }
      })
    );

    return NextResponse.json({ data: results.filter(Boolean) });
  } catch {
    return NextResponse.json({ error: "Đang cập nhật" }, { status: 500 });
  }
}
