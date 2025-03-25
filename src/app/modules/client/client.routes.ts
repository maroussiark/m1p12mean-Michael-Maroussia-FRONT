import { AppointmentHistoryComponent } from './appointment/appointment-history';
import { AppointmentBookingComponent } from './appointment/appointment-booking';
import { Routes } from '@angular/router';
import { ClientProfileComponent } from './profile/client.profile';
import { HomeComponent } from './home/home';
import { AuthComponent } from './auth.component';
import { InvoiceHistoryComponent } from './appointment/invoice-history';
import { NotificationsComponent } from '../notifications/notifications.component';

export default [
    { path: 'profile', component: ClientProfileComponent },
    { path: 'appointment', component: AppointmentBookingComponent },
    { path: 'appointment-history', component: AppointmentHistoryComponent },
    { path: 'invoice', component: InvoiceHistoryComponent },
    { path: '', component: HomeComponent },
    { path: 'auth', component: AuthComponent },
    { path: 'not', component: NotificationsComponent },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
