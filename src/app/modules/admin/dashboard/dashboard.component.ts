// dashboard.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';

interface CarService {
  id: number;
  type: string;
  vehicule: string;
  client: string;
  dateDebut: Date;
  dateFin: Date | null;
  statut: string;
  montant: number;
}

interface ChartData {
  labels: string[];
  datasets: any[];
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports:[CommonModule,TableModule,ChartModule,CardModule]
})
export class DashboardComponent implements OnInit {
  services: CarService[] = [];
  revenueData: ChartData;
  serviceTypeData: ChartData;
  statsCards = [
    { icon: 'pi pi-car', title: 'Véhicules en atelier', value: 12, color: 'bg-blue-500' },
    { icon: 'pi pi-calendar', title: 'Rendez-vous aujourd\'hui', value: 8, color: 'bg-green-500' },
    { icon: 'pi pi-check-circle', title: 'Services terminés', value: 24, color: 'bg-purple-500' },
    { icon: 'pi pi-money-bill', title: 'CA du mois', value: '24 500 €', color: 'bg-yellow-500' }
  ];

  constructor() {
    this.revenueData = {
      labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin'],
      datasets: [
        {
          label: 'Chiffre d\'affaires',
          data: [18500, 21300, 19800, 24500, 26700, 24200],
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1
        }
      ]
    };

    this.serviceTypeData = {
      labels: ['Révision', 'Réparation', 'Pneus', 'Carrosserie', 'Vidange'],
      datasets: [
        {
          data: [35, 25, 15, 15, 10],
          backgroundColor: [
            '#42A5F5',
            '#66BB6A',
            '#FFA726',
            '#26C6DA',
            '#7E57C2'
          ]
        }
      ]
    };
  }

  ngOnInit() {
    this.services = [
      {
        id: 1,
        type: 'Révision',
        vehicule: 'Renault Clio',
        client: 'Martin Dubois',
        dateDebut: new Date('2025-03-20'),
        dateFin: null,
        statut: 'En cours',
        montant: 180
      },
      {
        id: 2,
        type: 'Réparation',
        vehicule: 'Peugeot 308',
        client: 'Sophie Leroy',
        dateDebut: new Date('2025-03-22'),
        dateFin: null,
        statut: 'En cours',
        montant: 350
      },
      {
        id: 3,
        type: 'Vidange',
        vehicule: 'Citroën C3',
        client: 'Jean Petit',
        dateDebut: new Date('2025-03-19'),
        dateFin: new Date('2025-03-21'),
        statut: 'Terminé',
        montant: 90
      },
      {
        id: 4,
        type: 'Pneus',
        vehicule: 'Audi A3',
        client: 'Claire Martin',
        dateDebut: new Date('2025-03-22'),
        dateFin: new Date('2025-03-23'),
        statut: 'Terminé',
        montant: 420
      },
      {
        id: 5,
        type: 'Carrosserie',
        vehicule: 'BMW Série 1',
        client: 'Thomas Bernard',
        dateDebut: new Date('2025-03-18'),
        dateFin: null,
        statut: 'En attente pièces',
        montant: 980
      }
    ];
  }

  getStatutClass(statut: string): string {
    switch(statut) {
      case 'En cours':
        return 'bg-blue-100 text-blue-800';
      case 'Terminé':
        return 'bg-green-100 text-green-800';
      case 'En attente pièces':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
