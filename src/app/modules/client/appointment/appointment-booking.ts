import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { StepsModule } from 'primeng/steps';
import { MenuItem } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

// Import des modèles partagés depuis '../../../core/models/'
import { Vehicle, ServiceType, Appointment, AppointmentStatus, AppointmentService, Part } from '../../../core/models';
// Si vous avez aussi l'interface Invoice et InvoiceStatus définis, importez-les
import { Invoice, InvoiceStatus,InvoiceItem } from '../../../core/models';
import { Tooltip, TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-appointment-booking',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    DropdownModule,
    ButtonModule,
    CardModule,
    StepsModule,
    InputTextModule,
    ToastModule,
    DialogModule,
    TableModule,
    TagModule,
    TooltipModule
  ],
  providers: [MessageService],
  template: `
<div class="w-full p-4">
  <!-- Onglets de navigation -->
  <div class="flex flex-col md:flex-row mb-6 bg-white rounded-lg shadow-md overflow-hidden">
    <button
      *ngFor="let tab of tabs; let i = index"
      (click)="activeTabIndex = i"
      class="py-4 px-6 text-center transition-colors duration-200 text-gray-700"
      [class.bg-blue-500]="activeTabIndex === i"
      [class.text-white]="activeTabIndex === i"
      [class.font-medium]="activeTabIndex === i"
    >
      <i [class]="tab.icon + ' mr-2'"></i>
      {{ tab.label }}
    </button>
  </div>

  <!-- Contenu selon l'onglet actif -->
  <div [ngSwitch]="activeTabIndex">
    <!-- Onglet Mes Rendez-vous -->
    <div *ngSwitchCase="0" class="bg-white rounded-lg shadow-md p-6">
      <p-table [value]="appointments" [paginator]="true" [rows]="5" responsiveLayout="stack">
        <ng-template pTemplate="header">
          <tr>
            <th>Date</th>
            <th>Heure</th>
            <th>Véhicule</th>
            <th>Services</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-appointment>
          <tr>
            <td>{{ appointment.startTime | date:'dd/MM/yyyy' }}</td>
            <td>{{ appointment.startTime | date:'HH:mm' }}</td>
            <td>{{ getVehicleDisplay(appointment.vehicleId) }}</td>
            <td>
              <div *ngFor="let s of appointment.services; let last = last">
                {{ getServiceName(s.serviceType) }}{{ !last ? ', ' : '' }}
              </div>
            </td>
            <td>
              <p-tag [value]="appointment.status" [severity]="getStatusSeverity(appointment.status)"></p-tag>
            </td>
            <td>
              <div class="flex gap-2">
                <button pButton icon="pi pi-calendar" class="p-button-rounded p-button-text p-button-sm" pTooltip="Détails" (click)="viewAppointmentDetails(appointment)"></button>
                <button
                  pButton
                  icon="pi pi-pencil"
                  class="p-button-rounded p-button-text p-button-sm"
                  pTooltip="Modifier"
                  [disabled]="appointment.status === AppointmentStatus.COMPLETED || appointment.status === AppointmentStatus.CANCELED"
                  (click)="editAppointment(appointment)"
                ></button>
                <button
                  pButton
                  icon="pi pi-times"
                  class="p-button-rounded p-button-text p-button-sm p-button-danger"
                  pTooltip="Annuler"
                  [disabled]="appointment.status === AppointmentStatus.COMPLETED || appointment.status === AppointmentStatus.CANCELED"
                  (click)="cancelAppointment(appointment)"
                ></button>
                <button
                  pButton
                  icon="pi pi-file"
                  class="p-button-rounded p-button-text p-button-sm"
                  pTooltip="Facture"
                  (click)="viewInvoiceDetails(appointment)"
                ></button>
              </div>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>

    <!-- Onglet Nouveau Rendez-vous -->
    <div *ngSwitchCase="1" class="bg-white rounded-lg shadow-md p-6">
      <!-- Formulaire et étapes (code inchangé par rapport à la version précédente) -->
      <p-steps [model]="steps" [activeIndex]="currentStep" [readonly]="false" (activeIndexChange)="onStepChange($event)" styleClass="mb-6"></p-steps>
      <form [formGroup]="appointmentForm">
        <div [ngSwitch]="currentStep" class="mt-6">
          <!-- Étape 1: Sélection du véhicule -->
          <div *ngSwitchCase="0" class="p-fluid">
            <h3 class="text-lg font-medium text-gray-700 mb-4">Sélectionnez un véhicule</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div
                *ngFor="let vehicle of vehicles"
                class="border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:bg-gray-50"
                [class.border-blue-500]="appointmentForm.get('vehicleId')?.value === vehicle._id"
                (click)="selectVehicle(vehicle._id!)"
              >
                <h4 class="font-bold text-gray-800">{{ vehicle.make }} {{ vehicle.model }}</h4>
                <p class="text-sm text-gray-600">{{ vehicle.year }} | {{ vehicle.licensePlate }}</p>
              </div>
            </div>
            <div class="flex justify-end mt-4">
              <button pButton label="Continuer" icon="pi pi-arrow-right" iconPos="right" [disabled]="!appointmentForm.get('vehicleId')?.valid" (click)="nextStep()"></button>
            </div>
          </div>

          <!-- Étape 2: Sélection du service -->
          <div *ngSwitchCase="1" class="p-fluid">
            <h3 class="text-lg font-medium text-gray-700 mb-4">Sélectionnez un ou plusieurs services</h3>
            <div class="mb-3 bg-blue-50 border border-blue-200 p-3 rounded-lg">
              <p class="text-blue-700 text-sm">
                <i class="pi pi-info-circle mr-2"></i>
                Sélectionnez autant de services que nécessaire.
              </p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div
                *ngFor="let service of serviceTypes"
                class="border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:bg-gray-50"
                [class.border-blue-500]="isServiceSelected(service._id!)"
                [class.bg-blue-50]="isServiceSelected(service._id!)"
                (click)="selectService(service._id!)"
              >
                <div class="flex justify-between items-start">
                  <h4 class="font-bold text-gray-800 mb-1">{{ service.name }}</h4>
                  <i *ngIf="isServiceSelected(service._id!)" class="pi pi-check-circle text-blue-500"></i>
                </div>
                <p class="text-sm text-gray-600 mb-2">{{ service.description }}</p>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500">Durée: {{ service.defaultDuration }} min</span>
                  <span class="font-medium">€{{ service.baseCost }}</span>
                </div>
              </div>
            </div>
            <div class="flex justify-between mt-4">
              <button pButton label="Retour" icon="pi pi-arrow-left" class="p-button-outlined" (click)="prevStep()"></button>
              <button pButton label="Continuer" icon="pi pi-arrow-right" iconPos="right" [disabled]="!appointmentForm.get('selectedServices')?.value?.length" (click)="nextStep()"></button>
            </div>
          </div>

          <!-- Étape 3: Sélection de la date et de l'heure -->
          <div *ngSwitchCase="2" class="p-fluid">
            <h3 class="text-lg font-medium text-gray-700 mb-4">Choisissez une date et une heure</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="flex flex-col">
                <label for="date" class="mb-2 text-sm font-medium text-gray-700">Date</label>
                <p-calendar
                  id="date"
                  formControlName="date"
                  [showIcon]="true"
                  [minDate]="minDate"
                  [disabledDates]="disabledDates"
                  [disabledDays]="[0]"
                  (onSelect)="onDateSelect($event)"
                  [style]="{ width: '100%' }"
                ></p-calendar>
                <small *ngIf="appointmentForm.get('date')?.invalid && appointmentForm.get('date')?.touched" class="text-red-500 mt-1">Veuillez sélectionner une date</small>
              </div>
              <div class="flex flex-col">
                <label class="mb-2 text-sm font-medium text-gray-700">Heure disponible</label>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    *ngFor="let slot of timeSlots"
                    type="button"
                    class="p-2 text-center border rounded-md transition-colors duration-200"
                    [class.bg-blue-500]="appointmentForm.get('timeSlotId')?.value === slot.id"
                    [class.text-white]="appointmentForm.get('timeSlotId')?.value === slot.id"
                    [class.opacity-50]="!slot.available"
                    [disabled]="!slot.available"
                    (click)="selectTimeSlot(slot.id)"
                  >
                    {{ slot.time }}
                  </button>
                </div>
                <small *ngIf="appointmentForm.get('timeSlotId')?.invalid && appointmentForm.get('timeSlotId')?.touched" class="text-red-500 mt-1">Veuillez sélectionner une heure</small>
              </div>
            </div>
            <div class="field col-span-full mt-6">
              <label for="notes" class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea pInputTextarea id="notes" formControlName="notes" rows="3" class="w-full border rounded p-2"></textarea>
            </div>
            <div class="flex justify-between mt-4">
              <button pButton label="Retour" icon="pi pi-arrow-left" class="p-button-outlined" (click)="prevStep()"></button>
              <button pButton label="Continuer" icon="pi pi-arrow-right" iconPos="right" [disabled]="!appointmentForm.get('date')?.valid || !appointmentForm.get('timeSlotId')?.valid" (click)="nextStep()"></button>
            </div>
          </div>

          <!-- Étape 4: Récapitulatif et confirmation -->
          <div *ngSwitchCase="3" class="p-fluid">
            <h3 class="text-lg font-medium text-gray-700 mb-4">Récapitulatif de votre rendez-vous</h3>
            <div class="bg-gray-50 border rounded-lg p-6 mb-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                <div>
                  <h4 class="text-sm font-medium text-gray-500 mb-1">Véhicule</h4>
                  <p class="font-medium text-gray-800">{{ getVehicleDisplay(appointmentForm.get('vehicleId')?.value) }}</p>
                </div>
                <div>
                  <h4 class="text-sm font-medium text-gray-500 mb-1">Services</h4>
                  <div *ngFor="let service of getSelectedServicesInfo()" class="font-medium text-gray-800 mb-1">
                    <p>
                      {{ service.name }} <span class="text-gray-500 font-normal">({{ service.defaultDuration }} min - €{{ service.baseCost }})</span>
                    </p>
                  </div>
                </div>
                <div>
                  <h4 class="text-sm font-medium text-gray-500 mb-1">Date</h4>
                  <p class="font-medium text-gray-800">{{ appointmentForm.get('date')?.value | date:'EEEE d MMMM yyyy' }}</p>
                </div>
                <div>
                  <h4 class="text-sm font-medium text-gray-500 mb-1">Heure</h4>
                  <p class="font-medium text-gray-800">{{ getSelectedTimeSlot()?.time }}</p>
                </div>
                <div *ngIf="appointmentForm.get('notes')?.value" class="col-span-full">
                  <h4 class="text-sm font-medium text-gray-500 mb-1">Notes</h4>
                  <p class="text-gray-800">{{ appointmentForm.get('notes')?.value }}</p>
                </div>
                <div class="col-span-full mt-2">
                  <h4 class="text-sm font-medium text-gray-500 mb-1">Durée estimée</h4>
                  <p class="font-medium text-gray-800">{{ calculateTotalDuration() }} minutes</p>
                </div>
                <div class="col-span-full mt-2">
                  <h4 class="text-sm font-medium text-gray-500 mb-1">Prix estimé</h4>
                  <p class="text-xl font-bold text-blue-600">€{{ calculateTotalPrice() }}</p>
                  <p class="text-xs text-gray-500 mt-1">*Prix indicatif, le montant final peut varier</p>
                </div>
              </div>
            </div>
            <div class="flex justify-between mt-4">
              <button pButton label="Retour" icon="pi pi-arrow-left" class="p-button-outlined" (click)="prevStep()"></button>
              <button pButton label="Confirmer le rendez-vous" icon="pi pi-check" class="p-button-success" (click)="submitAppointment()"></button>
            </div>
          </div>
        </div>
      </form>
    </div>

    <!-- Onglet Historique -->
    <div *ngSwitchCase="2" class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-bold text-gray-800 mb-6">Historique des Services</h2>
      <!-- Tableau des véhicules avec row expansion pour afficher leurs rendez-vous anciens -->
      <p-table [value]="getVehiclesWithOldAppointments()" dataKey="_id" responsiveLayout="stack">
        <ng-template pTemplate="header">
          <tr>
            <th>Véhicule</th>
            <th>Immatriculation</th>
            <th>Modèle</th>
            <th>Année</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-vehicle>
          <tr>
            <td>
              <a  (click)="toggleRow(vehicle)">
                <i class="pi" [ngClass]="{'pi-chevron-down': isRowExpanded(vehicle), 'pi-chevron-right': !isRowExpanded(vehicle)}"></i>
                {{ vehicle.make }} {{ vehicle.model }}
              </a>
            </td>
            <td>{{ vehicle.licensePlate }}</td>
            <td>{{ vehicle.model }}</td>
            <td>{{ vehicle.year }}</td>
          </tr>
          <tr *ngIf="isRowExpanded(vehicle)">
            <td colspan="4">
              <p-table [value]="getAppointmentsByVehicle(vehicle._id)" responsiveLayout="stack">
                <ng-template pTemplate="header">
                  <tr>
                    <th>Date</th>
                    <th>Heure</th>
                    <th>Mécaniciens</th>
                    <th>Services / Pièces</th>
                    <th>Options</th>
                  </tr>
                </ng-template>
                <ng-template pTemplate="body" let-appointment>
                  <tr>
                    <td>{{ appointment.startTime | date:'dd/MM/yyyy' }}</td>
                    <td>{{ appointment.startTime | date:'HH:mm' }}</td>
                    <td>
                      <span *ngFor="let mech of getMechanicsNames(appointment.mechanics); let last = last">
                        {{ mech }}{{ !last ? ', ' : '' }}
                      </span>
                    </td>
                    <td>
                      <div *ngFor="let s of appointment.services">
                        {{ getServiceName(s.serviceType) }} ({{ s.estimatedDuration }} min - €{{ s.estimatedCost }})
                      </div>
                      <div *ngIf="appointment.partsUsed && appointment.partsUsed.length">
                        <strong>Pièces :</strong>
                        <div *ngFor="let part of appointment.partsUsed">
                          {{ part.part }} (Quantité : {{ part.quantity }})
                        </div>
                      </div>
                    </td>
                    <td>
                        <div class="flex gap-2">
                            <button pButton severity="info" icon="pi pi-file" pTooltip="Regarder facture" (click)="viewInvoiceDetails(appointment)"></button>
                            <button pButton severity="warn" icon="pi pi-info-circle" pTooltip="Détail" (click)="viewAppointmentDetails(appointment)"></button>
                        </div>
                    </td>
                  </tr>
                </ng-template>
              </p-table>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  </div>
</div>

<!-- Dialog Détails du Rendez-vous -->
<p-dialog [(visible)]="appointmentDetailsVisible" header="Détails du Rendez-vous" [modal]="true" [style]="{ width: '90%', maxWidth: '600px' }" [breakpoints]="{ '768px': '95vw' }">
  <div *ngIf="selectedAppointment" class="p-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
      <div>
        <h4 class="text-sm font-medium text-gray-500 mb-1">Véhicule</h4>
        <p class="font-medium text-gray-800">{{ getVehicleDisplay(selectedAppointment.vehicleId) }}</p>
      </div>
      <div>
        <h4 class="text-sm font-medium text-gray-500 mb-1">Services</h4>
        <span class="font-medium text-gray-800" *ngFor="let s of selectedAppointment.services; let last = last">
          {{ getServiceName(s.serviceType) }}{{ !last ? ', ' : '' }}
        </span>
      </div>
      <div>
        <h4 class="text-sm font-medium text-gray-500 mb-1">Date</h4>
        <p class="font-medium text-gray-800">{{ selectedAppointment.startTime | date:'EEEE d MMMM yyyy' }}</p>
      </div>
      <div>
        <h4 class="text-sm font-medium text-gray-500 mb-1">Heure</h4>
        <p class="font-medium text-gray-800">{{ selectedAppointment.startTime | date:'HH:mm' }}</p>
      </div>
      <div class="col-span-full">
        <h4 class="text-sm font-medium text-gray-500 mb-1">Notes</h4>
        <p class="text-gray-800">{{ selectedAppointment.notes }}</p>
      </div>
    </div>
  </div>
</p-dialog>

<!-- Dialog Détails de la Facture -->
<p-dialog [(visible)]="afficherFacture" [modal]="true" [header]="'Détails de la Facture'" [style]="{width: '600px'}">
  <ng-container *ngIf="factureSelectionnee">
    <div class="p-4">
      <div class="text-center mb-4">
        <h2 class="text-xl font-bold">Facture du {{ factureSelectionnee.issueDate | date:'dd/MM/yyyy' }}</h2>
      </div>
      <table class="w-full mb-4">
        <thead>
          <tr class="border-b">
            <th class="text-left py-2">Opération</th>
            <th class="text-right py-2">Prix</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of factureSelectionnee.items" class="border-b">
            <td class="py-2">{{ item.description }} ({{ item.type }})</td>
            <td class="text-right py-2">{{ item.total | currency:'EUR':'symbol':'1.2-2' }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td class="py-2 font-bold">Total HT</td>
            <td class="text-right py-2">{{ factureSelectionnee.subtotal | currency:'EUR':'symbol':'1.2-2' }}</td>
          </tr>
          <tr>
            <td class="py-2 font-bold">TVA ({{ factureSelectionnee.taxRate }}%)</td>
            <td class="text-right py-2">{{ (factureSelectionnee.totalAmount - factureSelectionnee.subtotal) | currency:'EUR':'symbol':'1.2-2' }}</td>
          </tr>
          <tr>
            <td class="py-2 font-bold text-lg">Total TTC</td>
            <td class="text-right py-2 font-bold text-lg">{{ factureSelectionnee.totalAmount | currency:'EUR':'symbol':'1.2-2' }}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  </ng-container>
</p-dialog>

<p-toast></p-toast>
  `,
  styles: [
    `
:host ::ng-deep .p-steps .p-steps-item .p-menuitem-link {
  background: transparent;
}
:host ::ng-deep .p-steps .p-steps-item.p-highlight .p-steps-number {
  background: #3b82f6;
}
@media screen and (max-width: 768px) {
  :host ::ng-deep .p-datatable-responsive .p-datatable-tbody > tr > td {
    padding: 0.5rem;
    border: 0;
  }
}
    `
  ]
})
export class AppointmentBookingComponent implements OnInit {
  // Pour utiliser l'enum dans le template
  AppointmentStatus = AppointmentStatus;

