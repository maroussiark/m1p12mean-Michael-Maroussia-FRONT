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
import timeGridPlugin from '@fullcalendar/timegrid';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import { MultiSelectModule } from 'primeng/multiselect';

import { Vehicle, ServiceType, Appointment, AppointmentStatus, AppointmentService, Part, User, UserRole } from '../../../core/models';
import { SelectModule } from 'primeng/select';

@Component({
    selector: 'app-planning-appointment',
    imports: [CommonModule, ButtonModule, CalendarModule, TableModule, DialogModule, ReactiveFormsModule,
        ToastModule, InputNumberModule, DropdownModule, FullCalendarModule,MultiSelectModule, SelectModule],
    templateUrl: './planning-appointment.component.html',
    styleUrls: ['./planning-appointment.component.scss'],
    providers: [MessageService]
})
export class PlanningAppointmentComponent implements OnInit {
    appointments: Appointment[] = [];
    mechanics: User[] = [];
    serviceTypes: ServiceType[] = [];
    vehicles: Vehicle[] = [];

    appointmentForm!: FormGroup;
    appointmentDialog: boolean = false;
    selectedAppointment: Appointment | null = null;
    submitted: boolean = false;

    view: 'calendar' | 'list' = 'calendar';
    date: Date = new Date();

    statusOptions = Object.entries(AppointmentStatus).map(([key, value]) => ({
        label: this.formatStatusLabel(value),
        value
      }));

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

    filteredAppointments: Appointment[] = [];

    onGlobalFilter(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredAppointments = this.appointments.filter(appointment =>
        this.getClientName(appointment.clientId).toLowerCase().includes(searchTerm) ||
        this.getVehicleDetails(appointment.vehicleId).toLowerCase().includes(searchTerm)
    );
    }

    filterAppointments(event: any) {
    const status = event.value;
    this.filteredAppointments = status
        ? this.appointments.filter(a => a.status === status)
        : this.appointments;
    }

    getStatusChipClass(status?: AppointmentStatus): string {
        if (!status) {
            return 'px-3 py-1 rounded-full text-xs font-medium text-gray-500';
          }
    const baseClass = 'px-3 py-1 rounded-full text-xs font-medium';
    switch (status) {
        case AppointmentStatus.SCHEDULED: return `${baseClass} bg-yellow-100 text-yellow-800`;
        case AppointmentStatus.VALIDATED: return `${baseClass} bg-blue-100 text-blue-800`;
        case AppointmentStatus.IN_PROGRESS: return `${baseClass} bg-indigo-100 text-indigo-800`;
        case AppointmentStatus.COMPLETED: return `${baseClass} bg-green-100 text-green-800`;
        case AppointmentStatus.CANCELED: return `${baseClass} bg-red-100 text-red-800`;
        default: return `${baseClass} bg-gray-100 text-gray-800`;
    }
    }

    // Utility methods (these would typically come from services)
    getClientName(clientId: string): string {
    // Fetch client name from users or clients service
    return 'Nom du Client';
    }

    getVehicleDetails(vehicleId: string): string {
    const vehicle = this.vehicles.find(v => v._id === vehicleId);
    return vehicle ? `${vehicle.make} ${vehicle.model} (${vehicle.licensePlate})` : 'Véhicule';
    }

    getMechanicName(mechanicId: string): string {
    const mechanic = this.mechanics.find(m => m._id === mechanicId);
    return mechanic ? `${mechanic.profile?.firstName} ${mechanic.profile?.lastName}` : 'Mécanicien';
    }

    getMechanicInitials(mechanicId: string): string {
    const name = this.getMechanicName(mechanicId);
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }

    calculateTotalDuration(appointment: Appointment): number {
    return appointment.services.reduce((total, service) => total + service.estimatedDuration, 0);
    }

    getServiceName(serviceId: string): string {
    const service = this.serviceTypes.find(s => s._id === serviceId);
    return service ? service.name : 'Service';
    }

