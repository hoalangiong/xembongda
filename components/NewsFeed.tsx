"use client";

import { useState, useEffect } from "react";
import { apiUrl } from "@/lib/utils";

interface NewsItem {
  title: string;
  link: string;
  image: string;
  pubDate: string;
  source: string;
}

function timeAgo(dateStr: string): string {
  const now = new Date().getTime();
  const pub = new Date(dateStr).getTime();
  const diff = Math.floor((now - pub) / 60000); // phút
  if (diff < 60) return `${diff} phút trước`;
  if (diff < 1440) return `${Math.floor(diff / 60)} giờ trước`;
  return `${Math.floor(diff / 1440)} ngày trước`;
}

export default function NewsFeed() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch(apiUrl("/api/news"));
        const data = await res.json();
        setNews(data.data || []);
      } catch {
        setNews([]);
      }
      setLoading(false);
    }
    fetchNews();
  }, []);

  if (loading) return null;
  if (news.length === 0) return null;

  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">📰 Tin tức bóng đá</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {news.map((item, i) => (
          <a
            key={i}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-3 rounded-lg bg-gray-100 p-3 transition hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-750"
          >
            {item.image && (
              <img
                src={item.image}
                alt=""
                className="h-16 w-24 shrink-0 rounded object-cover"
              />
            )}
            <div className="flex flex-col justify-between">
              <h3 className="line-clamp-2 text-sm font-medium text-gray-900 dark:text-white">
                {item.title}
              </h3>
              <p className="text-xs text-gray-500">
                {item.source} • {timeAgo(item.pubDate)}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