  // Onglets
  tabs = [
    { label: 'Mes Rendez-vous', icon: 'pi pi-calendar' },
    { label: 'Nouveau Rendez-vous', icon: 'pi pi-calendar-plus' },
    { label: 'Historique', icon: 'pi pi-history' }
  ];
  activeTabIndex = 0;

  // Étapes pour le formulaire
  steps: MenuItem[] = [
    { label: 'Véhicule', command: () => (this.currentStep = 0) },
    { label: 'Service', command: () => (this.currentStep = 1) },
    { label: 'Date & Heure', command: () => (this.currentStep = 2) },
    { label: 'Confirmation', command: () => (this.currentStep = 3) }
  ];
  currentStep = 0;

  // Formulaire
  appointmentForm: FormGroup;
  minDate = new Date();
  disabledDates: Date[] = [];

  // Données fictives pour les véhicules (modèle Vehicle)
  vehicles: Vehicle[] = [
    {
      _id: 'veh1',
      userId: 'user1',
      make: 'Renault',
      model: 'Clio',
      year: 2018,
      licensePlate: 'AB-123-CD',
      technicalDetails: { mileage: 50000, fuelType: 'Essence' }
    },
    {
      _id: 'veh2',
      userId: 'user1',
      make: 'Peugeot',
      model: '308',
      year: 2020,
      licensePlate: 'EF-456-GH',
      technicalDetails: { mileage: 30000, fuelType: 'Diesel' }
    },
    {
      _id: 'veh3',
      userId: 'user1',
      make: 'Citroën',
      model: 'C4',
      year: 2016,
      licensePlate: 'IJ-789-KL',
      technicalDetails: { mileage: 70000, fuelType: 'Essence' }
    }
  ];

