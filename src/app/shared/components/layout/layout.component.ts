import { Component } from '@angular/core';
import { MenuItem } from '../../../core/models/menu-item.model';
import { SharedModule } from "../../shared.module";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  imports: [SharedModule,RouterModule],
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  // Vous pouvez définir ici un menu commun à toutes les pages authentifiées
  menuItems: MenuItem[] = [
    { label: 'Dashboard', link: '/dashboard' },
    { label: 'Mon Profil', link: '/profile' },
    { label: 'Rendez-vous', link: '/appointments' },
    { label: 'Déconnexion', link: '/logout' }
  ];
}
