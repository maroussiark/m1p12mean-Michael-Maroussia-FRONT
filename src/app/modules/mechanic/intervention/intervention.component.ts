import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { EditorModule } from 'primeng/editor';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

// Import real models
import { Appointment, AppointmentStatus, AppointmentService, PartUsage, Vehicle, ServiceType } from '../../../core/models';
import { Part } from '../../../core/models/part.model';
import { AppointmentsService } from '../../../core/services/appointments.service';
import { PartService } from '../../../core/services/part.service';
import { TextareaModule } from 'primeng/textarea';

interface Difficulty {
    name: string;
    description: string;
}

@Component({
    selector: 'app-intervention',
    templateUrl: './intervention.component.html',
    styleUrls: ['./intervention.component.scss'],
    providers: [MessageService, ConfirmationService],
    standalone: true,
    imports: [ReactiveFormsModule, ButtonModule, MultiSelectModule, ToastModule, CommonModule, InputNumberModule, FormsModule, EditorModule, TableModule, CalendarModule, ConfirmDialogModule, SelectModule, InputTextModule,TextareaModule]
})
export class InterventionComponent implements OnInit {
    workForm!: FormGroup;
    selectedAppointment: Appointment | null = null;
    searchText: string = '';
    dateFilter: Date | null = null;
    isLoading: boolean = false;

    difficulties: Difficulty[] = [
        { name: 'Difficult access', description: 'Parts difficult to access' },
        { name: 'Rusted parts', description: 'Heavily corroded elements' },
        { name: 'Non-standard parts', description: 'Specific parts required' },
        { name: 'Multiple issues', description: 'Several problems identified' }
    ];

    parts: Part[] = [];
    appointments: Appointment[] = [];
    filteredAppointments: Appointment[] = [];

    statusMap = {
        [AppointmentStatus.SCHEDULED]: { label: 'Planifié', class: 'bg-yellow-100 text-yellow-800' },
        [AppointmentStatus.VALIDATED]: { label: 'Validé', class: 'bg-blue-100 text-blue-800' },
        [AppointmentStatus.IN_PROGRESS]: { label: 'En cours', class: 'bg-blue-100 text-blue-800' },
        [AppointmentStatus.COMPLETED]: { label: 'Terminé', class: 'bg-green-100 text-green-800' },
        [AppointmentStatus.CANCELED]: { label: 'Annulé', class: 'bg-red-100 text-red-800' }
    };

    constructor(
        private fb: FormBuilder,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private appointmentService: AppointmentsService,
        private partService: PartService
    ) {}

    ngOnInit(): void {
        this.initForm();
        this.loadAppointments();
        this.loadParts();
    }

    initForm(): void {
        this.workForm = this.fb.group({
            partsUsed: this.fb.array([this.createPartFormGroup()]),
            timeSpent: ['', [Validators.required, Validators.min(0.1)]], // in hours
            difficulties: [[]],
            otherDifficulties: [''],
            recommendations: [''], // optional
            appointmentId: ['', Validators.required]
        });
    }

    createPartFormGroup(): FormGroup {
        return this.fb.group({
            part: [''],
            quantity: [1]
        });
    }