  // Données fictives pour les services (modèle ServiceType)
  serviceTypes: ServiceType[] = [
    {
      _id: 'srv1',
      name: 'Révision standard',
      description: 'Vidange, filtres, vérification générale',
      defaultDuration: 60,
      requiredSpecialties: [],
      baseCost: 129
    },
    {
      _id: 'srv2',
      name: 'Changement de freins',
      description: 'Remplacement des plaquettes/disques',
      defaultDuration: 90,
      requiredSpecialties: [],
      baseCost: 199
    },
    {
      _id: 'srv3',
      name: 'Contrôle technique',
      description: 'Pré-contrôle et rapport',
      defaultDuration: 45,
      requiredSpecialties: [],
      baseCost: 79
    },
    {
      _id: 'srv4',
      name: 'Diagnostic électronique',
      description: 'Analyse des systèmes électroniques',
      defaultDuration: 30,
      requiredSpecialties: [],
      baseCost: 59
    }
  ];

  // Créneaux horaires disponibles
  timeSlots: { id: number; time: string; available: boolean }[] = [
    { id: 1, time: '08:00', available: true },
    { id: 2, time: '09:00', available: true },
    { id: 3, time: '10:00', available: true },
    { id: 4, time: '11:00', available: false },
    { id: 5, time: '14:00', available: true },
    { id: 6, time: '15:00', available: true },
    { id: 7, time: '16:00', available: true },
    { id: 8, time: '17:00', available: false }
  ];

