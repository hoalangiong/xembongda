import type { Metadata } from "next";
import LichThiDauContent from "@/components/LichThiDauContent";

export const metadata: Metadata = {
  title: "Lịch thi đấu bóng đá hôm nay | XemBongDa",
  description:
    "Lịch thi đấu bóng đá hôm nay các giải Ngoại hạng Anh, La Liga, Bundesliga, Serie A, Champions League, World Cup, V-League.",
  openGraph: {
    title: "Lịch thi đấu bóng đá hôm nay | XemBongDa",
    description: "Xem lịch thi đấu bóng đá đầy đủ các giải đấu lớn trên thế giới.",
  },
};

export default function LichThiDauPage() {
  return <LichThiDauContent />;
}
