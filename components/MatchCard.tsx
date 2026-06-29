import Link from "next/link";
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

  return (
    <div className="relative rounded-lg bg-gray-800 p-4 transition hover:bg-gray-750 hover:ring-1 hover:ring-green-600/50">
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
          <div className="flex flex-1 items-center gap-2">
            {teams.home.logo && (
              <img src={teams.home.logo} alt={teams.home.name} className="h-6 w-6" />
            )}
            <span className="text-sm font-medium text-white">{teams.home.name}</span>
          </div>

          <div className="mx-4 text-center">
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

          <div className="flex flex-1 items-center justify-end gap-2">
            <span className="text-sm font-medium text-white">{teams.away.name}</span>
            {teams.away.logo && (
              <img src={teams.away.logo} alt={teams.away.name} className="h-6 w-6" />
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
