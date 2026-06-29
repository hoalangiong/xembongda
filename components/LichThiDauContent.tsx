"use client";

import { useState, useEffect } from "react";
import MatchCard from "@/components/MatchCard";
import LeagueFilter from "@/components/LeagueFilter";
import { apiUrl } from "@/lib/utils";

export default function LichThiDauContent() {
  const [fixtures, setFixtures] = useState<any[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<number | null>(null);
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const params = new URLSearchParams({ date });
        if (selectedLeague) params.set("league", String(selectedLeague));
        const res = await fetch(apiUrl(`/api/fixtures?${params}`));
        const data = await res.json();
        setFixtures(data.data || []);
      } catch {
        setFixtures([]);
      }
      setLoading(false);
    }
    fetchData();
  }, [date, selectedLeague]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">📅 Lịch thi đấu</h1>

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
      ) : fixtures.length === 0 ? (
        <p className="text-gray-400">Không có trận đấu nào trong ngày này.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {fixtures.map((f: any) => (
            <MatchCard key={f.fixture.id} fixture={f} />
          ))}
        </div>
      )}
    </div>
  );
}
