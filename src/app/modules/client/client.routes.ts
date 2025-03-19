import { Routes } from '@angular/router';
import { ClientProfile } from './profile/client.profile';

export default [
    { path: 'profile', component: ClientProfile },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
