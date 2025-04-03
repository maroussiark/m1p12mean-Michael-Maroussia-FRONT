import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutService } from '../service/layout.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { Notification } from '../../core/models';
import { BadgeModule } from 'primeng/badge';
import { OverlayPanelModule, OverlayPanel } from 'primeng/overlaypanel';
import { Subscription } from 'rxjs';
import { TooltipModule } from 'primeng/tooltip';
import { Socket } from 'socket.io-client';
import { OverlayBadgeModule } from 'primeng/overlaybadge';


@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [
        RouterModule,
        CommonModule,
        StyleClassModule,
        BadgeModule,
        OverlayPanelModule,
        TooltipModule,
        OverlayBadgeModule
    ],
    template: ` <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                <i class="pi pi-bars"></i>
            </button>
            <a class="layout-topbar-logo" routerLink="/">

                <span>AUTO-PRO</span>
            </a>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                    <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                </button>
            </div>

            <button class="layout-topbar-menu-button layout-topbar-action" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <!-- Notification Button -->
                    <button type="button" class="layout-topbar-action relative" (click)="toggleNotificationPanel($event)" pTooltip="Notifications">
                    <p-overlaybadge [value]="unreadCount > 0 ? unreadCount.toString() : null" severity="danger">
                        <i class="pi pi-bell"></i>
                    </p-overlaybadge>
                        <!-- <span class="notification-badge" *ngIf="unreadCount > 0" pBadge [value]="unreadCount.toString()" severity="danger"></span> -->
                        <span>Notification</span>
                    </button>
                    <button type="button" class="layout-topbar-action">
                        <i class="pi pi-user"></i>
                        <span>Profile</span>
                    </button>
                    <button type="button" class="layout-topbar-action" (click)="logout()">
                        <i class="pi pi-sign-out" style="color: red"></i>
                        <span>Deconnexion</span>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Notification Panel -->
    <p-overlayPanel #notificationPanel [dismissable]="true" [showCloseIcon]="true" styleClass="notification-panel">
        <ng-template pTemplate>
            <div class="notification-header flex justify-between items-center p-3 border-b border-gray-200">
                <h3 class="text-lg font-semibold">Notifications</h3>
                <button *ngIf="notifications.length > 0" class="text-sm text-blue-500 hover:text-blue-700" (click)="markAllAsRead()">
                    Tout marquer comme lu
                </button>
            </div>

            <div class="notification-list max-h-80 overflow-y-auto">
                <div *ngIf="notifications.length === 0" class="p-4 text-center text-gray-500">
                    Aucune notification
                </div>

                <div *ngFor="let notification of notifications"
                     class="notification-item p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50"
                     [ngClass]="{'bg-blue-50': !notification.isRead}"
                     (click)="markAsRead(notification)">
                    <div class="flex items-start">
                        <div class="notification-icon mr-3">
                            <i [ngClass]="getNotificationIcon(notification.type)" class="text-xl"
                               [style.color]="getNotificationColor(notification.type)"></i>
                        </div>
                        <div class="notification-content flex-grow">
                            <div class="notification-title font-medium">{{ notification.type }}</div>
                            <div class="notification-message text-gray-600">{{ notification.message }}</div>
                            <div class="notification-time text-xs text-gray-400 mt-1">
                                {{ notification.createdAt | date:'dd/MM/yyyy HH:mm' }}
                            </div>
                        </div>
                        <div *ngIf="!notification.isRead" class="notification-badge ml-2">
                            <span class="w-2 h-2 bg-blue-500 rounded-full block"></span>
                        </div>
                    </div>
                </div>
            </div>

            <div *ngIf="notifications.length > 0" class="notification-footer p-2 text-center border-t border-gray-200">
                <a routerLink="/notifications" class="text-sm text-blue-500 hover:text-blue-700">
                    Voir toutes les notifications
                </a>
            </div>
        </ng-template>
    </p-overlayPanel>
    `
})
export class AppTopbar implements OnInit, OnDestroy {
    @ViewChild('notificationPanel') notificationPanel?: OverlayPanel;

