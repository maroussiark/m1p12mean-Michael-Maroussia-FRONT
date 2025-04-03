import { VehicleService } from './../../../core/services/vehicle.service';
import { ServiceTypeService } from './../../../core/services/service-type.service';
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
import { AppointmentsService } from '../../../core/services/appointments.service';
import { UserService } from '../../../core/services/user.service';

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
    clients: User[] = [];
    filteredVehicles: Vehicle[] = [];
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
        events: [],  // Initialize with empty array, will be properly set later
        eventClick: this.handleEventClick.bind(this),
        select: this.handleDateSelect.bind(this)
    };

    filteredAppointments: Appointment[] = [];

    onGlobalFilter(event: any) {
        const searchTerm = event.target.value.toLowerCase();
        this.filteredAppointments = this.appointments.filter(appointment =>
            this.getClientName(appointment.clientId!).toLowerCase().includes(searchTerm) ||
            this.getVehicleDetails(appointment.vehicleId!).toLowerCase().includes(searchTerm)
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

    getClientName(clientId: string | User): string {
        if (typeof clientId !== 'string') {
            return `${clientId.profile?.firstName} ${clientId.profile?.lastName}`;
        }
        return 'Nom du Client';
    }

    getVehicleDetails(vehicleId: string | Vehicle): string {
        if (typeof vehicleId !== 'string') {
            return `${vehicleId.make} ${vehicleId.model} (${vehicleId.licensePlate})`;
        }
        const vehicle = this.vehicles.find(v => v._id === vehicleId);
        return vehicle ? `${vehicle.make} ${vehicle.model} (${vehicle.licensePlate})` : 'Véhicule';
    }

    getMechanicName(mechanicId: string | User): string {
        if(typeof mechanicId != 'string'){
            return  `${mechanicId.profile?.firstName} ${mechanicId.profile?.lastName}` ;
        }
        const mechanic = this.mechanics.find(m => m.id === mechanicId);
        return mechanic ? `${mechanic.profile?.firstName} ${mechanic.profile?.lastName}` : 'Mécanicien';
    }

    getMechanicInitials(mechanicId: string): string {
        const name = this.getMechanicName(mechanicId);
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }

    calculateTotalDuration(appointment: Appointment): number {
        return appointment.services?.reduce((total, service) => total + service.estimatedDuration, 0) || 0;
    }

    getServiceName(serviceId: string | ServiceType): string {
        if (typeof serviceId !== 'string') {
            return `${serviceId.name}`;
        }
        const service = this.serviceTypes.find(s => s._id === serviceId);
        return service ? service.name : 'Service';
    }

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
        private messageService: MessageService,
        private appointmentsService: AppointmentsService,
        private serviceTypeService: ServiceTypeService,
        private vehicleService: VehicleService,
        private userService: UserService
    ) {
        this.initForm();
    }

    ngOnInit() {
        this.loadInitialData();
        // Removal: no need to call generateCalendarEvents here yet
        // as we don't have any appointments loaded at this point
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
        this.appointmentForm.get('clientId')?.valueChanges.subscribe(clientId => {
            if (clientId) {
                this.filterVehiclesByClient(clientId);
            } else {
                this.filteredVehicles = [];
                this.appointmentForm.get('vehicleId')?.setValue(null);
            }
        });
    }

    loadInitialData() {
        // Load data in correct sequence
        this.loadClients();
        this.loadMechanics();
        this.loadServiceTypes();
        this.loadVehicles();
        // Load appointments last, as it may depend on the other data
        this.loadAppointments();
    }

    loadClients() {
        this.userService.getAllClients().subscribe({
            next: (users) => {
                this.clients = users;
            },
            error: (err) => console.error('Error loading clients:', err)
        });
    }

    loadMechanics() {
        this.userService.getAllMechanics().subscribe({
            next: (users) => this.mechanics = users,
            error: (err) => console.error('Error loading mechanics:', err)
        });
    }

    loadServiceTypes() {
        this.serviceTypeService.getAllServiceTypes().subscribe({
            next: (services) => this.serviceTypes = services,
            error: (err) => console.error('Error loading service types:', err)
        });
    }

    loadVehicles() {
        this.vehicleService.getAllVehicles().subscribe({
            next: (vehicles) => this.vehicles = vehicles,
            error: (err) => console.error('Error loading vehicles:', err)
        });
    }

    loadAppointments() {
        this.appointmentsService.getAppointments().subscribe({
            next: (appointments) => {
                console.log('Appointments loaded:', appointments);
                this.appointments = appointments;
                this.filteredAppointments = [...appointments]; // Initialize filtered list
                this.generateCalendarEvents(); // Now generate calendar events after loading appointments
            },
            error: (err) => {
                console.error('Error loading appointments:', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Impossible de charger les rendez-vous'
                });
            }
        });
    }

    filterVehiclesByClient(clientId: string) {
        this.filteredVehicles = this.vehicles.filter(vehicle => vehicle.userId === clientId);

        // Si un seul véhicule, le sélectionner automatiquement
        if (this.filteredVehicles.length === 1) {
            this.appointmentForm.get('vehicleId')?.setValue(this.filteredVehicles[0]._id);
        } else if (this.filteredVehicles.length === 0) {
            // Si aucun véhicule, afficher un message
            this.messageService.add({
                severity: 'info',
                summary: 'Information',
                detail: 'Ce client n\'a pas de véhicule enregistré'
            });
        }
    }

    handleEventClick(info: any) {
        console.log('Event clicked:', info.event);
        const appointmentId = info.event.id;
        const appointment = this.appointments.find((a) => a._id === appointmentId);
        if (appointment) {
            this.editAppointment(appointment);
        } else {
            console.error('Appointment not found with ID:', appointmentId);
        }
    }

    handleDateSelect(selectInfo: any) {
        console.log('Date selected:', selectInfo);
        const startTime = new Date(selectInfo.start);

        this.openNew();
        this.appointmentForm.patchValue({
            startTime: startTime
        });
    }

    generateCalendarEvents() {
        console.log('Generating calendar events from appointments:', this.appointments);

        if (!this.appointments || this.appointments.length === 0) {
            console.warn('No appointments available to generate calendar events');
            this.calendarEvents = [];
            this.updateCalendarOptions();
            return;
        }

        try {
            this.calendarEvents = this.appointments.map(appointment => {
                // Ensure dates are properly parsed
                const startTime = new Date(appointment.startTime!);
                const endTime = appointment.endTime ?
                                new Date(appointment.endTime) :
                                this.calculateEndTime(appointment);

                return {
                    id: appointment._id,
                    title: this.getAppointmentTitle(appointment),
                    start: startTime,
                    end: endTime,
                    backgroundColor: this.getStatusColor(appointment.status)
                };
            });

            console.log('Generated calendar events:', this.calendarEvents);
            this.updateCalendarOptions();
        } catch (error) {
            console.error('Error generating calendar events:', error);
        }
    }

    updateCalendarOptions() {
        this.calendarOptions = {
            ...this.calendarOptions,
            events: this.calendarEvents
        };
        console.log('Updated calendar options:', this.calendarOptions);
    }

    getAppointmentTitle(appointment: Appointment): string {
        // Find the vehicle associated with this appointment
        const vehicle = typeof appointment.vehicleId === 'string' ?
            this.vehicles.find(v => v._id === appointment.vehicleId) :
            appointment.vehicleId;

        if (vehicle) {
            return `${vehicle.make} ${vehicle.model} - ${vehicle.licensePlate}`;
        }

        // Fallback to just showing appointment ID if vehicle not found
        return `Rendez-vous ${appointment._id?.substring(0, 6)}`;
    }

    calculateEndTime(appointment: Appointment): Date {
        if (!appointment.startTime) {
            console.error('Appointment has no startTime:', appointment);
            return new Date(); // Return current time as fallback
        }

        // Ensure startTime is a Date object
        const startTime = new Date(appointment.startTime);

        // Calculate total duration from services
        const totalDuration = appointment.services?.reduce(
            (total, service) => {
                if (typeof service === 'string') {
                    // If service is just an ID string
                    const serviceType = this.serviceTypes.find(s => s._id === service);
                    return total + (serviceType?.defaultDuration || 60); // Default to 60 min if not found
                } else if (service.estimatedDuration) {
                    // If service has estimatedDuration directly
                    return total + service.estimatedDuration;
                } else if (service.serviceType) {
                    // If service has a reference to serviceType
                    const serviceTypeId = typeof service.serviceType === 'string' ?
                        service.serviceType :
                        (service.serviceType as ServiceType)._id;
                    const serviceType = this.serviceTypes.find(s => s._id === serviceTypeId);
                    return total + (serviceType?.defaultDuration || 60);
                }
                return total + 60; // Default to 60 minutes if structure unclear
            },
            0
        );

        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + (totalDuration || 60)); // Use 60 min if no duration calculated
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
        console.log('Editing appointment:', appointment);
        this.selectedAppointment = { ...appointment };

        // Properly format the appointment data for the form
        // This is crucial for the edit functionality to work correctly
        if (appointment.clientId) {
            const clientId = typeof appointment.clientId === 'string' ?
                appointment.clientId : (appointment.clientId as unknown as User).id;
            if (clientId) {
                this.filterVehiclesByClient(clientId);
            }

            }
        this.appointmentForm.patchValue({
            _id: appointment._id,
            clientId: typeof appointment.clientId === 'string' ?
                appointment.clientId : (appointment.clientId as unknown as User)?.id,
            vehicleId: typeof appointment.vehicleId === 'string' ?
                appointment.vehicleId : (appointment.vehicleId as unknown as Vehicle)?._id,
            mechanics: appointment.mechanics
                ? appointment.mechanics.map(m => typeof m === 'string' ? m : (m as User).id)
                : [],
            startTime: new Date(appointment.startTime!),
            endTime: appointment.endTime ? new Date(appointment.endTime) : null,
            status: appointment.status,
            notes: appointment.notes || '',
            services: this.formatServicesForForm(appointment.services!),
            totalEstimatedCost: appointment.totalEstimatedCost || 0,
            partsUsed: appointment.partsUsed || []
        });
        this.appointmentDialog = true;
    }

    formatServicesForForm(services: any[]): any[] {
        // Handle different possible structures of the services array
        if (!services || services.length === 0) return [];

        // If services are already in the right format, return them
        if (typeof services[0] === 'string') {
            return services;
        }

        // If services are objects with serviceType property
        return services.map(service => {
            if (typeof service.serviceType === 'string') {
                return service.serviceType;
            } else if (service.serviceType) {
                return (service.serviceType && (service.serviceType as any)._id) || service;
            }
            return service; // Return original if can't determine format
        });
    }

    deleteAppointment(appointment: Appointment) {
        if (!appointment._id) {
            console.error('Cannot delete appointment without ID');
            return;
        }

        // You would typically call a service method here
        this.appointmentsService.deleteAppointment(appointment._id).subscribe({
            next: () => {
                this.appointments = this.appointments.filter(a => a._id !== appointment._id);
                this.filteredAppointments = this.filteredAppointments.filter(a => a._id !== appointment._id);
                this.generateCalendarEvents();
                this.messageService.add({
                    severity: 'success',
                    summary: 'Supprimé',
                    detail: 'Rendez-vous supprimé'
                });
            },
            error: (err) => {
                console.error('Error deleting appointment:', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Impossible de supprimer le rendez-vous'
                });
            }
        });
    }

    saveAppointment() {
        this.submitted = true;

        if (this.appointmentForm.valid) {
            const appointmentData: Appointment = this.appointmentForm.value;
            console.log('Saving appointment data:', appointmentData);

            // Ensure startTime is a Date object
            if (appointmentData.startTime && !(appointmentData.startTime instanceof Date)) {
                appointmentData.startTime = new Date(appointmentData.startTime);
            }

            // Ensure endTime is calculated if not provided
            if (!appointmentData.endTime) {
                appointmentData.endTime = this.calculateEndTime(appointmentData);
            } else if (!(appointmentData.endTime instanceof Date)) {
                appointmentData.endTime = new Date(appointmentData.endTime);
            }

            // Prepare services array in the correct format for the API
            appointmentData.services = this.formatServicesForAPI(appointmentData.services!);

            // Calculate total estimated cost
            appointmentData.totalEstimatedCost = this.calculateTotalCost(appointmentData.services);

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
                this.appointmentsService.updateAppointment(appointmentData).subscribe({
                    next: (updatedAppointment) => {
                        const index = this.appointments.findIndex(a => a._id === this.selectedAppointment!._id);
                        if (index !== -1) {
                            this.appointments[index] = updatedAppointment;
                            this.filteredAppointments = [...this.appointments]; // Refresh filtered list
                        }
                        this.generateCalendarEvents();
                        this.appointmentDialog = false;
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Succès',
                            detail: 'Rendez-vous mis à jour'
                        });
                    },
                    error: (err) => {
                        console.error('Error updating appointment:', err);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erreur',
                            detail: 'Impossible de mettre à jour le rendez-vous'
                        });
                    }
                });
            } else {
                // Create new appointment
                this.appointmentsService.createAppointment(appointmentData).subscribe({
                    next: (newAppointment) => {
                        this.appointments.push(newAppointment);
                        this.filteredAppointments = [...this.appointments]; // Refresh filtered list
                        this.generateCalendarEvents();
                        this.appointmentDialog = false;
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Succès',
                            detail: 'Rendez-vous créé'
                        });
                    },
                    error: (err) => {
                        console.error('Error creating appointment:', err);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erreur',
                            detail: 'Impossible de créer le rendez-vous'
                        });
                    }
                });
            }
        } else {
            // Form validation failed
            console.error('Form validation errors:', this.appointmentForm.errors);
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Veuillez remplir tous les champs obligatoires'
            });
        }
    }

    formatServicesForAPI(services: any[]): any[] {
        // Format services from form structure to API structure
        if (!services || services.length === 0) return [];

        return services.map(serviceId => {
            if (typeof serviceId === 'string') {
                const serviceType = this.serviceTypes.find(s => s._id === serviceId);
                return {
                    serviceType: serviceId,
                    estimatedDuration: serviceType?.defaultDuration || 60,
                    baseCost: serviceType?.baseCost || 0
                };
            }
            return serviceId; // Return as is if already in the right format
        });
    }

    calculateTotalCost(services: any[]): number {
        if (!services || services.length === 0) return 0;

        return services.reduce((total, service) => {
            if (typeof service === 'string') {
                // If service is just an ID
                const serviceType = this.serviceTypes.find(s => s._id === service);
                return total + (serviceType?.baseCost || 0);
            } else if (service.baseCost) {
                // If service has baseCost directly
                return total + service.baseCost;
            } else if (service.serviceType) {
                // If service has a reference to serviceType
                const serviceTypeId = typeof service.serviceType === 'string' ?
                    service.serviceType :
                    service.serviceType._id;
                const serviceType = this.serviceTypes.find(s => s._id === serviceTypeId);
                return total + (serviceType?.baseCost || 0);
            }
            return total;
        }, 0);
    }

    validateMechanicAvailability(newAppointment: Appointment): boolean {
        if (!newAppointment.mechanics || newAppointment.mechanics.length === 0) {
            return true; // No mechanics assigned, so no conflicts
        }

        if (!newAppointment.startTime) {
            return false; // Invalid appointment, no start time
        }

        const newStart = new Date(newAppointment.startTime);
        const newEnd = newAppointment.endTime ?
                     new Date(newAppointment.endTime) :
                     this.calculateEndTime(newAppointment);

        return newAppointment.mechanics.every(mechanicId => {
            // Check if this mechanic is already booked during this time
            const conflictingAppointment = this.appointments.find(app =>
                app._id !== newAppointment._id &&
                app.mechanics &&
                app.mechanics.includes(mechanicId) &&
                this.isTimeOverlap(
                    newStart,
                    newEnd,
                    new Date(app.startTime!),
                    app.endTime ? new Date(app.endTime) : this.calculateEndTime(app)
                )
            );

            return !conflictingAppointment;
        });
    }

    isTimeOverlap(start1: Date, end1: Date, start2: Date, end2: Date): boolean {
        return start1 < end2 && start2 < end1;
    }

    hideDialog() {
        this.appointmentDialog = false;
        this.submitted = false;
    }

    onDateSelect(date: Date) {
        this.openNew();
        this.appointmentForm.patchValue({ startTime: date });
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

    getClientFullName(client: User): string {
        return `${client.profile?.firstName || ''} ${client.profile?.lastName || ''}`;
    }

    getVehicleWithOwner(vehicle: Vehicle): string {
        const owner = this.clients.find(c => c.id === vehicle.userId);
        const ownerName = owner ? this.getClientFullName(owner) : 'Propriétaire inconnu';
        return `${vehicle.make} ${vehicle.model} (${vehicle.licensePlate}) - ${ownerName}`;
    }
}
