import { CommonModule } from '@angular/common';
import { User, UserRole } from './../../../core/models/user.model';
import { UserService } from './../../../core/services/user.service';
// user-management.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DialogService } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleButtonModule } from 'primeng/togglebutton';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
  imports:[TableModule,
    ButtonModule,
    TagModule,
    DialogModule,
    ReactiveFormsModule,
    CommonModule,
    DropdownModule,
    MultiSelectModule,
    InputTextModule,
ToggleButtonModule,
FormsModule ],
    providers: [MessageService,DialogService]
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  userForm!: FormGroup;
  displayUserModal = false;
  selectedUser: User | null = null;

  userRoles = Object.values(UserRole);
  mechanicSpecialties = [
    'Électricité',
    'Mécanique générale',
    'Carrosserie',
    'Diagnostic électronique',
    'Climatisation'
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private messageService: MessageService,
    private dialogService: DialogService
  ) {
    this.initUserForm();
  }

  ngOnInit() {
    this.loadUsers();
  }

  initUserForm() {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      firstName: [''],
      lastName: [''],
      phoneNumber: [''],
      specialties: [],
      isActive: [true]
    });

    // Conditionally add specialties validator for mechanic role
    this.userForm.get('role')?.valueChanges.subscribe(role => {
      const specialtiesControl = this.userForm.get('specialties');
      if (role === UserRole.MECHANIC) {
        specialtiesControl?.setValidators([Validators.required]);
      } else {
        specialtiesControl?.clearValidators();
      }
      specialtiesControl?.updateValueAndValidity();
    });
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (users) => this.users = users,
      error: (err) => this.handleError(err)
    });
  }

  openUserModal(user?: User) {
    this.selectedUser = user || null;

    if (this.selectedUser) {
      this.userForm.patchValue({
        email: this.selectedUser.email,
        role: this.selectedUser.role,
        firstName: this.selectedUser.profile?.firstName,
        lastName: this.selectedUser.profile?.lastName,
        phoneNumber: this.selectedUser.profile?.phoneNumber,
        specialties: this.selectedUser.specialties,
        isActive: this.selectedUser.isActive
      });
    } else {
      this.userForm.reset({ isActive: true });
    }

    this.displayUserModal = true;
  }

  saveUser() {
    if (this.userForm.invalid) {
      this.markFormGroupTouched(this.userForm);
      return;
    }

    const userData: User = {
      ...this.selectedUser,
      email: this.userForm.value.email,
      password:'autopro',
      role: this.userForm.value.role,
      profile: {
        firstName: this.userForm.value.firstName,
        lastName: this.userForm.value.lastName,
        phoneNumber: this.userForm.value.phoneNumber
      },
      specialties: this.userForm.value.role === UserRole.MECHANIC
        ? this.userForm.value.specialties
        : undefined,
      isActive: this.userForm.value.isActive
    };

    if (this.selectedUser?.id) {
      this.updateUser(userData);
    } else {
      this.createUser(userData);
    }
  }

  createUser(userData: User) {
    this.userService.createUser(userData).subscribe({
      next: (newUser) => {
        this.users.push(newUser);
        this.displayUserModal = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Utilisateur créé',
          detail: `L'utilisateur ${newUser.email} a été créé avec succès.`
        });
      },
      error: (err) => this.handleError(err)
    });
  }

  updateUser(userData: User) {
    this.userService.updateUser(userData).subscribe({
      next: (updatedUser) => {
        const index = this.users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
        this.displayUserModal = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Utilisateur mis à jour',
          detail: `L'utilisateur ${updatedUser.email} a été mis à jour avec succès.`
        });
      },
      error: (err) => this.handleError(err)
    });
  }

  toggleUserStatus(user: User) {
    const updatedUser = { ...user, isActive: !user.isActive };
    this.userService.updateUser(updatedUser).subscribe({
      next: (result) => {
        const index = this.users.findIndex(u => u.id === result.id);
        if (index !== -1) {
          this.users[index] = result;
        }
        this.messageService.add({
          severity: result.isActive ? 'success' : 'warn',
          summary: result.isActive ? 'Utilisateur activé' : 'Utilisateur désactivé',
          detail: `Le statut de ${result.email} a été modifié.`
        });
      },
      error: (err) => this.handleError(err)
    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private handleError(err: any) {
    this.messageService.add({
      severity: 'error',
      summary: 'Erreur',
      detail: err.message || 'Une erreur est survenue.'
    });
  }
}
