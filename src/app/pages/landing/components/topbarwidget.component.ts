import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { User } from './../../../core/models/user.model';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { StyleClassModule } from 'primeng/styleclass';
import { Router, RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { NotificationService } from '../../../core/services/notification.service';
import { Notification } from '../../../core/models';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { Subscription } from 'rxjs';

interface MenuItem {
    label: string;
    routerLink: any[];
    fragment?: string;
    condition: () => boolean;
}

interface ButtonConfig {
    label?: string;
    icon?: string;
    action: () => void;
    style?: 'text' | 'default';
    severity?: 'success' | 'info' | 'warn' | 'danger' | 'help' | 'primary' | 'secondary' | 'contrast';
    raised?: boolean;
}

@Component({
    selector: 'topbar-widget',
    imports: [
        RouterModule,
        StyleClassModule,
        ButtonModule,
        RippleModule,
        CommonModule,
        ToastModule,
        OverlayPanelModule,
        OverlayBadgeModule,
        BadgeModule,
        TooltipModule
    ],
    providers: [MessageService],
    template: `
        <a class="flex items-center" href="/">
            <!-- <svg class="w-10 h-10 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 13l2-2h14l2 2M3 13v5a1 1 0 001 1h1a1 1 0 001-1v-2a1 1 0 011-1h10a1 1 0 011 1v2a1 1 0 001 1h1a1 1 0 001-1v-5M5 13V7a1 1 0 011-1h12a1 1 0 011 1v6" />
            </svg> -->
            <span class="text-surface-300 dark:text-surface-0 font-medium text-2xl leading-normal mr-20">AutoPro</span>
        </a>

        <a pButton [text]="true" severity="secondary" [rounded]="true" pRipple class="lg:!hidden" pStyleClass="@next" enterClass="hidden" leaveToClass="hidden" [hideOnOutsideClick]="true">
            <i class="pi pi-bars !text-2xl"></i>
        </a>

        <div class="items-center grow justify-between hidden lg:flex absolute lg:static w-full left-0 top-full px-12 lg:px-0 z-20 rounded-border">
            <ul class="list-none p-0 m-0 flex lg:items-center select-none flex-col lg:flex-row cursor-pointer gap-8">
                <li *ngFor="let item of filteredMenuItems">
                    <a (click)="navigate(item)" pRipple class="px-0 py-4 text-surface-300 dark:text-surface-0 font-medium text-xl">
                        <span>{{ item.label }}</span>
                    </a>
                </li>
            </ul>

            <div class="flex border-t lg:border-t-0 border-surface py-4 lg:py-0 mt-4 lg:mt-0 gap-4">
                <!-- Notification Button - Only show when logged in -->
              <!-- Notification Button -->
                    <button *ngIf="isLoggedIn" type="button" class="layout-topbar-action relative" (click)="toggleNotificationPanel($event)" pTooltip="Notifications" >
                        <p-overlaybadge [value]="unreadCount > 0 ? unreadCount.toString() : null" severity="danger" >
                            <i class="pi pi-bell" style="font-size: large"></i>
                        </p-overlaybadge>
                            <!-- <span class="notification-badge" *ngIf="unreadCount > 0" pBadge [value]="unreadCount.toString()" severity="danger"></span> -->
                    </button>

                <ng-container *ngIf="!isLoggedIn; else loggedInButtons">
                    <button *ngFor="let btn of buttonConfigs.loggedOut" pButton pRipple [icon]="btn.icon || ''" [label]="btn.label || ''" (click)="btn.action()" [rounded]="true" [text]="btn.style === 'text'"></button>
                </ng-container>
                <ng-template #loggedInButtons>
                    <button
                        *ngFor="let btn of buttonConfigs.loggedIn"
                        pButton
                        pRipple
                        [icon]="btn.icon || ''"
                        [label]="btn.label || ''"
                        [severity]="btn.severity"
                        (click)="btn.action()"
                        [rounded]="true"
                        [text]="btn.style === 'text'"
                        [raised]="btn.raised"
                    ></button>
                </ng-template>
            </div>
        </div>

        <!-- Notification Panel -->
        <p-overlayPanel #notificationPanel [dismissable]="true" [showCloseIcon]="true" styleClass="w-80 md:w-96">
            <ng-template pTemplate>
                <div class="flex justify-between items-center p-3 border-b border-gray-200">
                    <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">Notifications</h3>
                    <button *ngIf="notifications.length > 0"
                            class="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            (click)="markAllAsRead()">
                        Tout marquer comme lu
                    </button>
                </div>

                <div class="max-h-80 overflow-y-auto">
                    <div *ngIf="notifications.length === 0" class="p-4 text-center text-gray-500 dark:text-gray-400">
                        Aucune notification
                    </div>

                    <div *ngFor="let notification of notifications"
                        class="p-3 border-b border-gray-100 cursor-pointer transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-700"
                        [ngClass]="{'bg-blue-50 dark:bg-blue-900/30': !notification.isRead}"
                        (click)="markAsRead(notification)">
                        <div class="flex items-start">
                            <div class="mr-3">
                                <i [ngClass]="getNotificationIcon(notification.type)" class="text-xl"
                                [style.color]="getNotificationColor(notification.type)"></i>
                            </div>
                            <div class="flex-grow">
                                <div class="font-medium text-gray-800 dark:text-gray-200">{{ notification.type }}</div>
                                <div class="text-gray-600 dark:text-gray-400">{{ notification.message }}</div>
                                <div class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                    {{ notification.createdAt | date:'dd/MM/yyyy HH:mm' }}
                                </div>
                            </div>
                            <div *ngIf="!notification.isRead" class="ml-2">
                                <span class="w-2 h-2 bg-blue-500 rounded-full block"></span>
                            </div>
                        </div>
                    </div>
                </div>

                <div *ngIf="notifications.length > 0" class="p-2 text-center border-t border-gray-200 dark:border-gray-700">
                    <a [routerLink]="['/client/notification']" class="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                        Voir toutes les notifications
                    </a>
                </div>
            </ng-template>
        </p-overlayPanel>
    `
})
export class TopbarWidget implements OnInit, OnDestroy {
    @ViewChild('notificationPanel') notificationPanel?: OverlayPanel;

    isLoggedIn = false;
    notifications: Notification[] = [];
    unreadCount: number = 0;
    private userId: string = '';
    private subscription: Subscription = new Subscription();

    constructor(
        public router: Router,
        private authService: AuthService,
        private messageService: MessageService,
        private notificationService: NotificationService
    ) {}

    menuItems: MenuItem[] = [
        // {
        //     label: 'Rendez-vous',
        //     routerLink: ['/client/appointment'],
        //     condition: () => this.isLoggedIn
        // },
        // {
        //     label: 'Service',
        //     routerLink: ['/'],
        //     fragment: 'features',
        //     condition: () => !this.isLoggedIn
        // }
    ];

    ngOnInit(): void {
        this.authService.currentUserSubject.subscribe((user: User | null) => {
            this.isLoggedIn = !!user;

            if (user && user._id) {
                this.userId = user._id;
                this.notificationService.setUserId(this.userId);
                this.initializeNotifications();
            }
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
        if (this.isLoggedIn) {
            this.notificationService.disconnect();
        }
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
            }
        );

        // S'abonner au compteur de notifications non lues
        const unreadCountSub = this.notificationService.unreadCount$.subscribe(
            count => {
                this.unreadCount = count;
            }
        );

        this.subscription.add(notificationsSub);
        this.subscription.add(unreadCountSub);
    }

    setSignUp(): void {
        this.authService.setSignUp(true);
        this.router.navigate(['/auth']);
    }

    setSignIn(): void {
        this.router.navigate(['/auth']);
    }

    logout(): void {
        setTimeout(() => {
            this.authService.logout();
            // Déconnecter le socket lors de la déconnexion
            if (this.isLoggedIn) {
                this.notificationService.disconnect();
            }
        }, 1500);
        this.router.navigate(['/auth']);
        this.messageService.add({
            severity: 'warn',
            summary: 'Déconnexion réussie',
            detail: 'A bientot'
        });
    }

    navigate(item: MenuItem): void {
        this.router.navigate(item.routerLink, { fragment: item.fragment });
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

    buttonConfigs = {
        loggedOut: <ButtonConfig[]>[
            {
                label: 'Se connecter',
                action: () => this.setSignIn(),
                style: 'text'
            },
            {
                label: "S'inscrire",
                action: () => this.setSignUp()
            }
        ],
        loggedIn: <ButtonConfig[]>[
            {
                label:'Rendez-vous',
                icon: 'pi pi-calendar-plus',
                action: () => this.router.navigate(['/client/appointment']),
                severity: 'warn'
            },
            {
                // label: 'Profil',
                icon: 'pi pi-user',
                action: () => this.router.navigate(['/client/profile']),
                severity: 'info'
            },
            {
                icon: 'pi pi-sign-out',
                action: () => this.logout(),
                severity: 'danger',
                raised: true
            }
        ]
    };

    get filteredMenuItems(): MenuItem[] {
        return this.menuItems.filter((item) => item.condition());
    }
}
