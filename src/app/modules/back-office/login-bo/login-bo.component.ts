import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login-bo',
  imports: [ReactiveFormsModule],
  templateUrl: './login-bo.component.html',
  styleUrl: './login-bo.component.scss'
})
export class LoginBoComponent {
  loginForm!: FormGroup;
  returnUrl!: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', Validators.required]
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/client/dashboard';
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      console.log('Soumission du formulaire', this.loginForm.value);
      this.authService.login(email, password).subscribe(
        user => {
          console.log('Staff connecté', user);
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
