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
  { name: "SC88", logo: "🔵", link: "https://www.sc88.com/?ref=xembongda" },
  { name: "78Win", logo: "🔴", link: "https://78win.com/?ref=xembongda" },
  { name: "X88", logo: "🟣", link: "https://x88.com/?ref=xembongda" },
];

export default function MatchOdds({ fixtureId, homeTeam, awayTeam }: MatchOddsProps) {
  const [oddsData, setOddsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOdds() {
      if (!homeTeam || !awayTeam) { setLoading(false); return; }
      try {
        const res = await fetch(
          apiUrl(`/api/real-odds?home=${encodeURIComponent(homeTeam)}&away=${encodeURIComponent(awayTeam)}`)
        );
        const json = await res.json();
        setOddsData(json.data || null);
      } catch {
        setOddsData(null);
      }
      setLoading(false);
    }
    fetchOdds();
  }, [fixtureId, homeTeam, awayTeam]);

  if (loading) return null;
  if (!oddsData || !oddsData.bookmakers) return null;

  const bookmakers = oddsData.bookmakers; // { M88: [...], Sbobet: [...] }
  const bmNames = Object.keys(bookmakers);
  if (bmNames.length === 0) return null;

  // Helper: tìm market theo tên
  function getMarket(bmKey: string, marketName: string) {
    const markets = bookmakers[bmKey] || [];
    return markets.find((m: any) => m.name === marketName);
  }

  // Lấy Spread (kèo chấp) từ mỗi nhà cái
  const spreadRows = bmNames
    .map((bm) => ({ name: bm, market: getMarket(bm, "Spread") }))
    .filter((b) => b.market);

  // Lấy Totals (tài xỉu) từ mỗi nhà cái
  const totalsRows = bmNames
    .map((bm) => ({ name: bm, market: getMarket(bm, "Totals") }))
    .filter((b) => b.market);

  return (
    <div className="rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        🎯 Kèo châu Á (SBOBET & M88)
      </h3>

      {/* Kèo chấp */}
      {spreadRows.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Kèo chấp</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-300 dark:border-gray-600">
                  <th className="px-3 py-2 text-left text-xs text-gray-500">Nhà cái</th>
                  <th className="px-3 py-2 text-center text-xs text-gray-500">{oddsData.home}</th>
                  <th className="px-3 py-2 text-center text-xs text-gray-500">Kèo</th>
                  <th className="px-3 py-2 text-center text-xs text-gray-500">{oddsData.away}</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {spreadRows.map(({ name, market }) => {
                  const mainLine = market.odds[0]; // Lấy line chính
                  const label = name === "Sbobet" ? "🟡 SBOBET" : "🟠 M88";
                  return (
                    <tr key={name} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="px-3 py-2 font-medium text-gray-700 dark:text-gray-300">{label}</td>
                      <td className="px-3 py-2 text-center font-medium text-gray-900 dark:text-white">{mainLine.home}</td>
                      <td className="px-3 py-2 text-center text-xs font-bold text-yellow-600 dark:text-yellow-400">
                        {mainLine.hdp > 0 ? `+${mainLine.hdp}` : mainLine.hdp}
                      </td>
                      <td className="px-3 py-2 text-center font-medium text-gray-900 dark:text-white">{mainLine.away}</td>
                      <td className="px-3 py-2"></td>
                    </tr>
                  );
                })}
                {/* Nhà cái VN theo line SBOBET */}
                {(() => {
                  const sbobet = spreadRows.find((b) => b.name === "Sbobet");
                  if (!sbobet) return null;
                  const line = sbobet.market.odds[0];
                  return VN_BOOKMAKERS.map((vn) => (
                    <tr key={vn.name} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{vn.logo} {vn.name}</td>
                      <td className="px-3 py-2 text-center font-medium text-gray-900 dark:text-white">{line.home}</td>
                      <td className="px-3 py-2 text-center text-xs font-bold text-yellow-600 dark:text-yellow-400">
                        {line.hdp > 0 ? `+${line.hdp}` : line.hdp}
                      </td>
                      <td className="px-3 py-2 text-center font-medium text-gray-900 dark:text-white">{line.away}</td>
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
      )}

      {/* Tài/Xỉu */}
      {totalsRows.length > 0 && (
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
                {totalsRows.map(({ name, market }) => {
                  const mainLine = market.odds[0];
                  const label = name === "Sbobet" ? "🟡 SBOBET" : "🟠 M88";
                  return (
                    <tr key={name} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="px-3 py-2 font-medium text-gray-700 dark:text-gray-300">{label}</td>
                      <td className="px-3 py-2 text-center font-medium text-gray-900 dark:text-white">{mainLine.over}</td>
                      <td className="px-3 py-2 text-center text-xs font-bold text-yellow-600 dark:text-yellow-400">{mainLine.hdp}</td>
                      <td className="px-3 py-2 text-center font-medium text-gray-900 dark:text-white">{mainLine.under}</td>
                    </tr>
                  );
                })}
                {/* VN bookmakers */}
                {(() => {
                  const sbobet = totalsRows.find((b) => b.name === "Sbobet");
                  if (!sbobet) return null;
                  const line = sbobet.market.odds[0];
                  return VN_BOOKMAKERS.map((vn) => (
                    <tr key={vn.name} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{vn.logo} {vn.name}</td>
                      <td className="px-3 py-2 text-center font-medium text-gray-900 dark:text-white">{line.over}</td>
                      <td className="px-3 py-2 text-center text-xs font-bold text-yellow-600 dark:text-yellow-400">{line.hdp}</td>
                      <td className="px-3 py-2 text-center font-medium text-gray-900 dark:text-white">{line.under}</td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="mt-3 text-xs text-gray-400">
        * Data thật từ SBOBET & M88 (odds-api.io). SC88/78Win/X88 theo line SBOBET. Link đối tác. 18+
      </p>
    </div>
  );
}
