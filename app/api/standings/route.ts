import { NextRequest, NextResponse } from "next/server";
import { getStandings } from "@/lib/api-football";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const league = searchParams.get("league");
    const season = searchParams.get("season") || String(new Date().getFullYear());

    if (!league) {
      return NextResponse.json({ error: "Thiếu tham số league" }, { status: 400 });
    }

    const data = await getStandings(Number(league), Number(season));
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Đang cập nhật dữ liệu" }, { status: 500 });
  }
}
