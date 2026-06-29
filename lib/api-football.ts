const API_BASE = "https://v3.football.api-sports.io";
const API_KEY = process.env.API_FOOTBALL_KEY || "";

interface CacheEntry {
  data: unknown;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();

const CACHE_TTL = {
  live: 5 * 60 * 1000, // 5 phút cho trận live
  fixtures: 60 * 60 * 1000, // 1 giờ cho lịch thi đấu
  standings: 60 * 60 * 1000, // 1 giờ cho BXH
};

function getCached(key: string, ttl: number): unknown | null {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < ttl) {
    return entry.data;
  }
  cache.delete(key);
  return null;
}

function setCache(key: string, data: unknown) {
  cache.set(key, { data, timestamp: Date.now() });
}

async function apiFetch(endpoint: string, params: Record<string, string> = {}) {
  const url = new URL(endpoint, API_BASE);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    headers: {
      "x-apisports-key": API_KEY,
    },
  });

  if (!res.ok) {
    throw new Error(`API-Football error: ${res.status}`);
  }

  const json = await res.json();
  return json.response;
}

export async function getLiveFixtures() {
  const cacheKey = "live";
  const cached = getCached(cacheKey, CACHE_TTL.live);
  if (cached) return cached;

  const data = await apiFetch("/fixtures", { live: "all" });
  setCache(cacheKey, data);
  return data;
}

export async function getFixturesByDate(date: string, leagueId?: number) {
  const cacheKey = `fixtures-${date}-${leagueId || "all"}`;
  const cached = getCached(cacheKey, CACHE_TTL.fixtures);
  if (cached) return cached;

  const params: Record<string, string> = { date };
  if (leagueId) params.league = String(leagueId);

  const data = await apiFetch("/fixtures", params);
  setCache(cacheKey, data);
  return data;
}

export async function getStandings(leagueId: number, season: number) {
  const cacheKey = `standings-${leagueId}-${season}`;
  const cached = getCached(cacheKey, CACHE_TTL.standings);
  if (cached) return cached;

  const data = await apiFetch("/standings", {
    league: String(leagueId),
    season: String(season),
  });
  setCache(cacheKey, data);
  return data;
}

export async function getFixtureById(id: number) {
  const cacheKey = `fixture-${id}`;
  const cached = getCached(cacheKey, CACHE_TTL.live);
  if (cached) return cached;

  const data = await apiFetch("/fixtures", { id: String(id) });
  setCache(cacheKey, data);
  return data;
}
