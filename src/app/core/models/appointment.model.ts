// appointment.model.ts
export enum AppointmentStatus {
    SCHEDULED = 'scheduled',
    VALIDATED = 'validated',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    CANCELED = 'canceled'
}

export interface AppointmentService {
    serviceType: string; // ID du ServiceType
    estimatedDuration: number;
    estimatedCost: number;
}

export interface PartUsage {
    part: string; // ID de la pièce
    quantity: number;
}

export interface Appointment {
    _id?: string;
    clientId?: string;
    vehicleId?: string;
    mechanics?: string[];
    startTime?: Date;
    endTime?: Date;
    status: AppointmentStatus;
    services?: AppointmentService[];
    totalEstimatedCost?: number;
    partsUsed?: PartUsage[];
    notes?: string;
}
