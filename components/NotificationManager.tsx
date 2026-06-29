"use client";

import { useEffect, useRef } from "react";
import {
  getSubscriptions,
  updateSubscription,
  showNotification,
  removeFinished,
} from "@/lib/notifications";
import { apiUrl } from "@/lib/utils";

const POLL_INTERVAL = 60000; // 60 giây

const LIVE_STATUSES = ["1H", "2H", "HT", "ET", "P", "LIVE"];

export default function NotificationManager() {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function checkUpdates() {
      const subs = getSubscriptions();
      if (subs.length === 0) return;

      const ids = subs.map((s) => s.fixtureId).join(",");

      try {
        const res = await fetch(apiUrl(`/api/notifications/check?ids=${ids}`));
        const { data } = await res.json();

        if (!data || !Array.isArray(data)) return;

        for (const match of data) {
          const sub = subs.find((s) => s.fixtureId === match.fixtureId);
          if (!sub) continue;

          // Trận bắt đầu
          if (
            LIVE_STATUSES.includes(match.status) &&
            !LIVE_STATUSES.includes(sub.lastStatus) &&
            sub.lastStatus !== "FT"
          ) {
            showNotification(
              "🟢 Trận đã bắt đầu!",
              `${match.homeTeam} vs ${match.awayTeam}`
            );
          }

          // Có bàn thắng (tỷ số thay đổi)
          if (
            match.goalsHome !== null &&
            match.goalsAway !== null &&
            (match.goalsHome !== sub.lastGoalsHome || match.goalsAway !== sub.lastGoalsAway) &&
            sub.lastGoalsHome !== null
          ) {
            showNotification(
              "⚽ BÀN THẮNG!",
              `${match.homeTeam} ${match.goalsHome} - ${match.goalsAway} ${match.awayTeam}${match.elapsed ? ` (phút ${match.elapsed})` : ""}`
            );
          }

          // Trận kết thúc
          if (match.status === "FT" && sub.lastStatus !== "FT") {
            showNotification(
              "🏁 Kết thúc!",
              `${match.homeTeam} ${match.goalsHome} - ${match.goalsAway} ${match.awayTeam}`
            );
          }

          // Cập nhật state
          updateSubscription(
            match.fixtureId,
            match.goalsHome,
            match.goalsAway,
            match.status
          );
        }

        // Dọn các trận đã kết thúc sau 5 phút
        removeFinished();
      } catch {
        // ignore network errors
      }
    }

    // Check ngay lần đầu
    checkUpdates();

    // Poll mỗi 60s
    intervalRef.current = setInterval(checkUpdates, POLL_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Component không render gì
  return null;
}
