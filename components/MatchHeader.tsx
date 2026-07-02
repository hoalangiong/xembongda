interface MatchHeaderProps {
  leagueName: string;
  leagueLogo?: string;
  homeName: string;
  homeLogo?: string;
  awayName: string;
  awayLogo?: string;
  homeGoals: number | null;
  awayGoals: number | null;
  statusText: string;
  kickoff: Date;
  isFinished: boolean;
  isLive?: boolean;
  elapsed?: number | null;
  venue?: string;
}

export default function MatchHeader({
  leagueName, leagueLogo, homeName, homeLogo, awayName, awayLogo,
  homeGoals, awayGoals, statusText, kickoff, isFinished, isLive, elapsed, venue,
}: MatchHeaderProps) {
  const hasScore = homeGoals !== null && awayGoals !== null;

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm dark:bg-gray-800">
      {/* League bar */}
      <div className="flex items-center justify-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-2.5 dark:border-gray-700 dark:bg-gray-900/50">
        {leagueLogo && <img src={leagueLogo} alt="" className="h-4 w-4 object-contain" />}
        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{leagueName}</span>
      </div>

      {/* Score row */}
      <div className="grid grid-cols-3 items-center gap-2 px-4 py-8">
        {/* Home */}
        <div className="flex flex-col items-center gap-3">
          {homeLogo ? (
            <img src={homeLogo} alt={homeName} className="h-16 w-16 object-contain drop-shadow" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-2xl dark:bg-gray-700">⚽</div>
          )}
          <span className="text-center text-sm font-semibold text-gray-900 dark:text-white">{homeName}</span>
        </div>

        {/* Center: score or time */}
        <div className="flex flex-col items-center">
          {isLive && (
            <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
              {elapsed ? `${elapsed}'` : "LIVE"}
            </span>
          )}
          {hasScore ? (
            <div className="flex items-center gap-3 text-4xl font-bold text-gray-900 dark:text-white">
              <span>{homeGoals}</span>
              <span className="text-gray-300 dark:text-gray-600">-</span>
              <span>{awayGoals}</span>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-400">
                {kickoff.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          )}
          <span className={`mt-2 text-xs font-medium ${isFinished ? "text-gray-400" : "text-green-600 dark:text-green-400"}`}>
            {statusText}
          </span>
        </div>

        {/* Away */}
        <div className="flex flex-col items-center gap-3">
          {awayLogo ? (
            <img src={awayLogo} alt={awayName} className="h-16 w-16 object-contain drop-shadow" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-2xl dark:bg-gray-700">⚽</div>
          )}
          <span className="text-center text-sm font-semibold text-gray-900 dark:text-white">{awayName}</span>
        </div>
      </div>

      {/* Footer: date + venue */}
      <div className="border-t border-gray-100 bg-gray-50 px-4 py-2.5 text-center dark:border-gray-700 dark:bg-gray-900/50">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {kickoff.toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          {" • "}
          {kickoff.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
        </p>
        {venue && <p className="mt-0.5 text-xs text-gray-400">📍 {venue}</p>}
      </div>
    </div>
  );
}
