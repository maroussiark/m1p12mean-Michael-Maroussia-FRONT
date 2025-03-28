import { User } from './../../../core/models/user.model';
import { Component, OnInit } from '@angular/core';
import { StyleClassModule } from 'primeng/styleclass';
import { Router, RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

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
    imports: [RouterModule, StyleClassModule, ButtonModule, RippleModule, CommonModule, ToastModule],
    providers: [MessageService],
    template: `
        <a class="flex items-center" href="/">
            <svg class="w-10 h-10 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 13l2-2h14l2 2M3 13v5a1 1 0 001 1h1a1 1 0 001-1v-2a1 1 0 011-1h10a1 1 0 011 1v2a1 1 0 001 1h1a1 1 0 001-1v-5M5 13V7a1 1 0 011-1h12a1 1 0 011 1v6" />
            </svg>
            <span class="text-surface-900 dark:text-surface-0 font-medium text-2xl leading-normal mr-20">AutoPro</span>
        </a>

        <a pButton [text]="true" severity="secondary" [rounded]="true" pRipple class="lg:!hidden" pStyleClass="@next" enterClass="hidden" leaveToClass="hidden" [hideOnOutsideClick]="true">
            <i class="pi pi-bars !text-2xl"></i>
        </a>

        <div class="items-center  grow justify-between hidden lg:flex absolute lg:static w-full left-0 top-full px-12 lg:px-0 z-20 rounded-border">
            <ul class="list-none p-0 m-0 flex lg:items-center select-none flex-col lg:flex-row cursor-pointer gap-8">
                <li *ngFor="let item of filteredMenuItems">
                    <a (click)="navigate(item)" pRipple class="px-0 py-4 text-surface-900 dark:text-surface-0 font-medium text-xl">
                        <span>{{ item.label }}</span>
                    </a>
                </li>
            </ul>

            <div class="flex border-t lg:border-t-0 border-surface py-4 lg:py-0 mt-4 lg:mt-0 gap-2">
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
    `
})
export class TopbarWidget implements OnInit {
    constructor(
        public router: Router,
        private authService: AuthService,
        private messageService: MessageService
    ) {}
    isLoggedIn = false;

    menuItems: MenuItem[] = [
        {
            label: 'Rendez-vous',
            routerLink: ['/client/appointment'],
            condition: () => this.isLoggedIn
        },
        {
            label: 'Service',
            routerLink: ['/'],
            fragment: 'features',
            condition: () => !this.isLoggedIn
        }
    ];

    ngOnInit(): void {
        this.authService.currentUserSubject.subscribe((user: User | null) => {
            this.isLoggedIn = !!user;
        });
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
                label: 'Profil',
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
