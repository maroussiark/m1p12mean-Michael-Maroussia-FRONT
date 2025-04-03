import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'https://m1p12mean-michael-maroussia-back.onrender.com/api';
//   private baseUrl = 'http://localhost:5000/api';

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) { }

  get<T>(endpoint: string): Observable<T> {
    this.loadingService.show();
    return this.http.get<T>(`${this.baseUrl}${endpoint}`).pipe(
      finalize(() => this.loadingService.hide())
    );
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    this.loadingService.show();
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, data).pipe(
      finalize(() => this.loadingService.hide())
    );
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    this.loadingService.show();
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, data).pipe(
      finalize(() => this.loadingService.hide())
    );
  }

  delete<T>(endpoint: string): Observable<T> {
    this.loadingService.show();
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`).pipe(
      finalize(() => this.loadingService.hide())
    );
  }

  patch<T>(endpoint: string, body: any): Observable<T> {
    this.loadingService.show();
    return this.http.patch<T>(`${this.baseUrl}${endpoint}`, body).pipe(
      finalize(() => this.loadingService.hide())
    );
  }

}
