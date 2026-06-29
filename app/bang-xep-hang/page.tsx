import type { Metadata } from "next";
import BangXepHangContent from "@/components/BangXepHangContent";

export const metadata: Metadata = {
  title: "Bảng xếp hạng bóng đá | XemBongDa",
  description:
    "Bảng xếp hạng các giải bóng đá Ngoại hạng Anh, La Liga, Bundesliga, Serie A, Ligue 1, V-League cập nhật mới nhất.",
  openGraph: {
    title: "Bảng xếp hạng bóng đá | XemBongDa",
    description: "BXH bóng đá các giải đấu lớn cập nhật theo thời gian thực.",
  },
};

export default function BangXepHangPage() {
  return <BangXepHangContent />;
}
