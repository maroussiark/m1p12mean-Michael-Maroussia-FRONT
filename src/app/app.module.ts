import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { NotFoundComponent } from './feature/not-found/not-found.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app.routes';
import { LandingPageComponent } from './feature/landing-page/landing-page.component';
import { FooterComponent } from "./shared/components/footer/footer.component";
import { SharedModule } from "./shared/shared.module";
import { provideNzI18n } from 'ng-zorro-antd/i18n';
import { fr_FR } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import fr from '@angular/common/locales/fr';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient } from '@angular/common/http';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { TokenInterceptor } from './core/interceptors/token.interceptor';
import { ToastrModule } from 'ngx-toastr';


registerLocaleData(fr);


@NgModule({
  declarations: [AppComponent,NotFoundComponent,LandingPageComponent],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FooterComponent,
    SharedModule,
    FormsModule,
    LayoutComponent,
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    })
],
  bootstrap: [AppComponent],
  providers: [
    provideNzI18n(fr_FR),
    provideAnimationsAsync(),
    provideHttpClient(),
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }

  ]
})
export class AppModule { }
