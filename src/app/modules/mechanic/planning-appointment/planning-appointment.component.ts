import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import timeGridPlugin from '@fullcalendar/timegrid';
import { MultiSelectModule } from 'primeng/multiselect';

interface Appointment {
    id: number;
    clientName: string;
    clientPhone: string;
    vehicleModel: string;
    vehiclePlate: string;
    serviceTypes: string[]; // Modifié pour stocker plusieurs services
    appointmentDate: Date;
    duration: number;
    status: string;
    notes: string;
    mechanicIds: number[]; // Modifié pour stocker plusieurs mécaniciens

}

interface MechanicSlot {
    id: number;
    mechanicName: string;
    available: boolean;
    specialty: string;

}

@Component({
    selector: 'app-planning-appointment',
    imports: [CommonModule, ButtonModule, CalendarModule, TableModule, DialogModule, ReactiveFormsModule,
        ToastModule, InputNumberModule, DropdownModule, FullCalendarModule,MultiSelectModule],
    templateUrl: './planning-appointment.component.html',
    styleUrls: ['./planning-appointment.component.scss'],
    providers: [MessageService]
})
export class PlanningAppointmentComponent implements OnInit {
    appointments: Appointment[] = [];
    mechanicSlots: MechanicSlot[] = [];
    selectedAppointment: Appointment | null = null;

    appointmentForm: FormGroup;
    appointmentDialog: boolean = false;
    submitted: boolean = false;

    statuses: any[] = [
        { label: 'En attente', value: 'pending' },
        { label: 'Confirmé', value: 'confirmed' },
        { label: 'En cours', value: 'in-progress' },
        { label: 'Terminé', value: 'completed' },
        { label: 'Annulé', value: 'cancelled' }
    ];

    serviceTypes: any[] = [
        { label: 'Entretien régulier', value: 'regular-maintenance' },
        { label: 'Réparation', value: 'repair' },
        { label: 'Diagnostic', value: 'diagnostic' },
        { label: 'Changement de pneus', value: 'tire-change' },
        { label: 'Révision', value: 'checkup' }
    ];

    view: 'calendar' | 'list' = 'calendar';
    date: Date = new Date();

    // Pour la vue calendrier
    calendarEvents: any[] = [];
    calendarPlugins = [dayGridPlugin, interactionPlugin];

    calendarOptions: CalendarOptions = {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        initialView: 'timeGridWeek',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        editable: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        events: this.calendarEvents,
        eventClick: this.handleEventClick.bind(this),
        select: this.handleDateSelect.bind(this)
    };

    // Ajoutez ces méthodes dans la classe
    handleEventClick(info: any) {
        const appointmentId = info.event.id;
        const appointment = this.appointments.find((a) => a.id === Number(appointmentId));
        if (appointment) {
            this.editAppointment(appointment);
        }
    }

    handleDateSelect(selectInfo: any) {
        this.openNew();
        this.appointmentForm.patchValue({
            appointmentDate: selectInfo.start
        });
    }

    constructor(
        private formBuilder: FormBuilder,
        private messageService: MessageService
    ) {
        this.appointmentForm = this.formBuilder.group({
            id: [null],
            clientName: ['', Validators.required],
            clientPhone: ['', Validators.required],
            vehicleModel: ['', Validators.required],
            vehiclePlate: ['', Validators.required],
            serviceTypes: [[], Validators.required], // Modifié pour accepter un tableau
            appointmentDate: [null, Validators.required],
            duration: [60, Validators.required],
            status: ['pending', Validators.required],
            notes: [''],
            mechanicIds: [[], Validators.required] // Modifié pour accepter un tableau
        });
    }

    ngOnInit() {
        // Simulation de données pour démonstration
        this.loadMechanics();
        this.loadAppointments();
        this.generateCalendarEvents();
        this.initializeCalendarOptions();

    }

    loadMechanics() {
        // Simuler le chargement des mécaniciens depuis une API
        this.mechanicSlots = [
            { id: 1, mechanicName: 'Jean Dupont', available: true, specialty: 'Moteur' },
            { id: 2, mechanicName: 'Marie Martin', available: true, specialty: 'Électronique' },
            { id: 3, mechanicName: 'Pierre Durand', available: true, specialty: 'Freins' },
            { id: 4, mechanicName: 'Sophie Petit', available: true, specialty: 'Climatisation' },
            { id: 5, mechanicName: 'Michel Dubois', available: false, specialty: 'Carrosserie' }
        ];
    }

