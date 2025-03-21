import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextarea } from 'primeng/inputtextarea';
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

interface Vehicle {
    id: number;
    marque: string;
    modele: string;
    annee: number;
    immatriculation: string;
}

interface TimeSlot {
    id: number;
    time: string;
    available: boolean;
}

interface ServiceType {
    id: number;
    name: string;
    description: string;
    duration: number;
    price: number;
}

interface Appointment {
    id: number;
    date: Date;
    timeSlot: string;
    vehicleId: number;
    vehicleInfo: string;
    // Remplacer le service unique par un tableau de services
    services: {
        id: number;
        name: string;
        price: number;
        duration: number;
    }[];
    totalDuration: number; // Durée totale des services combinés
    totalPrice: number; // Prix total des services combinés
    status: 'confirmé' | 'en attente' | 'terminé' | 'annulé';
    notes: string;
}

@Component({
    selector: 'app-appointment-booking',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, CalendarModule, DropdownModule, ButtonModule, CardModule, StepsModule, InputTextModule, ToastModule, DialogModule, TableModule, TagModule],
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

            <!-- Contenu basé sur l'onglet actif -->
            <div [ngSwitch]="activeTabIndex">
                <!-- Onglet Mes Rendez-vous -->
                <div *ngSwitchCase="0" class="bg-white rounded-lg shadow-md p-6">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-xl font-bold text-gray-800">Mes Rendez-vous</h2>
                        <button pButton label="Prendre un rendez-vous" icon="pi pi-calendar-plus" class="p-button-primary" (click)="startNewAppointment()"></button>
                    </div>

                    <p-table [value]="appointments" [paginator]="true" [rows]="5" [responsive]="true" styleClass="p-datatable-sm" [rowHover]="true" responsiveLayout="stack" [breakpoint]="'768px'">
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
                                <td>
                                    {{ appointment.date | date: 'dd/MM/yyyy' }}
                                </td>
                                <td>
                                    {{ appointment.timeSlot }}
                                </td>
                                <td>
                                    {{ appointment.vehicleInfo }}
                                </td>
                                <td>
                                    <div *ngFor="let service of appointment.services; let last = last">{{ service.name }}{{ !last ? ',' : '' }}</div>
                                    <div *ngIf="appointment.services.length > 1" class="text-xs text-gray-500 mt-1">{{ appointment.totalDuration }} min | {{ appointment.totalPrice }}€</div>
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
                                            [disabled]="appointment.status === 'terminé' || appointment.status === 'annulé'"
                                            (click)="editAppointment(appointment)"
                                        ></button>
                                        <button
                                            pButton
                                            icon="pi pi-times"
                                            class="p-button-rounded p-button-text p-button-sm p-button-danger"
                                            pTooltip="Annuler"
                                            [disabled]="appointment.status === 'terminé' || appointment.status === 'annulé'"
                                            (click)="cancelAppointment(appointment)"
                                        ></button>
                                    </div>
                                </td>
                            </tr>
                        </ng-template>
                        <!-- Le reste du template reste inchangé -->
                    </p-table>
                </div>

                <!-- Onglet Nouveau Rendez-vous -->
                <div *ngSwitchCase="1" class="bg-white rounded-lg shadow-md p-6">
                    <h2 class="text-xl font-bold text-gray-800 mb-6">Prendre un rendez-vous</h2>

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
                                        [class.border-blue-500]="appointmentForm.get('vehicleId')?.value === vehicle.id"
                                        [class.shadow-md]="appointmentForm.get('vehicleId')?.value === vehicle.id"
                                        (click)="selectVehicle(vehicle.id)"
                                    >
                                        <h4 class="font-bold text-gray-800">{{ vehicle.marque }} {{ vehicle.modele }}</h4>
                                        <p class="text-sm text-gray-600">{{ vehicle.annee }} | {{ vehicle.immatriculation }}</p>
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
                                        Sélectionnez autant de services que nécessaire. Cliquez sur un service pour le sélectionner ou le désélectionner.
                                    </p>
                                </div>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div
                                        *ngFor="let service of serviceTypes"
                                        class="border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:bg-gray-50"
                                        [class.border-blue-500]="isServiceSelected(service.id)"
                                        [class.shadow-md]="isServiceSelected(service.id)"
                                        [class.bg-blue-50]="isServiceSelected(service.id)"
                                        (click)="selectService(service.id)"
                                    >
                                        <div class="flex justify-between items-start">
                                            <h4 class="font-bold text-gray-800 mb-1">{{ service.name }}</h4>
                                            <i *ngIf="isServiceSelected(service.id)" class="pi pi-check-circle text-blue-500"></i>
                                        </div>
                                        <p class="text-sm text-gray-600 mb-2">{{ service.description }}</p>
                                        <div class="flex justify-between text-sm">
                                            <span class="text-gray-500">Durée: {{ service.duration }} min</span>
                                            <span class="font-medium">{{ service.price }}€</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="flex justify-between mt-4">
                                    <button pButton label="Retour" icon="pi pi-arrow-left" class="p-button-outlined" (click)="prevStep()"></button>
                                    <button pButton label="Continuer" icon="pi pi-arrow-right" iconPos="right" [disabled]="!appointmentForm.get('selectedServices')?.value?.length" (click)="nextStep()"></button>
                                </div>
                            </div>

                            <!-- Étape 3: Sélection de la date et heure -->
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
                                        <small *ngIf="appointmentForm.get('date')?.invalid && appointmentForm.get('date')?.touched" class="text-red-500 mt-1"> Veuillez sélectionner une date </small>
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
                                        <small *ngIf="appointmentForm.get('timeSlotId')?.invalid && appointmentForm.get('timeSlotId')?.touched" class="text-red-500 mt-1"> Veuillez sélectionner une heure </small>
                                    </div>
                                </div>

                                <div class="field col-span-full mt-6">
                                    <label for="notes" class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                    <textarea pInputTextarea id="notes" formControlName="notes" rows="3" class="w-1/4 resize-none p-inputtext-sm border-2 rounded-md"> </textarea>
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
                                            <p class="font-medium text-gray-800">
                                                {{ getSelectedVehicleInfo() }}
                                            </p>
                                        </div>

                                        <div>
                                            <h4 class="text-sm font-medium text-gray-500 mb-1">Services</h4>
                                            <div *ngFor="let service of getSelectedServicesInfo()" class="font-medium text-gray-800 mb-1">
                                                <p>
                                                    {{ service.name }} <span class="text-gray-500 font-normal">({{ service.duration }} min - {{ service.price }}€)</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 class="text-sm font-medium text-gray-500 mb-1">Date</h4>
                                            <p class="font-medium text-gray-800">
                                                {{ appointmentForm.get('date')?.value | date: 'EEEE d MMMM yyyy' }}
                                            </p>
                                        </div>

                                        <div>
                                            <h4 class="text-sm font-medium text-gray-500 mb-1">Heure</h4>
                                            <p class="font-medium text-gray-800">
                                                {{ getSelectedTimeSlot()?.time }}
                                            </p>
                                        </div>

                                        <div *ngIf="appointmentForm.get('notes')?.value" class="col-span-full">
                                            <h4 class="text-sm font-medium text-gray-500 mb-1">Notes</h4>
                                            <p class="text-gray-800">
                                                {{ appointmentForm.get('notes')?.value }}
                                            </p>
                                        </div>

                                        <div class="col-span-full mt-2">
                                            <h4 class="text-sm font-medium text-gray-500 mb-1">Durée estimée</h4>
                                            <p class="font-medium text-gray-800">{{ calculateTotalDuration() }} minutes</p>
                                        </div>

                                        <div class="col-span-full mt-2">
                                            <h4 class="text-sm font-medium text-gray-500 mb-1">Prix estimé</h4>
                                            <p class="text-xl font-bold text-blue-600">{{ calculateTotalPrice() }}€</p>
                                            <p class="text-xs text-gray-500 mt-1">*Prix indicatif, le montant final peut varier selon l'état du véhicule et les pièces nécessaires</p>
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

                    <p-table [value]="appointments" [paginator]="true" [rows]="5" [responsive]="true" styleClass="p-datatable-sm" [rowHover]="true" responsiveLayout="stack" [breakpoint]="'768px'">
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
                                <td>
                                    {{ appointment.date | date: 'dd/MM/yyyy' }}
                                </td>
                                <td>
                                    {{ appointment.timeSlot }}
                                </td>
                                <td>
                                    {{ appointment.vehicleInfo }}
                                </td>
                                <td>
                                    <div *ngFor="let service of appointment.services; let last = last">{{ service.name }}{{ !last ? ',' : '' }}</div>
                                    <div *ngIf="appointment.services.length > 1" class="text-xs text-gray-500 mt-1">{{ appointment.totalDuration }} min | {{ appointment.totalPrice }}€</div>
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
                                            [disabled]="appointment.status === 'terminé' || appointment.status === 'annulé'"
                                            (click)="editAppointment(appointment)"
                                        ></button>
                                        <button
                                            pButton
                                            icon="pi pi-times"
                                            class="p-button-rounded p-button-text p-button-sm p-button-danger"
                                            pTooltip="Annuler"
                                            [disabled]="appointment.status === 'terminé' || appointment.status === 'annulé'"
                                            (click)="cancelAppointment(appointment)"
                                        ></button>
                                    </div>
                                </td>
                            </tr>
                        </ng-template>
                        <!-- Le reste du template reste inchangé -->
                    </p-table>
                </div>
            </div>
        </div>

        <!-- Dialogs -->
        <p-dialog [(visible)]="appointmentDetailsVisible" header="Détails du Rendez-vous" [modal]="true" [style]="{ width: '90%', maxWidth: '600px' }" [breakpoints]="{ '768px': '95vw' }">
            <div *ngIf="selectedAppointment" class="p-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                    <div>
                        <h4 class="text-sm font-medium text-gray-500 mb-1">Véhicule</h4>
                        <p class="font-medium text-gray-800">{{ selectedAppointment.vehicleInfo }}</p>
                    </div>

                    <div>
                        <h4 class="text-sm font-medium text-gray-500 mb-1">Service</h4>
                        <span class="font-medium text-gray-800" *ngFor="let service of selectedAppointment.services; let last = last">{{ service.name }}{{ !last ? ',' : '' }}</span>
                    </div>

                    <div>
                        <h4 class="text-sm font-medium text-gray-500 mb-1">Date</h4>
                        <p class="font-medium text-gray-800">{{ selectedAppointment.date | date: 'EEEE d MMMM yyyy' }}</p>
                    </div>

                    <div>
                        <h4 class="text-sm font-medium text-gray-500 mb-1">Heure</h4>
                        <p class="font-medium text-gray-800">{{ selectedAppointment.timeSlot }}</p>
                    </div>

                    <div class="col-span-full">
                        <h4 class="text-sm font-medium text-gray-500 mb-1">Statut</h4>
                        <p-tag [value]="selectedAppointment.status" [severity]="getStatusSeverity(selectedAppointment.status)"></p-tag>
                    </div>

                    <div *ngIf="selectedAppointment.notes" class="col-span-full">
                        <h4 class="text-sm font-medium text-gray-500 mb-1">Notes</h4>
                        <p class="text-gray-800">{{ selectedAppointment.notes }}</p>
                    </div>
                </div>

                <div *ngIf="selectedAppointment.status === 'confirmé'" class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 class="text-sm font-bold text-blue-800 mb-2">Rappel</h4>
                    <p class="text-sm text-blue-700">Veuillez vous présenter 10 minutes avant l'heure de votre rendez-vous. En cas d'empêchement, merci d'annuler ou de reporter votre rendez-vous au moins 24h à l'avance.</p>
                </div>
            </div>
        </p-dialog>

        <p-dialog [(visible)]="serviceDetailsVisible" header="Détails du Service" [modal]="true" [style]="{ width: '90%', maxWidth: '700px' }" [breakpoints]="{ '768px': '95vw' }">
            <div *ngIf="selectedService" class="p-4">
                <!-- Contenu des détails du service passé -->
            </div>
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

                :host ::ng-deep .p-steps-title {
                    display: none;
                }
            }
        `
    ]
})
export class AppointmentBookingComponent implements OnInit {
    // Tabs
    tabs = [
        { label: 'Mes Rendez-vous', icon: 'pi pi-calendar' },
        { label: 'Nouveau Rendez-vous', icon: 'pi pi-calendar-plus' },
        { label: 'Historique', icon: 'pi pi-history' }
    ];
    activeTabIndex = 0;

    // Steps
    steps: MenuItem[] = [
        { label: 'Véhicule', command: () => (this.currentStep = 0) },
        { label: 'Service', command: () => (this.currentStep = 1) },
        { label: 'Date & Heure', command: () => (this.currentStep = 2) },
        { label: 'Confirmation', command: () => (this.currentStep = 3) }
    ];
    currentStep = 0;

    // Form
    appointmentForm: FormGroup;
    minDate = new Date();
    disabledDates: Date[] = [];

    // Data
    vehicles: Vehicle[] = [
        { id: 1, marque: 'Renault', modele: 'Clio', annee: 2018, immatriculation: 'AB-123-CD' },
        { id: 2, marque: 'Peugeot', modele: '308', annee: 2020, immatriculation: 'EF-456-GH' },
        { id: 3, marque: 'Citroën', modele: 'C4', annee: 2016, immatriculation: 'IJ-789-KL' }
    ];

    serviceTypes: ServiceType[] = [
        {
            id: 1,
            name: 'Révision standard',
            description: 'Vidange, filtres, niveaux et vérification générale',
            duration: 60,
            price: 129
        },
        {
            id: 2,
            name: 'Changement de freins',
            description: 'Remplacement des plaquettes et/ou disques',
            duration: 90,
            price: 199
        },
        {
            id: 3,
            name: 'Contrôle technique',
            description: 'Pré-contrôle technique et remise du rapport',
            duration: 45,
            price: 79
        },
        {
            id: 4,
            name: 'Diagnostic électronique',
            description: 'Analyse complète des systèmes électroniques',
            duration: 30,
            price: 59
        }
    ];

    timeSlots: TimeSlot[] = [
        { id: 1, time: '08:00', available: true },
        { id: 2, time: '09:00', available: true },
        { id: 3, time: '10:00', available: true },
        { id: 4, time: '11:00', available: false },
        { id: 5, time: '14:00', available: true },
        { id: 6, time: '15:00', available: true },
        { id: 7, time: '16:00', available: true },
        { id: 8, time: '17:00', available: false }
    ];

    // Mettre à jour les rendez-vous existants pour le nouveau format
    appointments: Appointment[] = [
        {
            id: 1,
            date: new Date('2025-03-25'),
            timeSlot: '10:00',
            vehicleId: 1,
            vehicleInfo: 'Renault Clio (AB-123-CD)',
            services: [
                {
                    id: 1,
                    name: 'Révision standard',
                    duration: 60,
                    price: 129
                }
            ],
            totalDuration: 60,
            totalPrice: 129,
            status: 'confirmé',
            notes: 'Bruit suspect côté droit à vérifier'
        },
        {
            id: 2,
            date: new Date('2025-03-10'),
            timeSlot: '14:00',
            vehicleId: 2,
            vehicleInfo: 'Peugeot 308 (EF-456-GH)',
            services: [
                {
                    id: 2,
                    name: 'Changement de freins',
                    duration: 90,
                    price: 199
                }
            ],
            totalDuration: 90,
            totalPrice: 199,
            status: 'terminé',
            notes: ''
        },
        {
            id: 3,
            date: new Date('2025-04-05'),
            timeSlot: '09:00',
            vehicleId: 3,
            vehicleInfo: 'Citroën C4 (IJ-789-KL)',
            services: [
                {
                    id: 3,
                    name: 'Contrôle technique',
                    duration: 45,
                    price: 79
                },
                {
                    id: 4,
                    name: 'Diagnostic électronique',
                    duration: 30,
                    price: 59
                }
            ],
            totalDuration: 75,
            totalPrice: 138,
            status: 'en attente',
            notes: 'Préparation au contrôle technique'
        }
    ];

    serviceHistory = [
        {
            id: 1,
            date: new Date('2024-12-15'),
            vehicleInfo: 'Renault Clio (AB-123-CD)',
            serviceType: 'Révision complète',
            technicien: 'Marc Dupont',
            cost: 245.8,
            details: 'Vidange, remplacement filtre à huile, filtre à air, filtre habitacle, contrôle des niveaux'
        },
        {
            id: 2,
            date: new Date('2024-09-22'),
            vehicleInfo: 'Peugeot 308 (EF-456-GH)',
            serviceType: 'Remplacement batterie',
            technicien: 'Sophie Martin',
            cost: 189.5,
            details: 'Remplacement batterie 12V 70Ah, test système de charge'
        },
        {
            id: 3,
            date: new Date('2024-07-05'),
            vehicleInfo: 'Citroën C4 (IJ-789-KL)',
            serviceType: 'Changement pneus',
            technicien: 'Thomas Bernard',
            cost: 425.0,
            details: 'Remplacement 4 pneus Michelin 205/55 R16, équilibrage et parallélisme'
        }
    ];

    // Dialogs
    appointmentDetailsVisible = false;
    serviceDetailsVisible = false;
    selectedAppointment: Appointment | null = null;
    selectedService: any = null;

    constructor(
        private fb: FormBuilder,
        private messageService: MessageService
    ) {
        this.appointmentForm = this.fb.group({
            vehicleId: [null, Validators.required],
            selectedServices: [[], Validators.compose([Validators.required, Validators.minLength(1)])],
            date: [null, Validators.required],
            timeSlotId: [null, Validators.required],
            notes: ['']
        });
    }

    ngOnInit() {
        // Préparer dates désactivées (weekends ou jours fériés)
        this.prepareDisabledDates();
    }

    prepareDisabledDates() {
        // Exemple: désactiver des dates spécifiques (jours fériés)
        const holidays = [
            new Date('2025-04-13'), // Pâques
            new Date('2025-05-01'), // Fête du travail
            new Date('2025-05-08') // Victoire 1945
        ];

        this.disabledDates = [...holidays];
    }

    startNewAppointment() {
        this.activeTabIndex = 1;
        this.currentStep = 0;
        this.appointmentForm.reset();
    }

    onStepChange(step: number) {
        // Vérifier que les étapes précédentes sont validées
        if (step > 0 && !this.appointmentForm.get('vehicleId')?.valid) {
            this.currentStep = 0;
            this.messageService.add({
                severity: 'warn',
                summary: 'Étape incomplète',
                detail: 'Veuillez sélectionner un véhicule'
            });
            return;
        }

        if (step > 1 && !this.appointmentForm.get('serviceTypeId')?.valid) {
            this.currentStep = 1;
            this.messageService.add({
                severity: 'warn',
                summary: 'Étape incomplète',
                detail: 'Veuillez sélectionner un service'
            });
            return;
        }

        if (step > 2 && (!this.appointmentForm.get('date')?.valid || !this.appointmentForm.get('timeSlotId')?.valid)) {
            this.currentStep = 2;
            this.messageService.add({
                severity: 'warn',
                summary: 'Étape incomplète',
                detail: 'Veuillez sélectionner une date et une heure'
            });
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

    selectVehicle(id: number) {
        this.appointmentForm.patchValue({ vehicleId: id });
    }

    selectService(id: number) {
        const currentServices = [...(this.appointmentForm.get('selectedServices')?.value || [])];

        // Vérifier si le service est déjà sélectionné
        const index = currentServices.indexOf(id);

        if (index === -1) {
            // Ajouter le service s'il n'est pas déjà sélectionné
            currentServices.push(id);
        } else {
            // Retirer le service s'il est déjà sélectionné
            currentServices.splice(index, 1);
        }

        this.appointmentForm.patchValue({ selectedServices: currentServices });
    }

    isServiceSelected(id: number): boolean {
        const selectedServices = this.appointmentForm.get('selectedServices')?.value || [];
        return selectedServices.includes(id);
    }

    calculateTotalDuration(): number {
        const selectedServiceIds = this.appointmentForm.get('selectedServices')?.value || [];
        return selectedServiceIds.reduce((total: number, serviceId: number) => {
            const service = this.serviceTypes.find((s) => s.id === serviceId);
            return total + (service ? service.duration : 0);
        }, 0);
    }
    calculateTotalPrice(): number {
        const selectedServiceIds = this.appointmentForm.get('selectedServices')?.value || [];
        return selectedServiceIds.reduce((total: number, serviceId: number) => {
            const service = this.serviceTypes.find((s) => s.id === serviceId);
            return total + (service ? service.price : 0);
        }, 0);
    }

    getSelectedServicesInfo() {
        const selectedServiceIds = this.appointmentForm.get('selectedServices')?.value || [];
        return this.serviceTypes.filter((service) => selectedServiceIds.includes(service.id));
    }

    onDateSelect(date: Date) {
        // Réinitialiser l'heure sélectionnée
        this.appointmentForm.patchValue({ timeSlotId: null });

        // Dans un vrai scénario, on appelerait un API pour obtenir les créneaux disponibles
        // pour la date sélectionnée
        this.updateAvailableTimeSlots(date);
    }

    updateAvailableTimeSlots(date: Date) {
        // Simuler différentes disponibilités selon les jours
        const day = date.getDay();

        // Réinitialiser disponibilités
        this.timeSlots.forEach((slot) => (slot.available = true));

        // Simulation: certains créneaux sont indisponibles selon le jour
        if (day === 2) {
            // Mardi
            this.timeSlots[0].available = false;
            this.timeSlots[3].available = false;
        } else if (day === 4) {
            // Jeudi
            this.timeSlots[5].available = false;
            this.timeSlots[6].available = false;
        } else if (day === 5) {
            // Vendredi
            this.timeSlots[1].available = false;
            this.timeSlots[4].available = false;
        }
    }

    selectTimeSlot(id: number) {
        this.appointmentForm.patchValue({ timeSlotId: id });
    }

    getSelectedVehicleInfo() {
        const vehicleId = this.appointmentForm.get('vehicleId')?.value;
        const vehicle = this.vehicles.find((v) => v.id === vehicleId);

        if (vehicle) {
            return `${vehicle.marque} ${vehicle.modele} (${vehicle.immatriculation})`;
        }

        return '';
    }

    getSelectedServiceInfo() {
        const serviceId = this.appointmentForm.get('serviceTypeId')?.value;
        return this.serviceTypes.find((s) => s.id === serviceId);
    }

    getSelectedTimeSlot() {
        const timeSlotId = this.appointmentForm.get('timeSlotId')?.value;
        return this.timeSlots.find((t) => t.id === timeSlotId);
    }

    submitAppointment() {
        if (this.appointmentForm.valid) {
            const formValue = this.appointmentForm.value;
            const vehicle = this.vehicles.find((v) => v.id === formValue.vehicleId);
            const selectedServices = this.getSelectedServicesInfo();
            const timeSlot = this.timeSlots.find((t) => t.id === formValue.timeSlotId);

            // Créer nouvel RDV avec services multiples
            const newAppointment: Appointment = {
                id: this.appointments.length + 1,
                date: formValue.date,
                timeSlot: timeSlot ? timeSlot.time : '',
                vehicleId: formValue.vehicleId,
                vehicleInfo: vehicle ? `${vehicle.marque} ${vehicle.modele} (${vehicle.immatriculation})` : '',
                services: selectedServices.map((s) => ({
                    id: s.id,
                    name: s.name,
                    price: s.price,
                    duration: s.duration
                })),
                totalDuration: this.calculateTotalDuration(),
                totalPrice: this.calculateTotalPrice(),
                status: 'en attente',
                notes: formValue.notes
            };

            // Ajouter au tableau des rendez-vous
            this.appointments.push(newAppointment);

            // Notifier l'utilisateur
            this.messageService.add({
                severity: 'success',
                summary: 'Rendez-vous confirmé',
                detail: `Votre rendez-vous avec ${selectedServices.length} service(s) a été enregistré pour le ${new Date(formValue.date).toLocaleDateString()} à ${timeSlot?.time}`
            });

            // Rediriger vers l'onglet des rendez-vous
            this.activeTabIndex = 0;

            // Réinitialiser le formulaire
            this.appointmentForm.reset();
            this.currentStep = 0;
        }
    }

    viewAppointmentDetails(appointment: Appointment) {
        this.selectedAppointment = appointment;
        this.appointmentDetailsVisible = true;
    }

    editAppointment(appointment: Appointment) {
        // Charger les données de l'appointment dans le formulaire
        const vehicle = this.vehicles.find((v) => v.id === appointment.vehicleId);
        const timeSlot = this.timeSlots.find((t) => t.time === appointment.timeSlot);

        // Extraire les IDs des services
        const serviceIds = appointment.services.map((s) => s.id);

        if (vehicle && timeSlot) {
            this.appointmentForm.patchValue({
                vehicleId: vehicle.id,
                selectedServices: serviceIds,
                date: appointment.date,
                timeSlotId: timeSlot.id,
                notes: appointment.notes
            });

            // Mettre à jour les créneaux disponibles
            this.updateAvailableTimeSlots(appointment.date);

            // Naviguer vers l'onglet de création de rendez-vous
            this.activeTabIndex = 1;

            // Enlever le rendez-vous à modifier
            this.appointments = this.appointments.filter((a) => a.id !== appointment.id);
        }
    }

    cancelAppointment(appointment: Appointment) {
        // Demander confirmation avant annulation
        if (confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous?')) {
            // Mettre à jour le statut
            appointment.status = 'annulé';

            this.messageService.add({
                severity: 'info',
                summary: 'Rendez-vous annulé',
                detail: 'Votre rendez-vous a été annulé avec succès'
            });
        }
    }

    getStatusSeverity(status: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
        switch (status) {
            case 'confirmé':
                return 'success';
            case 'en attente':
                return 'warn';
            case 'terminé':
                return 'info';
            case 'annulé':
                return 'danger';
            default:
                return 'info';
        }
    }

    viewServiceDetails(service: any) {
        this.selectedService = service;
        this.serviceDetailsVisible = true;
    }

    downloadInvoice(service: any) {
        // Simulation de téléchargement
        this.messageService.add({
            severity: 'info',
            summary: 'Téléchargement',
            detail: `La facture pour le service du ${new Date(service.date).toLocaleDateString()} est en cours de téléchargement`
        });

        // Dans un cas réel, on redirigerait vers un endpoint qui génère le PDF
        setTimeout(() => {
            console.log('Téléchargement de la facture:', service.id);
        }, 1500);
    }
}
