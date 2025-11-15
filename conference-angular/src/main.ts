import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors, HttpInterceptorFn } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideZoneChangeDetection, APP_INITIALIZER, inject } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: 'http://localhost:8080',
        realm: 'conference-realm',
        clientId: 'conference-frontend'
      },
      initOptions: {
        onLoad: 'check-sso',
        checkLoginIframe: false
      }
    });
}

// Intercepteur fonctionnel
const keycloakInterceptor: HttpInterceptorFn = (req, next) => {
  const keycloakService = inject(KeycloakService);

  console.log('🔍 Functional Interceptor called for:', req.url);

  // Ne pas ajouter le token pour les assets
  if (req.url.includes('/assets/')) {
    console.log('⏭️ Skipping token for assets');
    return next(req);
  }

  // Ajouter le token pour les requêtes vers le Gateway
  if (req.url.startsWith('http://localhost:8888/')) {
    console.log('🎯 Gateway URL detected');

    const token = keycloakService.getKeycloakInstance()?.token;

    if (token) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('✅ Token added to request');
      console.log('🔑 Token (first 50 chars):', token.substring(0, 50) + '...');

      return next(authReq);
    } else {
      console.error('❌ No token available!');
    }
  }

  return next(req);
};

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([keycloakInterceptor])),

    KeycloakService,

    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    }
  ]
}).catch(err => console.error(err));
