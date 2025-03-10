import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app.routes';
import { LandingPageComponent } from './shared/landing-page/landing-page.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FooterComponent } from "./shared/footer/footer.component";
import { SharedModule } from "./shared/shared.module";


@NgModule({
  declarations: [AppComponent,NotFoundComponent,LandingPageComponent],
  imports: [
    BrowserModule,
    RouterModule,
    MatCardModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    FooterComponent,
    SharedModule
],
  bootstrap: [AppComponent]
})
export class AppModule { }
