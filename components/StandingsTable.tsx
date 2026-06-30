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
            <th className="px-2 py-2 sm:px-3">#</th>
            <th className="px-2 py-2 sm:px-3">Đội</th>
            <th className="px-2 py-2 text-center sm:px-3">Trận</th>
            <th className="px-2 py-2 text-center sm:px-3">Thắng</th>
            <th className="hidden px-2 py-2 text-center sm:table-cell sm:px-3">Hòa</th>
            <th className="hidden px-2 py-2 text-center sm:table-cell sm:px-3">Thua</th>
            <th className="hidden px-2 py-2 text-center md:table-cell sm:px-3">HS</th>
            <th className="px-2 py-2 text-center font-bold sm:px-3">Điểm</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((row) => (
            <tr key={row.team.id} className="border-b border-gray-800 hover:bg-gray-800/50">
              <td className="px-2 py-2 text-gray-300 sm:px-3">{row.rank}</td>
              <td className="px-2 py-2 sm:px-3">
                <div className="flex items-center gap-2">
                  {row.team.logo && (
                    <img src={row.team.logo} alt={row.team.name} className="h-5 w-5 shrink-0" />
                  )}
                  <span className="truncate text-white">{row.team.name}</span>
                </div>
              </td>
              <td className="px-2 py-2 text-center text-gray-300 sm:px-3">{row.all.played}</td>
              <td className="px-2 py-2 text-center text-gray-300 sm:px-3">{row.all.win}</td>
              <td className="hidden px-2 py-2 text-center text-gray-300 sm:table-cell sm:px-3">{row.all.draw}</td>
              <td className="hidden px-2 py-2 text-center text-gray-300 sm:table-cell sm:px-3">{row.all.lose}</td>
              <td className="hidden px-2 py-2 text-center text-gray-300 md:table-cell sm:px-3">{row.goalsDiff}</td>
              <td className="px-2 py-2 text-center font-bold text-white sm:px-3">{row.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
