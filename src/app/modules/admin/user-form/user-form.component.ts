import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // ✅ Importer CommonModule

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // ✅ Ajoute CommonModule et ReactiveFormsModule
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent {
  @Output() userAdded = new EventEmitter<any>();

  userForm: FormGroup;
  roles = ['user', 'mechanic', 'admin'];

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required]
    });
  }

  addUser(): void {
    if (this.userForm.valid) {
      this.userAdded.emit(this.userForm.value);
      this.userForm.reset();
    }
  }
}
