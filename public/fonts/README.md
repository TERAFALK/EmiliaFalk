# Fonter

## Roboto (brödtext)
Roboto laddas automatiskt via npm-paketet `@fontsource/roboto` och behöver inte laddas ner manuellt.

## Vogue (rubriker)
Vogue-fonten är gratis för privat bruk men får inte checkas in i git (se licens på dafont).
Ladda ner och lägg filen här:

1. Gå till https://www.dafont.com/vogue.font och ladda ner zip:en.
2. Packa upp och ta `Vogue.ttf`.
3. (Rekommenderat) Konvertera till `.woff2` för snabbare laddning, t.ex. på
   https://cloudconvert.com/ttf-to-woff2 — spara som `vogue.woff2`.
4. Lägg filen/filerna i denna mapp med små bokstäver:
   - `public/fonts/vogue.woff2`  (rekommenderat)
   - och/eller `public/fonts/vogue.ttf`

`@font-face`-regeln i `src/app/globals.css` pekar redan på dessa filnamn.

> Tills filen finns visas rubrikerna i en serif-fallback (Georgia). Sidan fungerar ändå.
