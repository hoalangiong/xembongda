import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "XemBongDa - Lịch thi đấu & Kết quả bóng đá trực tuyến",
  description:
    "Xem lịch thi đấu, kết quả, bảng xếp hạng và trực tiếp bóng đá các giải Ngoại hạng Anh, La Liga, Bundesliga, Serie A, Champions League, World Cup.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark">
      <body className="min-h-screen bg-gray-950 text-white antialiased">
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
