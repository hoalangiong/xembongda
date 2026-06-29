"use client";

import { useState, useEffect } from "react";
import MatchCard from "@/components/MatchCard";
import LeagueFilter from "@/components/LeagueFilter";

export default function HomePage() {
  const [fixtures, setFixtures] = useState<any[]>([]);
  const [liveFixtures, setLiveFixtures] = useState<any[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [fixturesRes, liveRes] = await Promise.all([
          fetch(`/api/fixtures${selectedLeague ? `?league=${selectedLeague}` : ""}`),
          fetch("/api/live"),
        ]);
        const fixturesData = await fixturesRes.json();
        const liveData = await liveRes.json();
        setFixtures(fixturesData.data || []);
        setLiveFixtures(liveData.data || []);
      } catch {
        setFixtures([]);
        setLiveFixtures([]);
      }
      setLoading(false);
    }
    fetchData();
  }, [selectedLeague]);

  // Refresh live mỗi 60 giây
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/live");
        const data = await res.json();
        setLiveFixtures(data.data || []);
      } catch {
        // ignore
      }
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const filteredLive = selectedLeague
    ? liveFixtures.filter((f: any) => f.league?.id === selectedLeague)
    : liveFixtures;

  return (
    <div className="space-y-8">
      <section>
        <h1 className="mb-4 text-2xl font-bold">⚽ Bóng đá hôm nay</h1>
        <LeagueFilter selected={selectedLeague} onChange={setSelectedLeague} />
      </section>

      {filteredLive.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-green-400">
            🔴 Đang diễn ra
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {filteredLive.map((f: any) => (
              <MatchCard key={f.fixture.id} fixture={f} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-lg font-semibold">📅 Trận hôm nay</h2>
        {loading ? (
          <p className="text-gray-400">Đang tải...</p>
        ) : fixtures.length === 0 ? (
          <p className="text-gray-400">Không có trận đấu nào hôm nay.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {fixtures.map((f: any) => (
              <MatchCard key={f.fixture.id} fixture={f} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
