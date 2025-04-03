import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-bo',
template:`
    <div class="login-container">
  <h2>Se Connecter</h2>
  <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
    <input type="text" name="username" placeholder="Nom d'utilisateur" formControlName="email" >
    <input type="password" name="password" placeholder="Mot de passe" formControlName="password">
    <button type="submit">Connexion</button>
  </form>
</div>
`,
styles:`
    * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
}

/* Utilisation de :host pour styliser l'élément du composant */
:host {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #f2f2f2;
}

.login-container {
  background: #fff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 300px;

  h2 {
    text-align: center;
    margin-bottom: 20px;
    color: #333;
  }

  form {
    display: flex;
    flex-direction: column;

    input[type="text"],
    input[type="password"] {
      padding: 12px;
      margin-bottom: 20px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }

    button {
      padding: 12px;
      border: none;
      border-radius: 4px;
      background: #3498db;
      color: #fff;
      font-size: 16px;
      cursor: pointer;
      transition: background 0.3s ease;

      &:hover {
        background: #2980b9;
      }
    }

    .forgot {
      text-align: center;
      margin-top: 10px;

      a {
        color: #3498db;
        text-decoration: none;
        font-size: 14px;
      }
    }
  }
}

`,
  standalone: false
})
export class LoginMecaComponent {
  loginForm!: FormGroup;
  returnUrl!: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
        private router: Router,

  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['meca@test.com', [Validators.required]],
      password: ['autopro', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      console.log('Soumission du formulaire', this.loginForm.value);
      this.authService.login(email, password).subscribe(
        user => {
          this.router.navigate([`${user.role}`]);
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
