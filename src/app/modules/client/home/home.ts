import { AppFooter } from './../../../layout/component/app.footer';
import { FeaturesWidget } from './../../../pages/landing/components/featureswidget';
import { TopbarWidget } from './../../../pages/landing/components/topbarwidget.component';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';


@Component({
    selector: 'app-home',
    standalone: true,
    imports: [RouterModule, TopbarWidget, FeaturesWidget, RippleModule, StyleClassModule, ButtonModule, DividerModule, AppFooter],
    template: `
        <div class="bg-surface-0 dark:bg-surface-900">
            <div id="home" class="landing-wrapper overflow-hidden">
                <topbar-widget class="py-6 px-6 mx-0 md:mx-12 lg:mx-20 lg:px-20 flex items-center justify-between relative lg:static" />
                <features-widget />
                <app-footer />
            </div>
        </div>
    `
})
export class Home {}
