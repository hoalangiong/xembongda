"use client";

import { useState, useEffect } from "react";
import { apiUrl } from "@/lib/utils";

interface MatchOddsProps {
  fixtureId: number;
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

  const bookmaker = odds.bookmakers[0];
  const matchWinner = bookmaker.bets?.find((b: any) => b.name === "Match Winner");
  const overUnder = bookmaker.bets?.find((b: any) => b.name === "Goals Over/Under");

  if (!matchWinner) return null;

  return (
    <div className="rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
      <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
        🎯 Tỷ lệ kèo
      </h3>
      <p className="mb-3 text-xs text-gray-500">{bookmaker.name}</p>

      {/* 1X2 */}
      <div className="mb-4">
        <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Kết quả trận</p>
        <div className="grid grid-cols-3 gap-2">
          {matchWinner.values.map((v: any) => (
            <div
              key={v.value}
              className="rounded-lg bg-gray-200 p-3 text-center dark:bg-gray-700"
            >
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {v.value === "Home" ? "Chủ nhà" : v.value === "Away" ? "Đội khách" : "Hòa"}
              </p>
              <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">{v.odd}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Over/Under */}
      {overUnder && overUnder.values.length > 0 && (
        <div>
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
    </div>
  );
}
