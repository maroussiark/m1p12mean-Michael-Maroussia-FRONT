import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginBoComponent } from './login-bo/login-bo.component';
import { AuthComponent } from './auth/auth.component';
import { AuthRoutingModule } from './authentication-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { LoginMecaComponent } from './login-meca/login-meca.component';



@NgModule({
  declarations: [LoginBoComponent,LoginMecaComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    ToastModule,
    ButtonModule,
    AuthComponent
  ],
  providers: [MessageService],
  exports: [AuthComponent]
})
export class AuthenticationModule { }
