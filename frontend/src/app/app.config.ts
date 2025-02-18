import { ApplicationConfig } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';

// Import Angular Material modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';

// Import your components
import { GameListComponent } from './components/game-list/game-list.component';
import { SlotMachineComponent } from './components/slot-machine/slot-machine.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// Define routes
const appRoutes: Routes = [
  { path: '', component: GameListComponent },
  { path: 'slot-machine', component: SlotMachineComponent }
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    provideAnimations(),
    provideRouter(appRoutes),
    importProvidersFrom(

      MatToolbarModule,
      MatButtonModule,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      MatSnackBarModule, 
      MatCardModule
    ), provideAnimationsAsync()
  ]
};
