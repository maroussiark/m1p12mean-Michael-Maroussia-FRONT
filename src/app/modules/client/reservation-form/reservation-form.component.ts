import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.scss'],
  standalone: false
})
export class ReservationFormComponent implements OnInit {
  reservationForm!: FormGroup;
  serviceOptions: string[] = ['Réparation Mécanique', 'Entretien', 'Carrosserie'];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.reservationForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      service: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      message: ['']
    });
  }

  onSubmit(): void {
    if (this.reservationForm.valid) {
      console.log('Réservation soumise', this.reservationForm.value);
      // Ici, vous pouvez envoyer les données vers votre API
    }
  }
}
