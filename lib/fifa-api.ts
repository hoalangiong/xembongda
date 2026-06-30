// FIFA Official API - Free, no key needed
// Provides timeline events (goals, cards, subs), lineups for World Cup 2026

const FIFA_BASE = "https://api.fifa.com/api/v3";
const WC_COMPETITION_ID = "17";
const WC_SEASON_ID = "285023";

interface FifaEvent {
  EventId: string;
  IdTeam?: string;
  IdPlayer?: string;
  MatchMinute: string;
  Period: number;
  HomeGoals: number;
  AwayGoals: number;
  Type: number;
  TypeLocalized: Array<{ Locale: string; Description: string }>;
  EventDescription: Array<{ Locale: string; Description: string }>;
}

interface FifaMatch {
  IdMatch: string;
  IdStage: string;
  Date: string;
  HomeTeam: { IdTeam: string; TeamName: Array<{ Locale: string; Description: string }>; Score: number | null };
  AwayTeam: { IdTeam: string; TeamName: Array<{ Locale: string; Description: string }>; Score: number | null };
}

// Event types:
// 0 = Goal, 2 = Yellow Card, 3 = Red Card, 5 = Substitution, 18 = Foul
// 12 = Attempt at Goal, 7 = Start/End, 71 = Penalty Goal, 72 = Own Goal
const EVENT_TYPES = {
  GOAL: 0,
  YELLOW_CARD: 2,
  RED_CARD: 3,
  SUBSTITUTION: 5,
  PENALTY_GOAL: 41,
  OWN_GOAL: 34,
};

export async function getFifaMatches(from: string, to: string): Promise<any[]> {
  try {
    const res = await fetch(
      `${FIFA_BASE}/calendar/matches?idCompetition=${WC_COMPETITION_ID}&idSeason=${WC_SEASON_ID}&from=${from}&to=${to}&count=50&language=en`
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.Results || [];
  } catch {
    return [];
  }
}

export async function getFifaTimeline(stageId: string, matchId: string): Promise<FifaEvent[]> {
  try {
    const res = await fetch(
      `${FIFA_BASE}/timelines/${WC_COMPETITION_ID}/${WC_SEASON_ID}/${stageId}/${matchId}?language=en`
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.Event || [];
  } catch {
    return [];
  }
}

export async function getFifaLineups(stageId: string, matchId: string): Promise<any> {
  try {
    const res = await fetch(
      `${FIFA_BASE}/live/football/${WC_COMPETITION_ID}/${WC_SEASON_ID}/${stageId}/${matchId}?language=en`
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// Tìm FIFA match ID dựa vào tên đội
function normalize(name: string): string {
  return name.toLowerCase().replace(/[^a-z]/g, "");
}

export async function findFifaMatch(homeTeam: string, awayTeam: string): Promise<{ matchId: string; stageId: string } | null> {
  const from = "2026-06-11";
  const to = "2026-07-22";
  const matches = await getFifaMatches(from, to);

  const homeNorm = normalize(homeTeam);
  const awayNorm = normalize(awayTeam);

  for (const match of matches) {
    const homeName = match.HomeTeam?.TeamName?.[0]?.Description || "";
    const awayName = match.AwayTeam?.TeamName?.[0]?.Description || "";
    const h = normalize(homeName);
    const a = normalize(awayName);

    if ((h.includes(homeNorm) || homeNorm.includes(h)) &&
        (a.includes(awayNorm) || awayNorm.includes(a))) {
      return { matchId: match.IdMatch, stageId: match.IdStage };
    }
  }
  return null;
}

// Format events cho frontend
export function formatEvents(events: FifaEvent[]) {
  const important = events.filter((e) =>
    [0, 2, 3, 5, 34, 41, 72].includes(e.Type)
  );

  return important.map((e) => ({
    minute: e.MatchMinute,
    type: getEventType(e.Type),
    description: e.EventDescription?.[0]?.Description || e.TypeLocalized?.[0]?.Description || "",
    homeGoals: e.HomeGoals,
    awayGoals: e.AwayGoals,
  }));
}

function getEventType(type: number): string {
  switch (type) {
    case 0: return "goal";
    case 2: return "yellow_card";
    case 3: return "red_card";
    case 5: return "substitution";
    case 34: case 72: return "own_goal";
    case 41: return "penalty_goal";
    default: return "other";
  }
}
