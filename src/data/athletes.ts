import type { Athlete, BadgeKey, MarathonEntry, YearGroup } from "../types/athlete";
import { MARATHON_STANDARD_DISTANCE } from "../utils/calculations";

// ─── Utilitário: agrupa history por ano (para o Ranking) ─────────────────────

export function groupByYear(history: MarathonEntry[]): YearGroup[] {
  const map = new Map<string, MarathonEntry[]>();
  for (const entry of history) {
    if (!map.has(entry.year)) map.set(entry.year, []);
    map.get(entry.year)!.push(entry);
  }
  return [...map.entries()]
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([year, races]) => ({
      year,
      count: `${races.length} prova${races.length > 1 ? "s" : ""}`,
      races,
    }));
}

// ─── Gerador de histórico de provas ──────────────────────────────────────────

// Pool ponderado: Santa Maria aparece 3x, Porto Alegre 2x — garante Top 5 realista
const RACE_POOL = [
  "Maratona de Santa Maria",
  "Maratona de Santa Maria",
  "Maratona de Santa Maria",
  "Maratona de Porto Alegre",
  "Maratona de Porto Alegre",
  "Maratona Internacional de SP",
  "Maratona de Curitiba",
  "Maratona do Rio",
  "Maratona de Florianópolis",
  "Maratona de Buenos Aires",
  "Maratona de Berlim",
  "Maratona de Lisboa",
] as const;

function timeToSec(t: string): number {
  const [h, m, s] = t.split(":").map(Number);
  return h * 3600 + m * 60 + s;
}

