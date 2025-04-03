import { NotificationsComponent } from '../notifications/notifications.component';
import { InterventionComponent } from './intervention/intervention.component';
import { MechanicDashboardComponent } from './mechanic-dashboard/mechanic-dashboard.component';
import { Routes } from '@angular/router';

export default [
    { path: '', component: MechanicDashboardComponent },
    { path: '/notification', component: NotificationsComponent },
    { path: 'intervention', component: InterventionComponent },
    { path: '**', redirectTo: '/notfound' }

] as Routes;
