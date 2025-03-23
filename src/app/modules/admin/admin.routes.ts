import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserManagementComponent } from './user-management/user-management.component';

export default [
    { path: '', component: DashboardComponent },
    { path: 'user-management', component: UserManagementComponent },
    { path: '**', redirectTo: '/notfound' }

] as Routes;
