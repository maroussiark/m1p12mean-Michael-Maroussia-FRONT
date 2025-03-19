import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../../shared/components/layout/layout.component';
import { DashboardMechanicComponent } from './dashboard-mechanic/dashboard-mechanic.component';
import { MechanicPlanningComponent } from './mechanic-planning/mechanic-planning.component';



const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,  // Layout réutilisé pour header et footer
    children: [
      { path: 'planning', component: MechanicPlanningComponent },
      { path: 'dashboard', component: DashboardMechanicComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MechanicRoutingModule { }
