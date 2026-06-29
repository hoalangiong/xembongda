"use client";

import { useState, useEffect } from "react";
import { apiUrl } from "@/lib/utils";

interface MatchOddsProps {
  fixtureId: number;
  homeTeam?: string;
  awayTeam?: string;
}

// Nhà cái VN clone kèo SBOBET + affiliate links
const VN_BOOKMAKERS = [
  { name: "SC88", logo: "🔵", link: "https://www.sc88.com/?ref=xembongda", source: "sbobet" },
  { name: "78Win", logo: "🔴", link: "https://78win.com/?ref=xembongda", source: "sbobet" },
  { name: "X88", logo: "🟣", link: "https://x88.com/?ref=xembongda", source: "sbobet" },
];

export default function MatchOdds({ fixtureId, homeTeam, awayTeam }: MatchOddsProps) {
  const [oddsData, setOddsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOdds() {
      if (!homeTeam || !awayTeam) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(
          apiUrl(`/api/real-odds?home=${encodeURIComponent(homeTeam)}&away=${encodeURIComponent(awayTeam)}`)
        );
        const data = await res.json();
        setOddsData(data.data || null);
      } catch {
        setOddsData(null);
      }
      setLoading(false);
    }
    fetchOdds();
  }, [fixtureId, homeTeam, awayTeam]);

  if (loading) return null;
  if (!oddsData || !oddsData.bookmakers || oddsData.bookmakers.length === 0) return null;

  // Parse bookmakers data
  const bookmakers = oddsData.bookmakers || [];

  // Tìm spreads (Asian Handicap), totals (Tài/Xỉu), h2h (1X2)
  function getMarket(bm: any, marketKey: string) {
    return bm.markets?.find((m: any) => m.key === marketKey);
  }

  return (
    <div className="rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        🎯 Kèo châu Á (Real-time)
      </h3>

      {/* Kèo chấp (Spreads / Asian Handicap) */}
      {(() => {
        const spreadsData = bookmakers
          .map((bm: any) => ({ name: bm.title || bm.key, market: getMarket(bm, "spreads") }))
          .filter((b: any) => b.market);

        if (spreadsData.length === 0) return null;
        return (
          <div className="mb-4">
            <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Kèo chấp</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-300 dark:border-gray-600">
                    <th className="px-3 py-2 text-left text-xs text-gray-500">Nhà cái</th>
                    <th className="px-3 py-2 text-center text-xs text-gray-500">Chủ nhà</th>
                    <th className="px-3 py-2 text-center text-xs text-gray-500">Kèo</th>
                    <th className="px-3 py-2 text-center text-xs text-gray-500">Đội khách</th>
                    <th className="px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {spreadsData.map((bm: any) => {
                    const outcomes = bm.market.outcomes || [];
                    const homeOc = outcomes.find((o: any) => o.name === oddsData.home_team);
                    const awayOc = outcomes.find((o: any) => o.name === oddsData.away_team);
                    const vnBm = VN_BOOKMAKERS.find((v) => v.source === bm.name.toLowerCase());
                    return (
                      <tr key={bm.name} className="border-b border-gray-200 dark:border-gray-700">
                        <td className="px-3 py-2">
                          <span className="text-gray-700 dark:text-gray-300 font-medium">
                            {bm.name === "sbobet" ? "🟡 SBOBET" : bm.name === "m88" ? "🟠 M88" : bm.name}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-center font-medium text-gray-900 dark:text-white">
                          {homeOc?.price?.toFixed(2) || "-"}
                        </td>
                        <td className="px-3 py-2 text-center text-xs text-yellow-600 dark:text-yellow-400 font-bold">
                          {homeOc?.point !== undefined ? (homeOc.point > 0 ? `+${homeOc.point}` : homeOc.point) : "-"}
                        </td>
                        <td className="px-3 py-2 text-center font-medium text-gray-900 dark:text-white">
                          {awayOc?.price?.toFixed(2) || "-"}
                        </td>
                        <td className="px-3 py-2 text-center">
                          {vnBm ? (
                            <a href={vnBm.link} target="_blank" rel="noopener noreferrer"
                              className="rounded bg-green-600 px-2 py-1 text-xs font-medium text-white hover:bg-green-700">
                              Cược
                            </a>
                          ) : null}
                        </td>
                      </tr>
                    );
                  })}
                  {/* Nhà cái VN clone SBOBET */}
                  {(() => {
                    const sbobet = spreadsData.find((b: any) => b.name.toLowerCase() === "sbobet");
                    if (!sbobet) return null;
                    const outcomes = sbobet.market.outcomes || [];
                    const homeOc = outcomes.find((o: any) => o.name === oddsData.home_team);
                    const awayOc = outcomes.find((o: any) => o.name === oddsData.away_team);
                    return VN_BOOKMAKERS.map((vn) => (
                      <tr key={vn.name} className="border-b border-gray-200 dark:border-gray-700">
                        <td className="px-3 py-2">
                          <span className="text-gray-700 dark:text-gray-300">{vn.logo} {vn.name}</span>
                        </td>
                        <td className="px-3 py-2 text-center font-medium text-gray-900 dark:text-white">
                          {homeOc?.price?.toFixed(2) || "-"}
                        </td>
                        <td className="px-3 py-2 text-center text-xs text-yellow-600 dark:text-yellow-400 font-bold">
                          {homeOc?.point !== undefined ? (homeOc.point > 0 ? `+${homeOc.point}` : homeOc.point) : "-"}
                        </td>
                        <td className="px-3 py-2 text-center font-medium text-gray-900 dark:text-white">
                          {awayOc?.price?.toFixed(2) || "-"}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <a href={vn.link} target="_blank" rel="noopener noreferrer"
                            className="rounded bg-green-600 px-2 py-1 text-xs font-medium text-white hover:bg-green-700">
                            Cược
                          </a>
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        );
      })()}

      {/* Tài/Xỉu (Totals) */}
      {(() => {
        const totalsData = bookmakers
          .map((bm: any) => ({ name: bm.title || bm.key, market: getMarket(bm, "totals") }))
          .filter((b: any) => b.market);

        if (totalsData.length === 0) return null;
        return (
          <div className="mb-4">
            <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Tài / Xỉu</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-300 dark:border-gray-600">
                    <th className="px-3 py-2 text-left text-xs text-gray-500">Nhà cái</th>
                    <th className="px-3 py-2 text-center text-xs text-gray-500">Tài</th>
                    <th className="px-3 py-2 text-center text-xs text-gray-500">Mức</th>
                    <th className="px-3 py-2 text-center text-xs text-gray-500">Xỉu</th>
                  </tr>
                </thead>
                <tbody>
                  {totalsData.map((bm: any) => {
                    const outcomes = bm.market.outcomes || [];
                    const over = outcomes.find((o: any) => o.name === "Over");
                    const under = outcomes.find((o: any) => o.name === "Under");
                    return (
                      <tr key={bm.name} className="border-b border-gray-200 dark:border-gray-700">
                        <td className="px-3 py-2 text-gray-700 dark:text-gray-300">
                          {bm.name === "sbobet" ? "🟡 SBOBET" : bm.name === "m88" ? "🟠 M88" : bm.name}
                        </td>
                        <td className="px-3 py-2 text-center font-medium text-gray-900 dark:text-white">
                          {over?.price?.toFixed(2) || "-"}
                        </td>
                        <td className="px-3 py-2 text-center text-xs text-yellow-600 dark:text-yellow-400 font-bold">
                          {over?.point || "-"}
                        </td>
                        <td className="px-3 py-2 text-center font-medium text-gray-900 dark:text-white">
                          {under?.price?.toFixed(2) || "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })()}

      <p className="mt-3 text-xs text-gray-400">
        * Kèo thật từ SBOBET & M88 via odds-api.io. SC88/78Win/X88 theo line SBOBET. Link đối tác. 18+
      </p>
    </div>
  );
}
