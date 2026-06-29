import { NextRequest, NextResponse } from "next/server";
import { getTeamInfo, getTeamFixtures, getTeamNextFixtures } from "@/lib/api-football";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const teamId = Number(id);

    const [teamData, lastFixtures, nextFixtures] = await Promise.all([
      getTeamInfo(teamId),
      getTeamFixtures(teamId, 5),
      getTeamNextFixtures(teamId, 5),
    ]);

    return NextResponse.json({
      team: teamData?.[0] || null,
      lastMatches: lastFixtures || [],
      nextMatches: nextFixtures || [],
    });
  } catch {
    return NextResponse.json({ error: "Đang cập nhật dữ liệu" }, { status: 500 });
  }
}