function secToTime(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function secToPace(sec: number): string {
  const ps = Math.round(sec / MARATHON_STANDARD_DISTANCE);
  return `${Math.floor(ps / 60)}'${String(ps % 60).padStart(2, "0")}"/km`;
}

function makeHistory(rank: number, bestTime: string, marathons: number): MarathonEntry[] {
  const best = timeToSec(bestTime);
  return Array.from({ length: marathons }, (_, i) => {
    const sec = best + i * 42; // cada prova mais antiga ~42s mais lenta
    return {
      name: RACE_POOL[(rank - 1 + i) % RACE_POOL.length],
      year: String(2025 - Math.floor(i / 3)),
      time: secToTime(sec),
      pace: secToPace(sec),
    };
  });
}

// ─── Seeds dos atletas ────────────────────────────────────────────────────────

type Seed = Omit<Athlete, "totalKm" | "history">;

const seeds: Seed[] = [
  // ─── GRUPO 10+ MARATONAS (5 atletas) — Elite ────────────────────────────────
  { rank: 1,  name: "Lucas Menezes",    photo: "https://randomuser.me/api/portraits/men/11.jpg",    ageGroup: "M30-34", gender: "M", coach: "Felipe",   isCoach: true, marathons: 12, bestTime: "02:32:15", pace: "3'37\"/km", status: "Elite",  badgeKeys: ["lenda"] },
  { rank: 2,  name: "Thiago Prado",     photo: "https://randomuser.me/api/portraits/men/32.jpg",    ageGroup: "M35-39", gender: "M", coach: "Nestor",   marathons: 11, bestTime: "02:38:40", pace: "3'46\"/km", status: "Elite",  badgeKeys: ["ouro"] },
  { rank: 3,  name: "Matheus Silva",    photo: "https://randomuser.me/api/portraits/men/55.jpg",    ageGroup: "M25-29", gender: "M", coach: "Giuliano", marathons: 10, bestTime: "02:44:55", pace: "3'55\"/km", status: "Elite",  badgeKeys: ["top3"] },
  { rank: 4,  name: "Rafael Costa",     photo: "https://randomuser.me/api/portraits/men/21.jpg",    ageGroup: "M35-39", gender: "M", coach: "Felipe",   marathons: 12, bestTime: "02:47:10", pace: "3'58\"/km", status: "Elite",  badgeKeys: ["prata"] },
  { rank: 5,  name: "Bruno Vidal",      photo: "https://randomuser.me/api/portraits/men/43.jpg",    ageGroup: "M40-44", gender: "M", coach: "Gisele",   marathons: 11, bestTime: "02:52:30", pace: "4'05\"/km", status: "Elite",  badgeKeys: ["bronze"] },
  // ─── GRUPO 4–9 MARATONAS (10 atletas) — Elite / Pro ─────────────────────────
  { rank: 6,  name: "Caio Duarte",      photo: "https://randomuser.me/api/portraits/men/67.jpg",    ageGroup: "M30-34", gender: "M", coach: "Fábio",    marathons: 9,  bestTime: "02:56:45", pace: "4'11\"/km", status: "Elite",  badgeKeys: ["puro"] },
  { rank: 7,  name: "Igor Sampaio",     photo: "https://randomuser.me/api/portraits/men/14.jpg",    ageGroup: "M30-34", gender: "M", coach: "Giuliano", marathons: 8,  bestTime: "03:02:20", pace: "4'19\"/km", status: "Elite",  badgeKeys: ["lenda"] },
  { rank: 8,  name: "Daniel Teles",     photo: "https://randomuser.me/api/portraits/men/38.jpg",    ageGroup: "M45-49", gender: "M", coach: "Nestor",   marathons: 7,  bestTime: "03:09:50", pace: "4'30\"/km", status: "Elite",  badgeKeys: ["ouro"] },
  { rank: 9,  name: "Vinicius Goulart", photo: "https://randomuser.me/api/portraits/men/72.jpg",    ageGroup: "M35-39", gender: "M", coach: "Felipe",   marathons: 6,  bestTime: "03:15:05", pace: "4'38\"/km", status: "Pro",    badgeKeys: ["top3"] },
  { rank: 10, name: "Felipe Lacerda",   photo: "https://randomuser.me/api/portraits/men/82.jpg",    ageGroup: "M30-34", gender: "M", coach: "Gisele",   marathons: 5,  bestTime: "03:21:40", pace: "4'47\"/km", status: "Pro",    badgeKeys: ["prata"] },
  // ─── GRUPO 3 MARATONAS (4 atletas) ──────────────────────────────────────────
  { rank: 11, name: "Renato Alves",     photo: "https://randomuser.me/api/portraits/men/25.jpg",    ageGroup: "M40-44", gender: "M", coach: "Fábio",    marathons: 3,  bestTime: "03:28:25", pace: "4'56\"/km", status: "Pro",    badgeKeys: ["bronze"] },
  { rank: 12, name: "Gustavo Nunes",    photo: "https://randomuser.me/api/portraits/men/60.jpg",    ageGroup: "M25-29", gender: "M", coach: "Giuliano", marathons: 3,  bestTime: "03:35:10", pace: "5'06\"/km", status: "Amador", badgeKeys: ["puro"] },
  // ─── GRUPO 4–9 MARATONAS (feminino) ─────────────────────────────────────────
  { rank: 13, name: "Camila Rocha",     photo: "https://randomuser.me/api/portraits/women/33.jpg",  ageGroup: "F30-34", gender: "F", coach: "Gisele",   marathons: 9,  bestTime: "03:08:50", pace: "4'29\"/km", status: "Elite",  badgeKeys: ["lenda"] },
  { rank: 14, name: "Fernanda Lima",    photo: "https://randomuser.me/api/portraits/women/57.jpg",  ageGroup: "F35-39", gender: "F", coach: "Nestor",   marathons: 8,  bestTime: "03:14:30", pace: "4'37\"/km", status: "Elite",  badgeKeys: ["ouro"] },
  { rank: 15, name: "Juliana Moreira",  photo: "https://randomuser.me/api/portraits/women/18.jpg",  ageGroup: "F30-34", gender: "F", coach: "Felipe",   marathons: 7,  bestTime: "03:22:15", pace: "4'48\"/km", status: "Pro",    badgeKeys: ["top3"] },
  { rank: 16, name: "Patricia Santos",  photo: "https://randomuser.me/api/portraits/women/44.jpg",  ageGroup: "F40-44", gender: "F", coach: "Fábio",    marathons: 6,  bestTime: "03:29:40", pace: "4'58\"/km", status: "Pro",    badgeKeys: ["prata"] },
  { rank: 17, name: "Ana Clara Souza",  photo: "https://randomuser.me/api/portraits/women/70.jpg",  ageGroup: "F25-29", gender: "F", coach: "Giuliano", marathons: 5,  bestTime: "03:38:00", pace: "5'10\"/km", status: "Pro",    badgeKeys: ["bronze"] },
  // ─── GRUPO 3 MARATONAS (feminino) ────────────────────────────────────────────
  { rank: 18, name: "Mariana Faria",    photo: "https://randomuser.me/api/portraits/women/27.jpg",  ageGroup: "F35-39", gender: "F", coach: "Gisele",   marathons: 3,  bestTime: "03:45:20", pace: "5'20\"/km", status: "Amador", badgeKeys: ["puro"] },
  { rank: 19, name: "Beatriz Freitas",  photo: "https://randomuser.me/api/portraits/women/51.jpg",  ageGroup: "F30-34", gender: "F", coach: "Felipe",   marathons: 3,  bestTime: "03:52:10", pace: "5'30\"/km", status: "Amador", badgeKeys: ["lenda"] },
  // ─── GRUPO 2 MARATONAS (3 atletas) ───────────────────────────────────────────
  { rank: 20, name: "Larissa Mota",     photo: "https://randomuser.me/api/portraits/women/85.jpg",  ageGroup: "F40-44", gender: "F", coach: "Nestor",   marathons: 2,  bestTime: "03:58:45", pace: "5'40\"/km", status: "Amador", badgeKeys: ["ouro"] },
  { rank: 21, name: "Jessica Pires",    photo: "https://randomuser.me/api/portraits/women/39.jpg",  ageGroup: "F35-39", gender: "F", coach: "Fábio",    marathons: 2,  bestTime: "04:10:30", pace: "5'56\"/km", status: "Amador", badgeKeys: ["top3"] },
  { rank: 22, name: "Renata Melo",      photo: "https://randomuser.me/api/portraits/women/62.jpg",  ageGroup: "F45-49", gender: "F", coach: "Gisele",   marathons: 2,  bestTime: "04:22:55", pace: "6'14\"/km", status: "Amador", badgeKeys: ["prata"] },
  // ─── GRUPO 1 MARATONA (2 atletas) ────────────────────────────────────────────
  { rank: 23, name: "Talita Andrade",   photo: "https://randomuser.me/api/portraits/women/13.jpg",  ageGroup: "F40-44", gender: "F", coach: "Giuliano", marathons: 1,  bestTime: "04:35:00", pace: "6'31\"/km", status: "Amador", badgeKeys: ["bronze"] },
  { rank: 24, name: "Monica Teixeira",  photo: "https://randomuser.me/api/portraits/women/76.jpg",  ageGroup: "F50-54", gender: "F", coach: "Felipe",   marathons: 1,  bestTime: "04:52:20", pace: "6'56\"/km", status: "Amador", badgeKeys: ["puro"] },
];

const MAX_MARATHONS_PER_ATHLETE = 12;
const BALANCED_BADGES: BadgeKey[] = ["lenda", "ouro", "top3", "prata", "bronze", "puro"];

function normalizeMarathonsCount(rawMarathons: number): number {
  const safe = Number.isFinite(rawMarathons) ? Math.trunc(rawMarathons) : 0;
  return Math.min(MAX_MARATHONS_PER_ATHLETE, Math.max(1, safe));
}

function getBalancedBadgeSet(rank: number): BadgeKey[] {
  return [BALANCED_BADGES[(rank - 1) % BALANCED_BADGES.length]];
}

function calculateExtraTrainingKm(rank: number): number {
  // Determinístico e variado: simula treinos extras [50–499 km] sem Math.random().
  return (rank * 173 + 97) % 450 + 50;
}

// ─── Array principal exportado ────────────────────────────────────────────────

export const athletes: Athlete[] = seeds.map((s) => {
  const marathons = normalizeMarathonsCount(s.marathons);
  const history = makeHistory(s.rank, s.bestTime, marathons);
  const extraTrainingKm = calculateExtraTrainingKm(s.rank);
  const totalKm = Math.round((marathons * MARATHON_STANDARD_DISTANCE + extraTrainingKm) * 1000) / 1000;

  return {
    ...s,
    marathons,
    badgeKeys: getBalancedBadgeSet(s.rank),
    totalKm,
    history,
  };
});

// legado — mantido para não quebrar imports antigos
export const athleteSeeds = athletes;

