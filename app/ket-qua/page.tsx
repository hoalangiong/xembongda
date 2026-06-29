import type { Metadata } from "next";
import KetQuaContent from "@/components/KetQuaContent";

export const metadata: Metadata = {
  title: "Kết quả bóng đá mới nhất | XemBongDa",
  description:
    "Kết quả bóng đá mới nhất các giải Ngoại hạng Anh, La Liga, Bundesliga, Serie A, Champions League, World Cup.",
  openGraph: {
    title: "Kết quả bóng đá mới nhất | XemBongDa",
    description: "Tỷ số và kết quả trận đấu bóng đá hôm nay và hôm qua.",
  },
};

export default function KetQuaPage() {
  return <KetQuaContent />;
}
