import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Calendar } from './calendar/calendar';
import { DoorStateService } from './calendar/door-state.service';
import { Snowfall } from './snowfall/snowfall';

@Component({
  selector: 'app-root',
  imports: [Calendar, Snowfall],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly state = inject(DoorStateService);
}
