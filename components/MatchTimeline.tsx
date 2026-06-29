interface Event {
  time: { elapsed: number; extra: number | null };
  team: { name: string };
  player: { name: string };
  assist: { name: string | null };
  type: string;
  detail: string;
}

interface MatchTimelineProps {
  events: Event[];
  homeTeam: string;
}

function getEventIcon(type: string, detail: string) {
  if (type === "Goal") return "⚽";
  if (type === "Card" && detail === "Yellow Card") return "🟨";
  if (type === "Card" && detail === "Red Card") return "🟥";
  if (type === "subst") return "🔄";
  if (type === "Var") return "📺";
  return "•";
}

export default function MatchTimeline({ events, homeTeam }: MatchTimelineProps) {
  return (
    <div className="rounded-lg bg-gray-800 p-4">
      <h3 className="mb-4 text-lg font-semibold">📋 Diễn biến trận đấu</h3>
      <div className="space-y-2">
        {events.map((event, i) => {
          const isHome = event.team?.name === homeTeam;
          return (
            <div
              key={i}
              className={`flex items-center gap-3 text-sm ${
                isHome ? "" : "flex-row-reverse text-right"
              }`}
            >
              <span className="w-8 shrink-0 text-center text-xs text-gray-400">
                {event.time.elapsed}&apos;
                {event.time.extra ? `+${event.time.extra}` : ""}
              </span>
              <span className="text-base">{getEventIcon(event.type, event.detail)}</span>
              <span className="text-gray-200">
                {event.player?.name}
                {event.assist?.name && (
                  <span className="text-gray-500"> ({event.assist.name})</span>
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