  // Liste des rendez-vous (modèle Appointment)
  appointments: Appointment[] = [
    {
      _id: 'app1',
      clientId: 'user1',
      vehicleId: 'veh1',
      mechanics: ['mec1', 'mec2'],
      startTime: new Date('2025-03-25T10:00:00'),
      status: AppointmentStatus.SCHEDULED,
      services: [
        { serviceType: 'srv1', estimatedDuration: 60, estimatedCost: 129 }
      ],
      totalEstimatedCost: 129,
      notes: 'Bruit suspect côté droit à vérifier'
    },
    {
      _id: 'app2',
      clientId: 'user1',
      vehicleId: 'veh2',
      mechanics: ['mec3'],
      startTime: new Date('2025-03-10T14:00:00'),
      status: AppointmentStatus.COMPLETED,
      services: [
        { serviceType: 'srv2', estimatedDuration: 90, estimatedCost: 199 }
      ],
      totalEstimatedCost: 199,
      notes: ''
    },
    {
      _id: 'app3',
      clientId: 'user1',
      vehicleId: 'veh3',
      mechanics: ['mec1'],
      startTime: new Date('2025-04-05T09:00:00'),
      status: AppointmentStatus.SCHEDULED,
      services: [
        { serviceType: 'srv3', estimatedDuration: 45, estimatedCost: 79 },
        { serviceType: 'srv4', estimatedDuration: 30, estimatedCost: 59 }
      ],
      totalEstimatedCost: 138,
      notes: 'Préparation au contrôle technique',
      partsUsed: [
        { part: 'Filtre à air', quantity: 1 },
        { part: 'Plaquettes de frein', quantity: 4 }
      ]
    }
  ];

