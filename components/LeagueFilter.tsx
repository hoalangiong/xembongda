"use client";

import { LEAGUES } from "@/lib/leagues";

interface LeagueFilterProps {
  selected: number | null;
  onChange: (leagueId: number | null) => void;
}

export default function LeagueFilter({ selected, onChange }: LeagueFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(null)}
        className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
          selected === null
            ? "bg-green-600 text-white"
            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
        }`}
      >
        Tất cả
      </button>
      {LEAGUES.map((league) => (
        <button
          key={league.id}
          onClick={() => onChange(league.id)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
            selected === league.id
              ? "bg-green-600 text-white"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
          }`}
        >
          {league.name}
        </button>
      ))}
    </div>
  );
}
