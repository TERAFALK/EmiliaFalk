// Serialiserbara datatyper som skickas från server-komponenten till admin-klienten.

export type AdminResult = {
  id: string;
  date: string; // YYYY-MM-DD
  matchType: number;
  shots: number[];
  total: number;
  average: number;
  note: string | null;
  competitionId: string | null;
};

export type AdminCompetition = {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  location: string | null;
  discipline: string | null;
  description: string | null;
  isCompleted: boolean;
};

export type AdminNews = {
  id: string;
  title: string;
  body: string;
  imagePath: string | null;
  publishedAt: string; // YYYY-MM-DD
};

export type AdminSponsor = {
  id: string;
  name: string;
  logoPath: string;
  url: string | null;
  sortOrder: number;
  active: boolean;
};

export type AdminMerit = {
  id: string;
  title: string;
  description: string | null;
  date: string; // YYYY-MM-DD
  placement: string | null;
};

export type CompetitionOption = { id: string; name: string };
