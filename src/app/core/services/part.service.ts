import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Part } from '../models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class PartService {
  private baseUrl = '/parts'; // URL de base de l'API pour les pièces

  constructor(private http: ApiService) { }

  // Récupère la liste de toutes les pièces
  getParts(): Observable<Part[]> {
    return this.http.get<Part[]>(this.baseUrl);
  }

  // Récupère une pièce par son identifiant
  getPartById(id: string): Observable<Part> {
    return this.http.get<Part>(`${this.baseUrl}/${id}`);
  }

  // Crée une nouvelle pièce
  createPart(part: Part): Observable<Part> {
    return this.http.post<Part>(this.baseUrl, part);
  }

  // Met à jour une pièce existante
  updatePart( part: Part): Observable<Part> {
    return this.http.put<Part>(`${this.baseUrl}/${part._id}`, part);
  }

  // Supprime une pièce par son identifiant
  deletePart(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
