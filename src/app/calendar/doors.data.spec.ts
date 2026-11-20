import { DOORS, GRID_COLUMNS, GRID_ROWS, spanFor, themeFor } from './doors.data';

/** Baut eine Karte "zeile,spalte" → Tag, inklusive der 2×2-Fläche von Tür 24. */
function buildCellMap(): Map<string, number> {
  const cells = new Map<string, number>();
  for (const door of DOORS) {
    const span = spanFor(door.day);
    for (let r = door.row; r < door.row + span; r++) {
      for (let c = door.col; c < door.col + span; c++) {
        const key = `${r},${c}`;
        expect(cells.has(key), `Feld ${key} doppelt belegt`).toBe(false);
        cells.set(key, door.day);
      }
    }
  }
  return cells;
}

describe('DOORS (Anordnung)', () => {
  it('enthält jede Zahl von 1 bis 24 genau einmal', () => {
    const days = DOORS.map((d) => d.day).sort((a, b) => a - b);
    expect(days).toEqual(Array.from({ length: 24 }, (_, i) => i + 1));
  });

  it('füllt das 9×3-Raster lückenlos und ohne Überlappung', () => {
    const cells = buildCellMap();
    expect(cells.size).toBe(GRID_COLUMNS * GRID_ROWS);
    for (let r = 1; r <= GRID_ROWS; r++) {
      for (let c = 1; c <= GRID_COLUMNS; c++) {
        expect(cells.has(`${r},${c}`), `Feld ${r},${c} leer`).toBe(true);
      }
    }
  });

  it('lässt gleiche Farbverläufe nie an einer Kante aneinanderstoßen', () => {
    const cells = buildCellMap();
    for (const [key, day] of cells) {
      const [r, c] = key.split(',').map(Number);
      for (const [dr, dc] of [
        [0, 1],
        [1, 0],
      ]) {
        const neighbour = cells.get(`${r + dr},${c + dc}`);
        if (neighbour !== undefined && neighbour !== day) {
          expect(themeFor(neighbour), `${day} und ${neighbour} haben denselben Verlauf`).not.toBe(
            themeFor(day),
          );
        }
      }
    }
  });

  it('legt aufeinanderfolgende Zahlen nie nebeneinander (auch nicht diagonal)', () => {
    const cells = buildCellMap();
    for (const [key, day] of cells) {
      const [r, c] = key.split(',').map(Number);
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const neighbour = cells.get(`${r + dr},${c + dc}`);
          if (neighbour !== undefined && neighbour !== day) {
            expect(Math.abs(neighbour - day), `${day} liegt neben ${neighbour}`).not.toBe(1);
          }
        }
      }
    }
  });

  it('verteilt die Verläufe reihum nach Nummer und macht nur die 24 gold', () => {
    expect([1, 2, 3, 4, 5, 6].map(themeFor)).toEqual([
      'ice',
      'lavender',
      'mint',
      'ice',
      'lavender',
      'mint',
    ]);
    expect(themeFor(23)).toBe('lavender');
    expect(themeFor(24)).toBe('gold');
    expect(DOORS.filter((d) => themeFor(d.day) === 'gold').map((d) => d.day)).toEqual([24]);
  });

  it('verweist auf klein geschriebene Bilddateien mit passender Nummer', () => {
    for (const door of DOORS) {
      expect(door.image).toMatch(new RegExp(`^${door.day}\\.(png|jpg)$`));
    }
  });
});
