"use client";

import { useState, useEffect } from "react";
import MatchCard from "@/components/MatchCard";
import LeagueFilter from "@/components/LeagueFilter";
import { apiUrl } from "@/lib/utils";

export default function HomePage() {
  const [fixtures, setFixtures] = useState<any[]>([]);
  const [upcomingFixtures, setUpcomingFixtures] = useState<any[]>([]);
  const [liveFixtures, setLiveFixtures] = useState<any[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [fixturesRes, liveRes, upcomingRes] = await Promise.all([
          fetch(apiUrl(`/api/fixtures${selectedLeague ? `?league=${selectedLeague}` : ""}`)),
          fetch(apiUrl("/api/live")),
          fetch(apiUrl(`/api/fixtures?next=3&league=1`)), // World Cup 3 ngày tới
        ]);
        const fixturesData = await fixturesRes.json();
        const liveData = await liveRes.json();
        const upcomingData = await upcomingRes.json();
        setFixtures(fixturesData.data || []);
        setLiveFixtures(liveData.data || []);
        // Chỉ lấy trận chưa đá
        const upcoming = (upcomingData.data || []).filter(
          (f: any) => f.fixture.status.short === "NS" || f.fixture.status.short === "TBD"
        );
        setUpcomingFixtures(upcoming);
      } catch {
        setFixtures([]);
        setLiveFixtures([]);
        setUpcomingFixtures([]);
      }
      setLoading(false);
    }
    fetchData();
  }, [selectedLeague]);

  // Refresh live mỗi 60 giây
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(apiUrl("/api/live"));
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

      {upcomingFixtures.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">🏆 World Cup — Sắp tới</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {upcomingFixtures.map((f: any) => (
              <MatchCard key={f.fixture.id} fixture={f} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
