import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MenuItem } from '../../../core/models/menu-item.model';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-header',
  imports: [CommonModule,RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',

})
export class HeaderComponent {
  @Input() menuItems: MenuItem[] = [];
  @Input() title: string = 'Garage AutoPro';

  isLoginModalOpen = false;
  isSignupModalOpen = false;

  openLoginModal(): void {
    this.isLoginModalOpen = true;
  }

  closeLoginModal(): void {
    this.isLoginModalOpen = false;
  }

  openSignupModal(): void {
    this.isSignupModalOpen = true;
  }

  closeSignupModal(): void {
    this.isSignupModalOpen = false;
  }
}

