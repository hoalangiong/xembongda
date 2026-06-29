import { NextRequest, NextResponse } from "next/server";
import { getFixtureById } from "@/lib/api-football";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await getFixtureById(Number(id));
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Đang cập nhật dữ liệu" }, { status: 500 });
  }
}
