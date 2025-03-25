// user.model.ts
export enum UserRole {
    CLIENT = 'client',
    MECHANIC = 'mechanic',
    ADMIN = 'admin'
}

export interface UserProfile {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
}

export interface User {
    _id?: string;
    email: string;
    password?: string; // Ne devrait être présent que pour les requêtes POST
    role: UserRole;
    profile?: UserProfile;
    specialties?: string[];
    hourlyRate?: number;
    createdAt?: Date;
    lastLogin?: Date;
    isActive?: boolean;
    token?: string;
}
