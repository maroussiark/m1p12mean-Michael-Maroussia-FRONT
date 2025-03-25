// notification.model.ts
export enum NotificationType {
    APPOINTMENT = 'appointment',
    INVOICE = 'invoice',
    MAINTENANCE = 'maintenance',
    SYSTEM = 'system'
}

export interface Notification {
    _id?: string;
    userId: string;
    type: NotificationType;
    message: string;
    relatedEntityId: string;
    isRead?: boolean;
    createdAt?: Date;
}
