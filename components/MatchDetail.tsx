"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { apiUrl } from "@/lib/utils";
import MatchTimeline from "./MatchTimeline";
import MatchStats from "./MatchStats";
import MatchLineup from "./MatchLineup";
import MatchOdds from "./MatchOdds";

export default function MatchDetail() {
  const params = useParams();
  const id = params.id as string;
  const [match, setMatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMatch() {
      try {
        const res = await fetch(apiUrl(`/api/match/${id}`));
        const data = await res.json();
        setMatch(data.data?.[0] || null);
      } catch {
        setMatch(null);
      }
      setLoading(false);
    }
    fetchMatch();
  }, [id]);

  if (loading) {
    return <p className="text-gray-400">Đang tải...</p>;
  }

  if (!match) {
    return <p className="text-gray-400">Không tìm thấy trận đấu.</p>;
  }

  const { fixture, league, teams, goals, events, statistics, lineups } = match;

  return (
    <div className="space-y-6">
      {/* Header trận đấu */}
      <div className="rounded-lg bg-gray-800 p-6 text-center">
        <p className="text-sm text-gray-400">{league?.name} — {league?.round}</p>
        <div className="mt-4 flex items-center justify-center gap-6">
          <div className="flex flex-col items-center gap-2">
            {teams.home.logo && (
              <img src={teams.home.logo} alt={teams.home.name} className="h-12 w-12" />
            )}
            <span className="text-sm font-medium">{teams.home.name}</span>
          </div>

          <div className="text-center">
            {goals.home !== null ? (
              <p className="text-3xl font-bold text-white">
                {goals.home} - {goals.away}
              </p>
            ) : (
              <p className="text-xl text-gray-500">vs</p>
            )}
            <p className="mt-1 text-xs text-gray-400">
              {fixture.status.long}
              {fixture.status.elapsed && ` — ${fixture.status.elapsed}'`}
            </p>
          </div>

          <div className="flex flex-col items-center gap-2">
            {teams.away.logo && (
              <img src={teams.away.logo} alt={teams.away.name} className="h-12 w-12" />
            )}
            <span className="text-sm font-medium">{teams.away.name}</span>
          </div>
        </div>

        <p className="mt-3 text-xs text-gray-500">
          {new Date(fixture.date).toLocaleDateString("vi-VN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        {fixture.venue?.name && (
          <p className="text-xs text-gray-500">📍 {fixture.venue.name}, {fixture.venue.city}</p>
        )}
      </div>

      {/* Tỷ lệ kèo */}
      <MatchOdds fixtureId={fixture.id} />

      {/* Timeline sự kiện */}
      {events && events.length > 0 && (
        <MatchTimeline events={events} homeTeam={teams.home.name} />
      )}

      {/* Thống kê */}
      {statistics && statistics.length > 0 && (
        <MatchStats statistics={statistics} />
      )}

      {/* Đội hình */}
      {lineups && lineups.length > 0 && (
        <MatchLineup lineups={lineups} />
      )}
    </div>
  );
}
