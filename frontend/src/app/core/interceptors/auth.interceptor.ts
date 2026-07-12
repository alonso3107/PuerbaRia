import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '@core/services/auth.service';

/**
 * Interceptor HTTP funcional para autenticación.
 * Adjunta el Bearer token JWT y, si el backend responde 401 porque el
 * access token expiró, renueva la sesión con el refresh token y reintenta
 * la petición original sin que el usuario lo note.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(conToken(req, authService.getToken())).pipe(
    catchError((error: HttpErrorResponse) => {
      const esRenovable =
        error.status === 401 &&
        !req.url.includes('/auth/') &&
        !!authService.getRefreshToken();

      if (!esRenovable) {
        return throwError(() => error);
      }

      return authService.refrescarSesion().pipe(
        switchMap((sesion) => next(conToken(req, sesion.token))),
        catchError(() => {
          // El refresh token también es inválido: la sesión murió de verdad
          authService.clearSession();
          router.navigate(['/login']);
          return throwError(() => error);
        })
      );
    })
  );
};

/** Clona la petición inyectando el Bearer token si existe. */
function conToken(req: HttpRequest<unknown>, token: string | null): HttpRequest<unknown> {
  if (!token) {
    return req;
  }

  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
}
