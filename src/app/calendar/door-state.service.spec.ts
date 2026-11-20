import { TestBed } from '@angular/core/testing';
import { DoorStateService, STORAGE_KEY } from './door-state.service';

describe('DoorStateService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
  });

  afterEach(() => localStorage.clear());

  it('startet mit allen Türen zu', () => {
    const service = TestBed.inject(DoorStateService);
    expect(service.anyOpen()).toBe(false);
    expect(service.isOpen(1)).toBe(false);
  });

  it('öffnet und schließt eine Tür und speichert den Zustand', () => {
    const service = TestBed.inject(DoorStateService);

    service.toggle(5);
    service.toggle(24);
    expect(service.isOpen(5)).toBe(true);
    expect(service.isOpen(24)).toBe(true);
    expect(localStorage.getItem(STORAGE_KEY)).toBe('[5,24]');

    service.toggle(5);
    expect(service.isOpen(5)).toBe(false);
    expect(localStorage.getItem(STORAGE_KEY)).toBe('[24]');
  });

  it('stellt offene Türen nach einem Reload wieder her', () => {
    localStorage.setItem(STORAGE_KEY, '[3,17]');
    const service = TestBed.inject(DoorStateService);
    expect(service.isOpen(3)).toBe(true);
    expect(service.isOpen(17)).toBe(true);
    expect(service.isOpen(4)).toBe(false);
  });

  it('ignoriert kaputte oder ungültige Einträge', () => {
    localStorage.setItem(STORAGE_KEY, '{kaputt');
    expect(TestBed.inject(DoorStateService).anyOpen()).toBe(false);

    TestBed.resetTestingModule();
    localStorage.setItem(STORAGE_KEY, '[0, 25, 2.5, "7", 8]');
    const service = TestBed.inject(DoorStateService);
    expect(service.isOpen(8)).toBe(true);
    expect(service.isOpen(7)).toBe(false);
    expect(service.anyOpen()).toBe(true);
  });

  it('schließt mit closeAll alle Türen und leert den Speicher', () => {
    const service = TestBed.inject(DoorStateService);
    service.toggle(1);
    service.toggle(2);

    service.closeAll();
    expect(service.anyOpen()).toBe(false);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});
