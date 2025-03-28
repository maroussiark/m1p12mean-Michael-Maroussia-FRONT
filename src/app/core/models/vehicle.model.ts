// vehicle.model.ts
export interface VehicleTechnicalDetails {
    mileage: number;
    fuelType: string;
    lastMaintenanceDate?: Date;
}

export interface MaintenanceRecord {
    date: Date;
    serviceType: string;
    description?: string;
    mechanicId?: string;
    partsUsed?: string[];
}

export interface Vehicle {
    _id?: string;
    userId: string;
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    technicalDetails: VehicleTechnicalDetails;
    maintenanceHistory?: MaintenanceRecord[];
}
