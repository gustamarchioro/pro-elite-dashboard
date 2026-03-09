import type { Athlete } from "../types/athlete";

export const MARATHON_STANDARD_DISTANCE = 42.195;
export const GOAL_MARATHONS = 1000;

const WORLD_CIRCUMFERENCE_KM = 40075;
const BRAZIL_CROSSING_KM = 4394.7;

function toSafeNonNegativeNumber(value: unknown): number {
  const num = Number(value);
  if (!Number.isFinite(num) || num < 0) return 0;
  return num;
}

function safeHistoryLength(athlete: Pick<Athlete, "history">): number {
  if (!Array.isArray(athlete.history)) return 0;
  return athlete.history.length;
}

export type TopProva = {
  name: string;
  count: number;
};

export type DistributionItem = {
  label: string;
  count: number;
};

export type AthleteKmValidation = {
  athleteName: string;
  marathonsInHistory: number;
  declaredTotalKm: number;
  minExpectedKm: number;
  adjustedTotalKm: number;
  deficitKm: number;
  isValid: boolean;
};

export function formatNumberPtBr(
  value: number,
  minimumFractionDigits = 0,
  maximumFractionDigits = minimumFractionDigits,
): string {
  const safeValue = Number.isFinite(value) ? value : 0;
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(safeValue);
}

export function calculateMarathonsCount(athletes: Athlete[]): number {
  return athletes.reduce((sum, athlete) => sum + safeHistoryLength(athlete), 0);
}

export function calculateGenderPercentages(athletes: Athlete[]): {
  menCount: number;
  womenCount: number;
  menPercentage: number;
  womenPercentage: number;
} {
  const total = Math.max(athletes.length, 1);
  const menCount = athletes.filter((a) => a.gender === "M").length;
  const womenCount = athletes.filter((a) => a.gender === "F").length;

  return {
    menCount,
    womenCount,
    menPercentage: roundTo((menCount / total) * 100, 1),
    womenPercentage: roundTo((womenCount / total) * 100, 1),
  };
}

export function getAgeGroupDistribution(athletes: Athlete[], limit = 5): DistributionItem[] {
  const groups = new Map<string, number>();

  for (const athlete of athletes) {
    const label = typeof athlete.ageGroup === "string" && athlete.ageGroup.trim() !== ""
      ? athlete.ageGroup.trim()
      : "Sem faixa";
    groups.set(label, (groups.get(label) ?? 0) + 1);
  }

  return [...groups.entries()]
    .sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      return a[0].localeCompare(b[0], "pt-BR");
    })
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }));
}

function expectedKmFromHistory(athlete: Pick<Athlete, "history">): number {
  return safeHistoryLength(athlete) * MARATHON_STANDARD_DISTANCE;
}

function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function validateAthleteKmConsistency(
  athlete: Pick<Athlete, "name" | "history" | "totalKm">,
): AthleteKmValidation {
  const minExpectedKm = expectedKmFromHistory(athlete);
  const declaredTotalKm = toSafeNonNegativeNumber(athlete.totalKm);
  const adjustedTotalKm = Math.max(declaredTotalKm, minExpectedKm);
  const deficitKm = Math.max(0, minExpectedKm - declaredTotalKm);

  return {
    athleteName: athlete.name,
    marathonsInHistory: safeHistoryLength(athlete),
    declaredTotalKm: roundTo(declaredTotalKm, 3),
    minExpectedKm: roundTo(minExpectedKm, 3),
    adjustedTotalKm: roundTo(adjustedTotalKm, 3),
    deficitKm: roundTo(deficitKm, 3),
    isValid: declaredTotalKm >= minExpectedKm,
  };
}

export function validateAthletesKmConsistency(athletes: Athlete[]): AthleteKmValidation[] {
  return athletes.map(validateAthleteKmConsistency);
}

export function calculateTotalKm(
  athletes: Athlete[],
  options: { enforceHistoryMinimum?: boolean } = {},
): number {
  const enforceHistoryMinimum = options.enforceHistoryMinimum ?? true;

  const total = athletes.reduce((sum, athlete) => {
    if (!enforceHistoryMinimum) {
      return sum + toSafeNonNegativeNumber(athlete.totalKm);
    }

    return sum + validateAthleteKmConsistency(athlete).adjustedTotalKm;
  }, 0);

  return roundTo(total, 3);
}

export function getTopProvas(athletes: Athlete[], limit = 5): TopProva[] {
  const frequency = new Map<string, number>();

  for (const athlete of athletes) {
    const history = Array.isArray(athlete.history) ? athlete.history : [];
    for (const race of history) {
      const raceName = typeof race?.name === "string" && race.name.trim() !== ""
        ? race.name.trim()
        : "Prova não informada";
      frequency.set(raceName, (frequency.get(raceName) ?? 0) + 1);
    }
  }

  return [...frequency.entries()]
    .sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      return a[0].localeCompare(b[0], "pt-BR");
    })
    .slice(0, limit)
    .map(([name, count]) => ({ name, count }));
}

export function calculateWorldTourPercentage(totalKm: number): number {
  const safeKm = toSafeNonNegativeNumber(totalKm);
  if (WORLD_CIRCUMFERENCE_KM <= 0 || safeKm === 0) return 0;
  return (safeKm / WORLD_CIRCUMFERENCE_KM) * 100;
}

export function calculateBrasilCrossings(totalKm: number): number {
  const safeKm = toSafeNonNegativeNumber(totalKm);
  if (BRAZIL_CROSSING_KM <= 0 || safeKm === 0) return 0;
  return Math.floor(safeKm / BRAZIL_CROSSING_KM);
}

export function calculateAthleteTotalKmFromMarathons(marathons: number): number {
  const safeMarathons = toSafeNonNegativeNumber(marathons);
  return roundTo(safeMarathons * MARATHON_STANDARD_DISTANCE, 3);
}

export function calculateGoalProgressPercentage(
  athletes: Athlete[],
  goalMarathons = GOAL_MARATHONS,
): number {
  const safeGoalMarathons = toSafeNonNegativeNumber(goalMarathons);
  if (safeGoalMarathons <= 0) return 0;

  // Equivalente a (marathons / goalMarathons) * 100, usando a distância oficial.
  const currentMarathons = calculateMarathonsCount(athletes);
  const currentKmFromMarathons = currentMarathons * MARATHON_STANDARD_DISTANCE;
  const totalKmGoal = safeGoalMarathons * MARATHON_STANDARD_DISTANCE;
  const percentage = (currentKmFromMarathons / totalKmGoal) * 100;

  if (!Number.isFinite(percentage) || percentage <= 0) return 0;
  return Math.min(100, percentage);
}

export function calculateRemainingKmToGoal(
  athletes: Athlete[],
  goalMarathons = GOAL_MARATHONS,
): {
  totalKmGoal: number;
  currentTotalKm: number;
  remainingKm: number;
} {
  const safeGoalMarathons = toSafeNonNegativeNumber(goalMarathons);
  const totalKmGoal = safeGoalMarathons * MARATHON_STANDARD_DISTANCE;
  const currentTotalKm = calculateTotalKm(athletes, { enforceHistoryMinimum: true });

  return {
    totalKmGoal: roundTo(totalKmGoal, 3),
    currentTotalKm,
    remainingKm: roundTo(Math.max(0, totalKmGoal - currentTotalKm), 3),
  };
}
