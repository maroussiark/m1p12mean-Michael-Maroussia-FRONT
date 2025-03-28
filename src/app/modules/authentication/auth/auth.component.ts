import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { User, UserProfile, UserRole } from '../../../core/models';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-auth',
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div class="w-full max-w-md">
        <div class="bg-white shadow-md rounded-lg p-8">
          <!-- Logo or Title -->
          <div class="text-center mb-6">
            <h2 class="text-2xl font-bold text-gray-800">Garage Auto-Pro</h2>
          </div>

          <!-- Toggle between Login and Register -->
          <div class="flex mb-6">
            <button
              (click)="switchMode(true)"
              class="w-1/2 py-2 text-center transition-colors duration-300"
              [ngClass]="isLoginMode
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'"
            >
              Connexion
            </button>
            <button
              (click)="switchMode(false)"
              class="w-1/2 py-2 text-center transition-colors duration-300"
              [ngClass]="!isLoginMode
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'"
            >
              Inscription
            </button>
          </div>

          <!-- Login Form -->
          <form [formGroup]="authForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <!-- Email Input -->
            <div>
              <label class="block text-gray-700 mb-2">Email</label>
              <input
                pInputText
                formControlName="email"
                class="w-full p-2 border rounded-md"
                placeholder="Entrez votre email"
              />
              <small
                *ngIf="authForm.get('email')?.invalid && authForm.get('email')?.touched"
                class="text-red-500"
              >
                Email invalide
              </small>
            </div>

            <!-- Password Input -->
            <div>
              <label class="block text-gray-700 mb-2">Mot de passe</label>
              <input
                pInputText
                type="password"
                formControlName="password"
                class="w-full p-2 border rounded-md"
                placeholder="Entrez votre mot de passe"
              />
              <small
                *ngIf="authForm.get('password')?.invalid && authForm.get('password')?.touched"
                class="text-red-500"
              >
                Mot de passe requis
              </small>
            </div>

            <!-- Additional Fields for Registration -->
            <ng-container *ngIf="!isLoginMode">
              <div>
                <label class="block text-gray-700 mb-2">Nom</label>
                <input
                  pInputText
                  formControlName="lastName"
                  class="w-full p-2 border rounded-md"
                  placeholder="Votre nom"
                />
                <small
                  *ngIf="authForm.get('lastName')?.invalid && authForm.get('lastName')?.touched"
                  class="text-red-500"
                >
                  Nom requis
                </small>
              </div>

              <!-- Prénom -->
              <div>
                <label class="block text-gray-700 mb-2">Prénom</label>
                <input
                  pInputText
                  formControlName="firstName"
                  class="w-full p-2 border rounded-md"
                  placeholder="Votre prénom"
                />
                <small
                  *ngIf="authForm.get('firstName')?.invalid && authForm.get('firstName')?.touched"
                  class="text-red-500"
                >
                  Prénom requis
                </small>
              </div>

              <!-- Numéro de téléphone -->
              <div>
                <label class="block text-gray-700 mb-2">Numéro de téléphone</label>
                <input
                  pInputText
                  formControlName="phoneNumber"
                  class="w-full p-2 border rounded-md"
                  placeholder="Votre numéro de téléphone"
                />
                <small
                  *ngIf="authForm.get('phoneNumber')?.invalid && authForm.get('phoneNumber')?.touched"
                  class="text-red-500"
                >
                  Numéro de téléphone invalide
                </small>
              </div>
            </ng-container>

            <!-- Submit Button -->
            <button
              pButton
              type="submit"
              [disabled]="authForm.invalid"
              class="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
            {{ isLoginMode ? "Connexion" : "S'inscrire" }}
            </button>
          </form>

        </div>
      </div>
    </div>
  `,
  providers: [MessageService],
  imports:[CommonModule,ButtonModule,ReactiveFormsModule],
  standalone: true
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
    // Pré-remplissage uniquement pour le login
    if (this.isLoginMode) {
      this.authForm.patchValue({
        email: 'jean@test.com',
        password: 'qwerty'
      });
    }
  }

  initForm() {
        this.authForm = this.fb.group({
          email: ['', [Validators.required, Validators.email]],
          password: ['', [Validators.required, Validators.minLength(6)]],
        });

        if (!this.isLoginMode) {
          this.authForm.addControl('firstName', this.fb.control('', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]));
          this.authForm.addControl('lastName', this.fb.control('', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]));
          this.authForm.addControl('phoneNumber', this.fb.control('', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]));
        }
      }



  onSubmit() {
    if (this.authForm.invalid) {
      return;
    }

    const formValues = this.authForm.value;

    if (this.isLoginMode) {
      // Connexion
      this.authService.login(formValues.email, formValues.password).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Connexion réussie',
            detail: 'Bienvenue !'
          });
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur de connexion',
            detail: 'Identifiants incorrects'
          });
        }
      });
    } else {
      // Inscription
      const userProfile: UserProfile = {
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        phoneNumber: formValues.phoneNumber
      };

      const newUser: User = {
        email: formValues.email,
        password: formValues.password,
        role: UserRole.USER,
        profile: userProfile,
        isActive: true,
        createdAt: new Date()
      };

      this.authService.register(newUser).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Inscription réussie',
            detail: 'Vous pouvez maintenant vous connecter'
          });
          this.isLoginMode = true;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erreur d\'inscription',
            detail: 'Impossible de créer le compte'
          });
        }
      });
    }
  }
  switchMode(mode: boolean) {
    this.isLoginMode = mode;
    this.initForm();

    if (this.isLoginMode) {
      this.authForm.patchValue({
        email: 'jean@test.com',
        password: 'qwerty'
      });
    }
  }

}
