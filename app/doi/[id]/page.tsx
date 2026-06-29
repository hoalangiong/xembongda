import type { Metadata } from "next";
import TeamDetail from "@/components/TeamDetail";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Thông tin đội bóng #${id} | XemBongDa`,
    description: `Xem thông tin, phong độ và lịch thi đấu đội bóng #${id}.`,
  };
}

export default function DoiBongPage() {
  return <TeamDetail />;
}
