// token.interceptor.ts
import { inject } from '@angular/core';
import { HttpRequest, HttpHandlerFn, HttpEvent, HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

export const tokenInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const messageService = inject(MessageService);

  const currentUser = authService.currentUserValue;

  if (currentUser && currentUser.token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${currentUser.token}` }
    });
  } else {
    console.log('❌ Aucun token trouvé');
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          messageService.add({
            severity: 'warn',
            summary: 'Accès refusé',
            detail: 'Vous n\'avez pas les droits nécessaires pour accéder à cette ressource.'
          });
          router.navigate(['/auth/not-authorized']);
        }

        return throwError(error);
      })
    );
};
