import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { STORAGE_KEY } from './calendar/door-state.service';

describe('App', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({ imports: [App] }).compileComponents();
  });

  afterEach(() => localStorage.clear());

  it('zeigt den Titel und alle 24 Türchen', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('h1')?.textContent?.trim()).toBe('CatCalendar');
    expect(el.querySelectorAll('app-door').length).toBe(24);
  });

  it('aktiviert "Alle Türen schließen" nur, wenn eine Tür offen ist', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const reset = el.querySelector('button.reset') as HTMLButtonElement;
    expect(reset.disabled).toBe(true);

    (el.querySelector('app-door button') as HTMLButtonElement).click();
    await fixture.whenStable();
    expect(reset.disabled).toBe(false);

    reset.click();
    await fixture.whenStable();
    expect(reset.disabled).toBe(true);
    expect(el.querySelectorAll('app-door.is-open').length).toBe(0);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});
