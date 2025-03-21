import { PlanningAppointmentComponent } from './planning-appointment/planning-appointment.component';
import { MechanicDashboardComponent } from './mechanic-dashboard/mechanic-dashboard.component';
import { Routes } from '@angular/router';

export default [
    { path: '', component: MechanicDashboardComponent },
    { path: 'planning', component: PlanningAppointmentComponent },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
