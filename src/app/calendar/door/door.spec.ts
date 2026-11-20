import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DoorStateService, STORAGE_KEY } from '../door-state.service';
import { DOORS } from '../doors.data';
import { Door } from './door';

describe('Door', () => {
  let fixture: ComponentFixture<Door>;
  let host: HTMLElement;

  function create(day: number): void {
    fixture = TestBed.createComponent(Door);
    fixture.componentRef.setInput(
      'config',
      DOORS.find((d) => d.day === day),
    );
    host = fixture.nativeElement as HTMLElement;
  }

  function button(): HTMLButtonElement {
    return host.querySelector('button.door') as HTMLButtonElement;
  }

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ imports: [Door] });
  });

  afterEach(() => {
    vi.useRealTimers();
    localStorage.clear();
  });

  it('zeigt die Zahl auf beiden Flügeln und das passende Bild', async () => {
    create(7);
    await fixture.whenStable();

    const numbers = [...host.querySelectorAll('.number')].map((n) => n.textContent?.trim());
    expect(numbers).toEqual(['7', '7']);
    expect(host.querySelector('img')?.getAttribute('src')).toBe('images/7.jpg');
    expect(host.classList).toContain('theme-ice');
    expect(host.style.gridRow).toBe('3 / span 1');
    expect(host.style.gridColumn).toBe('8 / span 1');
  });

  it('macht die 24 gold und 2×2 groß', async () => {
    create(24);
    await fixture.whenStable();

    expect(host.classList).toContain('theme-gold');
    expect(host.style.gridRow).toBe('1 / span 2');
    expect(host.style.gridColumn).toBe('3 / span 2');
  });

  it('öffnet per Klick mit Glitzer und schließt wieder mit Wackeln', () => {
    // Fake-Timer + synchrones detectChanges(), damit die Effekt-Timer gezielt vorgespult werden können.
    vi.useFakeTimers();
    create(12);
    fixture.detectChanges();
    expect(button().getAttribute('aria-label')).toBe('Türchen 12 öffnen');

    button().click();
    fixture.detectChanges();
    expect(host.classList).toContain('is-open');
    expect(button().getAttribute('aria-label')).toBe('Türchen 12 schließen');
    expect(host.querySelectorAll('.sparkle').length).toBe(16);
    expect(localStorage.getItem(STORAGE_KEY)).toBe('[12]');

    const sparkle = host.querySelector('.sparkle') as HTMLElement;
    expect(sparkle.style.getPropertyValue('--sx')).not.toBe('');
    expect(sparkle.style.getPropertyValue('--duration')).toMatch(/^\d+ms$/);

    button().click();
    fixture.detectChanges();
    expect(host.classList).not.toContain('is-open');
    expect(host.classList).toContain('is-closing');
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();

    vi.advanceTimersByTime(2000);
    fixture.detectChanges();
    expect(host.classList).not.toContain('is-closing');
    expect(host.querySelectorAll('.sparkle').length).toBe(0);
  });

  it('erscheint nach einem Reload offen – ohne Glitzer', async () => {
    localStorage.setItem(STORAGE_KEY, '[3]');
    create(3);
    await fixture.whenStable();

    expect(host.classList).toContain('is-open');
    expect(host.querySelectorAll('.sparkle').length).toBe(0);
  });

  it('schließt sich mit Wackeln, wenn alle Türen zurückgesetzt werden', async () => {
    create(5);
    await fixture.whenStable();
    button().click();
    await fixture.whenStable();

    TestBed.inject(DoorStateService).closeAll();
    await fixture.whenStable();
    expect(host.classList).not.toContain('is-open');
    expect(host.classList).toContain('is-closing');
  });
});
