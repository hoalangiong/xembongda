// Map fixture ID → array of stream sources
// Cập nhật thủ công hoặc qua admin panel sau này

export interface StreamSource {
  url: string;
  name: string;
}

// Nguồn stream theo fixture ID (thêm thủ công)
const streamSources: Record<string, StreamSource[]> = {
  // Ví dụ:
  // "1234567": [
  //   { url: "https://example.com/embed/stream1", name: "Nguồn 1" },
  //   { url: "https://example2.com/embed/stream2", name: "Nguồn 2" },
  // ],
};

// Các nguồn stream mặc định (pattern-based)
// Nguồn đầu tiên là Google search (luôn hoạt động)
// Thêm nguồn thực tế khi có vào object streamSources phía trên
const DEFAULT_SOURCES: Array<{ name: string; pattern: (homeTeam: string, awayTeam: string) => string }> = [
  {
    name: "Tìm nguồn 1",
    pattern: (home, away) =>
      `https://www.google.com/search?igu=1&q=${encodeURIComponent(`${home} vs ${away} trực tiếp`)}`,
  },
  {
    name: "Tìm nguồn 2",
    pattern: (home, away) =>
      `https://www.google.com/search?igu=1&q=${encodeURIComponent(`${home} vs ${away} live stream free`)}`,
  },
];

export function getStreamSources(fixtureId: string | number, homeTeam?: string, awayTeam?: string): StreamSource[] {
  // 1. Nguồn cố định theo fixture ID
  const fixed = streamSources[String(fixtureId)];
  if (fixed && fixed.length > 0) return fixed;

  // 2. Nguồn pattern-based
  if (homeTeam && awayTeam) {
    return DEFAULT_SOURCES.map((src) => ({
      name: src.name,
      url: src.pattern(homeTeam, awayTeam),
    }));
  }

  return [];
}

// Link tìm kiếm fallback
export function getDefaultStreamSearch(homeTeam: string, awayTeam: string): string {
  const query = encodeURIComponent(`${homeTeam} vs ${awayTeam} trực tiếp`);
  return `https://www.google.com/search?q=${query}`;
}
