import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { ApiService } from './api.service';
import { LoadingService } from './loading.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private _isSignUp$ = new BehaviorSubject<boolean>(false);
  public isSignUp$ = this._isSignUp$.asObservable();

  constructor(private apiService: ApiService,private loadingService: LoadingService
  ) {
    const userFromStorage = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      userFromStorage ? JSON.parse(userFromStorage) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<User> {
    return this.apiService.post<User>('/auth/login', { email, password })
      .pipe(
        tap(user => {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        })
      );
  }

  logout(): void {
    this.loadingService.show();
    // Supprimer l'utilisateur et le token du localStorage
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.loadingService.hide();
  }

  setSignUp(isSignUp: boolean): void {
    this._isSignUp$.next(isSignUp);
  }

  register(user: User): Observable<any> {
    return this.apiService.post(`/auth/register`, {
      email: user.email,
      password: user.password,
      role: user.role,
      profile: {
        firstName: user.profile?.firstName,
        lastName: user.profile?.lastName,
        phoneNumber: user.profile?.phoneNumber
      },

    });
  }
}