    // Appointment details modal methods
    appointmentDetailsVisible = false;
    viewAppointmentDetails(appointment: Appointment) {
    this.selectedAppointment = appointment;
    this.appointmentDetailsVisible = true;
    }

    closeAppointmentDetails() {
    this.appointmentDetailsVisible = false;
    this.selectedAppointment = null;
    }

    constructor(
        private formBuilder: FormBuilder,
        private messageService: MessageService
    ) {
        this.initForm();
    }

    ngOnInit() {
        console.log(this.statusOptions[0]);

        this.loadInitialData();
        this.generateCalendarEvents(); // Ajoutez cette ligne

    }

    initForm() {
        this.appointmentForm = this.formBuilder.group({
          _id: [null],
          clientId: [null],
          vehicleId: [null, Validators.required],
          mechanics: [[], Validators.required],
          startTime: [null, Validators.required],
          endTime: [null],
          status: [AppointmentStatus.SCHEDULED, Validators.required],
          services: [[], Validators.required],
          totalEstimatedCost: [0],
          partsUsed: [[]],
          notes: ['']
        });
    }

    loadInitialData() {
        // These would typically come from services
        this.loadMechanics();
        this.loadServiceTypes();
        this.loadAppointments();
        this.loadVehicles();
    }

    loadMechanics() {
        this.mechanics = [
            {
              _id: '1',
              email: 'jean.dupont@garage.com',
              role: UserRole.MECHANIC,
              profile: {
                firstName: 'Jean',
                lastName: 'Dupont',
                phoneNumber: '+33612345678'
              },
              specialties: ['engine', 'electrical']
            },
            {
              _id: '2',
              email: 'marie.lenoir@garage.com',
              role: UserRole.MECHANIC,
              profile: {
                firstName: 'Marie',
                lastName: 'Lenoir',
                phoneNumber: '+33687654321'
              },
              specialties: ['brakes', 'suspension']
            },
            {
              _id: '3',
              email: 'paul.martin@garage.com',
              role: UserRole.MECHANIC,
              profile: {
                firstName: 'Paul',
                lastName: 'Martin',
                phoneNumber: '+33711223344'
              },
              specialties: ['tires', 'alignment']
            },
            {
              _id: '4',
              email: 'lucie.durand@garage.com',
              role: UserRole.MECHANIC,
              profile: {
                firstName: 'Lucie',
                lastName: 'Durand',
                phoneNumber: '+33699887766'
              },
              specialties: ['engine', 'transmission']
            }
          ];
    }

    loadServiceTypes() {
        this.serviceTypes = [
            {
              _id: '1',
              name: 'Oil Change',
              description: 'Regular engine oil and filter replacement',
              defaultDuration: 60,
              requiredSpecialties: ['engine'],
              baseCost: 50
            },
            {
              _id: '2',
              name: 'Brake Inspection',
              description: 'Complete check of the braking system',
              defaultDuration: 45,
              requiredSpecialties: ['brakes'],
              baseCost: 40
            },
            {
              _id: '3',
              name: 'Tire Rotation',
              description: 'Tire rotation to extend tire life',
              defaultDuration: 30,
              requiredSpecialties: ['tires'],
              baseCost: 25
            },
            {
              _id: '4',
              name: 'Suspension Check',
              description: 'Inspection of suspension components',
              defaultDuration: 50,
              requiredSpecialties: ['suspension'],
              baseCost: 60
            }
          ];

    }

