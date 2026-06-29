"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { apiUrl } from "@/lib/utils";
import MatchCard from "./MatchCard";

export default function TeamDetail() {
  const params = useParams();
  const id = params.id as string;
  const [team, setTeam] = useState<any>(null);
  const [lastMatches, setLastMatches] = useState<any[]>([]);
  const [nextMatches, setNextMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeam() {
      try {
        const res = await fetch(apiUrl(`/api/team/${id}`));
        const data = await res.json();
        setTeam(data.team);
        setLastMatches(data.lastMatches || []);
        setNextMatches(data.nextMatches || []);
      } catch {
        setTeam(null);
      }
      setLoading(false);
    }
    fetchTeam();
  }, [id]);

  if (loading) return <p className="text-gray-400">Đang tải...</p>;
  if (!team) return <p className="text-gray-400">Không tìm thấy đội bóng.</p>;

  const { team: teamInfo, venue } = team;

  return (
    <div className="space-y-6">
      {/* Header đội */}
      <div className="flex items-center gap-4 rounded-lg bg-gray-100 p-6 dark:bg-gray-800">
        {teamInfo.logo && (
          <img src={teamInfo.logo} alt={teamInfo.name} className="h-16 w-16" />
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{teamInfo.name}</h1>
          <p className="text-sm text-gray-500">
            {teamInfo.country} • Thành lập {teamInfo.founded}
          </p>
          {venue && (
            <p className="text-sm text-gray-500">
              🏟️ {venue.name} ({venue.capacity?.toLocaleString()} chỗ)
            </p>
          )}
        </div>
      </div>

      {/* Phong độ 5 trận gần nhất */}
      {lastMatches.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
            📈 Phong độ gần đây
          </h2>
          <div className="mb-4 flex gap-2">
            {lastMatches.map((match: any) => {
              const isHome = match.teams.home.id === Number(id);
              const teamGoals = isHome ? match.goals.home : match.goals.away;
              const oppGoals = isHome ? match.goals.away : match.goals.home;
              let result = "D";
              let color = "bg-gray-500";
              if (teamGoals > oppGoals) { result = "W"; color = "bg-green-500"; }
              else if (teamGoals < oppGoals) { result = "L"; color = "bg-red-500"; }
              return (
                <span
                  key={match.fixture.id}
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ${color}`}
                  title={`${match.teams.home.name} ${match.goals.home}-${match.goals.away} ${match.teams.away.name}`}
                >
                  {result}
                </span>
              );
            })}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {lastMatches.map((f: any) => (
              <MatchCard key={f.fixture.id} fixture={f} />
            ))}
          </div>
        </section>
      )}

      {/* Trận sắp tới */}
      {nextMatches.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
            📅 Trận sắp tới
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {nextMatches.map((f: any) => (
              <MatchCard key={f.fixture.id} fixture={f} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
