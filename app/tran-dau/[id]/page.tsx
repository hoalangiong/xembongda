import type { Metadata } from "next";
import MatchDetail from "@/components/MatchDetail";
import { getOddsEvents } from "@/lib/odds-api";

async function getMatchTeams(id: string): Promise<{ home: string; away: string; date: string } | null> {
  try {
    const events = await getOddsEvents("international-fifa-world-cup");
    const match = events.find((e: any) => String(e.id) === id);
    if (match) return { home: match.home, away: match.away, date: match.date };
  } catch {
    // ignore
  }
  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const teams = await getMatchTeams(id);

  if (teams) {
    const title = `${teams.home} vs ${teams.away} - Trực tiếp, tỷ lệ kèo | XemBongDa`;
    const desc = `Xem trực tiếp ${teams.home} vs ${teams.away}, tỷ lệ kèo châu Á, nhận định và kết quả trận đấu World Cup 2026.`;
    return {
      title,
      description: desc,
      openGraph: { title, description: desc, type: "website" },
    };
  }

  return {
    title: `Chi tiết trận đấu | XemBongDa`,
    description: `Xem chi tiết trận đấu: tỷ lệ kèo, trực tiếp, thống kê.`,
  };
}

export default async function TranDauPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const teams = await getMatchTeams(id);

  // Structured data cho SEO (schema.org SportsEvent)
  const jsonLd = teams
    ? {
        "@context": "https://schema.org",
        "@type": "SportsEvent",
        name: `${teams.home} vs ${teams.away}`,
        sport: "Football",
        startDate: teams.date,
        competitor: [
          { "@type": "SportsTeam", name: teams.home },
          { "@type": "SportsTeam", name: teams.away },
        ],
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <MatchDetail />
    </>
  );
}
