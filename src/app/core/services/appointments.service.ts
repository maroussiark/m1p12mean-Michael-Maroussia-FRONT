import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from '../models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {

  private baseUrl = '/appointments'; // URL de base pour les requêtes

  constructor(private http: ApiService) {}

  // 📌 Créer un rendez-vous
  createAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.baseUrl}/`, appointment);
  }

  updateAppointment(appointment: Appointment): Observable<Appointment> {
    console.log(appointment);
    return this.http.put<Appointment>(`${this.baseUrl}/${appointment._id}`, appointment);
  }

  // 📌 Obtenir tous les rendez-vous d'un utilisateur (par ID utilisateur)
  getAppointmentsByUser(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.baseUrl}/user`);
  }

  getAppointmentsForMechanic(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.baseUrl}/mechanic`);
  }

  // 📌 Obtenir tous les rendez-vous
  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.baseUrl);
  }

  // 📌 Obtenir un rendez-vous par ID
  getAppointmentById(id: string): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.baseUrl}/${id}`);
  }

  // 📌 Assigner des mécaniciens à un rendez-vous
  assignMechanicsToAppointment(appointmentId: string, mechanics: string[]): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.baseUrl}/${appointmentId}/assign-mechanics`, { mechanics });
  }

  // 📌 Valider un rendez-vous
  validateAppointment(appointmentId: string): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.baseUrl}/${appointmentId}/validate`, {});
  }

  // 📌 Confirmer un rendez-vous
  confirmAppointment(appointmentId: string): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.baseUrl}/${appointmentId}/confirm`, {});
  }

  // 📌 Ajouter des pièces à un rendez-vous
  addPartsToAppointment(appointmentId: string, parts: any[]): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.baseUrl}/${appointmentId}/add-parts`, { parts });
  }

  // 📌 Compléter un rendez-vous
  completeAppointment(appointmentId: string): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.baseUrl}/${appointmentId}/complete`, {});
  }

  // 📌 Supprimer un rendez-vous
  deleteAppointment(appointmentId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${appointmentId}`);
  }
}
