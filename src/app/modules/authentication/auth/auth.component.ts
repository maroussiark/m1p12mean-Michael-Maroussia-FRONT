import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', Validators.required],
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
          this.toastr.success('Connexion réussie', 'Bienvenue');
          this.router.navigate(['/client']);
        },
        error => {
          console.error('Erreur de connexion', error);
          this.toastr.error('Erreur de connexion', 'Veuillez réessayer');
        }
      );
    }
  }

}
