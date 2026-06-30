import { NextResponse } from "next/server";
import { getOddsEvents } from "@/lib/odds-api";

// Map tên quốc gia → mã ISO 2 ký tự để lấy cờ từ flagcdn.com
const COUNTRY_CODES: Record<string, string> = {
  "Brazil": "br", "Japan": "jp", "Germany": "de", "Paraguay": "py",
  "Netherlands": "nl", "Morocco": "ma", "Ivory Coast": "ci", "Norway": "no",
  "France": "fr", "Sweden": "se", "Mexico": "mx", "Ecuador": "ec",
  "England": "gb-eng", "Congo DR": "cd", "Belgium": "be", "Senegal": "sn",
  "USA": "us", "United States": "us", "Bosnia and Herzegovina": "ba",
  "Bosnia-Herzegovina": "ba",
  "Argentina": "ar", "Spain": "es", "Portugal": "pt", "Italy": "it",
  "Croatia": "hr", "Uruguay": "uy", "Colombia": "co", "Chile": "cl",
  "Peru": "pe", "Australia": "au", "South Korea": "kr", "Saudi Arabia": "sa",
  "Iran": "ir", "Qatar": "qa", "Canada": "ca", "Costa Rica": "cr",
  "Ghana": "gh", "Cameroon": "cm", "Nigeria": "ng", "Tunisia": "tn",
  "Egypt": "eg", "Algeria": "dz", "South Africa": "za", "Poland": "pl",
  "Denmark": "dk", "Switzerland": "ch", "Austria": "at", "Serbia": "rs",
  "Turkey": "tr", "Czech Republic": "cz", "Scotland": "gb-sct",
  "Wales": "gb-wls", "Ireland": "ie", "New Zealand": "nz",
  "Panama": "pa", "Honduras": "hn", "Jamaica": "jm", "Slovenia": "si",
  "Slovakia": "sk", "Romania": "ro", "Ukraine": "ua", "Greece": "gr",
  "Hungary": "hu", "Albania": "al", "Georgia": "ge", "Iceland": "is",
  "Uzbekistan": "uz", "Indonesia": "id", "India": "in", "China": "cn",
  "Cape Verde": "cv", "Mali": "ml", "Bahrain": "bh",
};

function getFlagUrl(country: string): string {
  const code = COUNTRY_CODES[country];
  if (!code) return "";
  return `https://flagcdn.com/w80/${code}.png`;
}

export async function GET() {
  try {
    const events = await getOddsEvents("international-fifa-world-cup");

    const fixtures = events
      .filter((e: any) => e.status === "pending")
      .map((e: any) => ({
        fixture: {
          id: e.id,
          status: { short: "NS", elapsed: null },
          date: e.date,
        },
        league: { id: 1, name: "World Cup 2026", logo: "https://flagcdn.com/w80/un.png" },
        teams: {
          home: { name: e.home, logo: getFlagUrl(e.home) },
          away: { name: e.away, logo: getFlagUrl(e.away) },
        },
        goals: { home: null, away: null },
      }));

    return NextResponse.json({ data: fixtures });
  } catch {
    return NextResponse.json({ error: "Đang cập nhật" }, { status: 500 });
  }
}
