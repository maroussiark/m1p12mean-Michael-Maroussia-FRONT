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
        <div class="layout-wrapper">
            <topbar-widget class="py-6 px-6 mx-0 md:mx-12 lg:mx-20 lg:px-20 flex items-center justify-between relative lg:static" />
            <div class="layout-main-container mt-0" style="margin-top: -70px;">
                <div class="layout-main">
                    <router-outlet></router-outlet>
                </div>
            </div>
            <app-footer />
        </div>
    `
})
export class ClientLayout {}
