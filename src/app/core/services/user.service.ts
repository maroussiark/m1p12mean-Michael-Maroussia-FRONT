import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private authService: AuthService) {}


  hasRequiredRole(expectedRoles: string[]): boolean {
    const currentUser = this.authService.currentUserValue;
    if (currentUser && currentUser.role) {
      return expectedRoles.some(role => currentUser.role.includes(role));
    }
    return false;
  }
}
