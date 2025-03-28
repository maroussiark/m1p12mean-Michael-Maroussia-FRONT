// user.model.ts
export enum UserRole {
    USER = 'user',
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
    password?: string;
    role: UserRole;
    profile?: UserProfile;
    specialties?: string[];
    createdAt?: Date;
    lastLogin?: Date;
    isActive?: boolean;
    token?: string;
}
