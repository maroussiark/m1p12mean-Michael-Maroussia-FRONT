import { InterventionComponent } from './intervention/intervention.component';
import { MechanicDashboardComponent } from './mechanic-dashboard/mechanic-dashboard.component';
import { Routes } from '@angular/router';

export default [
    { path: '', component: MechanicDashboardComponent },
    { path: 'intervention', component: InterventionComponent },
    { path: '**', redirectTo: '/notfound' }

] as Routes;
