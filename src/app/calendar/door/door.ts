import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { DoorStateService } from '../door-state.service';
import { DoorConfig, DoorTheme, spanFor, themeFor } from '../doors.data';

interface Sparkle {
  readonly id: number;
  /** Flugziel relativ zur Türgröße (1 = eine Türbreite). */
  readonly x: number;
  readonly y: number;
  readonly size: string;
  readonly rotation: string;
  readonly delay: string;
  readonly duration: string;
  readonly color: string;
  readonly round: boolean;
}

const SPARKLE_COLORS: Record<DoorTheme, readonly string[]> = {
  ice: ['#ffffff', '#b6fbff', '#83a4d4'],
  lavender: ['#ffffff', '#fbc2eb', '#a18cd1'],
  mint: ['#ffffff', '#f8ffae', '#43c6ac'],
  gold: ['#ffffff', '#fcf6ba', '#f3d27a', '#bf953f'],
};

const SPARKLE_MAX_DELAY_MS = 320;
const SPARKLE_MAX_DURATION_MS = 1200;
/** Schließen (560 ms) + Wackeln (420 ms ab 470 ms) + Puffer. */
const CLOSING_EFFECT_MS = 950;

function prefersReducedMotion(): boolean {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

@Component({
  selector: 'app-door',
  templateUrl: './door.html',
  styleUrl: './door.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': "'theme-' + theme()",
    '[class.is-open]': 'open()',
    '[class.is-closing]': 'closing()',
    '[style.grid-row]': 'gridRow()',
    '[style.grid-column]': 'gridColumn()',
  },
})
export class Door {
  readonly config = input.required<DoorConfig>();

  private readonly state = inject(DoorStateService);

  protected readonly theme = computed(() => themeFor(this.config().day));
  protected readonly open = computed(() => this.state.isOpen(this.config().day));
  protected readonly label = computed(
    () => `Türchen ${this.config().day} ${this.open() ? 'schließen' : 'öffnen'}`,
  );
  protected readonly imageSrc = computed(() => `images/${this.config().image}`);
  protected readonly gridRow = computed(
    () => `${this.config().row} / span ${spanFor(this.config().day)}`,
  );
  protected readonly gridColumn = computed(
    () => `${this.config().col} / span ${spanFor(this.config().day)}`,
  );

  protected readonly closing = signal(false);
  protected readonly sparkles = signal<readonly Sparkle[]>([]);

  private nextSparkleId = 0;
  private closingTimer: ReturnType<typeof setTimeout> | undefined;
  private readonly sparkleTimers = new Set<ReturnType<typeof setTimeout>>();

  constructor() {
    // Effekte nur bei echten Zustandswechseln abspielen – nicht beim ersten Laden,
    // damit gespeicherte offene Türen ohne Glitzer erscheinen.
    let previous: boolean | undefined;
    effect(() => {
      const isOpen = this.open();
      if (previous !== undefined && previous !== isOpen) {
        untracked(() => (isOpen ? this.playOpenEffects() : this.playCloseEffects()));
      }
      previous = isOpen;
    });

    inject(DestroyRef).onDestroy(() => {
      clearTimeout(this.closingTimer);
      this.sparkleTimers.forEach((timer) => clearTimeout(timer));
    });
  }

  protected toggle(): void {
    this.state.toggle(this.config().day);
  }

  private playOpenEffects(): void {
    this.stopClosingEffect();
    if (!prefersReducedMotion()) {
      this.burstSparkles();
    }
  }

  private playCloseEffects(): void {
    this.stopClosingEffect();
    this.closing.set(true);
    this.closingTimer = setTimeout(() => this.closing.set(false), CLOSING_EFFECT_MS);
  }

  private stopClosingEffect(): void {
    clearTimeout(this.closingTimer);
    this.closingTimer = undefined;
    this.closing.set(false);
  }

  private burstSparkles(): void {
    const theme = this.theme();
    const gold = theme === 'gold';
    const colors = SPARKLE_COLORS[theme];
    const count = gold ? 30 : 16;

    const batch: Sparkle[] = Array.from({ length: count }, () => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 0.45 + Math.random() * 0.45;
      return {
        id: this.nextSparkleId++,
        x: Number((Math.cos(angle) * distance).toFixed(3)),
        y: Number((Math.sin(angle) * distance).toFixed(3)),
        size: `${Math.round((gold ? 12 : 9) + Math.random() * (gold ? 14 : 9))}px`,
        rotation: `${Math.round(Math.random() * 360 - 180)}deg`,
        delay: `${Math.round(120 + Math.random() * (SPARKLE_MAX_DELAY_MS - 120))}ms`,
        duration: `${Math.round(750 + Math.random() * (SPARKLE_MAX_DURATION_MS - 750))}ms`,
        color: colors[Math.floor(Math.random() * colors.length)],
        round: Math.random() < 0.4,
      };
    });

    const ids = new Set(batch.map((sparkle) => sparkle.id));
    this.sparkles.update((list) => [...list, ...batch]);

    const timer = setTimeout(
      () => {
        this.sparkleTimers.delete(timer);
        this.sparkles.update((list) => list.filter((sparkle) => !ids.has(sparkle.id)));
      },
      SPARKLE_MAX_DELAY_MS + SPARKLE_MAX_DURATION_MS + 100,
    );
    this.sparkleTimers.add(timer);
  }
}
