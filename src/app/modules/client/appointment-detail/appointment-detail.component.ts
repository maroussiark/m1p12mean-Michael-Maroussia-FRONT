import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Appointment } from '../../../core/models/appointment.model';

@Component({
  selector: 'app-appointment-detail',
  templateUrl: './appointment-detail.component.html',
  styleUrls: ['./appointment-detail.component.scss'],
  standalone : false
})
export class AppointmentDetailComponent implements OnInit {
  appointment!: Appointment;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Récupérer l'id depuis les paramètres de la route (à partir d'un vrai service en production)
    const appointmentId = +this.route.snapshot.paramMap.get('id')!;

    // Exemple statique pour démonstration (à remplacer par une récupération API)
    this.appointment = {
      id: appointmentId,
      service: 'Réparation Mécanique',
      date: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // rendez-vous pour demain
      time: '10:00',
      status: 'Programmé',
      additionalDetails: 'Changement de plaquettes, vérification des freins et vidange.'
    };
  }
}
