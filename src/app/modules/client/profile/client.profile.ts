import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

interface Vehicle {
  id: number;
  marque: string;
  modele: string;
  annee: number;
  immatriculation: string;
  dernierEntretien: Date;
  statut: 'actif' | 'entretien' | 'réparation';
}

interface Client {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  dateInscription: Date;
  photoUrl: string;
}

@Component({
  selector: 'app-client-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    CardModule,
    AvatarModule,
    TagModule,
    DialogModule,
    InputTextModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <div class="w-full p-4">
      <!-- Section en-tête responsive -->
      <div class="flex flex-col md:flex-row gap-6 mb-8">
        <!-- Carte de profil client -->
        <div class="w-full md:w-1/3 bg-white rounded-lg shadow-md p-6">
          <div class="flex flex-col items-center text-center mb-4">
            <p-avatar
              [image]="client.photoUrl || 'assets/default-avatar.png'"
              size="xlarge"
              shape="circle"
              class="mb-4"
              [style]="{'width': '120px', 'height': '120px'}"
            ></p-avatar>
            <h2 class="text-2xl font-bold text-gray-800">{{client.prenom}} {{client.nom}}</h2>
            <p class="text-sm text-gray-500">Client depuis {{client.dateInscription | date:'MMMM yyyy'}}</p>
          </div>

          <div class="divide-y divide-gray-200">
            <div class="py-3 flex justify-between">
              <span class="text-gray-600 font-medium">Email</span>
              <span class="text-gray-800">{{client.email}}</span>
            </div>
            <div class="py-3 flex justify-between">
              <span class="text-gray-600 font-medium">Téléphone</span>
              <span class="text-gray-800">{{client.telephone}}</span>
            </div>
            <div class="py-3 flex justify-between">
              <span class="text-gray-600 font-medium">Adresse</span>
              <span class="text-gray-800">{{client.adresse}}</span>
            </div>
          </div>

          <div class="mt-6">
            <button
              pButton
              label="Modifier Profil"
              icon="pi pi-user-edit"
              class="p-button-outlined w-full"
              (click)="showEditProfileDialog()"
            ></button>
          </div>
        </div>

        <!-- Résumé des véhicules -->
        <div class="w-full md:w-2/3 bg-white rounded-lg shadow-md p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-gray-800">Aperçu des Véhicules</h2>
            <span class="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm font-medium">
              {{vehicles.length}} véhicule(s)
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div *ngFor="let vehicle of vehicles.slice(0, 3)" class="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-bold text-gray-800">{{vehicle.marque}} {{vehicle.modele}}</h3>
                <p-tag
                  [value]="vehicle.statut"
                  [severity]="getStatusSeverity(vehicle.statut)"
                ></p-tag>
              </div>
              <p class="text-sm text-gray-600 mb-1">{{vehicle.annee}} | {{vehicle.immatriculation}}</p>
              <p class="text-xs text-gray-500">Dernier entretien: {{vehicle.dernierEntretien | date}}</p>
            </div>
          </div>

          <div *ngIf="vehicles.length > 3" class="mt-4 text-center">
            <button
              pButton
              label="Voir tous les véhicules"
              icon="pi pi-chevron-down"
              class="p-button-text p-button-sm"
              (click)="scrollToVehicleList()"
            ></button>
          </div>
        </div>
      </div>

      <!-- Liste complète des véhicules -->
      <div id="vehicle-list" class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-gray-800">Mes Véhicules</h2>
          <button
            pButton
            label="Ajouter un véhicule"
            icon="pi pi-plus"
            class="p-button-success"
            (click)="showAddVehicleDialog()"
          ></button>
        </div>

        <p-table
          [value]="vehicles"
          [paginator]="true"
          [rows]="5"
          [responsive]="true"
          styleClass="p-datatable-sm"
          [rowHover]="true"
          responsiveLayout="stack"
          [breakpoint]="'768px'"
        >
          <ng-template pTemplate="header">
            <tr>
              <th>Marque/Modèle</th>
              <th>Année</th>
              <th>Immatriculation</th>
              <th>Dernier Entretien</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-vehicle>
            <tr>
              <td>
                <div class="font-medium">{{vehicle.marque}} {{vehicle.modele}}</div>
              </td>
              <td>
                {{vehicle.annee}}
              </td>
              <td>
                {{vehicle.immatriculation}}
              </td>
              <td>
                {{vehicle.dernierEntretien | date}}
              </td>
              <td>
                <p-tag
                  [value]="vehicle.statut"
                  [severity]="getStatusSeverity(vehicle.statut)"
                ></p-tag>
              </td>
              <td>
                <div class="flex gap-2">
                  <button
                    pButton
                    icon="pi pi-pencil"
                    class="p-button-rounded p-button-text p-button-sm"
                    (click)="editVehicle(vehicle)"
                  ></button>
                  <button
                    pButton
                    icon="pi pi-calendar-plus"
                    class="p-button-rounded p-button-text p-button-sm p-button-success"
                    pTooltip="Planifier un entretien"
                    (click)="scheduleService(vehicle)"
                  ></button>
                  <button
                    pButton
                    icon="pi pi-trash"
                    class="p-button-rounded p-button-text p-button-sm p-button-danger"
                    (click)="deleteVehicle(vehicle)"
                  ></button>
                </div>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="6" class="text-center p-4">
                <div class="text-gray-500">Aucun véhicule enregistré</div>
                <button
                  pButton
                  label="Ajouter mon premier véhicule"
                  icon="pi pi-plus"
                  class="p-button-outlined mt-3"
                  (click)="showAddVehicleDialog()"
                ></button>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </div>

    <!-- Modals -->
    <p-dialog
      [(visible)]="editProfileVisible"
      header="Modifier Profil"
      [modal]="true"
      [style]="{width: '90%', maxWidth: '500px'}"
      [breakpoints]="{'768px': '95vw'}"
    >
      <div class="grid grid-cols-1 gap-4">
        <div class="flex flex-col">
          <label for="prenom" class="mb-1 text-sm font-medium text-gray-700">Prénom</label>
          <input
            pInputText
            id="prenom"
            [(ngModel)]="editedClient.prenom"
            class="w-full"
          />
        </div>
        <div class="flex flex-col">
          <label for="nom" class="mb-1 text-sm font-medium text-gray-700">Nom</label>
          <input
            pInputText
            id="nom"
            [(ngModel)]="editedClient.nom"
            class="w-full"
          />
        </div>
        <div class="flex flex-col">
          <label for="email" class="mb-1 text-sm font-medium text-gray-700">Email</label>
          <input
            pInputText
            id="email"
            [(ngModel)]="editedClient.email"
            class="w-full"
          />
        </div>
        <div class="flex flex-col">
          <label for="telephone" class="mb-1 text-sm font-medium text-gray-700">Téléphone</label>
          <input
            pInputText
            id="telephone"
            [(ngModel)]="editedClient.telephone"
            class="w-full"
          />
        </div>
        <div class="flex flex-col">
          <label for="adresse" class="mb-1 text-sm font-medium text-gray-700">Adresse</label>
          <input
            pInputText
            id="adresse"
            [(ngModel)]="editedClient.adresse"
            class="w-full"
          />
        </div>
      </div>
      <ng-template pTemplate="footer">
        <button pButton label="Annuler" icon="pi pi-times" class="p-button-text" (click)="editProfileVisible = false"></button>
        <button pButton label="Enregistrer" icon="pi pi-check" class="p-button-primary" (click)="saveProfile()"></button>
      </ng-template>
    </p-dialog>

    <p-dialog
      [(visible)]="vehicleDialogVisible"
      [header]="editedVehicle.id ? 'Modifier Véhicule' : 'Ajouter Véhicule'"
      [modal]="true"
      [style]="{width: '90%', maxWidth: '500px'}"
      [breakpoints]="{'768px': '95vw'}"
    >
      <div class="grid grid-cols-1 gap-4">
        <div class="flex flex-col">
          <label for="marque" class="mb-1 text-sm font-medium text-gray-700">Marque</label>
          <input
            pInputText
            id="marque"
            [(ngModel)]="editedVehicle.marque"
            class="w-full"
          />
        </div>
        <div class="flex flex-col">
          <label for="modele" class="mb-1 text-sm font-medium text-gray-700">Modèle</label>
          <input
            pInputText
            id="modele"
            [(ngModel)]="editedVehicle.modele"
            class="w-full"
          />
        </div>
        <div class="flex flex-col">
          <label for="annee" class="mb-1 text-sm font-medium text-gray-700">Année</label>
          <input
            pInputText
            id="annee"
            [(ngModel)]="editedVehicle.annee"
            type="number"
            class="w-full"
          />
        </div>
        <div class="flex flex-col">
          <label for="immatriculation" class="mb-1 text-sm font-medium text-gray-700">Immatriculation</label>
          <input
            pInputText
            id="immatriculation"
            [(ngModel)]="editedVehicle.immatriculation"
            class="w-full"
          />
        </div>
      </div>
      <ng-template pTemplate="footer">
        <button pButton label="Annuler" icon="pi pi-times" class="p-button-text" (click)="vehicleDialogVisible = false"></button>
        <button pButton label="Enregistrer" icon="pi pi-check" class="p-button-primary" (click)="saveVehicle()"></button>
      </ng-template>
    </p-dialog>

    <p-toast></p-toast>
  `,
  styles: [`
    :host ::ng-deep .p-datatable-responsive .p-datatable-tbody > tr > td .p-column-title {
      display: none;
    }

    @media screen and (max-width: 768px) {
      :host ::ng-deep .p-datatable-responsive .p-datatable-tbody > tr > td {
        padding: 0.5rem;
        border: 0 none;
      }

      :host ::ng-deep .p-datatable-responsive .p-datatable-tbody > tr > td .p-column-title {
        display: inline-block;
        font-weight: bold;
        margin-right: 0.5rem;
        min-width: 30%;
      }

      :host ::ng-deep .p-datatable.p-datatable-responsive .p-datatable-thead > tr > th {
        display: none;
      }
    }
  `]
})
export class ClientProfile implements OnInit {
  client: Client = {
    id: 1,
    nom: 'Dupont',
    prenom: 'Jean',
    email: 'jean.dupont@example.com',
    telephone: '06 12 34 56 78',
    adresse: '123 Rue de la République, 75001 Paris',
    dateInscription: new Date('2022-05-15'),
    photoUrl: ''
  };

  editedClient: Client = {...this.client};
  editProfileVisible: boolean = false;

  vehicles: Vehicle[] = [
    {
      id: 1,
      marque: 'Renault',
      modele: 'Clio',
      annee: 2018,
      immatriculation: 'AB-123-CD',
      dernierEntretien: new Date('2023-10-12'),
      statut: 'actif'
    },
    {
      id: 2,
      marque: 'Peugeot',
      modele: '308',
      annee: 2020,
      immatriculation: 'EF-456-GH',
      dernierEntretien: new Date('2024-01-25'),
      statut: 'entretien'
    },
    {
      id: 3,
      marque: 'Citroën',
      modele: 'C4',
      annee: 2016,
      immatriculation: 'IJ-789-KL',
      dernierEntretien: new Date('2023-08-05'),
      statut: 'réparation'
    },
    {
      id: 4,
      marque: 'Volkswagen',
      modele: 'Golf',
      annee: 2019,
      immatriculation: 'MN-012-OP',
      dernierEntretien: new Date('2023-12-18'),
      statut: 'actif'
    }
  ];

  editedVehicle: Vehicle = this.initializeVehicle();
  vehicleDialogVisible: boolean = false;

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    // Ici, vous pourriez charger les données réelles du client et de ses véhicules
    // depuis un service backend
  }

  initializeVehicle(): Vehicle {
    return {
      id: 0,
      marque: '',
      modele: '',
      annee: new Date().getFullYear(),
      immatriculation: '',
      dernierEntretien: new Date(),
      statut: 'actif'
    };
  }

  getStatusSeverity(status: string): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | undefined {
    switch (status) {
      case 'actif': return 'success';
      case 'entretien': return 'info';
      case 'réparation': return 'warn';
      default: return 'info';
    }
  }

  scrollToVehicleList(): void {
    document.getElementById('vehicle-list')?.scrollIntoView({behavior: 'smooth'});
  }

  showEditProfileDialog(): void {
    this.editedClient = {...this.client};
    this.editProfileVisible = true;
  }

  saveProfile(): void {
    // Ici, vous devriez appeler un service pour sauvegarder les changements
    this.client = {...this.editedClient};
    this.editProfileVisible = false;
    this.messageService.add({severity: 'success', summary: 'Succès', detail: 'Profil mis à jour'});
  }

  showAddVehicleDialog(): void {
    this.editedVehicle = this.initializeVehicle();
    this.vehicleDialogVisible = true;
  }

  editVehicle(vehicle: Vehicle): void {
    this.editedVehicle = {...vehicle};
    this.vehicleDialogVisible = true;
  }

  saveVehicle(): void {
    // Ici, vous devriez appeler un service pour sauvegarder les changements
    if (this.editedVehicle.id) {
      // Mise à jour d'un véhicule existant
      const index = this.vehicles.findIndex(v => v.id === this.editedVehicle.id);
      if (index !== -1) {
        this.vehicles[index] = {...this.editedVehicle};
      }
      this.messageService.add({severity: 'success', summary: 'Succès', detail: 'Véhicule mis à jour'});
    } else {
      // Ajout d'un nouveau véhicule
      const newVehicle = {...this.editedVehicle};
      newVehicle.id = this.getNextVehicleId();
      newVehicle.dernierEntretien = new Date();
      this.vehicles.push(newVehicle);
      this.messageService.add({severity: 'success', summary: 'Succès', detail: 'Véhicule ajouté'});
    }

    this.vehicleDialogVisible = false;
  }

  getNextVehicleId(): number {
    return Math.max(0, ...this.vehicles.map(v => v.id)) + 1;
  }

  deleteVehicle(vehicle: Vehicle): void {
    // Ici, vous devriez ajouter une confirmation de suppression
    this.vehicles = this.vehicles.filter(v => v.id !== vehicle.id);
    this.messageService.add({severity: 'info', summary: 'Information', detail: 'Véhicule supprimé'});
  }

  scheduleService(vehicle: Vehicle): void {
    // Implémentation à venir pour planifier un entretien
    this.messageService.add({
      severity: 'info',
      summary: 'Fonctionnalité à venir',
      detail: 'La planification d\'entretien sera bientôt disponible'
    });
  }
}
