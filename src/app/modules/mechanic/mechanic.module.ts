import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardMechanicComponent } from './dashboard-mechanic/dashboard-mechanic.component';
import { MechanicRoutingModule } from './mechanic-routing.module';
import { MechanicPlanningComponent } from './mechanic-planning/mechanic-planning.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [DashboardMechanicComponent,MechanicPlanningComponent],
  imports: [
    CommonModule,
    MechanicRoutingModule,
    ReactiveFormsModule
  ]
})
export class MechanicModule { }
