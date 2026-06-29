// Odds-API.io - Real odds from SBOBET, M88
// Free tier: 2 bookmakers, 100 requests/hour

const ODDS_API_BASE = "https://api.odds-api.io";
const ODDS_API_KEY = process.env.ODDS_API_KEY || "";

export interface OddsMarket {
  bookmaker: string;
  market: string;
  outcomes: Array<{
    name: string;
    price: number;
    point?: number;
  }>;
}

export interface MatchOddsData {
  id: string;
  homeTeam: string;
  awayTeam: string;
  markets: OddsMarket[];
}

// Lấy danh sách trận football có odds
export async function getFootballEvents(): Promise<any[]> {
  try {
    const res = await fetch(
      `${ODDS_API_BASE}/v4/sports/soccer/odds?apiKey=${ODDS_API_KEY}&bookmakers=sbobet,m88&markets=spreads,totals,h2h&oddsFormat=decimal`,
      { next: { revalidate: 300 } } // cache 5 phút
    );
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

// Lấy odds cho 1 event cụ thể
export async function getEventOdds(eventId: string): Promise<any | null> {
  try {
    const res = await fetch(
      `${ODDS_API_BASE}/v4/sports/soccer/events/${eventId}/odds?apiKey=${ODDS_API_KEY}&bookmakers=sbobet,m88&markets=spreads,totals,h2h&oddsFormat=decimal`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// Tìm event trên Odds-API dựa theo tên đội
function normalize(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function findMatchingEvent(events: any[], homeTeam: string, awayTeam: string): any | null {
  const homeNorm = normalize(homeTeam);
  const awayNorm = normalize(awayTeam);

  return events.find((ev: any) => {
    const h = normalize(ev.home_team || "");
    const a = normalize(ev.away_team || "");
    return (
      (h.includes(homeNorm) || homeNorm.includes(h)) &&
      (a.includes(awayNorm) || awayNorm.includes(a))
    );
  }) || null;
}