    loadVehicles() {
        this.vehicles = [
            {
              _id: '1',
              userId: 'client1',
              make: 'Peugeot',
              model: '308',
              year: 2019,
              licensePlate: 'AB-123-CD',
              technicalDetails: {
                mileage: 45000,
                fuelType: 'diesel'
              }
            },
            {
              _id: '2',
              userId: 'client2',
              make: 'Renault',
              model: 'Clio',
              year: 2020,
              licensePlate: 'BC-456-EF',
              technicalDetails: {
                mileage: 30000,
                fuelType: 'petrol'
              }
            },
            {
              _id: '3',
              userId: 'client3',
              make: 'Citroën',
              model: 'C3',
              year: 2021,
              licensePlate: 'CD-789-GH',
              technicalDetails: {
                mileage: 15000,
                fuelType: 'electric'
              }
            },
            {
              _id: '4',
              userId: 'client4',
              make: 'Toyota',
              model: 'Yaris',
              year: 2018,
              licensePlate: 'DE-012-IJ',
              technicalDetails: {
                mileage: 60000,
                fuelType: 'hybrid'
              }
            }
          ];

    }

    loadAppointments() {
        this.appointments = [
            {
              _id: '1',
              clientId: 'client1',
              vehicleId: '1',
              mechanics: ['1'],
              startTime: new Date('2025-04-01T10:00:00'),
              status: AppointmentStatus.SCHEDULED,
              services: [{
                serviceType: '1',
                estimatedDuration: 60,
                estimatedCost: 50
              }]
            },
            {
              _id: '2',
              clientId: 'client2',
              vehicleId: '2',
              mechanics: ['2'],
              startTime: new Date('2025-04-02T11:30:00'),
              status: AppointmentStatus.SCHEDULED,
              services: [{
                serviceType: '2',
                estimatedDuration: 45,
                estimatedCost: 40
              }]
            },
            {
              _id: '3',
              clientId: 'client3',
              vehicleId: '3',
              mechanics: ['3'],
              startTime: new Date('2025-04-03T09:00:00'),
              status: AppointmentStatus.COMPLETED,
              services: [{
                serviceType: '3',
                estimatedDuration: 30,
                estimatedCost: 25
              }]
            },
            {
              _id: '4',
              clientId: 'client4',
              vehicleId: '4',
              mechanics: ['4'],
              startTime: new Date('2025-04-04T14:00:00'),
              status: AppointmentStatus.SCHEDULED,
              services: [{
                serviceType: '4',
                estimatedDuration: 50,
                estimatedCost: 60
              }]
            }
          ];

          this.generateCalendarEvents();
    }

    // Ajoutez ces méthodes dans la classe
    handleEventClick(info: any) {
        const appointmentId = info.event.id;
        const appointment = this.appointments.find((a) => Number(a._id) === Number(appointmentId));
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
        this.calendarEvents = this.appointments.map(appointment => ({
            id: appointment._id,
            title: this.getAppointmentTitle(appointment),
            start: appointment.startTime,
            end: appointment.endTime || this.calculateEndTime(appointment),
            backgroundColor: this.getStatusColor(appointment.status)
        }));

        // Mettre à jour les options du calendrier avec les events générés
        this.calendarOptions = {
            ...this.calendarOptions,
            events: this.calendarEvents
        };
    }

    getAppointmentTitle(appointment: Appointment): string {
        const vehicle = this.vehicles.find(v => v._id === appointment.vehicleId);
        return vehicle
          ? `${vehicle.make} ${vehicle.model} - ${vehicle.licensePlate}`
          : 'Rendez-vous';
    }

    calculateEndTime(appointment: Appointment): Date {
        const totalDuration = appointment.services.reduce(
          (total, service) => total + service.estimatedDuration,
          0
        );
        const endTime = new Date(appointment.startTime);
        endTime.setMinutes(endTime.getMinutes() + totalDuration);
        return endTime;
    }

    getStatusColor(status: AppointmentStatus): string {
        switch (status) {
          case AppointmentStatus.SCHEDULED:
            return '#FFC107'; // yellow
          case AppointmentStatus.VALIDATED:
            return '#2196F3'; // blue
          case AppointmentStatus.IN_PROGRESS:
            return '#673AB7'; // purple
          case AppointmentStatus.COMPLETED:
            return '#4CAF50'; // green
          case AppointmentStatus.CANCELED:
            return '#F44336'; // red
          default:
            return '#9E9E9E'; // gray
        }
    }

