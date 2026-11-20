import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Door } from './door/door';
import { DOORS } from './doors.data';

@Component({
  selector: 'app-calendar',
  imports: [Door],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Calendar {
  protected readonly doors = DOORS;
}
