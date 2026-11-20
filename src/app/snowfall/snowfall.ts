import { ChangeDetectionStrategy, Component } from '@angular/core';

interface Flake {
  readonly left: string;
  readonly size: string;
  readonly opacity: number;
  readonly duration: string;
  readonly delay: string;
  readonly drift: string;
  readonly sway: string;
  readonly swayDuration: string;
}

const FLAKE_COUNT = 70;

function random(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

@Component({
  selector: 'app-snowfall',
  templateUrl: './snowfall.html',
  styleUrl: './snowfall.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
})
export class Snowfall {
  protected readonly flakes: readonly Flake[] = Array.from({ length: FLAKE_COUNT }, () => {
    const duration = random(9, 20);
    return {
      left: `${random(0, 100).toFixed(2)}%`,
      size: `${random(2, 6).toFixed(1)}px`,
      opacity: Number(random(0.35, 0.9).toFixed(2)),
      duration: `${duration.toFixed(1)}s`,
      // Negative Verzögerung: Flocken sind beim Laden schon mitten im Fall.
      delay: `${(-random(0, duration)).toFixed(1)}s`,
      drift: `${random(-60, 60).toFixed(0)}px`,
      sway: `${random(6, 22).toFixed(0)}px`,
      swayDuration: `${random(2.5, 5).toFixed(1)}s`,
    };
  });
}
