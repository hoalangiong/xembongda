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
    case "penalty_goal": return "⚽";
    case "own_goal": return "⚽";
    case "yellow_card": return "🟨";
    case "red_card": return "🟥";
    case "substitution": return "🔄";
    default: return "•";
  }
}

function getEventLabel(type: string) {
  switch (type) {
    case "goal": return "";
    case "penalty_goal": return "(Pen)";
    case "own_goal": return "(P.lưới)";
    case "yellow_card": return "";
    case "red_card": return "";
    case "substitution": return "";
    default: return "";
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

  // Xác định event thuộc team nào dựa vào description
  function isHomeEvent(event: MatchEvent): boolean {
    const desc = event.description.toLowerCase();
    return desc.includes(homeTeam.toLowerCase()) || desc.includes(homeTeam.split(" ")[0].toLowerCase());
  }

  return (
    <div className="rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
        <span className="text-sm font-bold text-gray-900 dark:text-white">{homeTeam}</span>
        <span className="text-xs font-medium text-gray-500">Diễn biến</span>
        <span className="text-sm font-bold text-gray-900 dark:text-white">{awayTeam}</span>
      </div>

      {/* Events */}
      <div className="space-y-1">
        {events.map((event, i) => {
          const isHome = isHomeEvent(event);
          // Lấy tên cầu thủ từ description
          const playerMatch = event.description.match(/^([A-ZÀ-Ž\s.'-]+)\s*\(/i) || event.description.match(/^(.+?)\s(scores|commits|receives|replaces|comes)/i);
          const playerName = playerMatch ? playerMatch[1].trim() : event.description.split("(")[0].trim();

          return (
            <div
              key={i}
              className={`flex items-center gap-2 rounded px-2 py-1.5 ${
                event.type === "goal" || event.type === "penalty_goal"
                  ? "bg-green-50 dark:bg-green-900/20"
                  : ""
              }`}
            >
              {/* Home side */}
              <div className="flex flex-1 items-center justify-end gap-1 text-right">
                {isHome && (
                  <>
                    <span className="text-xs text-gray-700 dark:text-gray-300">
                      {playerName} {getEventLabel(event.type)}
                    </span>
                    <span>{getEventIcon(event.type)}</span>
                  </>
                )}
              </div>

              {/* Minute */}
              <div className="w-12 shrink-0 text-center">
                <span className="rounded bg-gray-200 px-1.5 py-0.5 text-xs font-bold text-gray-700 dark:bg-gray-600 dark:text-gray-200">
                  {event.minute}
                </span>
              </div>

              {/* Away side */}
              <div className="flex flex-1 items-center gap-1">
                {!isHome && (
                  <>
                    <span>{getEventIcon(event.type)}</span>
                    <span className="text-xs text-gray-700 dark:text-gray-300">
                      {playerName} {getEventLabel(event.type)}
                    </span>
                  </>
                )}
              </div>

              {/* Score update for goals */}
              {(event.type === "goal" || event.type === "penalty_goal" || event.type === "own_goal") && (
                <span className="ml-1 shrink-0 rounded bg-green-600 px-1.5 py-0.5 text-xs font-bold text-white">
                  {event.homeGoals}-{event.awayGoals}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
