import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginBoComponent } from './login-bo/login-bo.component';
import { AuthComponent } from './auth/auth.component';
import { AuthRoutingModule } from './authentication-routing.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [LoginBoComponent,AuthComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule
  ]
})
export class AuthenticationModule { }
