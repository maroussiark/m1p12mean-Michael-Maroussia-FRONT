import { Component, OnInit } from '@angular/core';
import { Appointment } from '../../../core/models/appointment.model';

@Component({
  selector: 'app-appointments-list',
  templateUrl: './appointments-list.component.html',
  styleUrls: ['./appointments-list.component.scss'],
  standalone : false
})
export class AppointmentsListComponent implements OnInit {
  futureAppointments: Appointment[] = [];
  pastAppointments: Appointment[] = [];

  ngOnInit(): void {
    const now = new Date();

    // Exemple de rendez-vous futurs
    this.futureAppointments = [
      {
        id: 1,
        service: 'Réparation Mécanique',
        date: new Date(now.getTime() + 24 * 60 * 60 * 1000), // +1 jour
        time: '10:00',
        status: 'Programmé'
      },
      {
        id: 2,
        service: 'Entretien',
        date: new Date(now.getTime() + 48 * 60 * 60 * 1000), // +2 jours
        time: '14:00',
        status: 'Programmé'
      }
    ];

    // Exemple de rendez-vous passés
    this.pastAppointments = [
      {
        id: 3,
        service: 'Carrosserie',
        date: new Date(now.getTime() - 72 * 60 * 60 * 1000), // -3 jours
        time: '09:00',
        status: 'Effectué'
      },
      {
        id: 4,
        service: 'Réparation Mécanique',
        date: new Date(now.getTime() - 120 * 60 * 60 * 1000), // -5 jours
        time: '16:00',
        status: 'Annulé'
      }
    ];
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Programmé':
        return 'status-scheduled';
      case 'Effectué':
        return 'status-completed';
      case 'Annulé':
        return 'status-cancelled';
      default:
        return '';
    }
  }
}
