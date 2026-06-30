"use client";

import { useState, useEffect } from "react";
import MatchCard from "@/components/MatchCard";
import LeagueFilter from "@/components/LeagueFilter";
import { apiUrl } from "@/lib/utils";

export default function KetQuaContent() {
  const [fixtures, setFixtures] = useState<any[]>([]);
  const [wcResults, setWcResults] = useState<any[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<number | null>(null);
  const [date, setDate] = useState(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split("T")[0];
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [fixturesRes, wcRes] = await Promise.all([
          fetch(apiUrl(`/api/fixtures?date=${date}${selectedLeague ? `&league=${selectedLeague}` : ""}`)),
          fetch(apiUrl("/api/worldcup?status=settled")),
        ]);
        const fixturesData = await fixturesRes.json();
        const wcData = await wcRes.json();
        const finished = (fixturesData.data || []).filter(
          (f: any) => f.fixture.status.short === "FT"
        );
        setFixtures(finished);
        setWcResults(wcData.data || []);
      } catch {
        setFixtures([]);
        setWcResults([]);
      }
      setLoading(false);
    }
    fetchData();
  }, [date, selectedLeague]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">📊 Kết quả</h1>

      <div className="flex flex-wrap items-center gap-4">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white"
        />
      </div>

      <LeagueFilter selected={selectedLeague} onChange={setSelectedLeague} />

      {loading ? (
        <p className="text-gray-400">Đang tải...</p>
      ) : fixtures.length === 0 && wcResults.length === 0 ? (
        <p className="text-gray-400">Không có kết quả nào.</p>
      ) : (
        <>
          {wcResults.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">🏆 World Cup 2026</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {wcResults.map((f: any) => (
                  <MatchCard key={f.fixture.id} fixture={f} />
                ))}
              </div>
            </div>
          )}
          {fixtures.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {fixtures.map((f: any) => (
                <MatchCard key={f.fixture.id} fixture={f} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
