"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getDefaultStreamSearch } from "@/lib/stream-sources";
import { getSportSrcMatches, getSportSrcStreams, findSportSrcMatch } from "@/lib/sportsrc";
import type { SportSrcStream } from "@/lib/sportsrc";
import { apiUrl } from "@/lib/utils";

export default function TrucTiepPage() {
  const params = useParams();
  const id = params.id as string;
  const [fixture, setFixture] = useState<any>(null);
  const [streams, setStreams] = useState<SportSrcStream[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSource, setActiveSource] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        // 1. Lấy thông tin trận từ API-Football
        const res = await fetch(apiUrl(`/api/fixtures?live=true`));
        const data = await res.json();
        const match = (data.data || []).find(
          (f: any) => String(f.fixture.id) === id
        );
        setFixture(match || null);

        // 2. Tìm stream từ SportSRC
        if (match) {
          const srcMatches = await getSportSrcMatches();
          const srcMatch = findSportSrcMatch(
            srcMatches,
            match.teams.home.name,
            match.teams.away.name
          );
          if (srcMatch) {
            const srcStreams = await getSportSrcStreams(srcMatch.id);
            // Lọc HD sources ưu tiên
            const sorted = srcStreams.sort((a, b) => {
              if (a.hd && !b.hd) return -1;
              if (!a.hd && b.hd) return 1;
              return a.streamNo - b.streamNo;
            });
            setStreams(sorted);
          }
        }
      } catch {
        setFixture(null);
      }
      setLoading(false);
    }
    fetchData();
  }, [id]);

  if (loading) {
    return <p className="text-gray-400">Đang tải...</p>;
  }

  return (
    <div className="space-y-6">
      {fixture && (
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">{fixture.league?.name}</p>
          <h1 className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
            {fixture.teams.home.name} vs {fixture.teams.away.name}
          </h1>
          {fixture.goals.home !== null && (
            <p className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">
              {fixture.goals.home} - {fixture.goals.away}
            </p>
          )}
          {fixture.fixture.status.elapsed && (
            <p className="text-sm text-green-600 dark:text-green-400">
              Phút {fixture.fixture.status.elapsed}
            </p>
          )}
        </div>
      )}

      <div className="rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
        <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">📺 Xem trực tiếp</h2>

        {streams.length > 0 ? (
          <>
            {/* Tabs chọn nguồn */}
            <div className="mb-3 flex flex-wrap gap-2">
              {streams.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSource(i)}
                  className={`rounded-full px-3 py-1 text-sm font-medium transition ${
                    activeSource === i
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  {src.hd ? "HD" : "SD"} {src.language} #{src.streamNo}
                </button>
              ))}
            </div>

            {/* Iframe */}
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
              <iframe
                src={streams[activeSource].embedUrl}
                className="h-full w-full"
                allowFullScreen
                allow="autoplay; encrypted-media"
                title={`Stream #${streams[activeSource].streamNo}`}
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              💡 Nếu nguồn không hoạt động, hãy thử nguồn khác. Ưu tiên HD.
            </p>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              {fixture ? "Chưa tìm thấy nguồn phát sóng cho trận này." : "Không tìm thấy trận đấu."}
            </p>
            {fixture && (
              <a
                href={getDefaultStreamSearch(
                  fixture.teams.home.name,
                  fixture.teams.away.name
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
              >
                Tìm link xem trực tiếp
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
