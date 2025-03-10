import { NgModule } from "@angular/core";
import { FooterComponent } from "./footer/footer.component";
import { HeaderComponent } from "./header/header.component";

@NgModule({
  declarations: [],
  imports: [FooterComponent,HeaderComponent],
  exports: [FooterComponent,HeaderComponent],
})
export class SharedModule { }