  // Pour le row expansion des véhicules dans l'historique
  expandedVehicleIds: { [key: string]: boolean } = {};

  // Liste fictive des mécaniciens
  mechanics = [
    { _id: 'mec1', name: 'Jean Dupont' },
    { _id: 'mec2', name: 'Marie Durand' },
    { _id: 'mec3', name: 'Pierre Martin' }
  ];

  // Dialogs
  appointmentDetailsVisible = false;
  selectedAppointment: Appointment | null = null;
  afficherFacture = false;
  factureSelectionnee: Invoice | null = null;

  constructor(private fb: FormBuilder, private messageService: MessageService) {
    this.appointmentForm = this.fb.group({
      vehicleId: [null, Validators.required],
      selectedServices: [[], Validators.compose([Validators.required, Validators.minLength(1)])],
      date: [null, Validators.required],
      timeSlotId: [null, Validators.required],
      notes: ['']
    });
  }

  ngOnInit() {
    this.prepareDisabledDates();
  }

  prepareDisabledDates() {
    const holidays = [
      new Date('2025-04-13'),
      new Date('2025-05-01'),
      new Date('2025-05-08')
    ];
    this.disabledDates = [...holidays];
  }

  // Combine la date et l'heure pour obtenir la date de début du rendez-vous
  getStartDateTime(date: Date, time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const result = new Date(date);
    result.setHours(hours, minutes, 0, 0);
    return result;
  }

