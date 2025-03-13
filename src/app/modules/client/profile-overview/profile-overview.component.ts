import { Component, OnInit } from '@angular/core';

interface Vehicle {
  id: number;
  brand: string;
  model: string;
  year: number;
}

@Component({
  selector: 'app-profile-overview',
  templateUrl: './profile-overview.component.html',
  styleUrls: ['./profile-overview.component.scss'],
  standalone: false
})
export class ProfileOverviewComponent implements OnInit {
  fullName!: string;
  email!: string;
  phone!: string;
  address!: string;
  vehicles!: Vehicle[];

  constructor() { }

  ngOnInit(): void {
    // Exemple de données statiques (à remplacer par des appels API)
    this.fullName = 'Jean Dupont';
    this.email = 'jean.dupont@example.com';
    this.phone = '0123456789';
    this.address = '123 rue de la République, Paris';
    this.vehicles = [
      { id: 1, brand: 'Toyota', model: 'Corolla', year: 2018 },
      { id: 2, brand: 'Honda', model: 'Civic', year: 2020 }
    ];
  }
}
