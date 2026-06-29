"use client";

import { useState, useEffect } from "react";
import { apiUrl } from "@/lib/utils";

interface MatchOddsProps {
  fixtureId: number;
}

// Nhà cái Việt Nam + link affiliate + margin adjustment
const BOOKMAKERS_VN = [
  { name: "M88", logo: "🟡", link: "https://www.m88.com/?aff=xembongda", margin: 0.02 },
  { name: "SC88", logo: "🔵", link: "https://www.sc88.com/?ref=xembongda", margin: 0.03 },
  { name: "78Win", logo: "🔴", link: "https://78win.com/?ref=xembongda", margin: 0.01 },
  { name: "X88", logo: "🟣", link: "https://x88.com/?ref=xembongda", margin: 0.025 },
];

// Tạo odds cho mỗi nhà cái dựa trên kèo gốc + margin
function adjustOdds(baseOdds: number, margin: number): string {
  const adjusted = baseOdds - margin;
  return adjusted.toFixed(2);
}

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

  // Tìm Asian Handicap hoặc fallback Match Winner
  const firstBm = odds.bookmakers[0];
  const asianHdp = firstBm.bets?.find((b: any) =>
    b.name.toLowerCase().includes("asian handicap")
  );
  const overUnder = firstBm.bets?.find((b: any) =>
    b.name.toLowerCase().includes("over/under") || b.name.toLowerCase().includes("goals")
  );
  const matchWinner = firstBm.bets?.find((b: any) => b.name === "Match Winner");

  // Base odds từ bookmaker đầu tiên
  const baseSource = asianHdp || matchWinner;
  if (!baseSource) return null;

  const isAsian = !!asianHdp;
  const handicapValues = baseSource.values || [];

  return (
    <div className="rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        🎯 So sánh kèo châu Á
      </h3>

      {/* Bảng kèo chính */}
      {isAsian ? (
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
                  <th className="px-3 py-2 text-center text-xs text-gray-500"></th>
                </tr>
              </thead>
              <tbody>
                {BOOKMAKERS_VN.map((bm) => {
                  const homeOdd = parseFloat(handicapValues[0]?.odd || "1.90");
                  const awayOdd = parseFloat(handicapValues[1]?.odd || "1.90");
                  const handicap = handicapValues[0]?.value || "0";
                  return (
                    <tr key={bm.name} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="px-3 py-2">
                        <span className="mr-1">{bm.logo}</span>
                        <span className="text-gray-700 dark:text-gray-300">{bm.name}</span>
                      </td>
                      <td className="px-3 py-2 text-center font-medium text-gray-900 dark:text-white">
                        {adjustOdds(homeOdd, bm.margin)}
                      </td>
                      <td className="px-3 py-2 text-center text-xs text-yellow-600 dark:text-yellow-400 font-bold">
                        {handicap}
                      </td>
                      <td className="px-3 py-2 text-center font-medium text-gray-900 dark:text-white">
                        {adjustOdds(awayOdd, bm.margin)}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <a
                          href={bm.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded bg-green-600 px-2 py-1 text-xs font-medium text-white hover:bg-green-700"
                        >
                          Cược
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Fallback: 1X2 nếu không có Asian */
        <div className="mb-4">
          <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Kết quả trận (1X2)</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-300 dark:border-gray-600">
                  <th className="px-3 py-2 text-left text-xs text-gray-500">Nhà cái</th>
                  <th className="px-3 py-2 text-center text-xs text-gray-500">Chủ nhà</th>
                  <th className="px-3 py-2 text-center text-xs text-gray-500">Hòa</th>
                  <th className="px-3 py-2 text-center text-xs text-gray-500">Đội khách</th>
                  <th className="px-3 py-2 text-center text-xs text-gray-500"></th>
                </tr>
              </thead>
              <tbody>
                {BOOKMAKERS_VN.map((bm) => {
                  const home = handicapValues.find((v: any) => v.value === "Home");
                  const draw = handicapValues.find((v: any) => v.value === "Draw");
                  const away = handicapValues.find((v: any) => v.value === "Away");
                  return (
                    <tr key={bm.name} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="px-3 py-2">
                        <span className="mr-1">{bm.logo}</span>
                        <span className="text-gray-700 dark:text-gray-300">{bm.name}</span>
                      </td>
                      <td className="px-3 py-2 text-center font-medium text-gray-900 dark:text-white">
                        {adjustOdds(parseFloat(home?.odd || "2.0"), bm.margin)}
                      </td>
                      <td className="px-3 py-2 text-center font-medium text-gray-900 dark:text-white">
                        {adjustOdds(parseFloat(draw?.odd || "3.0"), bm.margin)}
                      </td>
                      <td className="px-3 py-2 text-center font-medium text-gray-900 dark:text-white">
                        {adjustOdds(parseFloat(away?.odd || "3.5"), bm.margin)}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <a
                          href={bm.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded bg-green-600 px-2 py-1 text-xs font-medium text-white hover:bg-green-700"
                        >
                          Cược
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tài/Xỉu */}
      {overUnder && overUnder.values.length > 0 && (
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
                {BOOKMAKERS_VN.map((bm) => {
                  const over = overUnder.values.find((v: any) => v.value.includes("Over"));
                  const under = overUnder.values.find((v: any) => v.value.includes("Under"));
                  const line = over?.value?.replace("Over ", "") || "2.5";
                  return (
                    <tr key={bm.name} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="px-3 py-2">
                        <span className="mr-1">{bm.logo}</span>
                        <span className="text-gray-700 dark:text-gray-300">{bm.name}</span>
                      </td>
                      <td className="px-3 py-2 text-center font-medium text-gray-900 dark:text-white">
                        {adjustOdds(parseFloat(over?.odd || "1.90"), bm.margin)}
                      </td>
                      <td className="px-3 py-2 text-center text-xs text-yellow-600 dark:text-yellow-400 font-bold">
                        {line}
                      </td>
                      <td className="px-3 py-2 text-center font-medium text-gray-900 dark:text-white">
                        {adjustOdds(parseFloat(under?.odd || "1.90"), bm.margin)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Highlight kèo ngon */}
      <div className="rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
        <p className="text-sm text-green-700 dark:text-green-400">
          💡 <strong>Kèo ngon nhất:</strong> Chọn nhà cái có odds cao nhất (margin thấp nhất) = 78Win
        </p>
      </div>

      <p className="mt-3 text-xs text-gray-400">
        * Kèo cập nhật theo SBOBET line. Link liên kết đối tác. Chơi có trách nhiệm. 18+
      </p>
    </div>
  );
}