  startNewAppointment() {
    this.activeTabIndex = 1;
    this.currentStep = 0;
    this.appointmentForm.reset();
  }

  onStepChange(step: number) {
    if (step > 0 && !this.appointmentForm.get('vehicleId')?.valid) {
      this.currentStep = 0;
      this.messageService.add({ severity: 'warn', summary: 'Étape incomplète', detail: 'Veuillez sélectionner un véhicule' });
      return;
    }
    if (step > 1 && !this.appointmentForm.get('selectedServices')?.valid) {
      this.currentStep = 1;
      this.messageService.add({ severity: 'warn', summary: 'Étape incomplète', detail: 'Veuillez sélectionner un service' });
      return;
    }
    if (step > 2 && (!this.appointmentForm.get('date')?.valid || !this.appointmentForm.get('timeSlotId')?.valid)) {
      this.currentStep = 2;
      this.messageService.add({ severity: 'warn', summary: 'Étape incomplète', detail: 'Veuillez sélectionner une date et une heure' });
      return;
    }
    this.currentStep = step;
  }

  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  selectVehicle(id: string) {
    this.appointmentForm.patchValue({ vehicleId: id });
  }

  selectService(id: string) {
    const currentServices = [...(this.appointmentForm.get('selectedServices')?.value || [])];
    const index = currentServices.indexOf(id);
    if (index === -1) {
      currentServices.push(id);
    } else {
      currentServices.splice(index, 1);
    }
    this.appointmentForm.patchValue({ selectedServices: currentServices });
  }

