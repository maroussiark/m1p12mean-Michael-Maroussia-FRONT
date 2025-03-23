import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { MessageService } from 'primeng/api';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private userService: UserService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) {
        this.router.navigate(['/auth']);
        this.messageService.add({
          severity: 'warn',
          summary: 'Veuillez vous connecter',
          detail: 'Veuillez vous connecter d\'abord'
        });
        return false;
      }

      if (route.data['role'] && !this.userService.hasRequiredRole(route.data['role'])) {
        this.router.navigate(['/auth/not-authorized']);
        this.messageService.add({
          severity: 'warn',
          summary: 'Accès refusé',
          detail: 'Vous n\'avez pas les droits nécessaires pour accéder à cette page'
        });
        return false;
      }

      return true;
  }
}
