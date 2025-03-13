import { AppointmentsListComponent } from './appointments-list/appointments-list.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardClientComponent } from './dashboard-client/dashboard-client.component';
import { ClientRoutingModule } from './client-routing.module';
import { ProfileOverviewComponent } from './profile-overview/profile-overview.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReservationFormComponent } from './reservation-form/reservation-form.component';
import { AppointmentDetailComponent } from './appointment-detail/appointment-detail.component';



@NgModule({
  declarations: [
    DashboardClientComponent,
    ProfileOverviewComponent,
    ProfileEditComponent,
    ReservationFormComponent,
    AppointmentsListComponent,
    AppointmentDetailComponent
  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports : [ProfileEditComponent,ReservationFormComponent]
})
export class ClientModule { }
