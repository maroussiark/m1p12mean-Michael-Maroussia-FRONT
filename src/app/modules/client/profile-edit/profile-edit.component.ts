import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Vehicle } from '../../../core/models/vehicle.model';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss'],
  standalone: false
})
export class ProfileEditComponent implements OnInit {
  personalInfoForm!: FormGroup;
  vehicles!: Vehicle[];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    // Initialisation avec des données d'exemple (à remplacer par des données réelles)
    this.personalInfoForm = this.fb.group({
      fullName: ['Jean Dupont', Validators.required],
      email: ['jean.dupont@example.com', [Validators.required, Validators.email]],
      phone: ['0123456789', Validators.required],
      address: ['123 rue de la République, Paris']
    });

    this.vehicles = [
      { id: 1, brand: 'Toyota', model: 'Corolla', year: 2018 },
      { id: 2, brand: 'Honda', model: 'Civic', year: 2020 }
    ];
  }

  onSubmit(): void {
    if (this.personalInfoForm.valid) {
      console.log('Profil mis à jour', this.personalInfoForm.value);
      // Envoyer les données au serveur...
    }
  }

  onUpdateVehicle(vehicle: Vehicle): void {
    console.log('Véhicule mis à jour', vehicle);
    // Mise à jour du véhicule via API...
  }

  addVehicle(): void {
    // Ajouter un nouveau véhicule vierge
    const newVehicle: Vehicle = {
      id: new Date().getTime(),
      brand: '',
      model: '',
      year: new Date().getFullYear()
    };
    this.vehicles.push(newVehicle);
  }

  removeVehicle(index: number): void {
    this.vehicles.splice(index, 1);
  }
}
