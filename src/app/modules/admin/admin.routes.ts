import { PlanningGlobalComponent } from './planning-global/planning-global.component';
import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserManagementComponent } from './user-management/user-management.component';

export default [
    { path: '', component: DashboardComponent },
    { path: 'user-management', component: UserManagementComponent },
    { path: 'planning', component: PlanningGlobalComponent },
    { path: '**', redirectTo: '/notfound' }

] as Routes;
