import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './feature/landing-page/landing-page.component';
import { NotFoundComponent } from './feature/not-found/not-found.component';
import { AuthGuard } from './core/guards/auth.guards';
import { LoginBoComponent } from './modules/back-office/login-bo/login-bo.component';

const routes: Routes = [
  { path: 'client',canActivate: [AuthGuard], loadChildren: () => import('./modules/client/client.module').then(m => m.ClientModule) },
  { path: 'mechanic', loadChildren: () => import('./modules/mechanic/mechanic.module').then(m => m.MechanicModule) },
  {path:'bo', component: LoginBoComponent},
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  { path: 'landing', component: LandingPageComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
