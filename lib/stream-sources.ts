// Map fixture ID → iframe stream URL
// Cập nhật thủ công hoặc qua admin panel sau này

interface StreamSource {
  url: string;
  name: string;
}

const streamSources: Record<string, StreamSource> = {
  // Ví dụ:
  // "1234567": { url: "https://example.com/embed/stream1", name: "Nguồn 1" },
};

export function getStreamUrl(fixtureId: string | number): StreamSource | null {
  return streamSources[String(fixtureId)] || null;
}

// Link stream mặc định dựa trên tên trận (fallback)
export function getDefaultStreamSearch(homeTeam: string, awayTeam: string): string {
  const query = encodeURIComponent(`${homeTeam} vs ${awayTeam} trực tiếp`);
  return `https://www.google.com/search?q=${query}`;
}
