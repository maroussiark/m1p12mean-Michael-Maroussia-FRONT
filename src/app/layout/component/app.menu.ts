import { AuthService } from './../../core/services/auth.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

    constructor(private authService: AuthService){
    }

    ngOnInit() {
        const role = this.authService.currentUserSubject.value?.role;
        if (role === 'admin') {
            this.model = this.getAdminMenu();
        } else if (role === 'mechanic') {
            this.model = this.getMechanicMenu();
        } else {
            this.model = this.getDefaultMenu();
        }
    }

    getAdminMenu(): MenuItem[] {
        return [
            {
                label: 'Admin Dashboard',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/admin'] },
                    { label: 'Utilisateur', icon: 'pi pi-fw pi-users', routerLink: ['/admin/user-management'] },
                    { label: 'Rendez-vous', icon: 'pi pi-fw pi-calendar', routerLink: ['/admin/planning-management'] },
                    { label: 'Settings', icon: 'pi pi-fw pi-cog', routerLink: ['/admin/settings'] }
                ]
            },
            {
                label: 'Reports',
                items: [{ label: 'Logs', icon: 'pi pi-fw pi-file', routerLink: ['/admin/logs'] }]
            }
        ];
    }

    getMechanicMenu(): MenuItem[] {
        return [
            {
                label: 'Mechanic Panel',
                items: [
                    { label: 'Tasks', icon: 'pi pi-fw pi-wrench', routerLink: ['/mechanic/tasks'] },
                    { label: 'Schedule', icon: 'pi pi-fw pi-calendar', routerLink: ['/mechanic/schedule'] }
                ]
            }
        ];
    }

    getDefaultMenu(): MenuItem[] {
        return [
            {
                label: 'Accueil',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
                ]
            }
        ];
    }
}
