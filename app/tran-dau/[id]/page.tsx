import type { Metadata } from "next";
import MatchDetail from "@/components/MatchDetail";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Chi tiết trận đấu #${id} | XemBongDa`,
    description: `Xem chi tiết trận đấu: đội hình, diễn biến, thống kê trận đấu #${id}.`,
  };
}

export default function TranDauPage() {
  return <MatchDetail />;
}
