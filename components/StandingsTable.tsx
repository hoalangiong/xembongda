interface StandingsTableProps {
  standings: Array<{
    rank: number;
    team: { id: number; name: string; logo: string };
    points: number;
    all: {
      played: number;
      win: number;
      draw: number;
      lose: number;
      goals: { for: number; against: number };
    };
    goalsDiff: number;
  }>;
}

export default function StandingsTable({ standings }: StandingsTableProps) {
  if (!standings || standings.length === 0) {
    return <p className="text-gray-400">Chưa có dữ liệu bảng xếp hạng.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="border-b border-gray-700 text-xs uppercase text-gray-400">
          <tr>
            <th className="px-3 py-2">#</th>
            <th className="px-3 py-2">Đội</th>
            <th className="px-3 py-2 text-center">Trận</th>
            <th className="px-3 py-2 text-center">Thắng</th>
            <th className="px-3 py-2 text-center">Hòa</th>
            <th className="px-3 py-2 text-center">Thua</th>
            <th className="px-3 py-2 text-center">HS</th>
            <th className="px-3 py-2 text-center font-bold">Điểm</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((row) => (
            <tr key={row.team.id} className="border-b border-gray-800 hover:bg-gray-800/50">
              <td className="px-3 py-2 text-gray-300">{row.rank}</td>
              <td className="px-3 py-2">
                <div className="flex items-center gap-2">
                  {row.team.logo && (
                    <img src={row.team.logo} alt={row.team.name} className="h-5 w-5" />
                  )}
                  <span className="text-white">{row.team.name}</span>
                </div>
              </td>
              <td className="px-3 py-2 text-center text-gray-300">{row.all.played}</td>
              <td className="px-3 py-2 text-center text-gray-300">{row.all.win}</td>
              <td className="px-3 py-2 text-center text-gray-300">{row.all.draw}</td>
              <td className="px-3 py-2 text-center text-gray-300">{row.all.lose}</td>
              <td className="px-3 py-2 text-center text-gray-300">{row.goalsDiff}</td>
              <td className="px-3 py-2 text-center font-bold text-white">{row.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
