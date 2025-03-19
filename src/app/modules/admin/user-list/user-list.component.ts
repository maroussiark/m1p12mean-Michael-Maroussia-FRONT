import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; // ✅ Importation directe dans le composant

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-user-list',
  standalone: true, // ✅ Vérifie si c'est un standalone component
  imports: [CommonModule], // ✅ Ajoute CommonModule pour utiliser *ngFor
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {
  @Input() users: User[] = [];
}
