import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MenuItem } from '../../../core/models/menu-item.model';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-header',
  imports: [CommonModule,RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',

})
export class HeaderComponent implements OnInit {
  @Input() menuItems: MenuItem[] = [];
  @Input() title: string = 'Garage AutoPro';


  isLoginModalOpen = false;
  isSignupModalOpen = false;
  isLoggedIn = false;

  constructor(
    private authService: AuthService,
    private router: Router,
     private toastr: ToastrService
  ){
  }
  ngOnInit(): void {
    this.authService.currentUserSubject.subscribe((user: User | null) => {
      this.isLoggedIn = !!user;
    });
  }
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

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth']);
    console.log('Déconnexion effectuée');
    this.toastr.success('Déconnexion effectuée');

  }

  openProfile(): void {
    console.log('Ouvrir le profil utilisateur');
  }

  setSignUp(): void {
    this.authService.setSignUp(true);
    this.router.navigate(['/auth']);
  }

  setSignIn(): void {
    this.authService.setSignUp(false);
    this.router.navigate(['/auth']);
  }

}

