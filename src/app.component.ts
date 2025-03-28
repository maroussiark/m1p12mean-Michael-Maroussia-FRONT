import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { LoadingComponent } from "./app/layout/component/app.loading";
import { LoadingService } from './app/core/services/loading.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, ToastModule, LoadingComponent, CommonModule],
    providers: [MessageService],
    template: `
        <div *ngIf="!isInitialLoading" class="h-full">
            <p-toast position="bottom-center"></p-toast>
            <router-outlet></router-outlet>
            <app-loading [isLoading]="(isLoading$ | async) ?? false"></app-loading>
        </div>
        <div *ngIf="isInitialLoading" class="fixed inset-0 z-[9999] bg-white flex items-center justify-center">
            <span class="loader"></span>
        </div>
    `,
    styles: [`
        .loader {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            display: block;
            margin: 15px auto;
            position: relative;
            background: #fff;
            box-shadow: -24px 0 #000, 24px 0 #000;
            box-sizing: border-box;
            animation: shadowPulse 2s linear infinite;
        }

        @keyframes shadowPulse {
            33% {
                background: #fff;
                box-shadow: -24px 0 #1e40af, 24px 0 #fff;
            }
            66% {
                background: #1e40af;
                box-shadow: -24px 0 #fff, 24px 0 #fff;
            }
            100% {
                background: #fff;
                box-shadow: -24px 0 #fff, 24px 0 #1e40af;
            }
        }
    `]
})
export class AppComponent implements OnInit {
    isInitialLoading = true;
    isLoading$: Observable<boolean>;

    constructor(private loadingService: LoadingService) {
        this.isLoading$ = this.loadingService.loading$;
    }

    ngOnInit() {
        setTimeout(() => {
            this.isInitialLoading = false;
        }, 1500);
    }
}
