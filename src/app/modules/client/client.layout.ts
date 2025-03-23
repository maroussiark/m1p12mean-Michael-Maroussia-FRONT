import { LayoutService } from './../../layout/service/layout.service';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { AppFooter } from '../../layout/component/app.footer';
import { TopbarWidget } from '../../pages/landing/components/topbarwidget.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'client-layout',
    standalone: true,
    imports: [RouterModule, CommonModule, TopbarWidget, RippleModule, StyleClassModule, ButtonModule, DividerModule, AppFooter],
    template: `
        <div class="min-h-screen flex flex-col bg-surface-0">
        <topbar-widget class="fixed top-0 left-0 right-0 w-full py-6 px-6 flex items-center justify-between bg-gradient-to-r from-white via-gray-100 to-white shadow-lg z-50 text-gray-800" />
        <div class="flex-1 mt-20">
                <router-outlet></router-outlet>
            </div>
            <app-footer />
        </div>
    `
})
export class ClientLayout {}
