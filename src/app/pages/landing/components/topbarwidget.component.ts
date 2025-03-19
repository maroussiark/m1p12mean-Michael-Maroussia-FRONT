import { User } from './../../../core/models/user.model';
import { Component, OnInit } from '@angular/core';
import { StyleClassModule } from 'primeng/styleclass';
import { Router, RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'topbar-widget',
    imports: [RouterModule, StyleClassModule, ButtonModule, RippleModule],
    template: `<a class="flex items-center" href="#">
            <span class="text-surface-900 dark:text-surface-0 font-medium text-2xl leading-normal mr-20">AutoPro</span>
        </a>

        <a pButton [text]="true" severity="secondary" [rounded]="true" pRipple class="lg:!hidden" pStyleClass="@next" enterClass="hidden" leaveToClass="hidden" [hideOnOutsideClick]="true">
            <i class="pi pi-bars !text-2xl"></i>
        </a>

        <div class="items-center bg-surface-0 dark:bg-surface-900 grow justify-between hidden lg:flex absolute lg:static w-full left-0 top-full px-12 lg:px-0 z-20 rounded-border">
            <ul class="list-none p-0 m-0 flex lg:items-center select-none flex-col lg:flex-row cursor-pointer gap-8">
                <li>
                    <a (click)="router.navigate(['/landing'], { fragment: 'home' })" pRipple class="px-0 py-4 text-surface-900 dark:text-surface-0 font-medium text-xl">
                        <span>Acceuil</span>
                    </a>
                </li>
                <li>
                    <a (click)="router.navigate(['/landing'], { fragment: 'features' })" pRipple class="px-0 py-4 text-surface-900 dark:text-surface-0 font-medium text-xl">
                        <span>Service</span>
                    </a>
                </li>
            </ul>
            <div class="flex border-t lg:border-t-0 border-surface py-4 lg:py-0 mt-4 lg:mt-0 gap-2">
                <button pButton pRipple label="Se connecter" (click)="setSignIn()" [rounded]="true" [text]="true"></button>
                <button pButton pRipple label="S'inscrire" (click)="setSignUp()" [rounded]="true"></button>
            </div>
        </div> `
})
export class TopbarWidget  implements OnInit {
    constructor(
        public router: Router,
        private authService: AuthService,
    ) {}
    isLoggedIn = false;

    ngOnInit(): void {
        this.authService.currentUserSubject.subscribe((user: User | null) => {
            this.isLoggedIn = !!user;
          });
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
