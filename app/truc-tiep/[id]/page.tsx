"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getStreamUrl, getDefaultStreamSearch } from "@/lib/stream-sources";
import { apiUrl } from "@/lib/utils";

export default function TrucTiepPage() {
  const params = useParams();
  const id = params.id as string;
  const [fixture, setFixture] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFixture() {
      try {
        const res = await fetch(apiUrl(`/api/fixtures?live=true`));
        const data = await res.json();
        const match = (data.data || []).find(
          (f: any) => String(f.fixture.id) === id
        );
        setFixture(match || null);
      } catch {
        setFixture(null);
      }
      setLoading(false);
    }
    fetchFixture();
  }, [id]);

  const stream = getStreamUrl(id);

  if (loading) {
    return <p className="text-gray-400">Đang tải...</p>;
  }

  return (
    <div className="space-y-6">
      {fixture && (
        <div className="text-center">
          <p className="text-sm text-gray-400">{fixture.league?.name}</p>
          <h1 className="mt-2 text-xl font-bold">
            {fixture.teams.home.name} vs {fixture.teams.away.name}
          </h1>
          {fixture.goals.home !== null && (
            <p className="mt-1 text-2xl font-bold text-green-400">
              {fixture.goals.home} - {fixture.goals.away}
            </p>
          )}
          {fixture.fixture.status.elapsed && (
            <p className="text-sm text-green-400">
              Phút {fixture.fixture.status.elapsed}
            </p>
          )}
        </div>
      )}

      <div className="rounded-lg bg-gray-800 p-4">
        <h2 className="mb-3 text-lg font-semibold">📺 Xem trực tiếp</h2>
        {stream ? (
          <div className="aspect-video w-full overflow-hidden rounded-lg">
            <iframe
              src={stream.url}
              className="h-full w-full"
              allowFullScreen
              allow="autoplay; encrypted-media"
              title="Live stream"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <p className="text-gray-400">
              Chưa có link phát sóng cho trận đấu này.
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
