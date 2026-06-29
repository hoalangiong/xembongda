import { NextRequest, NextResponse } from "next/server";
import { getOdds } from "@/lib/api-football";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await getOdds(Number(id));
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Đang cập nhật" }, { status: 500 });
  }
}
