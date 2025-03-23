// mecanicien-dashboard.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Calendar } from 'primeng/calendar';
import { DatePicker, DatePickerModule } from 'primeng/datepicker';
import { ProgressBarModule } from 'primeng/progressbar';
import { Table, TableModule } from 'primeng/table';

interface Rendezvous {
  heure: string;
  client: string;
  vehicule: string;
  service: string;
  statut: 'terminé' | 'en cours' | 'à venir' | 'urgent';
}

interface Intervention {
  vehicule: string;
  client: string;
  service: string;
  debut: string;
  dureeEstimee: string;
  progression: number;
  type: 'primary' | 'warning' | 'info';
}

interface CommandePiece {
  nom: string;
  statut: 'en attente' | 'livrée' | 'en transit' | 'urgente';
  datelivraison: string;
}

@Component({
  selector: 'app-mechanic-dashboard',
  templateUrl: './mechanic-dashboard.component.html',
  styleUrls: ['./mechanic-dashboard.component.scss'],
  imports:[DatePickerModule,TableModule,ProgressBarModule,CommonModule]
})
export class MechanicDashboardComponent implements OnInit {

  rendezvous: Rendezvous[] = [];
  interventions: Intervention[] = [];
  commandesPieces: CommandePiece[] = [];

  statistiques = {
    rendezvousAujourdhui: 5,
    interventionsTerminees: 12,
    interventionsEnCours: 3,
    urgences: 1
  };

  constructor() { }

  ngOnInit(): void {
    this.loadRendezvous();
    this.loadInterventions();
    this.loadCommandesPieces();
  }

  loadRendezvous(): void {
    // Simuler le chargement des données depuis un service
    this.rendezvous = [
      { heure: '08:30', client: 'Martin Legrand', vehicule: 'Peugeot 308', service: 'Révision', statut: 'terminé' },
      { heure: '10:00', client: 'Sophie Laurent', vehicule: 'Renault Clio', service: 'Changement plaquettes', statut: 'en cours' },
      { heure: '13:30', client: 'Jean Dubois', vehicule: 'Citroën C3', service: 'Diagnostic', statut: 'à venir' },
      { heure: '15:00', client: 'Marie Petit', vehicule: 'Audi A3', service: 'Vidange', statut: 'à venir' },
      { heure: '17:00', client: 'Pierre Martin', vehicule: 'BMW Serie 1', service: 'Changement pneus', statut: 'urgent' }
    ];
  }

  loadInterventions(): void {
    this.interventions = [
      {
        vehicule: 'Renault Clio',
        client: 'Sophie Laurent',
        service: 'Changement plaquettes de frein',
        debut: '10:15',
        dureeEstimee: '1h30',
        progression: 65,
        type: 'primary'
      },
      {
        vehicule: 'Volkswagen Golf',
        client: 'Philippe Moreau',
        service: 'Remplacement alternateur',
        debut: '09:30',
        dureeEstimee: '2h45',
        progression: 85,
        type: 'warning'
      },
      {
        vehicule: 'Ford Focus',
        client: 'Thomas Bernard',
        service: 'Diagnostic électronique',
        debut: '11:45',
        dureeEstimee: '1h00',
        progression: 40,
        type: 'info'
      }
    ];
  }

  loadCommandesPieces(): void {
    this.commandesPieces = [
      { nom: 'Plaquettes de frein Bosch', statut: 'en attente', datelivraison: '22/03' },
      { nom: 'Huile moteur Total 5W40', statut: 'livrée', datelivraison: '20/03' },
      { nom: 'Filtre à air Mann', statut: 'en transit', datelivraison: '23/03' },
      { nom: 'Alternateur Valeo', statut: 'urgente', datelivraison: '21/03' }
    ];
  }

  getStatutClass(statut: string): string {
    switch(statut) {
      case 'terminé':
        return 'bg-green-100 text-green-800';
      case 'en cours':
        return 'bg-blue-100 text-blue-800';
      case 'à venir':
        return 'bg-gray-100 text-gray-800';
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'en attente':
        return 'bg-amber-100 text-amber-800';
      case 'livrée':
        return 'bg-green-100 text-green-800';
      case 'en transit':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getProgressBarClass(type: string): string {
    switch(type) {
      case 'primary':
        return 'bg-blue-600';
      case 'warning':
        return 'bg-yellow-500';
      case 'info':
        return 'bg-indigo-500';
      default:
        return 'bg-blue-600';
    }
  }

  getBorderClass(type: string): string {
    switch(type) {
      case 'primary':
        return 'border-blue-500 bg-blue-50';
      case 'warning':
        return 'border-yellow-500 bg-yellow-50';
      case 'info':
        return 'border-indigo-500 bg-indigo-50';
      default:
        return 'border-blue-500 bg-blue-50';
    }
  }
}
