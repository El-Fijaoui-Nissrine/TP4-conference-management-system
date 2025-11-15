import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const keycloakService = inject(KeycloakService);

  // Exclure les requêtes vers les assets
  if (req.url.includes('/assets/')) {
    return next(req);
  }

  // Ajouter le token Bearer si l'utilisateur est authentifié
  const token = keycloakService.getKeycloakInstance().token;

  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedReq);
  }

  return next(req);
};
