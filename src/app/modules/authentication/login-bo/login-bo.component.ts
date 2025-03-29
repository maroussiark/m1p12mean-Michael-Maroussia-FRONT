import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-bo',
  templateUrl: './login-bo.component.html',
  styleUrl: './login-bo.component.scss',
  standalone: false
})
export class LoginBoComponent {
  loginForm!: FormGroup;
  returnUrl!: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
        private router: Router,

  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['admin', [Validators.required]],
      password: ['admin', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      console.log('Soumission du formulaire', this.loginForm.value);
      this.authService.login(email, password).subscribe(
        user => {
          console.log('Staff connecté', user);
          this.router.navigate([`/${user.role}`]);
          // Rediriger vers l'URL de retour ou le dashboard
          // this.router.navigateByUrl(this.returnUrl);
        },
        error => {
          console.error('Erreur de connexion', error);
        }
      );
    }
  }
}
