"use client";

import { useState, useEffect } from "react";
import { isSubscribed, subscribe, unsubscribe, requestPermission } from "@/lib/notifications";

interface NotifyBellProps {
  fixtureId: number;
  homeTeam: string;
  awayTeam: string;
}

export default function NotifyBell({ fixtureId, homeTeam, awayTeam }: NotifyBellProps) {
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    setSubscribed(isSubscribed(fixtureId));
  }, [fixtureId]);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (subscribed) {
      unsubscribe(fixtureId);
      setSubscribed(false);
      return;
    }

    const granted = await requestPermission();
    if (!granted) {
      alert("Bạn cần cho phép thông báo để nhận cập nhật trận đấu.");
      return;
    }

    subscribe(fixtureId, homeTeam, awayTeam);
    setSubscribed(true);
  }

  return (
    <button
      onClick={handleClick}
      title={subscribed ? "Tắt thông báo" : "Bật thông báo trận này"}
      className={`absolute right-2 top-2 rounded-full p-1.5 text-sm transition ${
        subscribed
          ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
          : "bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-white"
      }`}
    >
      {subscribed ? "🔔" : "🔕"}
    </button>
  );
}
