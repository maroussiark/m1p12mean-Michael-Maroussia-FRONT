import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehicle,MaintenanceRecord } from '../models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private baseUrl = '/vehicles';  // URL de base pour les requêtes

  constructor(private http: ApiService) { }


  getAllVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.baseUrl}`);
  }

  // 📌 Obtenir tous les véhicules d'un utilisateur
  getVehiclesByUser(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.baseUrl}/user/`);
  }

  // 📌 Obtenir un véhicule par son ID
  getVehicleById(vehicleId: string): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.baseUrl}/${vehicleId}`);
  }

  // 📌 Créer un nouveau véhicule
  createVehicle(vehicle: Vehicle): Observable<Vehicle> {
    return this.http.post<Vehicle>(this.baseUrl, vehicle);
  }

  // 📌 Mettre à jour un véhicule
  updateVehicle(vehicleId: string, vehicle: Vehicle): Observable<Vehicle> {
    console.log("Updating ..",vehicle);
    return this.http.put<Vehicle>(`${this.baseUrl}/${vehicleId}`,vehicle);
  }

  // 📌 Supprimer un véhicule
  deleteVehicle(vehicleId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${vehicleId}`);
  }

  // 📌 Ajouter un enregistrement de maintenance à un véhicule
  addMaintenanceRecord(vehicleId: string, record: MaintenanceRecord): Observable<Vehicle> {
    return this.http.post<Vehicle>(`${this.baseUrl}/${vehicleId}/maintenance`, record);
  }
}
