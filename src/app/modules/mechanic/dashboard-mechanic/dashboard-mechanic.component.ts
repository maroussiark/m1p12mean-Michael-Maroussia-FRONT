import { Component, OnInit } from '@angular/core';
import { Appointment } from '../../../core/models/appointment.model';

@Component({
  selector: 'app-mechanic-dashboard',
  templateUrl: './dashboard-mechanic.component.html',
  styleUrls: ['./dashboard-mechanic.component.scss'],
  standalone: false
})
export class DashboardMechanicComponent implements OnInit {
  assignedAppointments: Appointment[] = [];
  todaysInterventions: Appointment[] = [];

  ngOnInit(): void {
    const now = new Date();

    // Exemple de rendez-vous assignés (certains pour aujourd'hui, d'autres pour plus tard)
    this.assignedAppointments = [
      {
        id: 1,
        service: 'Réparation Mécanique - Freins',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0),
        time: '09:00',
        status: 'Assigné'
      },
      {
        id: 2,
        service: 'Entretien - Vidange',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 11, 30),
        time: '11:30',
        status: 'Assigné'
      },
      {
        id: 3,
        service: 'Réparation Mécanique - Suspension',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 14, 0),
        time: '14:00',
        status: 'Assigné'
      }
    ];

    // Filtrer les interventions prévues pour aujourd'hui
    const todayStr = now.toDateString();
    this.todaysInterventions = this.assignedAppointments.filter(app =>
      app.date.toDateString() === todayStr
    );
  }
}
