# CatCalendar 🐱

Ein Adventskalender mit 24 Katzen – gebaut mit Angular 22 (standalone components, signals, zoneless), HTML und CSS.

- 24 gewürfelt angeordnete Doppeltüren im 9×3-Raster, Tür 24 ist gold und doppelt so groß
- Türen lassen sich beliebig oft öffnen und wieder schließen
- Öffnen: Flügel schwingen in 3D auf + Glitzer · Schließen: Tür schnappt zu und wackelt nach
- Offene Türen bleiben nach einem Reload offen (localStorage), „Alle Türen schließen“ setzt alles zurück
- Schneefall vor einem Nachthimmel

## Voraussetzungen

- Node.js **22.22.3+** oder **24.15+** (`node -v`)
- Git

## Lokal starten

```bash
npm install
npm start
```

Dann <http://localhost:4200/> öffnen.

| Befehl | Was passiert |
| --- | --- |
| `npm start` | Dev-Server mit Live-Reload |
| `npm test` | Unit-Tests (Vitest), u. a. prüfen sie die Farbregeln der Anordnung |
| `npm run build` | Produktions-Build nach `dist/catcalendar/browser` |

## Auf GitHub Pages veröffentlichen

Das Repo ist schon initialisiert (Branch `main`) und alle Dateien sind gestaged. Der Commit nutzt deine globale Git-Config.

1. Auf GitHub ein **leeres, öffentliches** Repo `catcalendar` anlegen (ohne README, .gitignore oder Lizenz).
2. Im Projektordner:

   ```bash
   git commit -m "CatCalendar: Adventskalender mit Angular"
   git remote add origin https://github.com/<dein-user>/catcalendar.git
   git push -u origin main
   ```

3. Auf GitHub: **Settings → Pages → Build and deployment → Source: „GitHub Actions“**.
4. Tab **Actions**: Der erste Lauf vom Push schlägt fehl, wenn Pages da noch nicht aktiviert war. Dann den Lauf öffnen und **„Re-run all jobs“** klicken (oder links „Deploy to GitHub Pages“ → **„Run workflow“**).
5. Fertig: <https://dein-user.github.io/catcalendar/>

Ab dann reicht `git push` – der Workflow (`.github/workflows/deploy.yml`) testet, baut und veröffentlicht automatisch. Schlägt ein Test fehl, wird nichts veröffentlicht.

## Anpassen

### Bilder tauschen

Die Bilder liegen in `public/images/` als `1.png`, `2.jpg` … `24.png`.

- Dateinamen **klein schreiben** – GitHub Pages unterscheidet Groß/Klein (`1.PNG` ≠ `1.png`).
- Quadratische Bilder passen am besten (Rest wird mittig zugeschnitten).
- Ändert sich die Endung (z. B. `.jpg` → `.png`), auch `image` in `src/app/calendar/doors.data.ts` anpassen.

### Anordnung der Türen

Steht fest in `src/app/calendar/doors.data.ts` (`row`/`col` je Tür). Nach Änderungen `npm test` ausführen – die Tests melden, wenn gleiche Farbverläufe aneinanderstoßen, Nachbarzahlen nebeneinander liegen oder Felder doppelt belegt sind.

### Farben

In `src/app/calendar/door/door.css` (`--door-gradient` je Theme). Verteilung nach Nummer: 1, 4, 7 … Eisblau · 2, 5, 8 … Lavendel-Rosa · 3, 6, 9 … Mint · 24 Gold.

## Projektstruktur

```
src/app/
├── app.ts / app.html / app.css         Seite: Titel, Kalender, Reset-Button
├── calendar/
│   ├── calendar.ts / .html / .css      9×3-Raster, Feldgröße passt sich dem Fenster an
│   ├── doors.data.ts                   Anordnung, Bilder, Farbregel
│   ├── door-state.service.ts           offene Türen + localStorage
│   └── door/door.ts / .html / .css     Doppeltür mit Animationen und Glitzer
└── snowfall/                           Schneefall im Hintergrund
```

Hinweis: Wer in den Systemeinstellungen „Bewegung reduzieren“ aktiviert hat, bekommt die Türen ohne Animationen, Glitzer und Schnee.
