import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { catchError, throwError } from 'rxjs';

/**
 * Interceptor HTTP funcional para manejo centralizado de errores.
 * Captura fallos globales como 401 (no autorizado) para purgar la sesión y redirigir.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Manejador para fallas de autenticación o expiración de token
      if (error.status === 401 && !esPeticionPublicaDeVoucher(req.url)) {
        authService.logout();
        router.navigate(['/login']);
      }
      
      // Propagamos el error para que componentes individuales puedan capturarlo si lo desean
      return throwError(() => error);
    })
  );
};

function esPeticionPublicaDeVoucher(url: string): boolean {
  return url.includes('/api/v1/vouchers');
}