    items!: MenuItem[];
    notifications: Notification[] = [];
    unreadCount: number = 0;
    private userId: string = '';
    private subscription: Subscription = new Subscription();

    constructor(
        public layoutService: LayoutService,
        private authService: AuthService,
        private router: Router,
        private messageService: MessageService,
        private notificationService: NotificationService
    ) {}

    ngOnInit(): void {
        // Récupérer l'ID de l'utilisateur connecté
        this.authService.currentUser.subscribe(user => {
            if (user && user.id) { // Remplace _id par id si nécessaire
                this.userId = user.id; // 🔥 Assure-toi que c'est bien _id et non id ou userId
                this.notificationService.setUserId(this.userId);
            } else {
                console.log('Utilisateur non trouvé ou ID manquant.');
            }
        })
        this.initializeNotifications();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
        this.notificationService.disconnect();
    }

    initializeNotifications(): void {
        // Initialiser le service de notification pour cet utilisateur
        this.notificationService.initForUser(this.userId);
        this.notificationService.authenticate(this.userId);

        // S'abonner aux notifications
        const notificationsSub = this.notificationService.notifications$.subscribe(
            notifications => {
                this.notifications = notifications;
                this.updateUnreadCount();
                console.log("Notifications actuelles :", this.notifications);
            }
        );

        // S'abonner au compteur de notifications non lues
        const unreadCountSub = this.notificationService.unreadCount$.subscribe(
            count => {
                this.unreadCount = count;
                console.log("Nombre de notifications non lues :", this.unreadCount); // 🔥 Vérification du compteur
            }
        );

        this.subscription.add(notificationsSub);
        this.subscription.add(unreadCountSub);
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    logout(): void {
        setTimeout(() => {
            this.authService.logout();
            // Déconnecter le socket lors de la déconnexion
            this.notificationService.disconnect();
        }, 1500);
        this.router.navigate(['/auth/bo']);
        this.messageService.add({
            severity: 'warn',
            summary: 'Déconnexion réussie',
            detail: 'A bientot'
        });
    }

    toggleNotificationPanel(event: Event): void {
        if (this.notificationPanel) {
            this.notificationPanel.toggle(event);
        }
    }

    markAsRead(notification: Notification): void {
        if (!notification.isRead && notification._id) {
            this.notificationService.markAsRead(notification._id).subscribe();
        }

        // Si la notification a un lien, naviguer vers ce lien
        // if (notification.link) {
        //     this.router.navigate([notification.link]);
        // }
    }

    markAllAsRead(): void {
        if (this.userId) {
            this.notificationService.markAllAsRead(this.userId).subscribe({
                next: () => {
                    // Le service met à jour automatiquement l'état des notifications via WebSocket
                },
                error: (error) => {
                    console.error('Error marking all notifications as read', error);
                }
            });
        }
    }

    updateUnreadCount(): void {
        this.unreadCount = this.notifications.filter(n => !n.isRead).length;
    }

    getNotificationIcon(type: string): string {
        switch (type) {
            case 'info':
                return 'pi pi-info-circle';
            case 'success':
                return 'pi pi-check-circle';
            case 'warning':
                return 'pi pi-exclamation-triangle';
            case 'error':
                return 'pi pi-times-circle';
            default:
                return 'pi pi-bell';
        }
    }

    getNotificationColor(type: string): string {
        switch (type) {
            case 'info':
                return '#2196F3';
            case 'success':
                return '#4CAF50';
            case 'warning':
                return '#FFC107';
            case 'error':
                return '#F44336';
            default:
                return '#607D8B';
        }
    }

    showNotificationToast(notification: Notification): void {
        this.messageService.add({
            severity: this.getSeverity(notification.type),
            summary: notification.type,
            detail: notification.message,
            life: 3000
        });
    }

    getSeverity(type: string): string {
        switch (type) {
            case 'info':
                return 'info';
            case 'success':
                return 'success';
            case 'warning':
                return 'warn';
            case 'error':
                return 'error';
            default:
                return 'info';
        }
    }
}
