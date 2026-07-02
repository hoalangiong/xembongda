"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import LiveBadge from "./LiveBadge";
import NotifyBell from "./NotifyBell";

interface MatchCardProps {
  fixture: {
    fixture: {
      id: number;
      status: { short: string; elapsed: number | null };
      date: string;
    };
    league: { name: string; logo: string };
    teams: {
      home: { name: string; logo: string };
      away: { name: string; logo: string };
    };
    goals: { home: number | null; away: number | null };
  };
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}

const LIVE_STATUSES = ["1H", "2H", "HT", "ET", "P", "LIVE"];

export default function MatchCard({ fixture }: MatchCardProps) {
  const { fixture: info, teams, goals, league } = fixture;
  const isLive = LIVE_STATUSES.includes(info.status.short);
  const isFinished = info.status.short === "FT";
  const href = isLive ? `/truc-tiep/${info.id}` : `/tran-dau/${info.id}`;

  // Flash hiệu ứng khi tỷ số thay đổi
  const [flash, setFlash] = useState(false);
  const prevScore = useRef<string>(`${goals.home}-${goals.away}`);

  useEffect(() => {
    const current = `${goals.home}-${goals.away}`;
    if (isLive && prevScore.current !== current && goals.home !== null) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 3000);
      prevScore.current = current;
      return () => clearTimeout(t);
    }
    prevScore.current = current;
  }, [goals.home, goals.away, isLive]);

  return (
    <div className={`relative rounded-lg bg-gray-800 p-4 transition hover:bg-gray-750 hover:ring-1 hover:ring-green-600/50 ${flash ? "ring-2 ring-green-500 animate-pulse" : ""}`}>
      <Link href={href} className="block">
        <div className="mb-2 flex items-center justify-between text-xs text-gray-400">
          <span className="flex items-center gap-1">
            {league.logo && (
              <img src={league.logo} alt={league.name} className="h-4 w-4" />
            )}
            {league.name}
          </span>
          {isLive ? (
            <LiveBadge />
          ) : isFinished ? (
            <span className="text-gray-500">Kết thúc</span>
          ) : (
            <span>{formatTime(info.date)}</span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-1 items-center gap-2 min-w-0">
            {teams.home.logo && (
              <img src={teams.home.logo} alt={teams.home.name} className="h-6 w-6 shrink-0" />
            )}
            <span className="truncate text-sm font-medium text-white">{teams.home.name}</span>
          </div>

          <div className="mx-2 shrink-0 text-center sm:mx-4">
            {goals.home !== null ? (
              <span className={`text-lg font-bold ${isLive ? "text-green-400" : "text-white"}`}>
                {goals.home} - {goals.away}
              </span>
            ) : (
              <span className="text-sm text-gray-500">vs</span>
            )}
            {isLive && info.status.elapsed && (
              <div className="text-xs text-green-400">{info.status.elapsed}&apos;</div>
            )}
          </div>

          <div className="flex flex-1 items-center justify-end gap-2 min-w-0">
            <span className="truncate text-sm font-medium text-white">{teams.away.name}</span>
            {teams.away.logo && (
              <img src={teams.away.logo} alt={teams.away.name} className="h-6 w-6 shrink-0" />
            )}
          </div>
        </div>
      </Link>

      {/* Nút chuông thông báo */}
      {!isFinished && (
        <NotifyBell
          fixtureId={info.id}
          homeTeam={teams.home.name}
          awayTeam={teams.away.name}
        />
      )}
    </div>
  );
}
