import { z } from "zod";

export const resultSchema = z
  .object({
    date: z.string().min(1, "Datum krävs"),
    matchType: z.number().int().positive("Ange antal skott"),
    entryMode: z.enum(["shots", "series"]).default("shots"),
    // Värden är antingen enskilda skott (0–10,9) eller serietotaler (0–109).
    shots: z
      .array(z.number().min(0, "Värdet kan inte vara negativt").max(109))
      .min(1, "Minst ett värde krävs"),
    competitionId: z.string().nullish(),
    note: z.string().max(500).nullish(),
  })
  .superRefine((data, ctx) => {
    const max = data.entryMode === "series" ? 109 : 10.9;
    data.shots.forEach((v, i) => {
      if (v > max) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["shots", i],
          message:
            data.entryMode === "series"
              ? "En serie kan inte vara mer än 109,0"
              : "Ett skott kan inte vara mer än 10,9",
        });
      }
    });
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
