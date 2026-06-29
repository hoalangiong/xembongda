"use client";

import { useState, useEffect } from "react";
import { apiUrl } from "@/lib/utils";

interface MatchOddsProps {
  fixtureId: number;
}

// Nhà cái Việt Nam + link affiliate
const BOOKMAKERS_VN = [
  { name: "M88", logo: "🟡", link: "https://www.m88.com/?aff=xembongda" },
  { name: "SC88", logo: "🔵", link: "https://www.sc88.com/?ref=xembongda" },
  { name: "78Win", logo: "🔴", link: "https://78win.com/?ref=xembongda" },
  { name: "Fun88", logo: "🟠", link: "https://www.fun88.com/?aff=xembongda" },
];

export default function MatchOdds({ fixtureId }: MatchOddsProps) {
  const [odds, setOdds] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOdds() {
      try {
        const res = await fetch(apiUrl(`/api/odds/${fixtureId}`));
        const data = await res.json();
        setOdds(data.data?.[0] || null);
      } catch {
        setOdds(null);
      }
      setLoading(false);
    }
    fetchOdds();
  }, [fixtureId]);

  if (loading) return null;
  if (!odds || !odds.bookmakers || odds.bookmakers.length === 0) return null;

  // Lấy tất cả bookmaker có kèo Match Winner
  const allBookmakers = odds.bookmakers
    .map((bm: any) => {
      const mw = bm.bets?.find((b: any) => b.name === "Match Winner");
      if (!mw) return null;
      return { name: bm.name, odds: mw.values };
    })
    .filter(Boolean)
    .slice(0, 5); // Lấy top 5

  // Tìm best odds cho mỗi outcome
  function getBestOdd(outcome: string): number {
    let best = 0;
    for (const bm of allBookmakers) {
      const val = bm.odds.find((v: any) => v.value === outcome);
      if (val && parseFloat(val.odd) > best) best = parseFloat(val.odd);
    }
    return best;
  }

  const bestHome = getBestOdd("Home");
  const bestDraw = getBestOdd("Draw");
  const bestAway = getBestOdd("Away");

  const overUnder = odds.bookmakers[0]?.bets?.find((b: any) => b.name === "Goals Over/Under");

  return (
    <div className="rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        🎯 So sánh tỷ lệ kèo
      </h3>

      {/* Bảng so sánh odds từ nhiều bookmaker */}
      <div className="mb-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-300 dark:border-gray-600">
              <th className="px-3 py-2 text-left text-xs text-gray-500">Nhà cái</th>
              <th className="px-3 py-2 text-center text-xs text-gray-500">Chủ nhà</th>
              <th className="px-3 py-2 text-center text-xs text-gray-500">Hòa</th>
              <th className="px-3 py-2 text-center text-xs text-gray-500">Đội khách</th>
            </tr>
          </thead>
          <tbody>
            {allBookmakers.map((bm: any) => {
              const home = bm.odds.find((v: any) => v.value === "Home");
              const draw = bm.odds.find((v: any) => v.value === "Draw");
              const away = bm.odds.find((v: any) => v.value === "Away");
              return (
                <tr key={bm.name} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{bm.name}</td>
                  <td className={`px-3 py-2 text-center font-medium ${parseFloat(home?.odd) === bestHome ? "text-green-600 dark:text-green-400 font-bold" : "text-gray-900 dark:text-white"}`}>
                    {home?.odd || "-"}
                  </td>
                  <td className={`px-3 py-2 text-center font-medium ${parseFloat(draw?.odd) === bestDraw ? "text-green-600 dark:text-green-400 font-bold" : "text-gray-900 dark:text-white"}`}>
                    {draw?.odd || "-"}
                  </td>
                  <td className={`px-3 py-2 text-center font-medium ${parseFloat(away?.odd) === bestAway ? "text-green-600 dark:text-green-400 font-bold" : "text-gray-900 dark:text-white"}`}>
                    {away?.odd || "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="mt-2 text-xs text-green-600 dark:text-green-400">
          ✅ Màu xanh = kèo ngon nhất (odds cao nhất)
        </p>
      </div>

      {/* Over/Under */}
      {overUnder && overUnder.values.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Tài/Xỉu</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {overUnder.values.slice(0, 6).map((v: any, i: number) => (
              <div
                key={i}
                className="rounded-lg bg-gray-200 p-2 text-center dark:bg-gray-700"
              >
                <p className="text-xs text-gray-500 dark:text-gray-400">{v.value}</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{v.odd}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Nhà cái Việt Nam + affiliate links */}
      <div className="mt-4 border-t border-gray-300 pt-4 dark:border-gray-600">
        <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
          🏦 Đặt cược tại nhà cái uy tín
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {BOOKMAKERS_VN.map((bm) => (
            <a
              key={bm.name}
              href={bm.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg bg-gray-200 px-3 py-2.5 text-sm font-medium text-gray-900 transition hover:bg-green-600 hover:text-white dark:bg-gray-700 dark:text-white dark:hover:bg-green-600"
            >
              <span>{bm.logo}</span>
              {bm.name}
            </a>
          ))}
        </div>
        <p className="mt-2 text-xs text-gray-400">
          * Link liên kết. Chơi có trách nhiệm. 18+
        </p>
      </div>
    </div>
  );
}
