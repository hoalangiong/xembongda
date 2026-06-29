"use client";

import { useState, useEffect } from "react";
import { LEAGUES } from "@/lib/leagues";
import StandingsTable from "@/components/StandingsTable";
import { apiUrl } from "@/lib/utils";

export default function BangXepHangContent() {
  const [selectedLeague, setSelectedLeague] = useState(LEAGUES[2].id);
  const [standings, setStandings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const season = new Date().getFullYear();
        const res = await fetch(
          apiUrl(`/api/standings?league=${selectedLeague}&season=${season}`)
        );
        const data = await res.json();
        const leagueData = data.data?.[0]?.league?.standings?.[0] || [];
        setStandings(leagueData);
      } catch {
        setStandings([]);
      }
      setLoading(false);
    }
    fetchData();
  }, [selectedLeague]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">🏆 Bảng xếp hạng</h1>

      <div className="flex flex-wrap gap-2">
        {LEAGUES.filter((l) => l.id !== 1 && l.id !== 2).map((league) => (
          <button
            key={league.id}
            onClick={() => setSelectedLeague(league.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              selectedLeague === league.id
                ? "bg-green-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {league.name}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-400">Đang tải...</p>
      ) : (
        <StandingsTable standings={standings} />
      )}
    </div>
  );
}
