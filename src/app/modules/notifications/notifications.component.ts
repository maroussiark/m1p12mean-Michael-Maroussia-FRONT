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

import { CommonModule } from '@angular/common';
  // notifications.component.ts
  import { Component, OnInit } from '@angular/core';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

  @Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.scss'],
    imports:[BadgeModule,TableModule,ButtonModule,CommonModule]
  })
  export class NotificationsComponent implements OnInit {
    notifications: Notification[] = [];

    // Configuration pour PrimeNG DataTable
    cols: any[] = [
      { field: 'type', header: 'Type' },
      { field: 'message', header: 'Message' },
      { field: 'isRead', header: 'Statut' },
      { field: 'actions', header: 'Actions' }
    ];

    constructor() {}

    ngOnInit(): void {
      this.loadNotifications();
    }

    loadNotifications(): void {
      // Mock data service (replace with actual API call)
      this.notifications = [
        {
          _id: '1',
          userId: 'user123',
          type: NotificationType.APPOINTMENT,
          message: 'Votre rendez-vous est confirmé pour demain',
          relatedEntityId: 'appt456',
          isRead: false,
          createdAt: new Date()
        },
        {
          _id: '2',
          userId: 'user123',
          type: NotificationType.INVOICE,
          message: 'Nouvelle facture disponible',
          relatedEntityId: 'inv789',
          isRead: true,
          createdAt: new Date()
        }
      ];
    }

    // Méthode pour obtenir la classe de badge en fonction du type
    getNotificationTypeClass(type: NotificationType): string {
      const typeClassMap = {
        [NotificationType.APPOINTMENT]: 'bg-blue-500 text-white',
        [NotificationType.INVOICE]: 'bg-green-500 text-white',
        [NotificationType.MAINTENANCE]: 'bg-orange-500 text-white',
        [NotificationType.SYSTEM]: 'bg-gray-500 text-white'
      };
      return typeClassMap[type] || 'bg-gray-200';
    }

    // Marquer une notification comme lue
    markAsRead(notification: Notification): void {
      if (!notification.isRead) {
        notification.isRead = true;
        // En pratique, vous appelleriez un service backend
        // this.notificationService.markAsRead(notification._id)
      }
    }
  }
