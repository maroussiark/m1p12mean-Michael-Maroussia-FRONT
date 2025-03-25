import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { AuthService } from './../../core/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-auth',
  imports:[FloatLabelModule,ReactiveFormsModule,ButtonModule,PasswordModule,CommonModule,CheckboxModule],
  template: `
    <div class="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {{ isLoginMode ? 'Connexion' : 'Créer un compte' }}
        </h2>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form [formGroup]="authForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <!-- Email Input -->
            <div>
              <p-floatLabel>
                <input
                  pInputText
                  formControlName="email"
                  id="email"
                  type="email"
                  class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
                <label htmlFor="email">Email</label>
              </p-floatLabel>
              <p *ngIf="authForm.get('email')?.invalid && authForm.get('email')?.touched" class="text-red-500 text-sm mt-1">
                Veuillez entrer un email valide
              </p>
            </div>

            <!-- Mot de passe Input -->
            <div>
              <p-floatLabel>
                <p-password
                  formControlName="password"
                  [toggleMask]="true"
                  [feedback]="!isLoginMode"
                  [inputStyle]="{'width': '100%'}"
                  [inputStyleClass]="'block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'"
                ></p-password>
                <label htmlFor="password">Mot de passe</label>
              </p-floatLabel>
              <p *ngIf="authForm.get('password')?.invalid && authForm.get('password')?.touched" class="text-red-500 text-sm mt-1">
                Le mot de passe doit contenir au moins 8 caractères
              </p>
            </div>

            <!-- Champs supplémentaires pour l'inscription -->
            <ng-container *ngIf="!isLoginMode">
              <div>
                <p-floatLabel>
                  <input
                    pInputText
                    formControlName="firstName"
                    id="firstName"
                    type="text"
                    class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                  <label htmlFor="firstName">Prénom</label>
                </p-floatLabel>
              </div>
              <div>
                <p-floatLabel>
                  <input
                    pInputText
                    formControlName="lastName"
                    id="lastName"
                    type="text"
                    class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                  <label htmlFor="lastName">Nom</label>
                </p-floatLabel>
              </div>
            </ng-container>

            <!-- Boutons -->
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <p-checkbox
                  *ngIf="isLoginMode"
                  [binary]="true"
                  formControlName="rememberMe"
                  label="Se souvenir de moi"
                ></p-checkbox>
              </div>

              <div class="text-sm" *ngIf="isLoginMode">
                <a href="#" (click)="onForgotPassword()" class="font-medium text-indigo-600 hover:text-indigo-500">
                  Mot de passe oublié ?
                </a>
              </div>
            </div>

            <div>
              <p-button
                type="submit"
                [disabled]="authForm.invalid"
                styleClass="w-full"
                label="{{ isLoginMode ? 'Se connecter' : 'Créer un compte' }}"
              ></p-button>
            </div>
          </form>

          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500">
                  {{ isLoginMode ? 'Pas de compte ?' : 'Déjà inscrit ?' }}
                </span>
              </div>
            </div>

            <div class="mt-6">
              <p-button
                (onClick)="toggleMode()"
                styleClass="w-full"
                [outlined]="true"
                [label]="isLoginMode ? 'Créer un compte' : 'Se connecter'"
              ></p-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  authForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    if (this.isLoginMode) {
      this.authForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        rememberMe: [false]
      });
    } else {
      this.authForm = this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]]
      });
    }
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.initForm();
  }

  onSubmit() {
    if (this.authForm.valid) {
      if (this.isLoginMode) {
        this.onSubmitLogin();
      } else {
        this.onSubmitRegister();
      }
    }
  }

  onSubmitLogin() {
    const { email, password } = this.authForm.value;
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
          detail: 'Veuillez réessayer'
        });
      }
    );
  }

  onSubmitRegister() {
    const { firstName, lastName, email, password } = this.authForm.value;
    // this.authService.register(firstName, lastName, email, password).subscribe(
    //   user => {
    //     this.router.navigate(['/']);
    //     this.messageService.add({
    //       severity: 'success',
    //       summary: 'Inscription réussie',
    //       detail: 'Bienvenue'
    //     });
    //   },
    //   error => {
    //     console.error('Erreur d\'inscription', error);
    //     this.messageService.add({
    //       severity: 'error',
    //       summary: 'Erreur d\'inscription',
    //       detail: 'Veuillez réessayer'
    //     });
    //   }
    // );
  }

  onForgotPassword() {
    // Logique de récupération de mot de passe
    this.router.navigate(['/forgot-password']);
  }
}
