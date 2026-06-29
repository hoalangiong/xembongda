import { NextRequest, NextResponse } from "next/server";
import { searchTeams } from "@/lib/api-football";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");

    if (!q || q.length < 2) {
      return NextResponse.json({ data: [] });
    }

    const data = await searchTeams(q);
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Lỗi tìm kiếm" }, { status: 500 });
  }
}
