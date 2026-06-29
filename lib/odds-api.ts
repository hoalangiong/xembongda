// Odds-API.io - Real odds from SBOBET, M88
// Free tier: 2 bookmakers, 100 requests/hour
// API docs: https://odds-api.io

const ODDS_API_BASE = "https://api.odds-api.io/v3";
const ODDS_API_KEY = process.env.ODDS_API_KEY || "";

// Lấy danh sách events football (có thể filter theo league)
export async function getOddsEvents(league?: string): Promise<any[]> {
  try {
    const params = new URLSearchParams({
      sport: "football",
      apiKey: ODDS_API_KEY,
    });
    if (league) params.set("league", league);
    const res = await fetch(`${ODDS_API_BASE}/events?${params}`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

// Lấy odds cho 1 event cụ thể từ SBOBET + M88
export async function getEventOdds(eventId: number): Promise<any | null> {
  try {
    const params = new URLSearchParams({
      sport: "football",
      eventId: String(eventId),
      bookmakers: "Sbobet,M88",
      apiKey: ODDS_API_KEY,
    });
    const res = await fetch(`${ODDS_API_BASE}/odds?${params}`);
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

export async function findAndGetOdds(homeTeam: string, awayTeam: string): Promise<any | null> {
  const events = await getOddsEvents();
  if (!events || events.length === 0) return null;

  const homeNorm = normalize(homeTeam);
  const awayNorm = normalize(awayTeam);

  const match = events.find((ev: any) => {
    const h = normalize(ev.home || "");
    const a = normalize(ev.away || "");
    return (
      (h.includes(homeNorm) || homeNorm.includes(h)) &&
      (a.includes(awayNorm) || awayNorm.includes(a))
    );
  });

  if (!match) return null;
  return getEventOdds(match.id);
}
