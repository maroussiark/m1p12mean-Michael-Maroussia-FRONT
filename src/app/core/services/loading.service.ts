import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);

  // Observable pour suivre l'état de chargement
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  // Méthode pour démarrer le chargement
  show() {
    this.loadingSubject.next(true);
  }

  // Méthode pour arrêter le chargement
  hide() {
    this.loadingSubject.next(false);
  }

  // Méthode pour définir un état de chargement spécifique
  setLoading(isLoading: boolean) {
    this.loadingSubject.next(isLoading);
  }
}