  isServiceSelected(id: string): boolean {
    const selectedServices = this.appointmentForm.get('selectedServices')?.value || [];
    return selectedServices.includes(id);
  }

  calculateTotalDuration(): number {
    return this.getSelectedServicesInfo().reduce((total, service) => total + service.defaultDuration, 0);
  }

  calculateTotalPrice(): number {
    return this.getSelectedServicesInfo().reduce((total, service) => total + service.baseCost, 0);
  }

  getSelectedServicesInfo(): ServiceType[] {
    const selectedIds = this.appointmentForm.get('selectedServices')?.value || [];
    return this.serviceTypes.filter(service => selectedIds.includes(service._id));
  }

  onDateSelect(date: Date) {
    this.appointmentForm.patchValue({ timeSlotId: null });
    this.updateAvailableTimeSlots(date);
  }

  updateAvailableTimeSlots(date: Date) {
    const day = date.getDay();
    this.timeSlots.forEach(slot => slot.available = true);
    if (day === 2) {
      this.timeSlots[0].available = false;
      this.timeSlots[3].available = false;
    } else if (day === 4) {
      this.timeSlots[5].available = false;
      this.timeSlots[6].available = false;
    } else if (day === 5) {
      this.timeSlots[1].available = false;
      this.timeSlots[4].available = false;
    }
  }

  selectTimeSlot(id: number) {
    this.appointmentForm.patchValue({ timeSlotId: id });
  }

  getSelectedTimeSlot() {
    const timeSlotId = this.appointmentForm.get('timeSlotId')?.value;
    return this.timeSlots.find(slot => slot.id === timeSlotId);
  }

  getVehicleDisplay(vehicleId: string): string {
    const vehicle = this.vehicles.find(v => v._id === vehicleId);
    return vehicle ? `${vehicle.make} ${vehicle.model} (${vehicle.licensePlate})` : '';
  }

  getServiceName(serviceTypeId: string): string {
    const service = this.serviceTypes.find(s => s._id === serviceTypeId);
    return service ? service.name : 'Service inconnu';
  }

  submitAppointment() {
    if (this.appointmentForm.valid) {
      const formValue = this.appointmentForm.value;
      const vehicle = this.vehicles.find(v => v._id === formValue.vehicleId);
      const selectedServices = this.getSelectedServicesInfo();
      const timeSlot = this.timeSlots.find(slot => slot.id === formValue.timeSlotId);
      const startTime = timeSlot ? this.getStartDateTime(formValue.date, timeSlot.time) : new Date();
      const newAppointment: Appointment = {
        clientId: 'user1',
        vehicleId: formValue.vehicleId,
        mechanics: [], // À renseigner ultérieurement
        startTime: startTime,
        status: AppointmentStatus.SCHEDULED,
        services: selectedServices.map(service => ({
          serviceType: service._id!,
          estimatedDuration: service.defaultDuration,
          estimatedCost: service.baseCost
        })),
        totalEstimatedCost: this.calculateTotalPrice(),
        notes: formValue.notes
      };
      this.appointments.push(newAppointment);
      this.messageService.add({
        severity: 'success',
        summary: 'Rendez-vous confirmé',
        detail: `Votre rendez-vous pour ${selectedServices.length} service(s) a été enregistré pour le ${new Date(formValue.date).toLocaleDateString()} à ${timeSlot?.time}`
      });
      this.activeTabIndex = 0;
      this.appointmentForm.reset();
      this.currentStep = 0;
    }
  }

  viewAppointmentDetails(appointment: Appointment) {
    this.selectedAppointment = appointment;
    this.appointmentDetailsVisible = true;
  }

