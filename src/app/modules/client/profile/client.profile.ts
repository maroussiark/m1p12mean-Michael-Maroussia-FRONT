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
import { SelectModule } from 'primeng/select';

// Import the new models
import { User, UserRole } from '../../../core/models/user.model';
import { Vehicle } from '../../../core/models/vehicle.model';

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
    ToastModule,
    SelectModule
  ],
  providers: [MessageService],
  template: `
    <div class="w-full p-4">
      <!-- Profile Section -->
      <div class="flex flex-col md:flex-row gap-6 mb-8">
        <!-- Client Profile Card -->
        <div class="w-full md:w-1/3 bg-white rounded-lg shadow-md p-6">
          <div class="flex flex-col items-center text-center mb-4">
            <p-avatar
              [image]="'assets/default-avatar.png'"
              size="xlarge"
              shape="circle"
              class="mb-4"
              [style]="{'width': '120px', 'height': '120px'}"
            ></p-avatar>
            <h2 class="text-2xl font-bold text-gray-800">
              {{user.profile?.firstName || 'N/A'}} {{user.profile?.lastName || ''}}
            </h2>
            <p class="text-sm text-gray-500">
              Client depuis {{user.createdAt ? (user.createdAt | date:'MMMM yyyy') : 'Date inconnue'}}
            </p>
          </div>

          <div class="divide-y divide-gray-200">
            <div class="py-3 flex justify-between">
              <span class="text-gray-600 font-medium">Email</span>
              <span class="text-gray-800">{{user.email}}</span>
            </div>
            <div class="py-3 flex justify-between">
              <span class="text-gray-600 font-medium">Téléphone</span>
              <span class="text-gray-800">{{user.profile?.phoneNumber || 'Non renseigné'}}</span>
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

        <!-- Vehicle Overview -->
        <div class="w-full md:w-2/3 bg-white rounded-lg shadow-md p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-gray-800">Mes Véhicules</h2>
            <span class="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm font-medium">
              {{vehicles.length}} véhicule(s)
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div *ngFor="let vehicle of vehicles.slice(0, 3)" class="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-bold text-gray-800">{{vehicle.make}} {{vehicle.model}}</h3>
                <p-tag
                  [value]="getVehicleStatus(vehicle)"
                  [severity]="getStatusSeverity(getVehicleStatus(vehicle))"
                ></p-tag>
              </div>
              <p class="text-sm text-gray-600 mb-1">
                {{vehicle.year}} | {{vehicle.licensePlate}}
              </p>
              <p class="text-xs text-gray-500">
                Dernier entretien:
                {{vehicle.technicalDetails.lastMaintenanceDate ? (vehicle.technicalDetails.lastMaintenanceDate | date) : 'N/A'}}
              </p>
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

      <!-- Full Vehicle List -->
      <div id="vehicle-list" class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-gray-800">Liste Détaillée des Véhicules</h2>
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
              <th>Km</th>
              <th>Dernier Entretien</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-vehicle>
            <tr>
              <td>{{vehicle.make}} {{vehicle.model}}</td>
              <td>{{vehicle.year}}</td>
              <td>{{vehicle.licensePlate}}</td>
              <td>{{vehicle.technicalDetails.mileage}} km</td>
              <td>{{vehicle.technicalDetails.lastMaintenanceDate ? (vehicle.technicalDetails.lastMaintenanceDate | date) : 'N/A'}}</td>
              <td>
                <p-tag
                  [value]="getVehicleStatus(vehicle)"
                  [severity]="getStatusSeverity(getVehicleStatus(vehicle))"
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
              <td colspan="7" class="text-center p-4">
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

    <!-- Edit Profile Dialog -->
    <p-dialog
      [(visible)]="editProfileVisible"
      header="Modifier Profil"
      [modal]="true"
      [style]="{width: '90%', maxWidth: '500px'}"
      [breakpoints]="{'768px': '95vw'}"
    >
      <div class="grid grid-cols-1 gap-4">
        <div class="flex flex-col">
          <label for="firstName" class="mb-1 text-sm font-medium text-gray-700">Prénom</label>
          <input
            pInputText
            id="firstName"
            [(ngModel)]="editedUser.profile!.firstName"
            class="w-full"
          />
        </div>
        <div class="flex flex-col">
          <label for="lastName" class="mb-1 text-sm font-medium text-gray-700">Nom</label>
          <input
            pInputText
            id="lastName"
            [(ngModel)]="editedUser.profile!.lastName"
            class="w-full"
          />
        </div>
        <div class="flex flex-col">
          <label for="phoneNumber" class="mb-1 text-sm font-medium text-gray-700">Téléphone</label>
          <input
            pInputText
            id="phoneNumber"
            [(ngModel)]="editedUser.profile!.phoneNumber"
            class="w-full"
          />
        </div>
      </div>
      <ng-template pTemplate="footer">
        <button pButton label="Annuler" icon="pi pi-times" class="p-button-text" (click)="editProfileVisible = false"></button>
        <button pButton label="Enregistrer" icon="pi pi-check" class="p-button-primary" (click)="saveProfile()"></button>
      </ng-template>
    </p-dialog>

    <!-- Add/Edit Vehicle Dialog -->
    <p-dialog
      [(visible)]="vehicleDialogVisible"
      [header]="editedVehicle._id ? 'Modifier Véhicule' : 'Ajouter Véhicule'"
      [modal]="true"
      [style]="{width: '90%', maxWidth: '500px'}"
      [breakpoints]="{'768px': '95vw'}"
    >
      <div class="grid grid-cols-1 gap-4">
        <div class="flex flex-col">
          <label for="make" class="mb-1 text-sm font-medium text-gray-700">Marque</label>
          <input
            pInputText
            id="make"
            [(ngModel)]="editedVehicle.make"
            class="w-full"
          />
        </div>
        <div class="flex flex-col">
          <label for="model" class="mb-1 text-sm font-medium text-gray-700">Modèle</label>
          <input
            pInputText
            id="model"
            [(ngModel)]="editedVehicle.model"
            class="w-full"
          />
        </div>
        <div class="flex flex-col">
          <label for="year" class="mb-1 text-sm font-medium text-gray-700">Année</label>
          <input
            pInputText
            id="year"
            [(ngModel)]="editedVehicle.year"
            type="number"
            class="w-full"
          />
        </div>
        <div class="flex flex-col">
          <label for="licensePlate" class="mb-1 text-sm font-medium text-gray-700">Immatriculation</label>
          <input
            pInputText
            id="licensePlate"
            [(ngModel)]="editedVehicle.licensePlate"
            class="w-full"
          />
        </div>
        <div class="flex flex-col">
            <label for="fuelType" class="mb-1 text-sm font-medium text-gray-700">Type de Carburant</label>
            <p-select
                id="fuelType"
                [options]="fuelTypeOptions"
                [(ngModel)]="editedVehicle.technicalDetails.fuelType"
                optionLabel="label"
                optionValue="value"
                placeholder="Sélectionnez un type de carburant"
                class="w-full"
            />
        </div>
        <div class="flex flex-col">
          <label for="mileage" class="mb-1 text-sm font-medium text-gray-700">Kilométrage</label>
          <input
            pInputText
            id="mileage"
            [(ngModel)]="editedVehicle.technicalDetails.mileage"
            type="number"
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
export class ClientProfileComponent implements OnInit {

  fuelTypeOptions = [
    { label: 'Essence', value: 'Essence' },
    { label: 'Diesel', value: 'Diesel' },
    { label: 'Hybride', value: 'Hybride' },
    { label: 'Électrique', value: 'Électrique' },
    { label: 'GPL', value: 'GPL' }
  ];
  // Initial mock user data
  user: User = {
    _id: '1',
    email: 'jean.dupont@example.com',
    role: UserRole.CLIENT,
    profile: {
      firstName: 'Jean',
      lastName: 'Dupont',
      phoneNumber: '06 12 34 56 78'
    },
    createdAt: new Date('2022-05-15'),
    isActive: true
  };

  // Editable copy for profile dialog
  editedUser: User = {...this.user};
  editProfileVisible: boolean = false;

  // Initial mock vehicle data
  vehicles: Vehicle[] = [
    {
      _id: '1',
      userId: '1',
      make: 'Renault',
      model: 'Clio',
      year: 2018,
      licensePlate: 'AB-123-CD',
      technicalDetails: {
        mileage: 75000,
        fuelType: 'Essence',
        lastMaintenanceDate: new Date('2023-10-12')
      },
      maintenanceHistory: []
    },
    {
      _id: '2',
      userId: '1',
      make: 'Peugeot',
      model: '308',
      year: 2020,
      licensePlate: 'EF-456-GH',
      technicalDetails: {
        mileage: 45000,
        fuelType: 'Diesel',
        lastMaintenanceDate: new Date('2024-01-25')
      },
      maintenanceHistory: []
    }
  ];

  // Editable vehicle for dialog
  editedVehicle: Vehicle = this.initializeVehicle();
  vehicleDialogVisible: boolean = false;

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    // Here you would typically load real user and vehicle data from a service
  }

  initializeVehicle(): Vehicle {
    return {
      userId: this.user._id || '',
      make: '',
      model: '',
      year: new Date().getFullYear(),
      licensePlate: '',
      technicalDetails: {
        mileage: 0,
        fuelType: '',
        lastMaintenanceDate: undefined
      },
      maintenanceHistory: []
    };
  }

  getVehicleStatus(vehicle: Vehicle): string {
    // Simple logic to determine vehicle status
    const now = new Date();
    const lastMaintenance = vehicle.technicalDetails.lastMaintenanceDate;

    if (!lastMaintenance) return 'maintenance';

    const monthsSinceLastMaintenance = (now.getFullYear() - lastMaintenance.getFullYear()) * 12 +
      (now.getMonth() - lastMaintenance.getMonth());

    return monthsSinceLastMaintenance > 6 ? 'entretien' : 'actif';
  }

  getStatusSeverity(status: string): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | undefined {
    switch (status) {
      case 'actif': return 'success';
      case 'entretien': return 'warn';
      case 'maintenance': return 'info';
      default: return 'secondary';
    }
  }

  scrollToVehicleList(): void {
    document.getElementById('vehicle-list')?.scrollIntoView({behavior: 'smooth'});
  }

  showEditProfileDialog(): void {
    this.editedUser = JSON.parse(JSON.stringify(this.user));
    this.editProfileVisible = true;
  }

  saveProfile(): void {
    // In a real app, this would call a user service to update the profile
    this.user = JSON.parse(JSON.stringify(this.editedUser));
    this.editProfileVisible = false;
    this.messageService.add({
      severity: 'success',
      summary: 'Succès',
      detail: 'Profil mis à jour'
    });
  }

  showAddVehicleDialog(): void {
    this.editedVehicle = this.initializeVehicle();
    this.vehicleDialogVisible = true;
  }

  editVehicle(vehicle: Vehicle): void {
    this.editedVehicle = JSON.parse(JSON.stringify(vehicle));
    this.vehicleDialogVisible = true;
  }

  saveVehicle(): void {
    // In a real app, this would call a vehicle service to save/update
    if (this.editedVehicle._id) {
      // Update existing vehicle
      const index = this.vehicles.findIndex(v => v._id === this.editedVehicle._id);
      if (index !== -1) {
        this.vehicles[index] = JSON.parse(JSON.stringify(this.editedVehicle));
      }
      this.messageService.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Véhicule mis à jour'
      });
    } else {
      // Add new vehicle
      const newVehicle = JSON.parse(JSON.stringify(this.editedVehicle));
      newVehicle._id = (this.vehicles.length + 1).toString();
      newVehicle.technicalDetails.lastMaintenanceDate = new Date();
      this.vehicles.push(newVehicle);
      this.messageService.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Véhicule ajouté'
      });
    }

    this.vehicleDialogVisible = false;
  }

  deleteVehicle(vehicle: Vehicle): void {
    // In a real app, this would call a vehicle service to delete
    this.vehicles = this.vehicles.filter(v => v._id !== vehicle._id);
    this.messageService.add({
      severity: 'info',
      summary: 'Information',
      detail: 'Véhicule supprimé'
    });
  }

  scheduleService(vehicle: Vehicle): void {
    // Functionality to be implemented for scheduling maintenance
    this.messageService.add({
      severity: 'info',
      summary: 'Fonctionnalité à venir',
      detail: 'La planification d\'entretien sera bientôt disponible'
    });
  }
}
