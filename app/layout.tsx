import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NotificationManager from "@/components/NotificationManager";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

export const metadata: Metadata = {
  title: "XemBongDa - Lịch thi đấu & Kết quả bóng đá trực tuyến",
  description:
    "Xem lịch thi đấu, kết quả, bảng xếp hạng và trực tiếp bóng đá các giải Ngoại hạng Anh, La Liga, Bundesliga, Serie A, Champions League, World Cup.",
  manifest: "/bongda/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "XemBongDa",
  },
  icons: {
    icon: "/bongda/icon-192.png",
    apple: "/bongda/icon-192.png",
  },
  openGraph: {
    title: "XemBongDa - Lịch thi đấu & Kết quả bóng đá trực tuyến",
    description: "Xem lịch thi đấu, kết quả, BXH và trực tiếp bóng đá các giải đấu lớn.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#16a34a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased dark:bg-gray-950 dark:text-white">
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        <Footer />
        <NotificationManager />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
