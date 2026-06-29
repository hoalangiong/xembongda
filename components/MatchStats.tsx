interface StatItem {
  type: string;
  value: number | string | null;
}

interface TeamStats {
  team: { name: string; logo: string };
  statistics: StatItem[];
}

interface MatchStatsProps {
  statistics: TeamStats[];
}

const STAT_LABELS: Record<string, string> = {
  "Ball Possession": "Kiểm soát bóng",
  "Total Shots": "Tổng cú sút",
  "Shots on Goal": "Sút trúng đích",
  "Shots off Goal": "Sút chệch",
  "Corner Kicks": "Phạt góc",
  "Offsides": "Việt vị",
  "Fouls": "Lỗi",
  "Yellow Cards": "Thẻ vàng",
  "Red Cards": "Thẻ đỏ",
  "Total passes": "Tổng chuyền",
  "Passes accurate": "Chuyền chính xác",
  "Passes %": "% chuyền chính xác",
};

export default function MatchStats({ statistics }: MatchStatsProps) {
  if (statistics.length < 2) return null;

  const home = statistics[0];
  const away = statistics[1];

  return (
    <div className="rounded-lg bg-gray-800 p-4">
      <h3 className="mb-4 text-lg font-semibold">📊 Thống kê</h3>
      <div className="space-y-3">
        {home.statistics.map((stat, i) => {
          const awayStat = away.statistics[i];
          const label = STAT_LABELS[stat.type] || stat.type;
          const homeVal = stat.value ?? 0;
          const awayVal = awayStat?.value ?? 0;

          // Tính percentage cho thanh progress
          const homeNum = parseInt(String(homeVal)) || 0;
          const awayNum = parseInt(String(awayVal)) || 0;
          const total = homeNum + awayNum || 1;
          const homePercent = (homeNum / total) * 100;

          return (
            <div key={i}>
              <div className="mb-1 flex justify-between text-xs text-gray-300">
                <span>{homeVal}</span>
                <span className="text-gray-400">{label}</span>
                <span>{awayVal}</span>
              </div>
              <div className="flex h-1.5 gap-0.5 overflow-hidden rounded">
                <div
                  className="bg-green-500 transition-all"
                  style={{ width: `${homePercent}%` }}
                />
                <div
                  className="bg-gray-600 transition-all"
                  style={{ width: `${100 - homePercent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
