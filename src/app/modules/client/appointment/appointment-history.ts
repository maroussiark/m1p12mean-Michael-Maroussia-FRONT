// appointment-history.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';

interface Intervention {
  description: string;
  piecesRemplacees: string;
  dureeOperation: number;
  tempsPasse: number;
  difficultesRencontrees: string[];
  autresDifficultes?: string;
  recommendationsClient?: string;
}

interface Appointment {
  id: number;
  car: {
    immatriculation: string;
    marque: string;
    modele: string;
  };
  date: Date;
  type: string;
  statut: 'Terminé' | 'En cours' | 'Annulé';
  intervention?: Intervention;
}

@Component({
  selector: 'app-appointment-history',
  imports:[TableModule,CommonModule,ButtonModule,DialogModule],
  template: `
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-6">Historique des Rendez-vous</h1>

      <p-table
        [value]="appointments"
        [paginator]="true"
        [rows]="10"
        [responsive]="true"
        class="shadow-md rounded-lg"
      >
        <ng-template pTemplate="header">
          <tr>
            <th>Immatriculation</th>
            <th>Marque/Modèle</th>
            <th>Date</th>
            <th>Type</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-appointment>
          <tr>
            <td>{{ appointment.car.immatriculation }}</td>
            <td>{{ appointment.car.marque }} {{ appointment.car.modele }}</td>
            <td>{{ appointment.date | date:'dd/MM/yyyy HH:mm' }}</td>
            <td>{{ appointment.type }}</td>
            <td>
              <span
                [ngClass]="{
                  'text-green-600': appointment.statut === 'Terminé',
                  'text-yellow-600': appointment.statut === 'En cours',
                  'text-red-600': appointment.statut === 'Annulé'
                }"
              >
                {{ appointment.statut }}
              </span>
            </td>
            <td>
              <p-button
                icon="pi pi-eye"
                (click)="voirDetails(appointment)"
                styleClass="p-button-info p-button-text"
              ></p-button>
            </td>
          </tr>
        </ng-template>
      </p-table>

      <p-dialog
        [(visible)]="afficherDetails"
        [modal]="true"
        [header]="'Détails du Rendez-vous'"
        [style]="{width: '600px'}"
      >
        <ng-container *ngIf="rendezVousCourant">
          <div class="grid gap-4">
            <div class="font-bold text-xl">Informations du Véhicule</div>
            <div>Véhicule : {{ rendezVousCourant.car.marque }} {{ rendezVousCourant.car.modele }}</div>
            <div>Immatriculation : {{ rendezVousCourant.car.immatriculation }}</div>
            <div>Date : {{ rendezVousCourant.date | date:'full' }}</div>
            <div>Type : {{ rendezVousCourant.type }}</div>
            <div>
              Statut :
              <span
                [ngClass]="{
                  'text-green-600': rendezVousCourant.statut === 'Terminé',
                  'text-yellow-600': rendezVousCourant.statut === 'En cours',
                  'text-red-600': rendezVousCourant.statut === 'Annulé'
                }"
              >
                {{ rendezVousCourant.statut }}
              </span>
            </div>

            <ng-container *ngIf="rendezVousCourant.intervention">
              <div class="font-bold text-xl mt-4">Détails de l'Intervention</div>
              <div>
                <strong>Description :</strong>
                {{ rendezVousCourant.intervention.description || 'Non renseigné' }}
              </div>
              <div>
                <strong>Pièces remplacées :</strong>
                {{ rendezVousCourant.intervention.piecesRemplacees || 'Aucune' }}
              </div>
              <div>
                <strong>Durée de l'opération :</strong>
                {{ rendezVousCourant.intervention.dureeOperation }} min
              </div>
              <div>
                <strong>Temps passé :</strong>
                {{ rendezVousCourant.intervention.tempsPasse }} heures
              </div>
              <div *ngIf="rendezVousCourant.intervention.difficultesRencontrees?.length">
                <strong>Difficultés rencontrées :</strong>
                <ul>
                  <li *ngFor="let difficulte of rendezVousCourant.intervention.difficultesRencontrees">
                    {{ difficulte }}
                  </li>
                </ul>
              </div>
              <div *ngIf="rendezVousCourant.intervention.autresDifficultes">
                <strong>Autres difficultés :</strong>
                {{ rendezVousCourant.intervention.autresDifficultes }}
              </div>
              <div *ngIf="rendezVousCourant.intervention.recommendationsClient">
                <strong>Recommandations pour le client :</strong>
                {{ rendezVousCourant.intervention.recommendationsClient }}
              </div>
            </ng-container>
          </div>
        </ng-container>
      </p-dialog>
    </div>
  `
})
export class AppointmentHistoryComponent implements OnInit {
  appointments: Appointment[] = [];
  afficherDetails = false;
  rendezVousCourant: Appointment | null = null;

  constructor() {}

  ngOnInit() {
    this.chargerRendezVous();
  }

  chargerRendezVous() {
    // Remplacer par l'appel de service réel
    this.appointments = [
      {
        id: 1,
        car: {
          immatriculation: 'AB-123-CD',
          marque: 'Renault',
          modele: 'Clio'
        },
        date: new Date(),
        type: 'Révision',
        statut: 'Terminé',
        intervention: {
          description: 'Révision périodique complète',
          piecesRemplacees: 'Filtre à huile, Filtre à air',
          dureeOperation: 120,
          tempsPasse: 2,
          difficultesRencontrees: [
            'Accès difficile au filtre à huile',
            'Vis de vidange légèrement grippée'
          ],
          autresDifficultes: 'Aucune difficulté majeure',
          recommendationsClient: 'Prévoir un changement des plaquettes de frein avant le prochain entretien'
        }
      },
      // Ajouter plus de rendez-vous de test
    ];
  }

  voirDetails(appointment: Appointment) {
    this.rendezVousCourant = appointment;
    this.afficherDetails = true;
  }
}
