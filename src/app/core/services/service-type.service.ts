import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceType } from '../models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceTypeService {

  private baseUrl = '/services'; // URL de base

  constructor(private http: ApiService) {}

  // 📌 Obtenir tous les types de service
  getAllServiceTypes(): Observable<ServiceType[]> {
    return this.http.get<ServiceType[]>(this.baseUrl);
  }

  // 📌 Obtenir un type de service par ID
  getServiceTypeById(id: string): Observable<ServiceType> {
    return this.http.get<ServiceType>(`${this.baseUrl}/${id}`);
  }

  // 📌 Créer un nouveau type de service
  createServiceType(serviceType: ServiceType): Observable<ServiceType> {
    return this.http.post<ServiceType>(this.baseUrl, serviceType);
  }

  // 📌 Mettre à jour un type de service existant
  updateServiceType(id: string, serviceType: ServiceType): Observable<ServiceType> {
    return this.http.put<ServiceType>(`${this.baseUrl}/${id}`, serviceType);
  }

  // 📌 Supprimer un type de service
  deleteServiceType(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
