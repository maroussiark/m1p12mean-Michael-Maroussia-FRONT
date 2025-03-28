import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-loading',
    template: `
        <div
            class="fixed inset-0 z-50 flex items-center justify-center bg-blue-800 bg-opacity-50"
            *ngIf="isLoading"
            aria-live="polite"
            role="status"
        >
            <div class="flex flex-col items-center">
                <span class="loader mb-4" aria-hidden="true"></span>
                <p class="text-white text-sm" *ngIf="message">{{ message }}</p>
            </div>
        </div>
    `,
    styles: [
        `
            .loader {
                width: 16px;
                height: 16px;
                border-radius: 50%;
                display: block;
                margin: 15px auto;
                position: relative;
                background: #fff;
                box-shadow:
                    -24px 0 #fff,
                    24px 0 #fff;
                box-sizing: border-box;
                animation: shadowPulse 2s linear infinite;
            }

            @keyframes shadowPulse {
                33% {
                    background: #fff;
                    box-shadow:
                        -24px 0 #ff3d00,
                        24px 0 #fff;
                }
                66% {
                    background: #ff3d00;
                    box-shadow:
                        -24px 0 #fff,
                        24px 0 #fff;
                }
                100% {
                    background: #fff;
                    box-shadow:
                        -24px 0 #fff,
                        24px 0 #ff3d00;
                }
            }
        `
    ],
    imports: [CommonModule]
})
export class LoadingComponent {
    @Input() isLoading: boolean = false;
    @Input() message: string = 'Chargement en cours...';
}
