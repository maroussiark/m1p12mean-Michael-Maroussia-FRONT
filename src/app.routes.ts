import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { ClientLayout } from './app/modules/client/client.layout';
import { AuthGuard } from './app/core/guards/auth.guards';

export const appRoutes: Routes = [
    {
        path: 'template',
        component: AppLayout,
        children: [
            { path: '', component: Dashboard },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }
        ]
    },
    {
        path: 'client',
        component: ClientLayout,
        canActivate: [AuthGuard],
        children: [
            { path: '', loadChildren: () => import('./app/modules/client/client.routes') },
        ],
        // data: { role: ['admin'] }

    },
    { path: '', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/modules/authentication/authentication.module').then(m => m.AuthenticationModule) },
    { path: '**', redirectTo: '/notfound' }
];