    loadAppointments(): void {
        this.isLoading = true;
        // In a real application, you would filter by mechanic ID, date range, etc.
        this.appointmentService.getAppointmentsForMechanic().subscribe({
            next: (appointments) => {
                this.appointments = appointments;
                this.filteredAppointments = [...this.appointments];
                this.isLoading = false;
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load appointments'
                });
                this.isLoading = false;
                console.error('Error loading appointments:', error);
            }
        });
    }

    loadParts(): void {
        this.partService.getParts().subscribe({
            next: (parts) => {
                this.parts = parts;
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load parts catalog'
                });
                console.error('Error loading parts:', error);
            }
        });
    }

    addPart(): void {
        const partsArray = this.workForm.get('partsUsed') as FormArray;
        partsArray.push(this.createPartFormGroup());
    }

    removePart(index: number): void {
        const partsArray = this.workForm.get('partsUsed') as FormArray;
        if (partsArray.length > 1) {
            partsArray.removeAt(index);
        } else {
            this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'At least one part is required'
            });
        }
    }

    filterAppointments(): void {
        this.filteredAppointments = this.appointments.filter((appointment) => {
            let matchDate = true;
            let matchText = true;

            if (this.dateFilter) {
                const filterDate = new Date(this.dateFilter);
                const appointmentDate = new Date(appointment.startTime!);
                matchDate = appointmentDate.getDate() === filterDate.getDate() && appointmentDate.getMonth() === filterDate.getMonth() && appointmentDate.getFullYear() === filterDate.getFullYear();
            }

            if (this.searchText.trim()) {
                const searchLower = this.searchText.toLowerCase();
                // Note: This would need to be enhanced with real client/vehicle data
                // that would be passed with appointments or retrieved separately
                matchText =
                    (appointment._id?.toLowerCase().includes(searchLower) || appointment.vehicleId?.toLowerCase().includes(searchLower) || appointment.services?.some((service) => service.serviceType.toLowerCase().includes(searchLower))) ?? false;
            }

            return matchDate && matchText;
        });
    }

    selectAppointment(appointment: Appointment): void {
        this.selectedAppointment = appointment;
        // Update appointment status to IN_PROGRESS if it's not already
        if (appointment.status === AppointmentStatus.SCHEDULED || appointment.status === AppointmentStatus.VALIDATED) {
            this.updateAppointmentStatus(appointment._id!, AppointmentStatus.IN_PROGRESS);
        }
        this.workForm.patchValue({ appointmentId: appointment._id });
    }

    cancelSelection(): void {
        this.confirmationService.confirm({
            message: 'Are you sure you want to change appointments? All entered data will be lost.',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.selectedAppointment = null;
                this.initForm();
            }
        });
    }

    getFormattedTime(date: Date): string {
        const d = new Date(date);
        return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
    }

    calculateDuration(appointment: Appointment): number {
        if (!appointment.endTime) {
            // Calculate from services if endTime not set
            return appointment.services?.reduce((total, service) => total + service.estimatedDuration, 0) ?? 0;
        }

        const start = new Date(appointment.startTime!);
        const end = new Date(appointment.endTime);
        return Math.round((end.getTime() - start.getTime()) / (1000 * 60)); // Minutes
    }

    updateAppointmentStatus(appointmentId: string, status: AppointmentStatus): void {
        const editedAppointment: Appointment = {
            _id: appointmentId,
            status: status
        };
        this.appointmentService.updateAppointment(editedAppointment).subscribe({
            next: (updated) => {
                // Update local data
                const index = this.appointments.findIndex((a) => a._id === appointmentId);
                if (index !== -1) {
                    this.appointments[index].status = status;

                    // If this is the selected appointment, update it too
                    if (this.selectedAppointment?._id === appointmentId) {
                        this.selectedAppointment.status = status;
                    }
                }

                this.messageService.add({
                    severity: 'info',
                    summary: 'Status Updated',
                    detail: `Appointment status updated to ${this.statusMap[status].label}`
                });
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to update appointment status'
                });
                console.error('Error updating status:', error);
            }
        });
    }

    submitWork(): void {
        if (this.workForm.valid && this.selectedAppointment) {
            this.isLoading = true;

            // Extract form data
            const formData = this.workForm.value;

            // Transform to match API expectations
            const partsUsed: PartUsage[] = formData.partsUsed.map((item: any) => ({
                part: item.part,
                quantity: item.quantity
            }));

            // Update the appointment with work details
            const workDetails = {
                _id: this.selectedAppointment._id,
                status: AppointmentStatus.COMPLETED,
                partsUsed: partsUsed,
                notes: this.selectedAppointment.notes
                    ? this.selectedAppointment.notes +
                      '\n\n--- WORK COMPLETED ---\n' +
                      `Time spent: ${formData.timeSpent} hours\n` +
                      `Difficulties: ${formData.difficulties.map((d: Difficulty) => d.name).join(', ')}\n` +
                      (formData.otherDifficulties ? `Other difficulties: ${formData.otherDifficulties}\n` : '') +
                      (formData.recommendations ? `Recommendations: ${formData.recommendations}` : '')
                    : `--- WORK COMPLETED ---\n` +
                      `Time spent: ${formData.timeSpent} hours\n` +
                      `Difficulties: ${formData.difficulties.map((d: Difficulty) => d.name).join(', ')}\n` +
                      (formData.otherDifficulties ? `Other difficulties: ${formData.otherDifficulties}\n` : '') +
                      (formData.recommendations ? `Recommendations: ${formData.recommendations}` : '')
            };

            this.appointmentService.updateAppointment(workDetails).subscribe({
                next: (updatedAppointment) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Work Completed',
                        detail: `Work recorded successfully for appointment #${updatedAppointment._id}`
                    });

                    // Update local data
                    const index = this.appointments.findIndex((a) => a._id === updatedAppointment._id);
                    if (index !== -1) {
                        this.appointments[index] = updatedAppointment;
                    }

                    this.selectedAppointment = null;
                    this.initForm();
                    this.isLoading = false;
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to record work'
                    });
                    this.isLoading = false;
                    console.error('Error recording work:', error);
                }
            });
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please complete all required fields'
            });
            this.validateAllFormFields(this.workForm);
        }
    }

    private validateAllFormFields(formGroup: FormGroup): void {
        Object.keys(formGroup.controls).forEach((field) => {
            const control = formGroup.get(field);
            if (control instanceof FormGroup) {
                this.validateAllFormFields(control);
            } else {
                control?.markAsTouched({ onlySelf: true });
            }
        });
    }

    get partsUsed(): FormArray {
        return this.workForm.get('partsUsed') as FormArray;
    }

    getVehicleDetails(vehicleId: string | Vehicle): string {
        if (typeof vehicleId !== 'string') {
            return `${vehicleId.make} ${vehicleId.model} (${vehicleId.licensePlate})`;
        }

        return 'Véhicule';
    }

    getServiceName(serviceId: string | ServiceType): string {
        if (typeof serviceId !== 'string') {
            return `${serviceId.name}`;
        }
        return 'Service';
    }
}
