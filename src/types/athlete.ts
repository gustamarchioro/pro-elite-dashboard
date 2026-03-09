export type BadgeKey = "top3" | "puro" | "ouro" | "prata" | "bronze" | "lenda";

export type MarathonEntry = {
  name: string;
  year: string;
  time: string;
  pace: string;
};

export type YearGroup = {
  year: string;
  count: string;
  races: MarathonEntry[];
};

export type Athlete = {
  rank: number;
  name: string;
  photo: string;
  ageGroup: string;
  gender: "M" | "F";
  coach: string;
  isCoach?: boolean;
  marathons: number;
  totalKm: number;
  bestTime: string;
  pace: string;
  status: "Elite" | "Pro" | "Amador";
  badgeKeys: BadgeKey[];
  history: MarathonEntry[];
};
