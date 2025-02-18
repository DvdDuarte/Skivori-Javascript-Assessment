import { Routes, provideRouter } from '@angular/router';
import { GameListComponent } from './components/game-list/game-list.component';
import { SlotMachineComponent } from './components/slot-machine/slot-machine.component';

const routes: Routes = [
  { path: '', component: GameListComponent }, // Home Page (Game List)
  { path: 'slot-machine', component: SlotMachineComponent } // Slot Machine Page
];

export const appRouting = provideRouter(routes);