    openNew() {
        this.selectedAppointment = null;
        this.appointmentForm.reset({
          status: AppointmentStatus.SCHEDULED,
          startTime: new Date(),
          services: []
        });
        this.appointmentDialog = true;
    }

    editAppointment(appointment: Appointment) {
        this.selectedAppointment = { ...appointment };
        this.appointmentForm.patchValue({
            ...appointment,
            services: appointment.services.map(s => s.serviceType) // uniquement les _id
          });
        this.appointmentDialog = true;
    }

    deleteAppointment(appointment: Appointment) {
        this.appointments = this.appointments.filter(a => a._id !== appointment._id);
        this.generateCalendarEvents();
        this.messageService.add({
          severity: 'success',
          summary: 'Supprimé',
          detail: 'Rendez-vous supprimé'
        });
      }

    saveAppointment() {
        this.submitted = true;

        if (this.appointmentForm.valid) {
          const appointmentData: Appointment = this.appointmentForm.value;

          // Calculate total estimated cost
          appointmentData.totalEstimatedCost = appointmentData.services.reduce(
            (total, service) => {
              const serviceType = this.serviceTypes.find(s => s._id === service.serviceType);
              return total + (serviceType?.baseCost || 0);
            },
            0
          );

          // Validate mechanic availability
          if (!this.validateMechanicAvailability(appointmentData)) {
            this.messageService.add({
              severity: 'error',
              summary: 'Conflit',
              detail: 'Un ou plusieurs mécaniciens sont déjà occupés à ce moment'
            });
            return;
          }

          if (this.selectedAppointment?._id) {
            // Update existing appointment
            const index = this.appointments.findIndex(a => a._id === this.selectedAppointment!._id);
            if (index !== -1) {
              this.appointments[index] = appointmentData;
            }
          } else {
            // Create new appointment
            appointmentData._id = this.generateTempId();
            this.appointments.push(appointmentData);
          }

          this.generateCalendarEvents();
          this.appointmentDialog = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Rendez-vous enregistré'
          });
        }
    }

    validateMechanicAvailability(newAppointment: Appointment): boolean {
        const newStart = newAppointment.startTime;
        const newEnd = newAppointment.endTime || this.calculateEndTime(newAppointment);

        return newAppointment.mechanics.every(mechanicId => {
          // Check if this mechanic is already booked during this time
          const conflictingAppointment = this.appointments.find(app =>
            app._id !== newAppointment._id &&
            app.mechanics.includes(mechanicId) &&
            this.isTimeOverlap(
              newStart,
              newEnd,
              app.startTime,
              app.endTime || this.calculateEndTime(app)
            )
          );

          return !conflictingAppointment;
        });
      }

      isTimeOverlap(start1: Date, end1: Date, start2: Date, end2: Date): boolean {
        return start1 < end2 && start2 < end1;
      }

      generateTempId(): string {
        return `temp_${Math.random().toString(36).substr(2, 9)}`;
      }

    hideDialog() {
        this.appointmentDialog = false;
        this.submitted = false;
    }

    getNextId(): number {
        return Math.max(0, ...this.appointments.map((a) => Number(a._id) || 0)) + 1;
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

    formatStatusLabel(status: string): string {
        switch (status) {
          case AppointmentStatus.SCHEDULED: return 'Planifié';
          case AppointmentStatus.VALIDATED: return 'Validé';
          case AppointmentStatus.IN_PROGRESS: return 'En cours';
          case AppointmentStatus.COMPLETED: return 'Terminé';
          case AppointmentStatus.CANCELED: return 'Annulé';
          default: return status;
        }
      }

      getServiceNameById(id: string): string {
        const service = this.serviceTypes.find(s => s._id === id);
        return service ? service.name : 'Inconnu';
      }


}
