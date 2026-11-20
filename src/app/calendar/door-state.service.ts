import { Injectable, computed, signal } from '@angular/core';

export const STORAGE_KEY = 'catcalendar.open-doors';

/** Merkt sich, welche Türchen offen sind – auch über einen Reload hinweg (localStorage). */
@Injectable({ providedIn: 'root' })
export class DoorStateService {
  private readonly openSet = signal<ReadonlySet<number>>(this.load());

  readonly anyOpen = computed(() => this.openSet().size > 0);

  isOpen(day: number): boolean {
    return this.openSet().has(day);
  }

  toggle(day: number): void {
    const next = new Set(this.openSet());
    if (next.has(day)) {
      next.delete(day);
    } else {
      next.add(day);
    }
    this.openSet.set(next);
    this.save(next);
  }

  closeAll(): void {
    this.openSet.set(new Set());
    this.save(new Set());
  }

  private load(): ReadonlySet<number> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return new Set();
      }
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return new Set();
      }
      return new Set(parsed.filter((d): d is number => Number.isInteger(d) && d >= 1 && d <= 24));
    } catch {
      // Kaputter Eintrag oder kein Zugriff auf localStorage → alle Türen zu.
      return new Set();
    }
  }

  private save(openDays: ReadonlySet<number>): void {
    try {
      if (openDays.size === 0) {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...openDays].sort((a, b) => a - b)));
      }
    } catch {
      // localStorage nicht verfügbar (z. B. gesperrt) → Zustand gilt nur für diese Sitzung.
    }
  }
}