    loadAppointments() {
        // Simuler le chargement des rendez-vous depuis une API
        this.appointments = [
            {
                id: 1,
                clientName: 'Thomas Bernard',
                clientPhone: '06 12 34 56 78',
                vehicleModel: 'Peugeot 308',
                vehiclePlate: 'AB-123-CD',
                serviceTypes: ['regular-maintenance', 'oil-change'],
                appointmentDate: new Date(),
                duration: 60,
                status: 'confirmed',
                notes: 'Vidange + filtre à huile',
                mechanicIds: [1, 3]
            },
            {
                id: 2,
                clientName: 'Sophie Laurent',
                clientPhone: '06 98 76 54 32',
                vehicleModel: 'Renault Clio',
                vehiclePlate: 'EF-456-GH',
                serviceTypes: ['brake-repair', 'electronic-diagnostic'],
                appointmentDate: new Date(new Date().setHours(new Date().getHours() + 3)),
                duration: 120,
                status: 'pending',
                notes: 'Problème de freins',
                mechanicIds: [2]

            }
        ];
    }
    initializeCalendarOptions() {
        this.calendarOptions = {
          plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
          initialView: 'timeGridWeek',
          headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          },
          editable: true,
          selectable: true,
          selectMirror: true,
          dayMaxEvents: true,
          events: this.calendarEvents, // Liaison avec les événements
          eventClick: this.handleEventClick.bind(this),
          select: this.handleDateSelect.bind(this)
        };
      }

    generateCalendarEvents() {
        this.calendarEvents = this.appointments.map(appointment => {
          const endDate = new Date(appointment.appointmentDate);
          endDate.setMinutes(endDate.getMinutes() + appointment.duration);

          return {
            id: appointment.id,
            title: `${appointment.clientName} - ${appointment.vehicleModel}`,
            start: appointment.appointmentDate,
            end: endDate,
            backgroundColor: this.getStatusColor(appointment.status)
          };
        });

        // Si le calendrier est déjà initialisé, mettre à jour ses événements
        if (this.calendarOptions) {
          this.calendarOptions.events = this.calendarEvents;
        }
    }

    getStatusColor(status: string): string {
        switch (status) {
          case 'pending':
            return '#FFC107'; // jaune
          case 'confirmed':
            return '#2196F3'; // bleu
          case 'in-progress':
            return '#673AB7'; // violet
          case 'completed':
            return '#4CAF50'; // vert
          case 'cancelled':
            return '#F44336'; // rouge
          default:
            return '#9E9E9E'; // gris
        }
      }

    openNew() {
        this.selectedAppointment = null;
        this.appointmentForm.reset({
            status: 'pending',
            duration: 60,
            appointmentDate: new Date()
        });
        this.submitted = false;
        this.appointmentDialog = true;
    }

    editAppointment(appointment: Appointment) {
        this.selectedAppointment = { ...appointment };
        this.appointmentForm.patchValue(this.selectedAppointment);
        this.appointmentDialog = true;
    }

    deleteAppointment(appointment: Appointment) {
        // Ici vous implémenteriez la logique de suppression
        // Exemple simplifié pour la démo
        this.appointments = this.appointments.filter((a) => a.id !== appointment.id);
        this.generateCalendarEvents();
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Rendez-vous supprimé', life: 3000 });
    }

    saveAppointment() {
        this.submitted = true;

        if (this.appointmentForm.valid) {
            const appointmentData = this.appointmentForm.value;

            if (this.selectedAppointment) {
                // Mise à jour d'un rendez-vous existant
                const index = this.appointments.findIndex((a) => a.id === this.selectedAppointment!.id);
                if (index !== -1) {
                    this.appointments[index] = { ...appointmentData };
                    this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Rendez-vous mis à jour', life: 3000 });
                }
            } else {
                // Création d'un nouveau rendez-vous
                appointmentData.id = this.getNextId();
                this.appointments.push(appointmentData);
                this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Rendez-vous créé', life: 3000 });
            }

            this.appointmentDialog = false;
            this.selectedAppointment = null;
            this.generateCalendarEvents();
        }
    }

    hideDialog() {
        this.appointmentDialog = false;
        this.submitted = false;
    }

    getNextId(): number {
        return Math.max(0, ...this.appointments.map((a) => a.id)) + 1;
    }

    onDateSelect(date: Date) {
        // Ouvrir le formulaire avec la date sélectionnée
        this.openNew();
        this.appointmentForm.patchValue({ appointmentDate: date });
    }

    getStatusSeverity(status: string): string {
        switch (status) {
            case 'pending':
                return 'warning';
            case 'confirmed':
                return 'info';
            case 'in-progress':
                return 'primary';
            case 'completed':
                return 'success';
            case 'cancelled':
                return 'danger';
            default:
                return 'secondary';
        }
    }

    getAppointmentStatusClass(status: string): string {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'confirmed':
                return 'bg-blue-100 text-blue-800';
            case 'in-progress':
                return 'bg-indigo-100 text-indigo-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    toggleView() {
        this.view = this.view === 'calendar' ? 'list' : 'calendar';
    }

    getMechanicNames(mechanicIds: number[]): string {
        if (!mechanicIds || mechanicIds.length === 0) return 'Aucun';

        return mechanicIds.map(id => {
          const mechanic = this.mechanicSlots.find(m => m.id === id);
          return mechanic ? mechanic.mechanicName : `Mécanicien #${id}`;
        }).join(', ');
    }

    getServiceLabels(serviceTypes: string[]): string {
        if (!serviceTypes || serviceTypes.length === 0) return 'Aucun';

        return serviceTypes.map(value => {
          const service = this.serviceTypes.find(s => s.value === value);
          return service ? service.label : value;
        }).join(', ');
      }
}
