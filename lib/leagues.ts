export interface League {
  id: number;
  name: string;
  country: string;
  logo: string;
  slug: string;
}

export const LEAGUES: League[] = [
  { id: 1, name: "World Cup", country: "Thế giới", logo: "https://media.api-sports.io/football/leagues/1.png", slug: "world-cup" },
  { id: 2, name: "Champions League", country: "Châu Âu", logo: "https://media.api-sports.io/football/leagues/2.png", slug: "champions-league" },
  { id: 39, name: "Ngoại hạng Anh", country: "Anh", logo: "https://media.api-sports.io/football/leagues/39.png", slug: "ngoai-hang-anh" },
  { id: 140, name: "La Liga", country: "Tây Ban Nha", logo: "https://media.api-sports.io/football/leagues/140.png", slug: "la-liga" },
  { id: 78, name: "Bundesliga", country: "Đức", logo: "https://media.api-sports.io/football/leagues/78.png", slug: "bundesliga" },
  { id: 135, name: "Serie A", country: "Ý", logo: "https://media.api-sports.io/football/leagues/135.png", slug: "serie-a" },
  { id: 61, name: "Ligue 1", country: "Pháp", logo: "https://media.api-sports.io/football/leagues/61.png", slug: "ligue-1" },
  { id: 340, name: "V-League", country: "Việt Nam", logo: "https://media.api-sports.io/football/leagues/340.png", slug: "v-league" },
];

export function getLeagueById(id: number): League | undefined {
  return LEAGUES.find((l) => l.id === id);
}

export function getLeagueBySlug(slug: string): League | undefined {
  return LEAGUES.find((l) => l.slug === slug);
}
