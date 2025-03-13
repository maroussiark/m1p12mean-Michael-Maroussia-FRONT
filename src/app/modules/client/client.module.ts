import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardClientComponent } from './dashboard-client/dashboard-client.component';
import { ClientRoutingModule } from './client-routing.module';
import { ProfileOverviewComponent } from './profile-overview/profile-overview.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    DashboardClientComponent,
    ProfileOverviewComponent,
    ProfileEditComponent
  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports : [ProfileEditComponent]
})
export class ClientModule { }
