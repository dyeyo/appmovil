import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { NavController } from '@ionic/angular';
import { catchError, from, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const nav = inject(NavController);

  /* ---- leemos el token de forma asíncrona ---- */
  return from(Preferences.get({ key: 'jwt' })).pipe(
    switchMap(({ value: token }) => {
      const authReq = token
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req; // sin token, no toques la request

      return next(authReq).pipe(
        catchError((err: unknown) => {
          // Solo reaccionar ante 401 (no autenticado)
          if (err instanceof HttpErrorResponse && err.status === 401) {
            // Limpia el token por si está corrupto/expirado y redirige
            Preferences.remove({ key: 'jwt' }).finally(() => {
              nav.navigateRoot('/login', { animated: true });
            });
          }
          return throwError(() => err);
        })
      );
    })
  );
};
