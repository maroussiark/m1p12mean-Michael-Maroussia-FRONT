// service-type.model.ts
export interface ServiceType {
    _id?: string;
    name: string;
    description?: string;
    defaultDuration: number;
    requiredSpecialties?: string[];
    baseCost: number;
}
