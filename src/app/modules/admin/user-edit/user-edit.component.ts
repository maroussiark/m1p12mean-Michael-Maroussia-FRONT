import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // ✅ Ajoute CommonModule et ReactiveFormsModule
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
  userEditForm: FormGroup;
  userId: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.userEditForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id') || '';

    if (this.userId) {
      // 🔹 Charger des valeurs fictives pour tester sans API
      this.userEditForm.patchValue({
        name: 'Nom Test',
        email: `user${this.userId}@test.com`,
        role: 'user'
      });
    }
  }

  saveUser(): void {
    if (this.userEditForm.valid) {
      console.log("Utilisateur modifié :", { id: this.userId, ...this.userEditForm.value });
      this.router.navigate(['/admin/users']);
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/users']);
  }
}
