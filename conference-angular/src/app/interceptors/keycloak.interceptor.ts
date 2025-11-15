import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';

@Injectable()
export class CustomKeycloakInterceptor implements HttpInterceptor {

  constructor(private keycloakService: KeycloakService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    console.log('🔍 Interceptor called for URL:', request.url);

    // Ne pas ajouter le token pour les assets
    if (request.url.includes('/assets/')) {
      console.log('⏭️ Skipping token for assets:', request.url);
      return next.handle(request);
    }

    // Ajouter le token uniquement pour les requêtes vers le Gateway
    if (request.url.startsWith('http://localhost:8888/')) {
      console.log('🎯 Gateway URL detected, attempting to add token...');

      const keycloakInstance = this.keycloakService.getKeycloakInstance();
      const token = keycloakInstance?.token;

      console.log('🔐 Keycloak instance exists:', !!keycloakInstance);
      console.log('🔑 Token exists:', !!token);

      if (token) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log('✅ Token added successfully to request:', request.url);
        console.log('🔑 Token (first 50 chars):', token.substring(0, 50) + '...');
        console.log('📋 Request headers:', request.headers.keys());
      } else {
        console.error('❌ No token available for request:', request.url);
        console.error('❌ Keycloak authenticated:', this.keycloakService.isLoggedIn());
        console.error('❌ Token value:', token);
      }
    } else {
      console.log('⏭️ Skipping token for non-gateway URL:', request.url);
    }

    return next.handle(request);
  }
}
