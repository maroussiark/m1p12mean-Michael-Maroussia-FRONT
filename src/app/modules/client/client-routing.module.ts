import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../../shared/components/layout/layout.component';
import { DashboardClientComponent } from './dashboard-client/dashboard-client.component';
import { ProfileOverviewComponent } from './profile-overview/profile-overview.component';


const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,  // Layout réutilisé pour header et footer
    children: [
      { path: 'dashboard', component: DashboardClientComponent },
      { path: 'profile', component: ProfileOverviewComponent },
      { path: 'profile/edit', component: ProfileEditComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
