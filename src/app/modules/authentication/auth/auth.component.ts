import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  standalone: false,
})
export class AuthComponent implements OnInit, OnDestroy {
  containerClass = '';
  private subscription!: Subscription;
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['jean@test.com', [Validators.required]],
      password: ['qwerty', Validators.required],
    });
    this.subscription = this.authService.isSignUp$.subscribe((isSignUp) => {
      this.containerClass = isSignUp ? 'right-panel-active' : '';
    });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  onSignIn(): void {
    this.authService.setSignUp(false);
  }

  onSignUp(): void {
    this.authService.setSignUp(true);
  }

  onSubmitLogin(){
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe(
        user => {
          this.router.navigate(['/']);
          this.messageService.add({
            severity: 'success',
            summary: 'Connexion réussie',
            detail: 'Bienvenue'
        });
        },
        error => {
          console.error('Erreur de connexion', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur de connexion',
            detail: 'Veuillez réessayez'
        });
        }
      );
    }
  }

}
