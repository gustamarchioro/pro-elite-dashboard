export type BadgeKey = "top3" | "puro" | "ouro" | "prata" | "bronze" | "lenda";

export type AthleteSeed = {
	rank: number;
	name: string;
	photo: string;
	ageGroup: string;
	gender: "M" | "F";
	coach: string;
	isCoach?: boolean;
	marathons: number;
	bestTime: string;
	pace: string;
	status: "Elite" | "Pro" | "Amador";
	badgeKeys: BadgeKey[];
};

export const athleteSeeds: AthleteSeed[] = [
	{ rank: 1,  name: "Lucas Menezes",   photo: "https://i.pravatar.cc/300?img=1",  ageGroup: "M30-34", gender: "M", coach: "Felipe",   isCoach: true, marathons: 21, bestTime: "02:45:22", pace: "3'55\" /km", status: "Elite",  badgeKeys: ["lenda", "top3"] },
	{ rank: 2,  name: "Thiago Prado",    photo: "https://i.pravatar.cc/300?img=2",  ageGroup: "M35-39", gender: "M", coach: "Nestor",   marathons: 18, bestTime: "02:47:10", pace: "3'57\" /km", status: "Elite",  badgeKeys: ["ouro", "top3"] },
	{ rank: 3,  name: "Matheus Silva",   photo: "https://i.pravatar.cc/300?img=3",  ageGroup: "M25-29", gender: "M", coach: "Giuliano", marathons: 16, bestTime: "02:50:05", pace: "4'00\" /km", status: "Pro",    badgeKeys: ["puro"] },
	{ rank: 4,  name: "Rafael Costa",    photo: "https://i.pravatar.cc/300?img=4",  ageGroup: "M35-39", gender: "M", coach: "Felipe",   marathons: 14, bestTime: "02:54:33", pace: "4'08\" /km", status: "Pro",    badgeKeys: ["puro"] },
	{ rank: 5,  name: "Bruno Vidal",     photo: "https://i.pravatar.cc/300?img=5",  ageGroup: "M40-44", gender: "M", coach: "Gisele",   marathons: 11, bestTime: "03:02:40", pace: "4'20\" /km", status: "Amador", badgeKeys: ["bronze"] },
	{ rank: 6,  name: "Caio Duarte",     photo: "https://i.pravatar.cc/300?img=6",  ageGroup: "M30-34", gender: "M", coach: "Fábio",    marathons: 17, bestTime: "02:49:18", pace: "3'58\" /km", status: "Elite",  badgeKeys: ["ouro", "top3"] },
	{ rank: 7,  name: "Igor Sampaio",    photo: "https://i.pravatar.cc/300?img=7",  ageGroup: "M30-34", gender: "M", coach: "Giuliano", marathons: 9,  bestTime: "03:05:11", pace: "4'23\" /km", status: "Pro",    badgeKeys: ["prata"] },
	{ rank: 8,  name: "Daniel Teles",    photo: "https://i.pravatar.cc/300?img=8",  ageGroup: "M45-49", gender: "M", coach: "Nestor",   marathons: 8,  bestTime: "03:14:02", pace: "4'36\" /km", status: "Amador", badgeKeys: ["bronze"] },
	{ rank: 9,  name: "Vinicius Goulart",photo: "https://i.pravatar.cc/300?img=9",  ageGroup: "M35-39", gender: "M", coach: "Felipe",   marathons: 12, bestTime: "02:57:45", pace: "4'12\" /km", status: "Elite",  badgeKeys: ["ouro"] },
	{ rank: 10, name: "Felipe Lacerda",  photo: "https://i.pravatar.cc/300?img=10", ageGroup: "M30-34", gender: "M", coach: "Gisele",   marathons: 10, bestTime: "03:09:27", pace: "4'29\" /km", status: "Pro",    badgeKeys: ["puro"] },
	{ rank: 11, name: "Renato Alves",    photo: "https://i.pravatar.cc/300?img=11", ageGroup: "M40-44", gender: "M", coach: "Fábio",    marathons: 7,  bestTime: "03:22:30", pace: "4'48\" /km", status: "Amador", badgeKeys: ["bronze"] },
	{ rank: 12, name: "Gustavo Nunes",   photo: "https://i.pravatar.cc/300?img=12", ageGroup: "M25-29", gender: "M", coach: "Giuliano", marathons: 6,  bestTime: "03:18:50", pace: "4'43\" /km", status: "Pro",    badgeKeys: ["prata"] },
	{ rank: 13, name: "Camila Rocha",    photo: "https://i.pravatar.cc/300?img=13", ageGroup: "F30-34", gender: "F", coach: "Gisele",   marathons: 15, bestTime: "02:56:20", pace: "4'10\" /km", status: "Elite",  badgeKeys: ["ouro", "top3"] },
	{ rank: 14, name: "Fernanda Lima",   photo: "https://i.pravatar.cc/300?img=14", ageGroup: "F35-39", gender: "F", coach: "Nestor",   marathons: 12, bestTime: "03:08:15", pace: "4'27\" /km", status: "Pro",    badgeKeys: ["puro"] },
	{ rank: 15, name: "Juliana Moreira", photo: "https://i.pravatar.cc/300?img=15", ageGroup: "F30-34", gender: "F", coach: "Felipe",   marathons: 9,  bestTime: "03:24:40", pace: "4'51\" /km", status: "Amador", badgeKeys: ["bronze"] },
	{ rank: 16, name: "Patricia Santos", photo: "https://i.pravatar.cc/300?img=16", ageGroup: "F40-44", gender: "F", coach: "Fábio",    marathons: 13, bestTime: "03:01:09", pace: "4'17\" /km", status: "Elite",  badgeKeys: ["ouro"] },
	{ rank: 17, name: "Ana Clara Souza", photo: "https://i.pravatar.cc/300?img=17", ageGroup: "F25-29", gender: "F", coach: "Giuliano", marathons: 11, bestTime: "03:12:22", pace: "4'33\" /km", status: "Pro",    badgeKeys: ["prata"] },
	{ rank: 18, name: "Mariana Faria",   photo: "https://i.pravatar.cc/300?img=18", ageGroup: "F35-39", gender: "F", coach: "Gisele",   marathons: 8,  bestTime: "03:31:05", pace: "4'59\" /km", status: "Amador", badgeKeys: ["bronze"] },
	{ rank: 19, name: "Beatriz Freitas", photo: "https://i.pravatar.cc/300?img=19", ageGroup: "F30-34", gender: "F", coach: "Felipe",   marathons: 14, bestTime: "03:05:48", pace: "4'22\" /km", status: "Elite",  badgeKeys: ["ouro", "top3"] },
	{ rank: 20, name: "Larissa Mota",    photo: "https://i.pravatar.cc/300?img=20", ageGroup: "F40-44", gender: "F", coach: "Nestor",   marathons: 10, bestTime: "03:20:33", pace: "4'45\" /km", status: "Pro",    badgeKeys: ["puro"] },
	{ rank: 21, name: "Jessica Pires",   photo: "https://i.pravatar.cc/300?img=21", ageGroup: "F35-39", gender: "F", coach: "Fábio",    marathons: 6,  bestTime: "03:42:10", pace: "5'18\" /km", status: "Amador", badgeKeys: ["bronze"] },
	{ rank: 22, name: "Renata Melo",     photo: "https://i.pravatar.cc/300?img=22", ageGroup: "F45-49", gender: "F", coach: "Gisele",   marathons: 7,  bestTime: "03:27:58", pace: "4'56\" /km", status: "Pro",    badgeKeys: ["prata"] },
	{ rank: 23, name: "Talita Andrade",  photo: "https://i.pravatar.cc/300?img=23", ageGroup: "F40-44", gender: "F", coach: "Giuliano", marathons: 4,  bestTime: "04:10:15", pace: "5'56\" /km", status: "Amador", badgeKeys: ["bronze"] },
	{ rank: 24, name: "Monica Teixeira", photo: "https://i.pravatar.cc/300?img=24", ageGroup: "F50-54", gender: "F", coach: "Felipe",   marathons: 2,  bestTime: "04:28:40", pace: "6'22\" /km", status: "Amador", badgeKeys: ["bronze"] },
];
