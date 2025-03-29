// token.interceptor.ts
import { inject } from '@angular/core';
import { HttpRequest, HttpHandlerFn, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  return next(req);
};
