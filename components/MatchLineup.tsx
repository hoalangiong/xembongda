interface Player {
  player: { id: number; name: string; number: number; pos: string };
}

interface Lineup {
  team: { name: string; logo: string };
  formation: string;
  startXI: Array<{ player: Player["player"] }>;
  substitutes: Array<{ player: Player["player"] }>;
  coach: { name: string };
}

interface MatchLineupProps {
  lineups: Lineup[];
}

export default function MatchLineup({ lineups }: MatchLineupProps) {
  if (lineups.length < 2) return null;

  return (
    <div className="rounded-lg bg-gray-800 p-4">
      <h3 className="mb-4 text-lg font-semibold">👥 Đội hình</h3>
      <div className="grid gap-6 md:grid-cols-2">
        {lineups.map((lineup) => (
          <div key={lineup.team.name}>
            <div className="mb-3 flex items-center gap-2">
              {lineup.team.logo && (
                <img src={lineup.team.logo} alt={lineup.team.name} className="h-5 w-5" />
              )}
              <span className="font-medium text-white">{lineup.team.name}</span>
              <span className="text-xs text-gray-400">({lineup.formation})</span>
            </div>
            <p className="mb-2 text-xs text-gray-400">HLV: {lineup.coach?.name}</p>

            <div className="space-y-1">
              <p className="text-xs font-medium text-green-400">Đội hình chính</p>
              {lineup.startXI.map(({ player }) => (
                <div key={player.id} className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="w-6 text-center text-xs text-gray-500">{player.number}</span>
                  <span>{player.name}</span>
                  <span className="text-xs text-gray-600">{player.pos}</span>
                </div>
              ))}
            </div>

            {lineup.substitutes.length > 0 && (
              <div className="mt-3 space-y-1">
                <p className="text-xs font-medium text-yellow-400">Dự bị</p>
                {lineup.substitutes.slice(0, 7).map(({ player }) => (
                  <div key={player.id} className="flex items-center gap-2 text-sm text-gray-400">
                    <span className="w-6 text-center text-xs text-gray-600">{player.number}</span>
                    <span>{player.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
