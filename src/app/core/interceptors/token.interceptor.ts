import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService,
        private router: Router,
        private messageService: MessageService,
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentUser = this.authService.currentUserValue;
    if (currentUser && currentUser.token) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${currentUser.token}` }
      });
    }
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
            this.router.navigate(['/auth/not-authorized']);
            this.messageService.add({
              severity: 'warn',
              summary: 'Accès refusé',
              detail: 'Vous n\'avez pas les droits nécessaires pour accéder à cette page'
            });
        }
        return throwError(error);
      })
    );
  }
}
