import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core'; // Alterado aqui
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Usamos a detecção nativa estável da v17
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient()
  ]
};