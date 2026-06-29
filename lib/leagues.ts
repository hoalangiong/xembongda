export interface League {
  id: number;
  name: string;
  country: string;
  logo: string;
  slug: string;
}

export const LEAGUES: League[] = [
  { id: 1, name: "World Cup", country: "Thế giới", logo: "/leagues/worldcup.png", slug: "world-cup" },
  { id: 2, name: "Champions League", country: "Châu Âu", logo: "/leagues/ucl.png", slug: "champions-league" },
  { id: 39, name: "Ngoại hạng Anh", country: "Anh", logo: "/leagues/epl.png", slug: "ngoai-hang-anh" },
  { id: 140, name: "La Liga", country: "Tây Ban Nha", logo: "/leagues/laliga.png", slug: "la-liga" },
  { id: 78, name: "Bundesliga", country: "Đức", logo: "/leagues/bundesliga.png", slug: "bundesliga" },
  { id: 135, name: "Serie A", country: "Ý", logo: "/leagues/seriea.png", slug: "serie-a" },
  { id: 61, name: "Ligue 1", country: "Pháp", logo: "/leagues/ligue1.png", slug: "ligue-1" },
  { id: 340, name: "V-League", country: "Việt Nam", logo: "/leagues/vleague.png", slug: "v-league" },
];

export function getLeagueById(id: number): League | undefined {
  return LEAGUES.find((l) => l.id === id);
}

export function getLeagueBySlug(slug: string): League | undefined {
  return LEAGUES.find((l) => l.slug === slug);
}
