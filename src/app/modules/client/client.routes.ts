import { AppointmentBookingComponent } from './appointment/appointment-booking';
import { Routes } from '@angular/router';
import { ClientProfile } from './profile/client.profile';
import { HomeComponent } from './home/home';

export default [
    { path: 'profile', component: ClientProfile },
    { path: 'appointment', component: AppointmentBookingComponent },
    { path: '', component: HomeComponent },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
