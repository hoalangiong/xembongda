"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { apiUrl } from "@/lib/utils";
import MatchTimeline from "./MatchTimeline";
import MatchStats from "./MatchStats";
import MatchLineup from "./MatchLineup";
import MatchOdds from "./MatchOdds";
import MatchHeader from "./MatchHeader";

export default function MatchDetail() {
  const params = useParams();
  const id = params.id as string;
  const [match, setMatch] = useState<any>(null);
  const [wcMatch, setWcMatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMatch() {
      try {
        // 1. Thử API-Football trước
        const res = await fetch(apiUrl(`/api/match/${id}`));
        const data = await res.json();
        if (data.data?.[0]) {
          setMatch(data.data[0]);
        } else {
          // 2. Fallback: tìm trong World Cup (tất cả status)
          const wcRes = await fetch(apiUrl("/api/worldcup?status=all"));
          const wcData = await wcRes.json();
          const found = (wcData.data || []).find(
            (f: any) => String(f.fixture.id) === id
          );
          if (found) setWcMatch(found);
        }
      } catch {
        setMatch(null);
      }
      setLoading(false);
    }
    fetchMatch();
  }, [id]);

  if (loading) {
    return <p className="text-gray-400">Đang tải...</p>;
  }

  // Fallback: World Cup match từ odds-api.io
  if (!match && wcMatch) {
    const isFinished = wcMatch.fixture.status.short === "FT";
    const kickoff = new Date(wcMatch.fixture.date);
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <MatchHeader
          leagueName={wcMatch.league.name}
          leagueLogo={wcMatch.league.logo}
          homeName={wcMatch.teams.home.name}
          homeLogo={wcMatch.teams.home.logo}
          awayName={wcMatch.teams.away.name}
          awayLogo={wcMatch.teams.away.logo}
          homeGoals={wcMatch.goals.home}
          awayGoals={wcMatch.goals.away}
          statusText={isFinished ? "Kết thúc" : "Chưa diễn ra"}
          kickoff={kickoff}
          isFinished={isFinished}
        />
        <MatchOdds fixtureId={wcMatch.fixture.id} homeTeam={wcMatch.teams.home.name} awayTeam={wcMatch.teams.away.name} />
      </div>
    );
  }

  if (!match) {
    return <p className="text-gray-400">Không tìm thấy trận đấu.</p>;
  }

  const { fixture, league, teams, goals, events, statistics, lineups } = match;
  const status = fixture.status.short;
  const isLive = ["1H", "2H", "HT", "ET", "P", "LIVE"].includes(status);
  const isFinishedMatch = status === "FT";

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <MatchHeader
        leagueName={`${league?.name}${league?.round ? " — " + league.round : ""}`}
        leagueLogo={league?.logo}
        homeName={teams.home.name}
        homeLogo={teams.home.logo}
        awayName={teams.away.name}
        awayLogo={teams.away.logo}
        homeGoals={goals.home}
        awayGoals={goals.away}
        statusText={fixture.status.long}
        kickoff={new Date(fixture.date)}
        isFinished={isFinishedMatch}
        isLive={isLive}
        elapsed={fixture.status.elapsed}
        venue={fixture.venue?.name ? `${fixture.venue.name}${fixture.venue.city ? ", " + fixture.venue.city : ""}` : undefined}
      />

      {/* Tỷ lệ kèo */}
      <MatchOdds fixtureId={fixture.id} homeTeam={teams.home.name} awayTeam={teams.away.name} />

      {/* Timeline sự kiện */}
      {events && events.length > 0 && (
        <MatchTimeline events={events} homeTeam={teams.home.name} />
      )}

      {/* Thống kê */}
      {statistics && statistics.length > 0 && (
        <MatchStats statistics={statistics} />
      )}

      {/* Đội hình */}
      {lineups && lineups.length > 0 && (
        <MatchLineup lineups={lineups} />
      )}
    </div>
  );
}
