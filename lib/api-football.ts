import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

const API_BASE = "https://v3.football.api-sports.io";
const API_KEY = process.env.API_FOOTBALL_KEY || "";
const CACHE_DIR = join(process.cwd(), ".cache");

interface CacheEntry {
  data: unknown;
  timestamp: number;
}

// In-memory cache (fast, nhưng mất khi restart)
const memCache = new Map<string, CacheEntry>();

const CACHE_TTL = {
  live: 5 * 60 * 1000, // 5 phút cho trận live
  fixtures: 60 * 60 * 1000, // 1 giờ cho lịch thi đấu
  standings: 60 * 60 * 1000, // 1 giờ cho BXH
};

// Đảm bảo thư mục cache tồn tại
function ensureCacheDir() {
  if (!existsSync(CACHE_DIR)) {
    mkdirSync(CACHE_DIR, { recursive: true });
  }
}

// File-based cache fallback
function getFileCache(key: string, ttl: number): unknown | null {
  try {
    const filePath = join(CACHE_DIR, `${key.replace(/[^a-z0-9-]/gi, "_")}.json`);
    if (!existsSync(filePath)) return null;
    const content = readFileSync(filePath, "utf-8");
    const entry: CacheEntry = JSON.parse(content);
    if (Date.now() - entry.timestamp < ttl) {
      return entry.data;
    }
  } catch {
    // ignore file read errors
  }
  return null;
}

function setFileCache(key: string, data: unknown) {
  try {
    ensureCacheDir();
    const filePath = join(CACHE_DIR, `${key.replace(/[^a-z0-9-]/gi, "_")}.json`);
    writeFileSync(filePath, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {
    // ignore file write errors
  }
}

function getCached(key: string, ttl: number): unknown | null {
  // 1. Check memory
  const memEntry = memCache.get(key);
  if (memEntry && Date.now() - memEntry.timestamp < ttl) {
    return memEntry.data;
  }
  memCache.delete(key);

  // 2. Check file cache
  const fileData = getFileCache(key, ttl);
  if (fileData) {
    memCache.set(key, { data: fileData, timestamp: Date.now() });
    return fileData;
  }

  return null;
}

function setCache(key: string, data: unknown) {
  memCache.set(key, { data, timestamp: Date.now() });
  setFileCache(key, data);
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

export async function searchTeams(query: string) {
  const cacheKey = `search-${query.toLowerCase()}`;
  const cached = getCached(cacheKey, CACHE_TTL.fixtures);
  if (cached) return cached;

  const data = await apiFetch("/teams", { search: query });
  setCache(cacheKey, data);
  return data;
}

export async function getTeamInfo(id: number) {
  const cacheKey = `team-${id}`;
  const cached = getCached(cacheKey, CACHE_TTL.fixtures);
  if (cached) return cached;

  const data = await apiFetch("/teams", { id: String(id) });
  setCache(cacheKey, data);
  return data;
}

export async function getTeamFixtures(id: number, last: number = 5) {
  const cacheKey = `team-fixtures-${id}-${last}`;
  const cached = getCached(cacheKey, CACHE_TTL.fixtures);
  if (cached) return cached;

  const data = await apiFetch("/fixtures", { team: String(id), last: String(last) });
  setCache(cacheKey, data);
  return data;
}

export async function getTeamNextFixtures(id: number, next: number = 5) {
  const cacheKey = `team-next-${id}-${next}`;
  const cached = getCached(cacheKey, CACHE_TTL.fixtures);
  if (cached) return cached;

  const data = await apiFetch("/fixtures", { team: String(id), next: String(next) });
  setCache(cacheKey, data);
  return data;
}

export async function getOdds(fixtureId: number) {
  const cacheKey = `odds-${fixtureId}`;
  const cached = getCached(cacheKey, CACHE_TTL.fixtures);
  if (cached) return cached;

  const data = await apiFetch("/odds", { fixture: String(fixtureId) });
  setCache(cacheKey, data);
  return data;
}
