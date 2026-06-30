import { NextResponse } from "next/server";

const RSS_FEEDS = [
  { name: "VNExpress Thể thao", url: "https://vnexpress.net/rss/the-thao.rss" },
  { name: "VNExpress Bóng đá", url: "https://vnexpress.net/rss/bong-da.rss" },
];

interface NewsItem {
  title: string;
  link: string;
  image: string;
  pubDate: string;
  source: string;
}

function parseRSS(xml: string, source: string): NewsItem[] {
  const items: NewsItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const content = match[1];
    const title = content.match(/<title>(.*?)<\/title>/)?.[1] || "";
    const link = content.match(/<link>(.*?)<\/link>/)?.[1] || "";
    const pubDate = content.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || "";
    const image = content.match(/url="([^"]+\.(jpg|jpeg|png|webp)[^"]*)"/)?.[1] || "";

    // Chỉ lấy tin liên quan bóng đá
    const keywords = ["world cup", "bóng đá", "bàn thắng", "trận", "đội tuyển", "ngoại hạng", "la liga", "champions", "giải", "huấn luyện", "cầu thủ", "tỷ số", "vòng", "luân lưu", "penalty"];
    const titleLower = title.toLowerCase();
    const isFootball = keywords.some((k) => titleLower.includes(k));

    if (title && link && isFootball) {
      items.push({ title, link, image, pubDate, source });
    }
  }

  return items;
}

export async function GET() {
  try {
    const allNews: NewsItem[] = [];

    for (const feed of RSS_FEEDS) {
      try {
        const res = await fetch(feed.url, { next: { revalidate: 600 } }); // cache 10 phút
        if (!res.ok) continue;
        const xml = await res.text();
        const items = parseRSS(xml, feed.name);
        allNews.push(...items);
      } catch {
        continue;
      }
    }

    // Sort theo thời gian mới nhất, lấy top 10
    const sorted = allNews
      .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
      .slice(0, 10);

    return NextResponse.json({ data: sorted });
  } catch {
    return NextResponse.json({ error: "Đang cập nhật" }, { status: 500 });
  }
}
