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
            <topbar-widget class="py-6 px-6 mx-0 md:mx-12 lg:mx-20 lg:px-20 flex items-center justify-between relative lg:static bg-surface-0 dark:bg-surface-900" />
            <div class="flex-1">
                <router-outlet></router-outlet>
            </div>
            <app-footer />
        </div>
    `
})
export class ClientLayout {}
