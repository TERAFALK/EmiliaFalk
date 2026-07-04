import { z } from "zod";

const shotSchema = z
  .number()
  .min(0, "Skott kan inte vara mindre än 0,0")
  .max(10.9, "Skott kan inte vara mer än 10,9");

export const resultSchema = z.object({
  date: z.string().min(1, "Datum krävs"),
  matchType: z.number().int().positive("Ange antal skott"),
  shots: z.array(shotSchema).min(1, "Minst ett skott krävs"),
  competitionId: z.string().nullish(),
  note: z.string().max(500).nullish(),
});

export const competitionSchema = z.object({
  name: z.string().min(1, "Namn krävs").max(200),
  date: z.string().min(1, "Datum krävs"),
  location: z.string().max(200).nullish(),
  discipline: z.string().max(120).nullish(),
  description: z.string().max(2000).nullish(),
  isCompleted: z.boolean().optional(),
});

export const newsSchema = z.object({
  title: z.string().min(1, "Rubrik krävs").max(200),
  body: z.string().min(1, "Text krävs").max(10000),
  imagePath: z.string().nullish(),
  publishedAt: z.string().nullish(),
});

export const sponsorSchema = z.object({
  name: z.string().min(1, "Namn krävs").max(200),
  logoPath: z.string().min(1, "Logga krävs"),
  url: z.string().url("Ogiltig URL").nullish().or(z.literal("")),
  sortOrder: z.number().int().optional(),
  active: z.boolean().optional(),
});

export const meritSchema = z.object({
  title: z.string().min(1, "Titel krävs").max(200),
  description: z.string().max(2000).nullish(),
  date: z.string().min(1, "Datum krävs"),
  placement: z.string().max(120).nullish(),
});

export type ResultInput = z.infer<typeof resultSchema>;
export type CompetitionInput = z.infer<typeof competitionSchema>;
export type NewsInput = z.infer<typeof newsSchema>;
export type SponsorInput = z.infer<typeof sponsorSchema>;
export type MeritInput = z.infer<typeof meritSchema>;
