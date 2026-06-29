import { NextResponse } from "next/server";
import { getLiveFixtures } from "@/lib/api-football";

export async function GET() {
  try {
    const data = await getLiveFixtures();
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Đang cập nhật dữ liệu" }, { status: 500 });
  }
}
