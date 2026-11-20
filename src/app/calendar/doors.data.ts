/** Raster des Kalenders: 9 Spalten × 3 Zeilen. */
export const GRID_COLUMNS = 9;
export const GRID_ROWS = 3;

/** Die drei Winterzauber-Verläufe für 1–23 plus Gold für die 24. */
export type DoorTheme = 'ice' | 'lavender' | 'mint' | 'gold';

export interface DoorConfig {
  /** Tag im Dezember (1–24). */
  readonly day: number;
  /** Zeile im Raster (1-basiert, obere linke Ecke der Tür). */
  readonly row: number;
  /** Spalte im Raster (1-basiert, obere linke Ecke der Tür). */
  readonly col: number;
  /** Dateiname in public/images (klein geschrieben, GitHub Pages unterscheidet Groß/Klein). */
  readonly image: string;
}

/**
 * Verlauf nach Türnummer, reihum:
 * 1, 4, 7 … → Eisblau | 2, 5, 8 … → Lavendel-Rosa | 3, 6, 9 … → Mint | 24 → Gold
 */
export function themeFor(day: number): DoorTheme {
  if (day === 24) {
    return 'gold';
  }
  const themes: readonly DoorTheme[] = ['mint', 'ice', 'lavender'];
  return themes[day % 3];
}

/** Tür 24 belegt 2×2 Felder, alle anderen 1×1. */
export function spanFor(day: number): number {
  return day === 24 ? 2 : 1;
}

/**
 * Fest gewürfelte Anordnung (immer gleich).
 * Regeln: gleiche Verläufe berühren sich nie an einer Kante, aufeinanderfolgende
 * Zahlen liegen nie nebeneinander (auch nicht diagonal).
 *
 *   3  19 [24 24]  2   6  23  15  20
 *  16  12 [24 24] 22  11  13  17  10
 *  21   5   1   8 18   4   9   7  14
 */
export const DOORS: readonly DoorConfig[] = [
  { day: 1, row: 3, col: 3, image: '1.png' },
  { day: 2, row: 1, col: 5, image: '2.jpg' },
  { day: 3, row: 1, col: 1, image: '3.jpg' },
  { day: 4, row: 3, col: 6, image: '4.jpg' },
  { day: 5, row: 3, col: 2, image: '5.jpg' },
  { day: 6, row: 1, col: 6, image: '6.png' },
  { day: 7, row: 3, col: 8, image: '7.jpg' },
  { day: 8, row: 3, col: 4, image: '8.jpg' },
  { day: 9, row: 3, col: 7, image: '9.jpg' },
  { day: 10, row: 2, col: 9, image: '10.jpg' },
  { day: 11, row: 2, col: 6, image: '11.jpg' },
  { day: 12, row: 2, col: 2, image: '12.png' },
  { day: 13, row: 2, col: 7, image: '13.jpg' },
  { day: 14, row: 3, col: 9, image: '14.jpg' },
  { day: 15, row: 1, col: 8, image: '15.jpg' },
  { day: 16, row: 2, col: 1, image: '16.jpg' },
  { day: 17, row: 2, col: 8, image: '17.png' },
  { day: 18, row: 3, col: 5, image: '18.png' },
  { day: 19, row: 1, col: 2, image: '19.png' },
  { day: 20, row: 1, col: 9, image: '20.jpg' },
  { day: 21, row: 3, col: 1, image: '21.png' },
  { day: 22, row: 2, col: 5, image: '22.jpg' },
  { day: 23, row: 1, col: 7, image: '23.jpg' },
  { day: 24, row: 1, col: 3, image: '24.png' },
];
