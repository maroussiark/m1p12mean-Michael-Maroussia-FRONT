import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      // L'utilisateur est connecté
      return true;
    } else {
      // Sinon redirection vers la page de login avec returnUrl
      this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }
}
