import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
    private endpoint = '/users';
  constructor(private authService: AuthService,private apiService : ApiService) {}

  hasRequiredRole(expectedRoles: string[]): boolean {
    const currentUser = this.authService.currentUserValue;
    if (currentUser && currentUser.role) {
      return expectedRoles.some(role => currentUser.role.includes(role));
    }
    return false;
  }

  getAllUsers(): Observable<User[]> {
    return this.apiService.get<User[]>(this.endpoint);
  }

  createUser(user: User): Observable<User> {
    return this.apiService.post<User>(this.endpoint, user);
  }

  updateUser(user: User): Observable<User> {
    return this.apiService.put<User>(`${this.endpoint}/${user.id}`, user);
  }

  deleteUser(userId: string): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${userId}`);
  }

  getAllMechanics(): Observable<User[]> {
    return this.apiService.get<User[]>(`${this.endpoint}/mechanics`);
  }

  getAllClients(): Observable<User[]> {
    return this.apiService.get<User[]>(`${this.endpoint}/users`);
  }
}
