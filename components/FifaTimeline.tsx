"use client";

import { useState, useEffect } from "react";
import { apiUrl } from "@/lib/utils";

interface FifaTimelineProps {
  homeTeam: string;
  awayTeam: string;
}

interface MatchEvent {
  minute: string;
  type: string;
  description: string;
  homeGoals: number;
  awayGoals: number;
}

function getEventIcon(type: string) {
  switch (type) {
    case "goal": return "⚽";
    case "penalty_goal": return "⚽(P)";
    case "own_goal": return "⚽(OG)";
    case "yellow_card": return "🟨";
    case "red_card": return "🟥";
    case "substitution": return "🔄";
    default: return "•";
  }
}

export default function FifaTimeline({ homeTeam, awayTeam }: FifaTimelineProps) {
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch(
          apiUrl(`/api/match-detail?home=${encodeURIComponent(homeTeam)}&away=${encodeURIComponent(awayTeam)}`)
        );
        const data = await res.json();
        setEvents(data.data?.events || []);
      } catch {
        setEvents([]);
      }
      setLoading(false);
    }
    fetchEvents();
  }, [homeTeam, awayTeam]);

  if (loading) return null;
  if (events.length === 0) return null;

  return (
    <div className="rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        📋 Diễn biến trận đấu
      </h3>
      <div className="space-y-2">
        {events.map((event, i) => (
          <div key={i} className="flex items-start gap-3 text-sm">
            <span className="w-10 shrink-0 text-right text-xs font-medium text-gray-500">
              {event.minute}
            </span>
            <span className="text-base">{getEventIcon(event.type)}</span>
            <div className="flex-1">
              <p className="text-gray-900 dark:text-gray-200">{event.description}</p>
              {(event.type === "goal" || event.type === "penalty_goal" || event.type === "own_goal") && (
                <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                  {event.homeGoals} - {event.awayGoals}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
