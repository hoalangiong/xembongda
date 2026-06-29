// SportSRC API - Free stream embed provider
// Docs: https://www.sportsrc.org/
// CORS enabled, no API key needed, 20 req/s rate limit

const SPORTSRC_BASE = "https://api.sportsrc.org";

export interface SportSrcMatch {
  id: string;
  title: string;
  date: number;
  teams: {
    home: { name: string; badge: string };
    away: { name: string; badge: string };
  };
}

export interface SportSrcStream {
  id: string;
  streamNo: number;
  language: string;
  hd: boolean;
  embedUrl: string;
  source: string;
}

export async function getSportSrcMatches(): Promise<SportSrcMatch[]> {
  try {
    const res = await fetch(`${SPORTSRC_BASE}/?data=matches&category=football`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export async function getSportSrcStreams(matchId: string): Promise<SportSrcStream[]> {
  try {
    const res = await fetch(`${SPORTSRC_BASE}/?data=detail&category=football&id=${matchId}`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data?.sources || [];
  } catch {
    return [];
  }
}

// Tìm match trên SportSRC dựa vào tên đội
function normalize(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function findSportSrcMatch(
  matches: SportSrcMatch[],
  homeTeam: string,
  awayTeam: string
): SportSrcMatch | null {
  const homeNorm = normalize(homeTeam);
  const awayNorm = normalize(awayTeam);

  return (
    matches.find((m) => {
      const h = normalize(m.teams.home.name);
      const a = normalize(m.teams.away.name);
      return (
        (h.includes(homeNorm) || homeNorm.includes(h)) &&
        (a.includes(awayNorm) || awayNorm.includes(a))
      );
    }) || null
  );
}
