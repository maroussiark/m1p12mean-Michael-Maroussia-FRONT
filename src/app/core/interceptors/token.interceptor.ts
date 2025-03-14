import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { catchError } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentUser = this.authService.currentUserValue;
    if (currentUser && currentUser.token) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${currentUser.token}` }
      });
    }
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Si l'utilisateur n'est pas autorisé, on peut le déconnecter ou le rediriger
          this.authService.logout();
          // Optionnel : rediriger vers la page de login
        }
        return throwError(error);
      })
    );
  }
}
