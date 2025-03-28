import { PlanningGlobalComponent } from './planning-global/planning-global.component';
import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { ServiceManagementComponent } from './service/service-management';
import { PlanningAppointmentComponent } from './planning-appointment/planning-appointment.component';

export default [
    { path: '', component: DashboardComponent },
    { path: 'user-management', component: UserManagementComponent },
    { path: 'service-management', component: ServiceManagementComponent },
    { path: 'planning-management', component: PlanningAppointmentComponent },
    { path: 'planning', component: PlanningGlobalComponent },
    { path: '**', redirectTo: '/notfound' }

] as Routes;