  editAppointment(appointment: Appointment) {
    const vehicle = this.vehicles.find(v => v._id === appointment.vehicleId);
    const timeSlot = this.timeSlots.find(slot => slot.time === this.formatTime(appointment.startTime));
    const serviceIds = appointment.services.map(s => s.serviceType);
    if (vehicle && timeSlot) {
      this.appointmentForm.patchValue({
        vehicleId: vehicle._id,
        selectedServices: serviceIds,
        date: appointment.startTime,
        timeSlotId: timeSlot.id,
        notes: appointment.notes
      });
      this.updateAvailableTimeSlots(appointment.startTime);
      this.activeTabIndex = 1;
      this.appointments = this.appointments.filter(a => a._id !== appointment._id);
    }
  }

  cancelAppointment(appointment: Appointment) {
    if (confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) {
      appointment.status = AppointmentStatus.CANCELED;
      this.messageService.add({
        severity: 'info',
        summary: 'Rendez-vous annulé',
        detail: 'Votre rendez-vous a été annulé avec succès'
      });
    }
  }

  getStatusSeverity(status: AppointmentStatus): 'success' | 'info' | 'warn' | 'danger' {
    switch (status) {
      case AppointmentStatus.SCHEDULED:
        return 'success';
      case AppointmentStatus.IN_PROGRESS:
        return 'info';
      case AppointmentStatus.COMPLETED:
        return 'info';
      case AppointmentStatus.CANCELED:
        return 'danger';
      default:
        return 'warn';
    }
  }

  // Méthode pour formater une date au format HH:mm
  formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  // Renvoie les véhicules ayant au moins un rendez-vous ancien (startTime < aujourd'hui)
  getVehiclesWithOldAppointments(): Vehicle[] {
    const today = new Date();
    return this.vehicles.filter(vehicle =>
      this.appointments.some(app => app.vehicleId === vehicle._id && app.startTime < today)
    );
  }

  // Renvoie les rendez-vous anciens d'un véhicule donné
  getAppointmentsByVehicle(vehicleId: string): Appointment[] {
    const today = new Date();
    return this.appointments.filter(app => app.vehicleId === vehicleId && app.startTime < today);
  }

  // Gestion du row expansion pour l'historique
  toggleRow(vehicle: Vehicle) {
    this.expandedVehicleIds[vehicle._id!] = !this.expandedVehicleIds[vehicle._id!];
  }

  isRowExpanded(vehicle: Vehicle): boolean {
    return !!this.expandedVehicleIds[vehicle._id!];
  }

  // Récupère les noms des mécaniciens à partir de leurs identifiants
  getMechanicsNames(ids: string[]): string[] {
    return ids.map(id => {
      const found = this.mechanics.find(m => m._id === id);
      return found ? found.name : id;
    });
  }

  // Génération de la facture en utilisant la structure Invoice
  viewInvoiceDetails(appointment: Appointment) {
    const items = appointment.services.map(s => {
      const service = this.serviceTypes.find(st => st._id === s.serviceType);
      return {
        type: 'service' as const,
        description: service ? service.name : 'Service inconnu',
        quantity: 1,
        unitPrice: service ? service.baseCost : 0,
        total: service ? service.baseCost : 0
      };
    });
    if (appointment.partsUsed && appointment.partsUsed.length) {
      appointment.partsUsed.forEach(part => {
        // Exemple : fixer un prix unitaire pour la pièce (à remplacer par la donnée réelle)
        const partPrice = 50;
        items.push({
          type: 'service' as const,
          description: part.part,
          quantity: part.quantity,
          unitPrice: partPrice,
          total: partPrice * part.quantity
        });
      });
    }
    const subtotal = items.reduce((acc, item) => acc + item.total, 0);
    const taxRate = 20; // Exemple : 20%
    const totalAmount = subtotal * 1.2;
    this.factureSelectionnee = {
      _id: 'inv_' + appointment._id,
      appointmentId: appointment._id!,
      clientId: appointment.clientId,
      invoiceNumber: 'INV-' + appointment._id,
      items: items,
      subtotal: subtotal,
      taxRate: taxRate,
      totalAmount: totalAmount,
      status: InvoiceStatus.ISSUED,
      issueDate: new Date(),
      dueDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
    };
    this.afficherFacture = true;
  }
}
